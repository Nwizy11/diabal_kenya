import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// yannisProductId is the same DIABAL product across all three tiers —
// only quantity and offerLabel change per package. Captured from the
// live diabalzambia order form's actual submit payload to form.hqyannis.com.
const packages = [
  {
    name: "Buy 1 Get 1 Free",
    units: "2 units",
    price: 7500,
    yannisProductId: "019e44c7-8812-7f32-b973-be14af74eef9",
    yannisQuantity: 2,
    offerLabel: "BUY 1 GET 1 FREE",
  },
  {
    name: "Buy 4 Get 2 Free",
    units: "6 units",
    price: 18000,
    yannisProductId: "019e44c7-8812-7f32-b973-be14af74eef9",
    yannisQuantity: 6,
    offerLabel: "BUY 4 GET 2 FREE",
  },
  {
    name: "Buy 8 Get 4 Free",
    units: "12 units",
    price: 30000,
    yannisProductId: "019e44c7-8812-7f32-b973-be14af74eef9",
    yannisQuantity: 12,
    offerLabel: "BUY 8 GET 4 FREE",
  },
];

const genderOptions = ["Male", "Female"];

const kenyanCounties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

const deliveryDateOptions = ["Today", "Tomorrow", "Specific date (mention in Notes)"];

type FormValues = {
  customerName: string;
  phone: string;
  email: string;
  packageIndex: string;
  state: string;
  deliveryAddress: string;
  preferredDeliveryDate: string;
  gender: string;
  notes: string;
};

const initialValues: FormValues = {
  customerName: "",
  phone: "",
  email: "",
  packageIndex: "",
  state: "",
  deliveryAddress: "",
  preferredDeliveryDate: "",
  gender: "",
  notes: "",
};

