import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const IMG = {
  hero: "/images/hero.jpg",
  ingredients: "/images/ingredients.jpg",
  explanation: "/images/explanation.jpg",
  testimonial1: "/images/testimonial-1.jpg",
  testimonial2: "/images/testimonial-2.jpg",
  testimonial3: "/images/testimonial-3.jpg",
  riskFree: "/images/risk-free.png",
  pack1: "/images/pack-1.jpeg",
  pack2: "/images/pack-2.jpeg",
  pack3: "/images/pack-3.jpeg",
};

const TITLE = "DIABAL Herbal Diabetes Tea Kenya | Natural Blood Sugar Support";
const DESC =
  "The 7-Herb DIABAL Blend to support healthy blood sugar levels naturally. Free delivery across Kenya, pay on delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: IMG.hero },
      { name: "twitter:image", content: IMG.hero },
    ],
  }),
  component: LandingPage,
});

const packages = [
  {
    name: 'The "Complete Healing" Pack',
    supply: "2 Months Supply",
    image: IMG.pack2,
    badge: "🏆 MOST POPULAR",
    features: [
      "Buy 4, Get 2 FREE Boxes of DIABAL Herbal Tea",
      "HUGE DISCOUNT (Save Big!)",
      "FREE Delivery Across Kenya",
      "Payment on Delivery",
    ],
    now: "KSh18,000",
    bestFor: "Unstable readings & recurring weakness.",
    recommended: true,
  },
  {
    name: 'The "Starter" Pack',
    supply: "1 Month Supply",
    image: IMG.pack1,
    badge: null as string | null,
    features: [
      "Buy 1, Get 1 FREE Box of DIABAL Herbal Tea",
      "FREE Delivery Across Kenya",
      "Payment on Delivery",
    ],
    now: "KSh7,500",
    bestFor: 'Mild symptoms & "the doubters". Recommended if you only have mild instability.',
    recommended: false,
  },
  {
    name: 'The "Total Restoration" Pack',
    supply: "3 Months Supply",
    image: IMG.pack3,
    badge: "💎 BEST VALUE",
    features: [
      "Buy 8, Get 4 FREE Boxes of DIABAL Herbal Tea",
      "FREE Delivery Across Kenya",
      "Payment on Delivery",
    ],
    now: "KSh30,000",
    bestFor: "Long-term diabetics & full routine support.",
    recommended: false,
  },
];

const stages = [
  {
    title: 'STAGE 1 — The "Stabilize" Effect',
    sub: "Supports smoother sugar levels",
    body: "The moment the warm tea enters your system, the Nauclea Leaves and Lemongrass go to work. Instead of sharp spikes and crashes, it supports smoother glucose absorption, reduced sudden sugar spikes and fewer energy crashes after meals. Many users notice less shaking, less sudden weakness and less extreme hunger swings.",
  },
  {
    title: 'STAGE 2 — The "Metabolic Support"',
    sub: "Helps insulin work better",
    body: "One of the biggest hidden problems in diabetes is insulin resistance — your body produces insulin, but your cells don't respond efficiently. The Cinnamon and Cassia Leaves in Diabal support improved insulin sensitivity, better glucose uptake and healthier liver sugar processing, so your body can begin to use sugar properly.",
  },
  {
    title: 'STAGE 3 — The "Circulation & Energy Boost"',
    sub: "Supports long-term stability",
    body: "High sugar over time affects nerves and circulation, which is when people begin to feel tingling, numbness, constant fatigue and slow healing. The Terminalia Leaves in Diabal support better blood flow, reduced internal stress and stronger metabolic balance.",
  },
];

