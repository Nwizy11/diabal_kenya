import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ensureAdminAccount } from "@/lib/admin.functions";
import { getAdminOrders, getAdminCheckoutEvents } from "@/lib/orders.functions";
import { exportOrdersToCsv, exportOrdersToPdf } from "@/lib/order-export";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const TITLE = "Admin Orders — All Sites";
const DESC = "Secure order management across all landing sites.";
type Order = Tables<"orders">;
type CheckoutEvent = Tables<"checkout_events">;

// A started checkout with no completed order after this long counts as
// abandoned rather than "still in progress".
const ABANDONED_AFTER_MINUTES = 30;

const SITE_TITLES: Record<string, string> = {
  "uniq-tea": "UNIQ Herbal Tea",
  solomon: "Solomon",
  deputy: "Deputy",
  deputy4business: "Deputy4Business",
};

function siteTitle(slug: string) {
  return SITE_TITLES[slug] ?? slug;
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const bootstrapAdmin = ensureAdminAccount;
  const fetchOrders = getAdminOrders;
  const fetchCheckoutEvents = getAdminCheckoutEvents;
  const [isReady, setIsReady] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [checkoutEvents, setCheckoutEvents] = useState<CheckoutEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "abandoned">("orders");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [siteFilter, setSiteFilter] = useState<string>("all");

  useEffect(() => {
    let active = true;
    void bootstrapAdmin()
      .catch(() => undefined)
      .finally(async () => {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        setSessionEmail(data.user?.email ?? null);
        setIsReady(true);
        if (data.user) {
          await loadOrders();
          await loadCheckoutEvents();
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function loadOrders() {
    try {
      const data = await fetchOrders();
      setOrders(data);
      setMessage("");
    } catch {
      setMessage("This account does not have admin access.");
    }
  }

  async function loadCheckoutEvents() {
    try {
      const data = await fetchCheckoutEvents();
      setCheckoutEvents(data);
    } catch {
      // Orders loading already surfaces the access-denied message; keep
      // this failure silent so it doesn't overwrite that message.
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("The email or password is incorrect.");
      setIsBusy(false);
      return;
    }
    setSessionEmail(email);
    await loadOrders();
    await loadCheckoutEvents();
    setIsBusy(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSessionEmail(null);
    setOrders([]);
    setCheckoutEvents([]);
  }

  async function handlePdfExport() {
    setIsExportingPdf(true);
    try {
      await exportOrdersToPdf(filteredOrders);
    } finally {
      setIsExportingPdf(false);
    }
  }

  const siteOptions = useMemo(() => {
    const seen = new Set(orders.map((order) => order.site));
    return Array.from(seen).sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (siteFilter === "all") return orders;
    return orders.filter((order) => order.site === siteFilter);
  }, [orders, siteFilter]);

  const stats = useMemo(() => {
    const totalValue = filteredOrders.reduce(
      (sum, order) => sum + order.package_price * order.quantity,
      0,
    );
    const today = new Date().toDateString();
    const todayCount = filteredOrders.filter(
      (order) => new Date(order.created_at).toDateString() === today,
    ).length;
    return { total: filteredOrders.length, today: todayCount, totalValue };
  }, [filteredOrders]);

  const filteredCheckoutEvents = useMemo(() => {
    if (siteFilter === "all") return checkoutEvents;
    return checkoutEvents.filter((event) => event.site === siteFilter);
  }, [checkoutEvents, siteFilter]);

  function abandonmentStatus(event: CheckoutEvent): "completed" | "abandoned" | "in_progress" {
    if (event.status === "completed") return "completed";
    const ageMs = Date.now() - new Date(event.updated_at).getTime();
    if (ageMs > ABANDONED_AFTER_MINUTES * 60 * 1000) return "abandoned";
    return "in_progress";
  }

  const abandonedCount = useMemo(
    () => filteredCheckoutEvents.filter((event) => abandonmentStatus(event) === "abandoned").length,
    [filteredCheckoutEvents],
  );

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading admin access…
      </div>
    );
  }

  if (!sessionEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
        <section className="card-surface w-full max-w-md rounded-2xl border p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            UNIQ Herbal Tea
          </p>
          <h1 className="mt-3 text-2xl font-extrabold">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">View and manage submitted orders.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {message ? <p className="text-sm text-destructive">{message}</p> : null}
            <Button type="submit" disabled={isBusy} className="w-full">
              {isBusy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              All Sites
            </p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Order dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {sessionEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="site-filter" className="text-xs text-muted-foreground">
                Site
              </Label>
              <select
                id="site-filter"
                value={siteFilter}
                onChange={(event) => setSiteFilter(event.target.value)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="all">All sites</option>
                {siteOptions.map((slug) => (
                  <option key={slug} value={slug}>
                    {siteTitle(slug)}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <StatCard label="All orders" value={stats.total.toString()} />
          <StatCard label="Orders today" value={stats.today.toString()} />
          <StatCard label="Order value" value={`₦${stats.totalValue.toLocaleString()}`} />
          <StatCard label="Abandoned carts" value={abandonedCount.toString()} />
        </div>

        <div className="mt-6 flex gap-2 border-b">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === "orders"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("abandoned")}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === "abandoned"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            Abandoned carts
          </button>
        </div>

        {activeTab === "orders" ? (
        <section className="card-surface mt-6 overflow-hidden rounded-2xl border">
          <div className="flex items-center justify-between gap-4 border-b p-4 sm:p-5">
            <div>
              <h2 className="font-bold">Submitted orders</h2>
              <p className="mt-1 text-xs text-muted-foreground">Newest orders appear first.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filteredOrders.length === 0}
                onClick={() => exportOrdersToCsv(filteredOrders)}
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filteredOrders.length === 0 || isExportingPdf}
                onClick={() => void handlePdfExport()}
              >
                {isExportingPdf ? "Preparing PDF…" : "Export PDF"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => void loadOrders()}>
                Refresh
              </Button>
            </div>
          </div>
          {message ? <p className="p-4 text-sm text-destructive">{message}</p> : null}
          {filteredOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No orders have been submitted yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Site</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Delivery</th>
                    <th className="px-4 py-3 font-semibold">Package</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Yannis sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {siteTitle(order.site)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {order.customer_name}
                        {order.gender ? (
                          <span className="block text-xs font-normal text-muted-foreground">
                            {order.gender}
                          </span>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {order.phone}
                        {order.email ? (
                          <span className="block text-xs text-muted-foreground">{order.email}</span>
                        ) : null}
                      </td>
                      <td className="max-w-xs px-4 py-4">
                        {order.delivery_address}
                        {order.city ? `, ${order.city}` : ""}, {order.state}
                        {order.preferred_delivery_date ? (
                          <span className="block text-xs text-muted-foreground">
                            Preferred: {order.preferred_delivery_date}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        {order.package_name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {order.quantity} × ₦{order.package_price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            order.sync_status === "synced"
                              ? "bg-green-100 text-green-700"
                              : order.sync_status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                          title={order.sync_error ?? undefined}
                        >
                          {order.sync_status ?? "pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        ) : (
        <section className="card-surface mt-6 overflow-hidden rounded-2xl border">
          <div className="flex items-center justify-between gap-4 border-b p-4 sm:p-5">
            <div>
              <h2 className="font-bold">Abandoned carts</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Checkout sessions started but not completed within {ABANDONED_AFTER_MINUTES} minutes.
                Includes partial personal data from visitors who didn't submit an order.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void loadCheckoutEvents()}>
              Refresh
            </Button>
          </div>
          {filteredCheckoutEvents.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No checkout activity recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Site</th>
                    <th className="px-4 py-3 font-semibold">Started</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Package</th>
                    <th className="px-4 py-3 font-semibold">Delivery</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCheckoutEvents.map((event) => {
                    const status = abandonmentStatus(event);
                    return (
                      <tr key={event.id} className="align-top">
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            {siteTitle(event.site)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                          {formatDate(event.created_at)}
                        </td>
                        <td className="px-4 py-4 font-semibold">{event.customer_name || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {event.phone || "—"}
                          {event.email ? (
                            <span className="block text-xs text-muted-foreground">{event.email}</span>
                          ) : null}
                        </td>
                        <td className="px-4 py-4">
                          {event.package_name || "—"}
                          {event.package_price ? (
                            <span className="block text-xs text-muted-foreground">
                              ₦{Number(event.package_price).toLocaleString()}
                            </span>
                          ) : null}
                        </td>
                        <td className="max-w-xs px-4 py-4">
                          {event.delivery_address || "—"}
                          {event.state ? `, ${event.state}` : ""}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status === "completed"
                                ? "bg-green-100 text-green-700"
                                : status === "abandoned"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {status === "completed"
                              ? "Completed"
                              : status === "abandoned"
                                ? "Abandoned"
                                : "In progress"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface rounded-2xl border p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-primary">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
