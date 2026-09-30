import { OrderSubmission, StoreConfig, Product, OrderRecord } from '../types/store';

export async function fetchStoreConfig(): Promise<StoreConfig> {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error('Failed to load store configuration');
  const data = await res.json();
  return data.config;
}

export async function updateStoreConfig(config: StoreConfig): Promise<StoreConfig> {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to save store configuration');
  const data = await res.json();
  return data.config;
}

export async function fetchProducts(): Promise<{ products: Product[]; source: string; targetUrl?: string }> {
  const res = await fetch('/api/products');
  const data = await res.json();
  if (!res.ok && !data.fallbackAvailable) {
    throw new Error(data.message || 'Failed to fetch product catalog');
  }
  return {
    products: data.products || data.fallbackProducts || [],
    source: data.source,
    targetUrl: data.targetUrl,
  };
}

export async function submitOrder(
  submission: OrderSubmission,
  idempotencyKey: string
): Promise<{ success: boolean; orderId: string; orderNumber: number; externalPayloadSent?: any; message?: string }> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(submission),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Order submission failed');
  }

  return data;
}

export async function fetchRecentOrders(): Promise<OrderRecord[]> {
  const res = await fetch('/api/orders/recent');
  if (!res.ok) throw new Error('Failed to fetch recent orders');
  const data = await res.json();
  return data.orders || [];
}

export async function testApiConnection(
  type: 'product' | 'order',
  config: { baseUrl: string; endpoint: string; authType: string; authToken?: string; apiKeyHeader?: string; apiKeyValue?: string }
): Promise<{ success: boolean; status: number; statusText: string; preview: any; targetUrl?: string; message?: string }> {
  const res = await fetch('/api/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, config }),
  });
  return await res.json();
}
