import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (roleError || !isAdmin) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, created_at, customer_name, phone, email, gender, delivery_address, city, state, preferred_delivery_date, package_name, package_price, quantity, status, notes, sync_status, sync_error, site",
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const getAdminCheckoutEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (roleError || !isAdmin) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("checkout_events")
      .select(
        "id, session_id, site, customer_name, phone, email, package_name, package_price, state, delivery_address, status, order_id, created_at, updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;
    return data ?? [];
  });
