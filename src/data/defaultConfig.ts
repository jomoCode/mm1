import { StoreConfig } from "../types/store";
import { THEME_PRESETS } from "./themes";

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  brandName: "winlium shop",
  brandTagline: "Fresh • Quality • Affordable",
  heroEyebrow: "Fresh • Quality • Affordable",
  heroTitle: "Everything You Need,",
  heroTitleAccent: "All in One Place",
  heroDescription:
    "Quality groceries and household essentials at great prices with fast, reliable doorstep delivery. Shop with confidence from our external API-backed catalog.",
  heroPrimaryCta: "Shop Now",
  heroDeliveryText: "Free delivery over ₦50,000",
  heroTrustText: "100% Guaranteed Fresh",
  heroImageBadge: "Hand-picked Fresh Everyday",
  currencySymbol: "₦",
  currencyCode: "NGN",
  freeDeliveryThreshold: 50000,
  deliveryFee: 0,
  theme: THEME_PRESETS[0],
  productApi: {
    mode: "demo",
    baseUrl: "https://api.external-catalog.example.com",
    endpoint: "/api/v1/products",
    authType: "none",
    dataPath: "products",
    fieldMapping: {
      idField: "id",
      nameField: "title",
      priceField: "price",
      quantityField: "stock",
      categoryField: "category",
      imageField: "thumbnail",
      descriptionField: "description",
    },
  },
  orderApi: {
    mode: "demo",
    baseUrl: "https://api.external-orders.example.com",
    endpoint: "/api/v1/orders",
    authType: "bearer",
    authToken: "sk_live_demo_9a87d6f5e4",
    payloadFormat: "standard",
  },
};
