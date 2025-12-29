/**
 * Auto Rotate and Post API Endpoint
 * Server-side automation for daily Instagram posts
 *
 * This endpoint:
 * 1. Gets first item from queue
 * 2. Generates carousel images using Puppeteer (server-side)
 * 3. Uploads images to Supabase Storage
 * 4. Creates pending post with 2-minute buffer
 * 5. Rotates the queue
 *
 * Can be called manually or via cron job
 */

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { db } from "~/server/db";
import { quotePosts, coreValues, quotes, authors, pendingPosts } from "~/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";
import { DEFAULT_THEME } from "~/lib/brand-themes";

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET = "daily-anchors";
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/25829205/ua7aaz9/";

export async function POST(request: NextRequest) {
  console.log("🤖 Auto Rotate and Post: Starting...");

  try {
    // 1. Get first item from queue
    console.log("📋 Fetching first queue item...");
    const queue = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition))
      .limit(1);

    if (!queue[0]) {
      return NextResponse.json({
        success: false,
        error: "Queue is empty",
      }, { status: 400 });
    }

    const firstItem = queue[0];

    // 2. Get core value and quote details
    console.log("🔍 Fetching content details...");
    const [coreValue] = await db
      .select()
      .from(coreValues)
      .where(eq(coreValues.id, firstItem.coreValueId))
      .limit(1);

    const [quoteData] = await db
      .select({
        id: quotes.id,
        text: quotes.text,
        authorId: quotes.authorId,
        authorName: authors.name,
      })
      .from(quotes)
      .leftJoin(authors, eq(quotes.authorId, authors.id))
      .where(eq(quotes.id, firstItem.quoteId))
      .limit(1);

    if (!coreValue || !quoteData) {
      return NextResponse.json({
        success: false,
        error: "Core value or quote not found",
      }, { status: 404 });
    }

    // 3. Generate images using Puppeteer
    console.log("🎨 Generating carousel images with Puppeteer...");
    const images = await generateCarouselWithPuppeteer({
      quote: {
        text: quoteData.text,
        author: quoteData.authorName ?? "Unknown",
      },
      value: {
        name: coreValue.value,
        description: coreValue.description,
      },
    });

    // 4. Upload images to Supabase Storage
    console.log("☁️  Uploading images to Supabase Storage...");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Delete old files
    await Promise.all([
      supabase.storage.from(STORAGE_BUCKET).remove(["image1.jpg"]),
      supabase.storage.from(STORAGE_BUCKET).remove(["image2.jpg"]),
      supabase.storage.from(STORAGE_BUCKET).remove(["image3.jpg"]),
    ]);

    // Upload new files
    const [upload1, upload2, upload3] = await Promise.all([
      supabase.storage.from(STORAGE_BUCKET).upload("image1.jpg", images.page1, {
        contentType: "image/jpeg",
        cacheControl: "0",
      }),
      supabase.storage.from(STORAGE_BUCKET).upload("image2.jpg", images.page2, {
        contentType: "image/jpeg",
        cacheControl: "0",
      }),
      supabase.storage.from(STORAGE_BUCKET).upload("image3.jpg", images.page3, {
        contentType: "image/jpeg",
        cacheControl: "0",
      }),
    ]);

    if (upload1.error || upload2.error || upload3.error) {
      throw new Error("Failed to upload images to Supabase");
    }

    // Get public URLs
    const { data: { publicUrl: url1 } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl("image1.jpg");
    const { data: { publicUrl: url2 } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl("image2.jpg");
    const { data: { publicUrl: url3 } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl("image3.jpg");

    const timestamp = Date.now();
    const cacheBust = `?v=${timestamp}&nocache=true`;

    // 5. Create Zapier payload
    console.log("📦 Creating payload...");
    const caption = generateCaption(
      coreValue.value,
      coreValue.description,
      quoteData.text,
      quoteData.authorName ?? "Unknown"
    );

    const zapierPayload = {
      image1: `${url1}${cacheBust}`,
      image2: `${url2}${cacheBust}`,
      image3: `${url3}${cacheBust}`,
      caption,
      metadata: {
        value: coreValue.value,
        valueDescription: coreValue.description,
        quote: quoteData.text,
        author: quoteData.authorName ?? "Unknown",
        timestamp: new Date().toISOString(),
      },
    };

    // 6. Save to pending_posts with 2-minute buffer
    console.log("💾 Saving to pending_posts...");
    const scheduledFor = new Date(Date.now() + 120000); // 2 minutes from now

    await db
      .insert(pendingPosts)
      .values({
        id: "current",
        zapierPayload: JSON.stringify(zapierPayload),
        scheduledFor,
        status: "pending",
      })
      .onConflictDoUpdate({
        target: pendingPosts.id,
        set: {
          zapierPayload: JSON.stringify(zapierPayload),
          scheduledFor,
          status: "pending",
          createdAt: new Date(),
          sentAt: null,
        },
      });

    // 7. Rotate queue (pop first, enqueue new random)
    console.log("🔄 Rotating queue...");

    // Delete first item
    await db.delete(quotePosts).where(eq(quotePosts.id, firstItem.id));

    // Get remaining items and reposition
    const remaining = await db
      .select()
      .from(quotePosts)
      .orderBy(asc(quotePosts.queuePosition));

    for (let i = 0; i < remaining.length; i++) {
      await db
        .update(quotePosts)
        .set({ queuePosition: String(i + 1).padStart(2, "0") })
        .where(eq(quotePosts.id, remaining[i]!.id));
    }

    // Add new random item to end (if queue not full)
    if (remaining.length < 10) {
      const allCoreValues = await db.select().from(coreValues);
      const allQuotes = await db.select().from(quotes);

      const existingQuoteIds = new Set(remaining.map((p: { quoteId: string }) => p.quoteId));
      const availableQuotes = allQuotes.filter((q: { id: string }) => !existingQuoteIds.has(q.id));

      if (availableQuotes.length > 0 && allCoreValues.length > 0) {
        const randomCoreValue = allCoreValues[Math.floor(Math.random() * allCoreValues.length)];
        const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];

        const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const queuePosition = String(remaining.length + 1).padStart(2, "0");

        await db.insert(quotePosts).values({
          id: postId,
          coreValueId: randomCoreValue!.id,
          quoteId: randomQuote!.id,
          isPublished: "false",
          queuePosition,
          caption: null,
          imageUrl: null,
          publishedAt: null,
          scheduledFor: null,
          metaPostId: null,
        });
      }
    }

    console.log("✅ Auto Rotate and Post: Complete!");

    return NextResponse.json({
      success: true,
      message: "Successfully rotated queue and created pending post",
      data: {
        value: coreValue.value,
        quote: quoteData.text.substring(0, 100) + "...",
        author: quoteData.authorName ?? "Unknown",
        scheduledFor: scheduledFor.toISOString(),
        imagesUploaded: true,
        queueRotated: true,
      },
    });

  } catch (error) {
    console.error("❌ Auto Rotate and Post Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to auto-rotate and post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Generate carousel images using Puppeteer
 */
async function generateCarouselWithPuppeteer(content: {
  quote: { text: string; author: string };
  value: { name: string; description: string };
}) {
  // Configure for Vercel serverless environment
  const isProduction = process.env.NODE_ENV === 'production';

  const browser = await puppeteer.launch({
    args: isProduction
      ? [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox']
      : ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: isProduction
      ? await chromium.executablePath()
      : process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350 });

    // Generate all 3 pages
    const page1Buffer = await generatePage1(page, content);
    const page2Buffer = await generatePage2(page, content);
    const page3Buffer = await generatePage3(page, content);

    return {
      page1: page1Buffer,
      page2: page2Buffer,
      page3: page3Buffer,
    };
  } finally {
    await browser.close();
  }
}

/**
 * Generate Page 1: Quote
 */
async function generatePage1(page: any, content: any): Promise<Buffer> {
  const theme = DEFAULT_THEME;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 1080px;
            height: 1350px;
            background: linear-gradient(135deg, ${theme.backgroundGradient?.from ?? theme.backgroundColor}, ${theme.backgroundGradient?.to ?? theme.backgroundColor});
            font-family: 'Georgia', serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 80px;
            box-sizing: border-box;
          }
          .quote {
            color: ${theme.textColor};
            font-size: 56px;
            line-height: 1.4;
            text-align: center;
            font-style: italic;
            margin-bottom: 40px;
          }
          .author {
            color: ${theme.accentColor};
            font-size: 32px;
            text-align: center;
            font-style: normal;
          }
          .logo {
            position: absolute;
            bottom: 80px;
            right: 80px;
            width: 200px;
            height: 100px;
            background: url('/brand/logo-white.png') no-repeat center;
            background-size: contain;
          }
        </style>
      </head>
      <body>
        <div class="quote">"${content.quote.text}"</div>
        <div class="author">— ${content.quote.author}</div>
        <div class="logo"></div>
      </body>
    </html>
  `);

  return await page.screenshot({ type: 'jpeg', quality: 95 });
}

/**
 * Generate Page 2: Core Value
 */
async function generatePage2(page: any, content: any): Promise<Buffer> {
  const theme = DEFAULT_THEME;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 1080px;
            height: 1350px;
            background: linear-gradient(135deg, ${theme.backgroundGradient?.from ?? theme.backgroundColor}, ${theme.backgroundGradient?.to ?? theme.backgroundColor});
            font-family: 'Arial', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 80px;
            box-sizing: border-box;
          }
          .value {
            color: ${theme.accentColor};
            font-size: 96px;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 4px;
          }
          .logo {
            position: absolute;
            bottom: 80px;
            right: 80px;
            width: 200px;
            height: 100px;
            background: url('/brand/logo-white.png') no-repeat center;
            background-size: contain;
          }
        </style>
      </head>
      <body>
        <div class="value">${content.value.name}</div>
        <div class="logo"></div>
      </body>
    </html>
  `);

  return await page.screenshot({ type: 'jpeg', quality: 95 });
}

/**
 * Generate Page 3: Description
 */
async function generatePage3(page: any, content: any): Promise<Buffer> {
  const theme = DEFAULT_THEME;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 1080px;
            height: 1350px;
            background: linear-gradient(135deg, ${theme.backgroundGradient?.from ?? theme.backgroundColor}, ${theme.backgroundGradient?.to ?? theme.backgroundColor});
            font-family: 'Arial', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 120px;
            box-sizing: border-box;
          }
          .description {
            color: ${theme.textColor};
            font-size: 42px;
            line-height: 1.6;
            text-align: center;
          }
          .logo {
            position: absolute;
            bottom: 80px;
            right: 80px;
            width: 200px;
            height: 100px;
            background: url('/brand/logo-white.png') no-repeat center;
            background-size: contain;
          }
        </style>
      </head>
      <body>
        <div class="description">${content.value.description}</div>
        <div class="logo"></div>
      </body>
    </html>
  `);

  return await page.screenshot({ type: 'jpeg', quality: 95 });
}

/**
 * Generate Instagram caption
 */
function generateCaption(
  value: string,
  description: string,
  quote: string,
  author: string
): string {
  return `${value.toUpperCase()}

"${quote}"
— ${author}

${description}

#DailyValues #${value.replace(/\s+/g, "")} #Inspiration #Mindfulness #PersonalGrowth`;
}

// Also support GET for manual testing
export async function GET() {
  return NextResponse.json({
    message: "Auto Rotate and Post Endpoint",
    usage: "POST to this endpoint to automatically rotate queue and create pending post",
    note: "This will generate images, upload to Supabase, and schedule for posting in 2 minutes",
  });
}
