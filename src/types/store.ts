/**
 * Core Storefront & Integration Types
 */

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number; // available stock
  category?: string;
  image?: string;
  description?: string;
  unit?: string;
  featured?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  notes?: string;
  paymentMethod: "card" | "cash_on_delivery" | "bank_transfer";
};

export type OrderSubmissionItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  category?: string;
};

export type OrderSubmission = {
  customer: CustomerInfo;
  items: OrderSubmissionItem[];
  currency: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  notes?: string;
};

export type OrderRecord = {
  id: string;
  orderNumber: number;
  createdAt: string;
  status: "confirmed" | "processing" | "shipped" | "cancelled";
  submission: OrderSubmission;
  externalPayloadSent?: any;
  externalApiResponse?: any;
  targetApiUrl?: string;
};

export type StoreTheme = {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  heroBgFrom?: string;
  heroBgVia?: string;
  heroBgTo?: string;
  footerBg?: string;
  footerStripBg?: string;
};

export type ApiFieldMapping = {
  idField: string;
  nameField: string;
  priceField: string;
  quantityField: string;
  categoryField: string;
  imageField: string;
  descriptionField?: string;
};

export type ProductApiConfig = {
  mode: "demo" | "external";
  baseUrl: string;
  endpoint: string;
  authType: "none" | "bearer" | "apiKey";
  authToken?: string;
  apiKeyHeader?: string;
  apiKeyValue?: string;
  fieldMapping: ApiFieldMapping;
  dataPath?: string; // Path inside response object, e.g. "products" or "data"
};

export type OrderApiConfig = {
  mode: "demo" | "external";
  baseUrl: string;
  endpoint: string;
  authType: "none" | "bearer" | "apiKey";
  authToken?: string;
  apiKeyHeader?: string;
  apiKeyValue?: string;
  payloadFormat: "standard" | "shopify_like" | "minimal";
};

export type StoreConfig = {
  brandName: string;
  brandTagline: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroTitleAccent?: string;
  heroDescription?: string;
  heroPrimaryCta?: string;
  heroDeliveryText?: string;
  heroTrustText?: string;
  heroImageBadge?: string;
  logoUrl?: string;
  currencySymbol: string;
  currencyCode: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  theme: StoreTheme;
  productApi: ProductApiConfig;
  orderApi: OrderApiConfig;
};
