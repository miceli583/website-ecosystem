import { db } from "~/server/db";
import { notifications, portalUsers } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "~/lib/email";
import { NotificationEmail } from "~/lib/email-templates/notification";

type CreateNotificationOpts = {
  recipientId: string;
  type: string;
  title: string;
  message?: string;
  linkUrl?: string;
  sendEmailNotification?: boolean;
};

/**
 * Create an in-app notification and optionally send an email.
 * Fire-and-forget — errors are logged but do not throw.
 */
export async function createNotification(opts: CreateNotificationOpts) {
  try {
    await db.insert(notifications).values({
      recipientId: opts.recipientId,
      type: opts.type,
      title: opts.title,
      message: opts.message ?? null,
      linkUrl: opts.linkUrl ?? null,
    });

    if (opts.sendEmailNotification) {
      const recipient = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.id, opts.recipientId),
        columns: { email: true, name: true },
      });

      if (recipient) {
        void sendEmail({
          to: recipient.email,
          subject: opts.title,
          react: NotificationEmail({
            recipientName: recipient.name,
            title: opts.title,
            message: opts.message,
            linkUrl: opts.linkUrl,
          }),
        });
      }
    }
  } catch (error) {
    console.error("[notifications] Failed to create notification:", error);
  }
}

/**
 * Notify all team members with a specific role about an event.
 */
export async function notifyByRole(
  role: string,
  opts: Omit<CreateNotificationOpts, "recipientId">
) {
  try {
    const teamMembers = await db.query.portalUsers.findMany({
      where: eq(portalUsers.isCompanyMember, true),
      columns: { id: true, companyRoles: true },
    });

    const targets = teamMembers.filter(
      (m: { id: string; companyRoles: string[] | null }) =>
        (m.companyRoles as string[] | null)?.includes(role)
    );

    await Promise.all(
      targets.map((t: { id: string }) =>
        createNotification({ ...opts, recipientId: t.id })
      )
    );
  } catch (error) {
    console.error("[notifications] Failed to notify by role:", error);
  }
}
