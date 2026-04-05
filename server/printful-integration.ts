// Printful API integration service

const PRINTFUL_API_URL = "https://api.printful.com";
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

interface PrintfulOrder {
  id: number;
  external_id: string;
  status: string;
  shipping: string;
  created: number;
  updated: number;
  items: Array<{
    id: number;
    external_id: string;
    variant_id: number;
    quantity: number;
    price: string;
  }>;
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  };
}

interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  thumbnail: string;
  variants: Array<{
    id: number;
    external_id: string;
    title: string;
    price: string;
  }>;
}

/**
 * Fetch headers for Printful API requests
 */
function getPrintfulHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${PRINTFUL_API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * Create a new order in Printful
 */
export async function createPrintfulOrder(
  externalOrderId: string,
  items: Array<{
    variantId: number;
    quantity: number;
  }>,
  recipient: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
): Promise<PrintfulOrder> {
  const payload = {
    external_id: externalOrderId,
    shipping: "STANDARD",
    items: items.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
    })),
    recipient: {
      name: recipient.name,
      address1: recipient.address,
      city: recipient.city,
      state_code: recipient.state,
      country_code: recipient.country,
      zip: recipient.zip,
    },
  };

  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: "POST",
    headers: getPrintfulHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Get order status from Printful
 */
export async function getPrintfulOrderStatus(
  printfulOrderId: number
): Promise<PrintfulOrder> {
  const response = await fetch(`${PRINTFUL_API_URL}/orders/${printfulOrderId}`, {
    method: "GET",
    headers: getPrintfulHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Cancel an order in Printful
 */
export async function cancelPrintfulOrder(
  printfulOrderId: number
): Promise<void> {
  const response = await fetch(
    `${PRINTFUL_API_URL}/orders/${printfulOrderId}/cancel`,
    {
      method: "POST",
      headers: getPrintfulHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API error: ${JSON.stringify(error)}`);
  }
}

/**
 * List all products in Printful catalog
 */
export async function listPrintfulProducts(): Promise<PrintfulProduct[]> {
  const response = await fetch(`${PRINTFUL_API_URL}/products`, {
    method: "GET",
    headers: getPrintfulHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Get product details from Printful
 */
export async function getPrintfulProduct(
  productId: number
): Promise<PrintfulProduct> {
  const response = await fetch(`${PRINTFUL_API_URL}/products/${productId}`, {
    method: "GET",
    headers: getPrintfulHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Upload product image to Printful
 */
export async function uploadPrintfulImage(
  imageUrl: string,
  filename: string
): Promise<{ id: string; url: string }> {
  const formData = new FormData();
  formData.append("file_url", imageUrl);
  formData.append("filename", filename);

  const response = await fetch(`${PRINTFUL_API_URL}/upload/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PRINTFUL_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Printful API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Sync order status from Printful to database
 */
export async function syncPrintfulOrderStatus(
  printfulOrderId: number,
  localOrderId: string
): Promise<{ status: string; trackingNumber?: string }> {
  const order = await getPrintfulOrderStatus(printfulOrderId);

  // Map Printful status to local status
  const statusMap: Record<string, string> = {
    draft: "pending",
    pending: "processing",
    confirmed: "confirmed",
    failed: "failed",
    canceled: "canceled",
    shipped: "shipped",
  };

  return {
    status: statusMap[order.status] || order.status,
    trackingNumber: (order as any).shipping_number,
  };
}

/**
 * Validate Printful API connection
 */
export async function validatePrintfulConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/account`, {
      method: "GET",
      headers: getPrintfulHeaders(),
    });

    return response.status === 200;
  } catch {
    return false;
  }
}
