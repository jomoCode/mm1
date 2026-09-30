import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import { DEFAULT_STORE_CONFIG } from "./src/data/defaultConfig";
import { MOCK_PRODUCTS } from "./src/data/mockProducts";
import { adaptExternalProductsResponse } from "./src/services/productAdapter";
import { buildExternalOrderPayload } from "./src/services/orderAdapter";
import {
  StoreConfig,
  OrderSubmission,
  OrderRecord,
  Product,
} from "./src/types/store";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory or file-backed configuration
const CONFIG_FILE = path.join(__dirname, ".store_config.json");
let storeConfig: StoreConfig = { ...DEFAULT_STORE_CONFIG };

// Load persistent config if available
if (fs.existsSync(CONFIG_FILE)) {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    storeConfig = { ...DEFAULT_STORE_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    console.warn("Could not read saved config file, using defaults.", err);
  }
}

// In-memory orders log for demo/admin inspection
const recentOrders: OrderRecord[] = [];
let nextOrderCounter = 1042;
const processedSubmissionTokens = new Set<string>();

// Helper to construct request headers for external calls
function buildAuthHeaders(config: {
  authType: string;
  authToken?: string;
  apiKeyHeader?: string;
  apiKeyValue?: string;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "JomoMart-BFF/1.0",
    Accept: "application/json",
  };

  if (config.authType === "bearer" && config.authToken) {
    headers["Authorization"] = `Bearer ${config.authToken}`;
  } else if (
    config.authType === "apiKey" &&
    config.apiKeyHeader &&
    config.apiKeyValue
  ) {
    headers[config.apiKeyHeader] = config.apiKeyValue;
  }

  return headers;
}

// --- API ROUTES ---

// 1. Get Store Configuration
app.get("/api/config", (req: Request, res: Response) => {
  res.json({
    success: true,
    config: storeConfig,
  });
});

// 2. Update Store Configuration
app.post("/api/config", (req: Request, res: Response) => {
  try {
    const newConfig = req.body;
    storeConfig = {
      ...storeConfig,
      ...newConfig,
    };

    // Save to disk for durability
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(storeConfig, null, 2));

    res.json({
      success: true,
      message: "Store configuration updated successfully",
      config: storeConfig,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update store configuration",
      error: err.message,
    });
  }
});

// 3. Get Products (BFF Product Service)
app.get("/api/products", async (req: Request, res: Response) => {
  const { mode, baseUrl, endpoint, dataPath, fieldMapping } =
    storeConfig.productApi;

  // Demo / Mock Mode
  if (mode === "demo" || !baseUrl || !endpoint) {
    return res.json({
      success: true,
      source: "mock_catalog",
      count: MOCK_PRODUCTS.length,
      products: MOCK_PRODUCTS,
    });
  }

  // External API Mode
  try {
    const targetUrl = new URL(endpoint, baseUrl).toString();
    const headers = buildAuthHeaders(storeConfig.productApi);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `External API responded with status ${response.status}: ${response.statusText}`,
      );
    }

    const rawData = await response.json();
    const adaptedProducts: Product[] = adaptExternalProductsResponse(
      rawData,
      fieldMapping,
      dataPath,
    );

    return res.json({
      success: true,
      source: "external_api",
      targetUrl,
      count: adaptedProducts.length,
      products: adaptedProducts,
    });
  } catch (err: any) {
    console.error("External Product API call failed:", err.message);
    // Fail gracefully as specified in requirements: inform frontend but provide fallback if desired
    return res.status(502).json({
      success: false,
      source: "external_api",
      message: `Failed to retrieve products from external API: ${err.message}`,
      fallbackAvailable: true,
      fallbackProducts: MOCK_PRODUCTS,
    });
  }
});

