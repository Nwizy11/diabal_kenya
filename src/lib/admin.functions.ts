import { createServerFn } from "@tanstack/react-start";

export const ensureAdminAccount = createServerFn({ method: "POST" }).handler(async () => {
  const email = process.env["UNIQ_ADMIN_EMAIL"];
  const password = process.env["UNIQ_ADMIN_PASSWORD"];

  if (!email || !password) {
    throw new Error("Admin account is not configured");
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const created = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId = created.data.user?.id;
  if (!userId && created.error) {
    const users = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 });
    userId = users.data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id;
  }

  if (!userId) {
    throw new Error("Unable to create the admin account");
  }

  const { error: roleError } = await supabaseAdmin.from("user_roles").upsert(
    { user_id: userId, role: "admin" },
    { onConflict: "user_id,role" },
  );

  if (roleError) throw roleError;
  return { ok: true };
});