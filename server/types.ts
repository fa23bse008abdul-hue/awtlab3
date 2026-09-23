export interface ProductSpecification {
  brand: string;
  model: string;
  weightGrams: number;
  dimensionsCm: { length: number; width: number; height: number };
  color: string;
  warrantyPeriodMonths: number;
  countryOfManufacture: string;
  batteryCapacityMah?: number;
  processor?: string;
  ramGb?: number;
  storageGb?: number;
  material?: string;
  shelfLifeDays?: number;
  certifications: string[];
}

export interface InventoryDetail {
  warehouseSku: string;
  totalStock: number;
  safetyStock: number;
  reorderPoint: number;
  binLocation: string;
  costPricePkr: number;
  supplierLeadTimeDays: number;
  fulfillmentHubs: {
    karachiCentral: number;
    lahoreMegaHub: number;
    islamabadExpress: number;
  };
}

export interface VendorInfo {
  vendorId: string;
  vendorName: string;
  vendorTier: 'Gold' | 'Platinum' | 'Silver' | 'Verified';
  vendorRating: number;
  dispatchSlaHours: number;
  supportEmail: string;
  ntnTaxNumber: string;
  warehouseCity: string;
}

export interface ShippingPolicy {
  freeShippingEligible: boolean;
  cashOnDeliveryAllowed: boolean;
  expressDeliveryHours: number;
  returnWindowDays: number;
  fragileHandlingRequired: boolean;
  customsTariffCode: string;
}

export interface AuditLog {
  createdAt: string;
  updatedAt: string;
  version: number;
  lastUpdatedBy: string;
  checksum: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  compareAtPrice: number;
  currency: string;
  discountPercentage: number;
  stock: number;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  thumbnailUrl: string;
  galleryImages: string[];
  tags: string[];

  // Heavy fields that cause overfetching on mobile
  descriptionHtml: string;
  rawMarkdown: string;
  specifications: ProductSpecification;
  inventoryDetails: InventoryDetail;
  vendorInfo: VendorInfo;
  shippingPolicy: ShippingPolicy;
  auditLog: AuditLog;
}

export interface OrderItem {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerInfo {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  shippingAddress: string;
}

export interface Order {
  orderId: string;
  idempotencyKey?: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'COD' | 'JazzCash' | 'Easypaisa' | 'CreditCard';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  orderStatus: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
  processedAt: string;
  isIdempotentReplay?: boolean;
}

export interface StandardErrorPayload {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
  suggestion?: string;
}

export interface StandardApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: StandardErrorPayload;
  meta?: {
    timestamp: string;
    requestId?: string;
    version: string;
    [key: string]: any;
  };
}