const audience = [
  {
    title: '1. The "Long-Term Diabetic"',
    body: "You have been managing diabetes for years. You carry medication everywhere. Your reading may drop, but the weakness always comes back. DIABAL supports your body beyond just lowering numbers — it strengthens sugar processing and circulation.",
  },
  {
    title: '2. The "Recently Diagnosed"',
    body: "You went to the lab, and the results shocked you. You are scared of complications. The Cassia Occidentalis and Terminalia Leaves in this tea are natural cleansers — early support helps your body maintain better long-term stability.",
  },
  {
    title: '3. The "Energy Crash" Sufferer',
    body: "You feel weak after eating, dizzy sometimes, and tired no matter what. The Wild Sage and Vervain in DIABAL support smoother sugar absorption and fewer spikes.",
  },
  {
    title: '4. The "Silent Struggler"',
    body: "You haven't tested recently, but your body is showing signs — dry mouth, blurry vision, frequent urination, slow healing. Ginger Roots act to support your body's natural balance from the first cup.",
  },
];

const faqs = [
  {
    q: "I have bought many 'Herbal Mixtures' online that were just dust. Is this real?",
    a: "We hear you. That is why DIABAL Tea is Approved. We are not hiding. You are buying a certified remedy, not a roadside mixture.",
  },
  {
    q: "Will this make me purge or 'run stomach'?",
    a: "NO. This is not an unregulated herbal mixture that flushes your system aggressively. DIABAL Tea is gentle and safe for daily use.",
  },
  {
    q: "I am taking some diabetes medication. Should I stop?",
    a: "You don't have to stop immediately. You can take DIABAL Tea alongside your medication. However, most of our customers find that after 9 days of drinking the tea, their sugar level reduces, and they naturally reduce the use of other drugs.",
  },
  {
    q: "How fast will I see results?",
    a: "Almost instantly for some symptoms. Some people notice reduced urination and improved energy within days. Stability improves with consistent use, which is why we recommend the 2-month pack for a total cure.",
  },
  {
    q: "Is the tea very bitter?",
    a: "It has a natural, earthy herbal taste. It is not sugary, but it is not bitter either — it is very easy to drink. If you have a sweet tooth, you can add a little pure honey (but avoid white sugar!).",
  },
  {
    q: "I don't have money now. Can I pay when you bring it?",
    a: "Yes! We offer Payment on Delivery nationwide. You don't pay until the dispatch rider hands the package to you, so you can see, touch and verify the product before paying.",
  },
  {
    q: "How do I take it? How do I prepare it?",
    a: "It takes less than 15 minutes. Put 1 teabag into a cup of freshly boiled hot water, cover it and let it steep for 5–10 minutes, then drink it warm in the morning and evening. Dosage: once daily (morning recommended). Pro tip: do not add milk — use a little pure honey if you want it sweet.",
  },
  {
    q: "Does it have side effects? Will it make me feel weak or dizzy?",
    a: "Absolutely not. Unlike strong hospital antibiotics that can leave you feeling tired or shaky, DIABAL Tea is 100% natural — you can drink it and still drive or go to work safely. As with all herbal products, we recommend pregnant women consult their doctor before starting.",
  },
];

// Recent-purchase social-proof popup, cycling through sample orders —
// same pattern as the one already running on the WordPress blog
// (balm.gethealthyforever.club). Packs match the real package sizes (2/6/12).
const recentPurchases = [
  { name: "Daniel", county: "Nairobi", packs: 6 },
  { name: "Brian", county: "Lamu", packs: 2 },
  { name: "Grace", county: "Mombasa", packs: 12 },
  { name: "Faith", county: "Kisumu", packs: 2 },
  { name: "Peter", county: "Nakuru", packs: 6 },
  { name: "Mercy", county: "Kiambu", packs: 2 },
  { name: "Kevin", county: "Uasin Gishu", packs: 12 },
  { name: "Lucy", county: "Kisii", packs: 6 },
  { name: "James", county: "Machakos", packs: 2 },
  { name: "Esther", county: "Meru", packs: 6 },
];

const NOTIFICATION_VISIBLE_MS = 5000;
const NOTIFICATION_GAP_MS = 6000;

