/**
 * Application Constants
 */

export const APP_NAME = "Supplier Management System";
export const APP_SHORT_NAME = "SMS Hub";
export const APP_VERSION = "1.0.0";

export const CURRENCY = {
  code: "INR",
  symbol: "₹",
  locale: "en-IN",
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export const SUPPLY_CATEGORIES = [
  "Hilsa",
  "Rohu",
  "Katla",
  "Tiger Prawns",
  "Pomfret",
  "Vannamei Shrimp",
  "Bhetki",
  "Crab",
  "Salmon",
  "Tuna",
  "Lobster",
  "Squid",
  "Other",
];

export const QUANTITY_UNITS = [
  { value: "KG", label: "KG (Kilograms)" },
  { value: "Ton", label: "Ton (Metric Tons)" },
  { value: "Box", label: "Box" },
  { value: "Bag", label: "Bag" },
  { value: "Piece", label: "Piece" },
];

export const PAYMENT_METHODS = [
  "Bank Transfer / NEFT / RTGS",
  "Cheque",
  "UPI / Online",
  "Cash",
  "Demand Draft",
];

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  SUPPLIERS: "/suppliers",
  SUPPLIERS_ADD: "/suppliers/add",
  SUPPLIERS_EDIT: "/suppliers/:id/edit",
  SUPPLIERS_DETAILS: "/suppliers/:id",
  SUPPLIES: "/supplies",
  SUPPLIES_ADD: "/supplies/add",
  PAYMENTS: "/payments",
  PAYMENTS_ADD: "/payments/add",
  THIRD_PARTY_PAYMENTS: "/third-party-payments",
  ADVANCE_PAYMENTS: "/advance-payments",
};
