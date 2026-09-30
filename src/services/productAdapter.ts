import { ApiFieldMapping, Product } from '../types/store';

/**
 * Safely resolves nested property paths such as "pricing.amount" or "images[0].src"
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Normalizes an external raw item into the domain Product entity
 */
export function mapExternalItemToProduct(
  raw: any,
  mapping: ApiFieldMapping,
  index: number
): Product {
  // Resolve fields using mapping configuration
  const rawId = getNestedValue(raw, mapping.idField) ?? raw.id ?? raw._id ?? raw.sku ?? `item-${index + 1}`;
  const rawName = getNestedValue(raw, mapping.nameField) ?? raw.name ?? raw.title ?? raw.product_name ?? 'Untitled Product';
  const rawPrice = getNestedValue(raw, mapping.priceField) ?? raw.price ?? raw.amount ?? raw.cost ?? 0;
  const rawQty = getNestedValue(raw, mapping.quantityField) ?? raw.quantity ?? raw.stock ?? raw.inventory_count ?? 10;
  const rawCategory = getNestedValue(raw, mapping.categoryField) ?? raw.category ?? raw.department ?? raw.type ?? 'General';
  const rawImage = getNestedValue(raw, mapping.imageField) ?? raw.image ?? raw.imageUrl ?? raw.thumbnail ?? raw.photo ?? '';
  const rawDesc = mapping.descriptionField ? getNestedValue(raw, mapping.descriptionField) : (raw.description ?? raw.summary ?? '');

  // Parse numerical values safely
  const parsedPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^0-9.-]+/g, '')) || 0;
  const parsedQty = typeof rawQty === 'number' ? rawQty : parseInt(String(rawQty).replace(/[^0-9]+/g, ''), 10) || 0;

  return {
    id: String(rawId),
    name: String(rawName).trim(),
    price: Math.max(0, parsedPrice),
    quantity: Math.max(0, parsedQty),
    category: String(rawCategory).trim() || 'General',
    image: typeof rawImage === 'string' ? rawImage.trim() : '',
    description: typeof rawDesc === 'string' ? rawDesc.trim() : '',
    unit: raw.unit || (parsedQty > 0 ? `${parsedQty} in stock` : 'Out of stock'),
    featured: Boolean(raw.featured ?? (index < 4)),
  };
}

/**
 * Normalizes an entire API response payload into Product[]
 */
export function adaptExternalProductsResponse(
  responseBody: any,
  mapping: ApiFieldMapping,
  dataPath?: string
): Product[] {
  if (!responseBody) return [];

  let itemsArray: any[] = [];

  if (dataPath && getNestedValue(responseBody, dataPath)) {
    const extracted = getNestedValue(responseBody, dataPath);
    if (Array.isArray(extracted)) {
      itemsArray = extracted;
    }
  } else if (Array.isArray(responseBody)) {
    itemsArray = responseBody;
  } else if (Array.isArray(responseBody.products)) {
    itemsArray = responseBody.products;
  } else if (Array.isArray(responseBody.data)) {
    itemsArray = responseBody.data;
  } else if (Array.isArray(responseBody.items)) {
    itemsArray = responseBody.items;
  } else if (typeof responseBody === 'object') {
    // Attempt to locate any array in the top-level keys
    for (const key of Object.keys(responseBody)) {
      if (Array.isArray(responseBody[key])) {
        itemsArray = responseBody[key];
        break;
      }
    }
  }

  return itemsArray.map((item, idx) => mapExternalItemToProduct(item, mapping, idx));
}
