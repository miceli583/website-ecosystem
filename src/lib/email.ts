import { Resend } from "resend";
import { env } from "~/env";
import type { ReactElement } from "react";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM_ADDRESS = "Miracle Mind <noreply@miraclemind.live>";
const ADMIN_EMAIL = "admin@miraclemind.live";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
}) {
  if (!resend) {
    console.warn("[Email] Resend not configured — skipping email send");
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
  });

  if (error) {
    console.error("[Email] Send failed:", error);
    return null;
  }

  return data;
}

export async function sendAdminNotification({
  subject,
  react,
}: {
  subject: string;
  react: ReactElement;
}) {
  return sendEmail({ to: ADMIN_EMAIL, subject, react });
}