function PurchaseNotification() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const showTimer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(showTimer);
  }, [dismissed]);

  useEffect(() => {
    if (!visible) return;

    const hideTimer = setTimeout(() => {
      setVisible(false);
      setIndex((current) => (current + 1) % recentPurchases.length);
    }, NOTIFICATION_VISIBLE_MS);

    return () => clearTimeout(hideTimer);
  }, [visible]);

  useEffect(() => {
    if (visible || dismissed) return;

    const nextTimer = setTimeout(() => setVisible(true), NOTIFICATION_GAP_MS);
    return () => clearTimeout(nextTimer);
  }, [visible, dismissed, index]);

  if (dismissed) return null;

  const order = recentPurchases[index]!;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex max-w-xs items-center gap-3 rounded-xl border bg-white p-3 pr-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      role="status"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#AC2815] text-sm font-extrabold text-white">
        {order.name.charAt(0)}
      </span>
      <span className="text-sm leading-snug text-black">
        <span className="font-bold">{order.name}</span> bought {order.packs} packs from{" "}
        {order.county}
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 text-xs text-muted-foreground hover:text-black"
      >
        ✕
      </button>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden bg-white text-black [font-family:'Montserrat',sans-serif]">
      {/* Top banner */}
      <div className="w-full bg-[#d32f2f] py-3 text-center text-sm font-extrabold tracking-wide text-white sm:text-base">
        Your choice is pay on delivery, no worries
      </div>

      {/* Floating order button */}
      <Link
        to="/checkout"
        className="fixed left-3 top-[58px] z-40 rounded-lg bg-[#AC2815] px-3 py-2 text-xs font-extrabold text-white shadow-lg transition-transform hover:scale-105 sm:text-sm"
      >
        Order Now
      </Link>

      <PurchaseNotification />

      {/* HERO */}
      <header className="w-full bg-gradient-to-br from-white to-[#f8f8f8] px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[28px] font-extrabold leading-tight text-black [font-family:'Poppins',sans-serif] sm:text-5xl">
            <span className="text-[#800000]">Finally</span>: This Is Exactly How You Can Instantly{" "}
            <span className="text-[#163cb8]">Pee Out Excess Sugar</span> And Balance Your Sugar
            Levels In <span className="text-[#800000]">35 Days!</span>
          </h1>
          <p className="mt-4 text-sm font-semibold italic text-[#502321] sm:text-lg">
            This is for diabetics who are doing everything right — taking their drugs, avoiding
            sugar — yet still feel weak, tired and unstable.
          </p>
          <img
            src={IMG.hero}
            alt="DIABAL Herbal Tea product"
            className="mx-auto mt-8 w-full max-w-sm rounded-xl border-2 border-[#ddd] object-cover shadow-xl"
            loading="eager"
          />
          <Link
            to="/checkout"
            className="mt-8 inline-flex w-full max-w-sm items-center justify-center rounded-xl border-b-[3px] border-black bg-[#AC2815] px-6 py-4 text-base font-bold text-white shadow-[0_6px_18px_rgba(172,40,21,0.35)] transition-transform hover:-translate-y-0.5 sm:text-lg"
          >
            Order Today And Pay On Delivery
          </Link>
        </div>
      </header>

      {/* INGREDIENTS / HOW IT WORKS */}
      <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-xl font-extrabold text-[#502321] [font-family:'Poppins',sans-serif] sm:text-3xl">
            The 7-Herb Blend Your Body Needs To Support Sugar Balance Naturally — Without Depending
            Only On Expensive Daily Pills
          </h2>
          <img
            src={IMG.ingredients}
            alt="The seven herbs inside DIABAL Herbal Tea"
            className="mt-8 w-full rounded-xl border-2 border-[#ddd] object-cover shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            loading="lazy"
          />

          <h2 className="mt-12 text-xl font-extrabold text-[#502321] [font-family:'Poppins',sans-serif] sm:text-3xl">
            How DIABAL Tea Actually Works
          </h2>
          <div className="mt-6 rounded-xl border border-[#f0f0f0] bg-white p-5 text-left shadow-[0_2px_10px_rgba(0,0,0,0.08)] sm:p-7">
            <h3 className="text-lg font-bold text-[#1D18C7]">
              Why You Still Feel Weak Even Though You're Taking Your Medication
            </h3>
            <p className="mt-3 text-sm leading-relaxed sm:text-base">
              Most diabetes drugs are designed to lower blood sugar numbers — that's why your
              reading may drop temporarily. But lowering the number is not the same as helping your
              body function properly.
            </p>
            <p className="mt-3 text-sm leading-relaxed sm:text-base">
              High blood sugar is not just about the number — it's about insulin resistance, poor
              glucose absorption, sluggish liver processing, inflammation and weak circulation. So
              even when the number drops, you may still feel weak and tired, urinating constantly,
              dizzy or shaky, afraid to eat, and afraid to check your sugar.
            </p>
            <img
              src={IMG.explanation}
              alt="How Diabal supports your body"
              className="mt-5 w-full rounded-xl border-2 border-[#ddd] object-cover"
              loading="lazy"
            />
          </div>

          <p className="mt-10 text-sm font-semibold sm:text-base">
            DIABAL is different because it uses a powerful 7-herb support blend designed to
            strengthen your body's natural sugar regulation system. Here is exactly what happens
            when you drink a cup:
          </p>

          <div className="mt-6 grid gap-4 text-left md:grid-cols-3">
            {stages.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-[#f0f0f0] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-[#1D18C7]">{s.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#ff0000]">
                  {s.sub}
                </p>
                <p className="mt-3 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="w-full bg-[#512321] px-4 py-12 text-[#F0F0F1] sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-extrabold text-[#F0F0F1] [font-family:'Poppins',sans-serif] sm:text-3xl">
            See What People Are Saying After Trying{" "}
            <span className="text-[#ffcc66]">DIABAL TEA</span> — They Feel Stronger And More Stable
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[IMG.testimonial1, IMG.testimonial2, IMG.testimonial3].map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`DIABAL customer testimonial ${i + 1}`}
                className="w-full rounded-xl border-2 border-[#ddd] object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-extrabold [font-family:'Poppins',sans-serif] sm:text-4xl">
            Who Exactly Is <span className="text-[#163cb8]">DIABAL</span> Tea For?
          </h2>
          <p className="mt-2 text-center text-sm italic text-muted-foreground sm:text-base">
            (And will it help if you've had high sugar for years?)
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm font-bold text-[#ff0000] sm:text-base">
            "I have been diabetic for 8–10 years… can this small tea really help me?"
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
            We get this question a lot, and the simple answer has always been YES. DIABAL Herbal Tea
            was not created for mild sugar imbalance — it was formulated specifically for people who
            are managing diabetes yet still feeling unstable.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {audience.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border border-[#f0f0f0] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              >
                <h3 className="text-base font-bold text-[#1D18C7]">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WILL IT WORK FOR ME */}
      <section className="w-full bg-[#EEE] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-extrabold text-[#163cb8] [font-family:'Poppins',sans-serif] sm:text-3xl">
            "But… Will It Work For ME?"
          </h2>
          <img
            src={IMG.riskFree}
            alt="Results you can expect from DIABAL Tea"
            className="mx-auto mt-6 w-full max-w-md rounded-xl border-2 border-[#ddd] object-cover"
            loading="lazy"
          />
          <p className="mt-6 text-sm sm:text-base">
            We know you are skeptical. You have probably bought "miracle cures" online that turned
            out to be useless dusty powder.
          </p>
          <p className="mt-2 text-sm font-bold sm:text-base">
            Here is why DIABAL Tea is different:
          </p>
          <ol className="mt-4 space-y-3 text-left text-sm sm:text-base">
            <li>
              <strong>It is Approved:</strong> We didn't mix this in a backyard. It is a certified
              remedy, tested for safety and effectiveness.
            </li>
            <li>
              <strong>It is not a magic cure:</strong> It supports your body's natural sugar
              regulation system.
            </li>
            <li>
              <strong>It works or you don't pay:</strong> We are so confident that we offer Payment
              on Delivery — you see the product before you part with your money.
            </li>
          </ol>
          <p className="mt-8 text-lg font-extrabold text-[#800000]">
            Stop managing the pain. It's time to end it completely.
          </p>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="order" className="w-full bg-[#CAE8EC] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-extrabold text-[#B30000] [font-family:'Poppins',sans-serif] sm:text-4xl">
            Select Your Treatment Package
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            {packages.map((p) => (
              <div key={p.name} className={cnPricing(p.recommended)}>
                {p.badge ? (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold text-black">
                    {p.badge}
                  </span>
                ) : null}
                <h3 className="text-xl font-extrabold text-[#1D18C7] [font-family:'Poppins',sans-serif]">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground">{p.supply}</p>
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.supply}`}
                  className="mt-4 w-full rounded-lg object-cover"
                  loading="lazy"
                />
                <ul className="mt-4 space-y-2 text-left text-sm">
                  {p.features.map((f) => (
                    <li key={f}>✅ {f}</li>
                  ))}
                </ul>
                <p className="mt-4 text-2xl font-black text-[#008000]">PRICE: {p.now}</p>
                <Link
                  to="/checkout"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl border-b-2 border-black bg-[#AC2815] px-5 py-3.5 text-base font-extrabold text-white transition-transform hover:-translate-y-0.5"
                >
                  Select This Package
                </Link>
                <p className="mt-4 text-left text-sm italic">
                  <strong>Best for:</strong> {p.bestFor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RISK FREE */}
      <section className="w-full px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-2xl font-extrabold text-[#B40000] [font-family:'Poppins',sans-serif]">
            🔒 100% Risk-Free Ordering
          </h3>
          <p className="mt-6 text-sm sm:text-base">
            We know there are many scams online. That is why we do <strong>NOT</strong> ask for your
            money now.
          </p>
          <ol className="mx-auto mt-4 max-w-md space-y-3 text-left text-sm sm:text-base">
            <li>
              <strong>Fill the form</strong> on the checkout page.
            </li>
            <li>
              <strong>We ship</strong> the package to your location (Nairobi, Mombasa, Kisumu,
              Nakuru, Eldoret and many more).
            </li>
            <li>
              <strong>You receive</strong> the package, open it, and confirm it is the original
              DIABAL Tea.
            </li>
            <li>
              <strong>You pay the rider</strong> only after you are satisfied.
            </li>
          </ol>
          <p className="mt-6 text-base font-bold">(Free delivery applies to ALL packages today!)</p>
          <Link
            to="/checkout"
            className="mt-8 inline-flex items-center justify-center rounded-xl border-b-[3px] border-black bg-[#AC2815] px-6 py-4 text-base font-bold text-white shadow-[0_6px_18px_rgba(172,40,21,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Order Today And Pay On Delivery
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-[#123655] px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-extrabold [font-family:'Poppins',sans-serif] sm:text-3xl">
            Still Deciding? Read The Top Questions Customers Asked Before Ordering{" "}
            <span className="text-[#163cb8]">DIABAL HERBAL TEA</span>
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-white/10 bg-white p-4 text-black"
              >
                <summary className="cursor-pointer list-none text-sm font-bold uppercase sm:text-base">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full bg-[#5E5D5D] px-4 py-6 text-center text-xs leading-relaxed text-white sm:px-6 [font-family:'Archivo',sans-serif]">
        <p className="mx-auto max-w-3xl">
          This product is designed to support your health and well-being based on widely recognized
          principles. Please note that these statements have not been evaluated by NAFDAC, and the
          information provided is for general knowledge only. For personalised medical advice or
          concerns about your health, we encourage you to consult with a qualified healthcare
          professional. While we strive to provide accurate and helpful information, this content is
          for educational and promotional purposes only and is not a substitute for professional
          medical care.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} DIABAL Herbal Tea</p>
      </footer>
    </div>
  );
}

function cnPricing(recommended: boolean) {
  const base =
    "relative flex w-full max-w-xs flex-1 flex-col items-center rounded-xl border-[3px] bg-white p-6 text-center shadow-[2px_10px_18px_rgba(0,0,0,0.25)]";
  return recommended
    ? `${base} border-[#1e3c72] scale-[1.03] border-solid`
    : `${base} border-[#001138]`;
}
