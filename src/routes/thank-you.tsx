import { createFileRoute, Link } from "@tanstack/react-router";

const YOUTUBE_EMBED = "https://www.youtube.com/embed/cCmVmETRWLQ";

const TITLE = "Order Received — DIABAL Herbal Tea";
const DESC =
  "Your DIABAL Herbal Tea order has been received. We'll call to confirm delivery — pay on delivery across Kenya.";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <div className="w-full overflow-x-hidden bg-white [font-family:'Montserrat',sans-serif]">
      <div className="w-full bg-[#d32f2f] py-3 text-center text-sm font-extrabold tracking-wide text-white sm:text-base">
        Your choice is pay on delivery, no worries
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e6f5ea] text-4xl">
          ✅
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-black [font-family:'Poppins',sans-serif] sm:text-4xl">
          Congratulations — Your Order Was Successful!
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Thank you for ordering DIABAL Herbal Tea. We've received your details and will call you
          shortly to confirm your delivery. Remember — you only pay the rider when your package
          arrives, no money needed now.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl border-b-[3px] border-black bg-[#AC2815] px-6 py-4 text-sm font-bold text-white shadow-[0_6px_18px_rgba(172,40,21,0.35)] transition-transform hover:-translate-y-0.5 sm:text-base"
        >
          ← Back to DIABAL
        </Link>

        <div className="mt-12 w-full overflow-hidden rounded-2xl border shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <div className="relative w-full pt-[56.25%]">
            <iframe
              src={YOUTUBE_EMBED}
              title="Welcome to DIABAL"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#5E5D5D] px-4 py-6 text-center text-xs leading-relaxed text-white sm:px-6 [font-family:'Archivo',sans-serif]">
        <p className="mx-auto max-w-3xl">
          These claims have not been evaluated by NAFDAC. All material herein is provided for
          information only and may not be construed as personal medical advice. Please consult
          appropriate health professionals on any matter relating to your health and well-being.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} DIABAL Herbal Tea</p>
      </footer>
    </div>
  );
}