export function OrderForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const checkoutSessionId = useRef(crypto.randomUUID());
  const hasTrackedStart = useRef(false);

  function updateValue<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  // Cart abandonment tracking: debounced upsert of whatever's been filled
  // in so far, keyed by a per-visit session id. Only starts tracking once
  // the visitor has actually typed something meaningful (name or phone),
  // not on page load alone.
  useEffect(() => {
    const hasMeaningfulInput =
      values.customerName.trim().length > 1 || values.phone.trim().length > 1;
    if (!hasMeaningfulInput) {
      console.log("[checkout-tracking] waiting for meaningful input");
      return;
    }

    console.log("[checkout-tracking] meaningful input detected, scheduling upsert in 1.5s");
    hasTrackedStart.current = true;
    const selectedPackage =
      values.packageIndex !== "" ? packages[Number(values.packageIndex)] : undefined;

    const timeout = setTimeout(async () => {
      console.log("[checkout-tracking] firing upsert now", checkoutSessionId.current);
      const fields = {
        session_id: checkoutSessionId.current,
        site: "diabal-kenya",
        customer_name: values.customerName.trim() || null,
        phone: values.phone.trim() || null,
        email: values.email.trim() || null,
        package_name: selectedPackage?.name ?? null,
        package_price: selectedPackage?.price ?? null,
        state: values.state || null,
        delivery_address: values.deliveryAddress.trim() || null,
      };

      // A single upsert keyed on session_id — no read-back required, so it
      // doesn't matter whether anon has SELECT access on this table.
      const { error } = await supabase
        .from("checkout_events")
        .upsert(fields, { onConflict: "session_id" });

      console.log("[checkout-tracking] upsert result:", { error });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [values]);

  // Kenyan mobile numbers: 10 digits starting with 0, e.g. 0712345678 or 0112345678.
  const KENYA_LOCAL_PHONE_REGEX = /^0[17][0-9]{8}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!values.customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const trimmedPhone = values.phone.trim();
    if (!trimmedPhone) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (!KENYA_LOCAL_PHONE_REGEX.test(trimmedPhone)) {
      setErrorMessage("Please enter a valid Kenyan phone number starting with 0, e.g. 0712345678.");
      return;
    }

    const trimmedEmail = values.email.trim();
    if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address, e.g. name@example.com.");
      return;
    }

    if (!values.packageIndex) {
      setErrorMessage("Please select an offer.");
      return;
    }

    if (!values.state) {
      setErrorMessage("Please select your delivery state.");
      return;
    }

    if (!values.deliveryAddress.trim()) {
      setErrorMessage("Please enter your delivery address.");
      return;
    }

    if (!values.preferredDeliveryDate) {
      setErrorMessage("Please select a preferred delivery date.");
      return;
    }

    if (!values.gender) {
      setErrorMessage("Please select your gender.");
      return;
    }

    setIsSubmitting(true);

    const selectedPackage = packages[Number(values.packageIndex)] ?? packages[0]!;
    // Deliberately no .select() here: anon only has INSERT on orders (by
    // design — it must not be able to read back customer data), and
    // chaining .select() forces PostgREST to also check SELECT privilege,
    // which fails for anon and turns a successful insert into a 401.
    const { error } = await supabase.from("orders").insert({
      site: "diabal-kenya",
      customer_name: values.customerName.trim(),
      phone: trimmedPhone,
      email: trimmedEmail || null,
      delivery_address: values.deliveryAddress.trim(),
      state: values.state,
      preferred_delivery_date: values.preferredDeliveryDate || null,
      gender: values.gender || null,
      package_name: selectedPackage.name,
      package_price: selectedPackage.price,
      quantity: 1,
      notes: values.notes.trim() || null,
      yannis_product_id: selectedPackage.yannisProductId,
      yannis_quantity: selectedPackage.yannisQuantity,
      offer_label: selectedPackage.offerLabel,
    });

    setIsSubmitting(false);
    if (error) {
      setErrorMessage("We could not submit your order. Please check your details and try again.");
      return;
    }

    if (hasTrackedStart.current) {
      void supabase.from("checkout_events").upsert(
        {
          session_id: checkoutSessionId.current,
          site: "diabal-kenya",
          status: "completed",
        },
        { onConflict: "session_id" },
      );
    }

    navigate({ to: "/thank-you" });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#000]">Order Form for Diabal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll contact you within 40 minutes to confirm delivery.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="customer-name" className="text-xs font-bold uppercase tracking-wide">
            Full name
          </Label>
          <Input
            id="customer-name"
            value={values.customerName}
            onChange={(event) => updateValue("customerName", event.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wide">
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            pattern="^0[17][0-9]{8}$"
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
            placeholder="0712345678"
            title="Enter a valid Kenyan number starting with 0, e.g. 0712345678"
            autoComplete="tel"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wide">Select offer</Label>
          <div className="space-y-3" role="radiogroup" aria-label="Select offer">
            {packages.map((item, index) => {
              const isSelected = values.packageIndex === String(index);
              return (
                <label
                  key={item.name}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                    isSelected ? "border-[#AC2815] ring-1 ring-[#AC2815]" : "border-input",
                  )}
                >
                  <input
                    type="radio"
                    name="package"
                    value={index}
                    checked={isSelected}
                    onChange={() => updateValue("packageIndex", String(index))}
                    className="h-5 w-5 shrink-0 accent-[#AC2815]"
                    required
                  />
                  <span>
                    <span className="block text-sm font-extrabold uppercase tracking-wide">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-sm">
                      <span className="font-semibold">{item.units}</span>{" "}
                      <span className="font-bold text-[#1D18C7]">
                        KSH{item.price.toLocaleString()}
                      </span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-xs font-bold uppercase tracking-wide">
            Delivery state <span className="text-destructive">*</span>
          </Label>
          <Select
            value={values.state}
            onValueChange={(value) => updateValue("state", value)}
            required
          >
            <SelectTrigger id="state" className="h-11">
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent>
              {kenyanCounties.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery-address" className="text-xs font-bold uppercase tracking-wide">
            Delivery address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="delivery-address"
            value={values.deliveryAddress}
            onChange={(event) => updateValue("deliveryAddress", event.target.value)}
            placeholder="Your delivery address"
            autoComplete="street-address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="preferred-delivery-date"
            className="text-xs font-bold uppercase tracking-wide"
          >
            Preferred delivery date <span className="text-destructive">*</span>
          </Label>
          <Select
            value={values.preferredDeliveryDate}
            onValueChange={(value) => updateValue("preferredDeliveryDate", value)}
          >
            <SelectTrigger id="preferred-delivery-date" className="h-11">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {deliveryDateOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wide">
            Gender <span className="text-destructive">*</span>
          </Label>
          <Select value={values.gender} onValueChange={(value) => updateValue("gender", value)}>
            <SelectTrigger id="gender" className="h-11">
              <SelectValue placeholder="Select gender..." />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wide">
            Delivery notes (optional)
          </Label>
          <Input
            id="notes"
            value={values.notes}
            onChange={(event) => updateValue("notes", event.target.value)}
            placeholder="Any special instructions"
          />
        </div>
      </div>

      {errorMessage ? <p className="text-sm font-medium text-destructive">{errorMessage}</p> : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-[#AC2815] text-base font-bold text-white hover:bg-[#8b1810]"
      >
        {isSubmitting ? "Submitting order…" : "Submit Order"}
      </Button>
    </form>
  );
}
