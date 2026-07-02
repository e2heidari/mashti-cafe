export interface WholesaleProduct {
  _id: string;
  sku?: string;
  name: string;
  description: string;
  ingredients: string[];
  category?: string;
  unitType: string;
  unitValue: number;
  unitDisplayOverride?: string;
  unitLabel: string;
  unitPrice: number;
  imageUrl?: string | null;
  imageAlt?: string;
  order: number;
  active: boolean;
}

export interface CartItem {
  product: WholesaleProduct;
  quantity: number;
}

export interface WholesaleOrderCustomer {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  message?: string;
}

export interface WholesaleOrderLineItemInput {
  productId: string;
  sku?: string;
  productName: string;
  category?: string;
  unitType: string;
  unitValue: number;
  unitLabel: string;
  unitPrice: number;
  requestedQuantity: number;
}

export interface WholesaleOrderLineItem extends WholesaleOrderLineItemInput {
  lineTotal: number;
}

export interface WholesaleOrderRequestPayload {
  customer: WholesaleOrderCustomer;
  items: WholesaleOrderLineItemInput[];
}

export interface WholesaleOrderSubmitResponse {
  success: boolean;
  message?: string;
  orderNumber?: string;
  emailWarning?: boolean;
}