// 4. Submit Order (BFF Order Service)
app.post("/api/orders", async (req: Request, res: Response) => {
  const submission: OrderSubmission = req.body;
  const clientToken = (req.headers["x-idempotency-key"] as string) || "";

  // 1. Validation
  if (!submission || !submission.items || submission.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty. Please add items before checking out.",
    });
  }

  if (
    !submission.customer ||
    !submission.customer.fullName ||
    !submission.customer.phone ||
    !submission.customer.deliveryAddress
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Customer information is incomplete. Name, phone, and delivery address are required.",
    });
  }

  // Prevent duplicate submissions
  if (clientToken && processedSubmissionTokens.has(clientToken)) {
    return res.status(409).json({
      success: false,
      message:
        "Duplicate order submission detected. Please do not double-click.",
    });
  }
  if (clientToken) {
    processedSubmissionTokens.add(clientToken);
  }

  const orderNumber = nextOrderCounter++;
  const orderId = `JM-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const orderConfig = storeConfig.orderApi;
  const externalPayload = buildExternalOrderPayload(
    submission,
    orderConfig,
    orderNumber,
    orderId,
  );

  // If in demo mode
  if (
    orderConfig.mode === "demo" ||
    !orderConfig.baseUrl ||
    !orderConfig.endpoint
  ) {
    const record: OrderRecord = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      submission,
      externalPayloadSent: externalPayload,
      targetApiUrl: `${orderConfig.baseUrl}${orderConfig.endpoint} [DEMO MOCK DISPATCH]`,
      externalApiResponse: {
        status: 201,
        body: {
          status: "SUCCESS",
          tracking_reference: `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          message: "Order accepted by mock external logistics handler",
          estimated_delivery: "Within 2 business hours",
        },
      },
    };

    recentOrders.unshift(record);
    if (recentOrders.length > 50) recentOrders.pop();

    return res.json({
      success: true,
      orderId,
      orderNumber,
      status: "confirmed",
      mode: "demo",
      createdAt: record.createdAt,
      externalPayloadSent: externalPayload,
      message:
        "Order confirmed successfully! External order dispatcher simulated.",
    });
  }

  // If in external mode: dispatch to real external API securely from BFF
  try {
    const targetUrl = new URL(
      orderConfig.endpoint,
      orderConfig.baseUrl,
    ).toString();
    const headers = buildAuthHeaders(orderConfig);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const externalResponse = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(externalPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const responseText = await externalResponse.text();
    let parsedResponseBody: any;
    try {
      parsedResponseBody = JSON.parse(responseText);
    } catch {
      parsedResponseBody = { rawText: responseText };
    }

    if (!externalResponse.ok) {
      throw new Error(
        `External Order API responded with HTTP ${externalResponse.status}: ${responseText.slice(0, 200)}`,
      );
    }

    const record: OrderRecord = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      submission,
      externalPayloadSent: externalPayload,
      targetApiUrl: targetUrl,
      externalApiResponse: parsedResponseBody,
    };

    recentOrders.unshift(record);
    if (recentOrders.length > 50) recentOrders.pop();

    return res.json({
      success: true,
      orderId,
      orderNumber,
      status: "confirmed",
      mode: "external",
      createdAt: record.createdAt,
      externalPayloadSent: externalPayload,
      externalApiResponse: parsedResponseBody,
      message: "Order submitted and accepted by external order API!",
    });
  } catch (err: any) {
    console.error("Order submission to external API failed:", err.message);
    return res.status(502).json({
      success: false,
      message: `Failed to submit order to external API: ${err.message}`,
      orderId,
      externalPayloadSent: externalPayload,
    });
  }
});

// 5. Recent Orders Log (Admin Inspector)
app.get("/api/orders/recent", (req: Request, res: Response) => {
  res.json({
    success: true,
    orders: recentOrders,
  });
});

// 6. Test External Connection
app.post("/api/test-connection", async (req: Request, res: Response) => {
  const { type, config } = req.body;
  if (!config || !config.baseUrl || !config.endpoint) {
    return res.status(400).json({
      success: false,
      message: "Base URL and Endpoint are required to test connection.",
    });
  }

  try {
    const targetUrl = new URL(config.endpoint, config.baseUrl).toString();
    const headers = buildAuthHeaders(config);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const testMethod = type === "order" ? "POST" : "GET";
    const testBody =
      type === "order"
        ? JSON.stringify({ ping: true, test_order: true })
        : undefined;

    const response = await fetch(targetUrl, {
      method: testMethod,
      headers,
      body: testBody,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const text = await response.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      // ignore
    }

    return res.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      targetUrl,
      preview: json || text.slice(0, 500),
    });
  } catch (err: any) {
    return res.status(502).json({
      success: false,
      message: err.message,
    });
  }
});

// --- CLIENT SERVING ---
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 4000;

async function startServer() {
  if (!isProduction) {
    // Vite middleware in development
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static file serving in production
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(
      `[winlium microsite BFF] Server running at http://0.0.0.0:${PORT}`,
    );
  });
}

startServer();
