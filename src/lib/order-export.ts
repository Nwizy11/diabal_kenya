import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;

const EXPORT_COLUMNS: { header: string; value: (order: Order) => string }[] = [
  { header: "Order ID", value: (order) => order.id },
  { header: "Date", value: (order) => new Date(order.created_at).toISOString() },
  { header: "Customer name", value: (order) => order.customer_name },
  { header: "Gender", value: (order) => order.gender ?? "" },
  { header: "Phone", value: (order) => order.phone },
  { header: "Email", value: (order) => order.email ?? "" },
  { header: "Delivery address", value: (order) => order.delivery_address },
  { header: "City", value: (order) => order.city ?? "" },
  { header: "State", value: (order) => order.state },
  { header: "Preferred delivery date", value: (order) => order.preferred_delivery_date ?? "" },
  { header: "Package", value: (order) => order.package_name },
  { header: "Quantity", value: (order) => String(order.quantity) },
  { header: "Unit price (NGN)", value: (order) => String(order.package_price) },
  { header: "Total (NGN)", value: (order) => String(order.package_price * order.quantity) },
  { header: "Status", value: (order) => order.status },
  { header: "Notes", value: (order) => order.notes ?? "" },
];

function timestampedFilename(extension: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  return `uniq-tea-orders-${stamp}.${extension}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Exports orders as a CSV file — a format every CRM (HubSpot, Zoho, Google Sheets, etc.) can import. */
export function exportOrdersToCsv(orders: Order[]) {
  const headerRow = EXPORT_COLUMNS.map((column) => escapeCsvValue(column.header)).join(",");
  const rows = orders.map((order) =>
    EXPORT_COLUMNS.map((column) => escapeCsvValue(column.value(order))).join(","),
  );
  const csvContent = [headerRow, ...rows].join("\n");
  // Prefix with a BOM so Excel opens UTF-8 (e.g. the Naira sign) correctly.
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, timestampedFilename("csv"));
}

/** Exports orders as a PDF table, for sharing or archiving order batches. */
export async function exportOrdersToPdf(orders: Order[]) {
  const [{ default: jsPDF }, autoTable] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("UNIQ Herbal Tea — Orders", 14, 15);
  doc.setFontSize(9);
  doc.text(`Exported ${new Date().toLocaleString("en-NG")} — ${orders.length} order(s)`, 14, 21);

  const pdfColumns = [
    "Date",
    "Customer",
    "Phone",
    "Email",
    "State",
    "Package",
    "Qty",
    "Total",
    "Status",
  ];
  const pdfRows = orders.map((order) => [
    new Date(order.created_at).toLocaleDateString("en-NG"),
    order.customer_name,
    order.phone,
    order.email ?? "",
    order.state,
    order.package_name,
    String(order.quantity),
    `NGN ${(order.package_price * order.quantity).toLocaleString()}`,
    order.status,
  ]);

  autoTable.default(doc, {
    head: [pdfColumns],
    body: pdfRows,
    startY: 26,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [21, 93, 252] },
  });

  doc.save(timestampedFilename("pdf"));
}
