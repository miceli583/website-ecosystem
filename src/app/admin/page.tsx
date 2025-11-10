import { createClient } from "~/lib/supabase/server";
import { redirect } from "next/navigation";
import { DevHub } from "~/components/pages/dev-hub";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <DevHub />;
}
