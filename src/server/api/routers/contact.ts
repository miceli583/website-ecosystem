import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { contactSubmissions, masterCrm, personalContactSubmissions } from "~/server/db/schema";
import { Resend } from "resend";
import { ContactNotificationEmail } from "~/lib/email-templates/contact-notification";
import { PersonalContactNotificationEmail } from "~/lib/email-templates/personal-contact-notification";
import { env } from "~/env";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export const contactRouter = createTRPCRouter({
  // miraclemind.dev contact form
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        message: z.string().min(10, "Message must be at least 10 characters"),
        services: z.array(z.string()).optional(),
        role: z.string().optional(),
        stewardshipInterest: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Upsert to master_crm (by email)
      const existingContact = await ctx.db
        .select()
        .from(masterCrm)
        .where(eq(masterCrm.email, input.email))
        .limit(1);

      let crmId: string;

      if (existingContact.length > 0) {
        // Update existing contact
        crmId = existingContact[0]!.id;
        await ctx.db
          .update(masterCrm)
          .set({
            name: input.name,
            phone: input.phone ?? existingContact[0]!.phone,
            lastContactAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(masterCrm.id, crmId));
      } else {
        // Create new contact
        const [newContact] = await ctx.db
          .insert(masterCrm)
          .values({
            email: input.email,
            name: input.name,
            phone: input.phone,
            source: "miracle_mind",
            status: "lead",
          })
          .returning({ id: masterCrm.id });
        crmId = newContact!.id;
      }

      // 2. Save to contact_submissions with crm reference
      await ctx.db.insert(contactSubmissions).values({
        crmId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        services: input.services,
        role: input.role,
        stewardshipInterest: input.stewardshipInterest,
      });

      // 3. Send email notification
      if (resend) {
        try {
          await resend.emails.send({
            from: "Miracle Mind <contact@miraclemind.live>",
            to: "matthewmiceli@miraclemind.live",
            replyTo: input.email,
            subject: `[Miracle Mind] Contact from ${input.name}`,
            react: ContactNotificationEmail({
              name: input.name,
              email: input.email,
              phone: input.phone,
              message: input.message,
              services: input.services,
              role: input.role,
            }),
          });
        } catch (error) {
          console.error("Failed to send contact notification email:", error);
          // Don't throw - submission was saved, email is secondary
        }
      }

      return { success: true };
    }),

  // Personal site: matthewmiceli.com contact form
  submitPersonal: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        message: z.string().min(10, "Message must be at least 10 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Upsert to master_crm (by email)
      const existingContact = await ctx.db
        .select()
        .from(masterCrm)
        .where(eq(masterCrm.email, input.email))
        .limit(1);

      let crmId: string;

      if (existingContact.length > 0) {
        // Update existing contact
        crmId = existingContact[0]!.id;
        await ctx.db
          .update(masterCrm)
          .set({
            name: input.name,
            phone: input.phone ?? existingContact[0]!.phone,
            lastContactAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(masterCrm.id, crmId));
      } else {
        // Create new contact
        const [newContact] = await ctx.db
          .insert(masterCrm)
          .values({
            email: input.email,
            name: input.name,
            phone: input.phone,
            source: "personal_site",
            status: "lead",
          })
          .returning({ id: masterCrm.id });
        crmId = newContact!.id;
      }

      // 2. Insert to personal_contact_submissions
      await ctx.db.insert(personalContactSubmissions).values({
        crmId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
      });

      // 3. Send email notification
      if (resend) {
        try {
          await resend.emails.send({
            from: "Matthew Miceli <contact@miraclemind.live>",
            to: "matthewmiceli@miraclemind.live",
            replyTo: input.email,
            subject: `[matthewmiceli.com] Contact from ${input.name}`,
            react: PersonalContactNotificationEmail({
              name: input.name,
              email: input.email,
              phone: input.phone,
              message: input.message,
            }),
          });
        } catch (error) {
          console.error("Failed to send personal contact notification email:", error);
          // Don't throw - submission was saved, email is secondary
        }
      }

      return { success: true };
    }),
});
