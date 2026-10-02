import { createFileRoute, Link } from "@tanstack/react-router";
import { OrderForm } from "@/components/OrderForm";

const TITLE = "Complete Your Order - DIABAL Herbal Tea";
const DESC = "Complete your DIABAL Herbal Tea order. Pay on delivery across Kenya.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <div className="w-full overflow-x-hidden bg-[#f2fbf7] [font-family:'Montserrat',sans-serif]">
      <div className="w-full bg-[#d32f2f] py-3 text-center text-sm font-extrabold tracking-wide text-white sm:text-base">
        Your choice is pay on delivery, no worries
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-[#800000] hover:underline"
        >
          ← Back to DIABAL
        </Link>

        <h1 className="mt-4 text-center text-[28px] font-extrabold text-black [font-family:'Poppins',sans-serif] sm:text-4xl">
          Complete Your Order
        </h1>
        <p className="mt-3 text-center text-sm text-[#555] sm:text-base">
          Fill out the form below to place your order. We'll contact you within 40 minutes to
          confirm delivery. <strong>Please pick your call.</strong>
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.08)] sm:p-6">
          <OrderForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          🔒 100% Risk-Free • Payment on Delivery
        </p>
      </main>

      <footer className="w-full bg-[#5E5D5D] px-4 py-6 text-center text-xs leading-relaxed text-white sm:px-6 [font-family:'Archivo',sans-serif]">
        <p className="mx-auto max-w-3xl">
          This product is designed to support your health and well-being based on widely recognized
          principles. These statements have not been evaluated by NAFDAC. For personalised medical
          advice, consult a qualified healthcare professional.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} DIABAL Herbal Tea</p>
      </footer>
    </div>
  );
}
