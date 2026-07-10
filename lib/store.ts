import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from './supabase'

export interface CartItem {
  id: number
  name: string
  weight: string
  price: number
  image: string
  qty: number
  vendorId?: string
  vendorName?: string
}

export interface Product {
  id: number
  name: string
  category: string
  weight: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  badge: string
  image: string
  inStock?: boolean
  sku?: string
  barcode?: string
  brand?: string
  vendorId?: string
  vendorName?: string
  costPrice?: number
  reorderLevel?: number
  reservedStock?: number
  variants?: ProductVariant[]
  description?: string
  tags?: string[]
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready-for-pickup'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: CartItem[]
  paymentMethod: 'cod' | 'online' | 'whatsapp'
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  date: string
  // Location & Delivery fields
  latitude?: number
  longitude?: number
  distanceKm?: number
  estimatedDeliveryTime?: string
  assignedDeliveryPartner?: string
  isStorefrontOrder?: boolean
  // Scheduled Delivery details
  deliveryType?: 'immediate' | 'scheduled'
  scheduledDate?: string
  scheduledSlot?: string
  scheduledTime?: string
  assignedRiderId?: string
  rescheduleReason?: string
  // Delivery assignment
  deliveryBoyName?: string
  deliveryBoyPhone?: string
}

export interface Banner {
  id: number
  title: string
  subtitle: string
  badge: string
  imageUrl: string
  buttonText: string
  link: string
  active: boolean
  archived?: boolean
}

export interface DeliveryPartner {
  id: number
  name: string
  phone: string
  status: 'active' | 'inactive'
}

export interface UserProfile {
  id?: string
  name: string
  email?: string
  phone?: string
  dob?: string
  password?: string
  role?: 'customer' | 'vendor' | 'admin'
}

export interface ProductVariant {
  sku: string
  name: string
  weight: string
  price: number
  costPrice: number
  stock: number
  reservedStock: number
  reorderLevel: number
  barcode: string
}

export interface Vendor {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  gstNumber: string
  status: 'active' | 'inactive'
  productsSupplied: number
  totalPurchases: number
  totalSpend: number
  deliveryPerformance: number
}

export interface PurchaseOrderItem {
  productId: number
  variantSku: string
  name: string
  quantity: number
  unitCost: number
  totalCost: number
}

export interface PurchaseOrder {
  id: string
  vendorId: string
  vendorName: string
  items: PurchaseOrderItem[]
  totalCost: number
  orderDate: string
  expectedDeliveryDate: string
  status: 'draft' | 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
}

export interface StockMovement {
  id: string
  productId: number
  productName: string
  variantSku: string
  type: 'in' | 'out' | 'fulfillment' | 'receipt' | 'return' | 'damage' | 'manual'
  quantityChanged: number
  previousStock: number
  newStock: number
  reason: string
  user: string
  date: string
  referenceNo?: string
}

export interface InventoryReturn {
  id: string
  type: 'customer' | 'vendor'
  orderId?: string
  poId?: string
  vendorId?: string
  productId: number
  variantSku: string
  productName: string
  quantity: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
  restocked: boolean
}

export type CustomerAccountStatus = 'active' | 'blocked' | 'suspended'

export interface CustomerActivityLog {
  id: string
  timestamp: string
  type: 'login' | 'order' | 'status_change' | 'security_alert'
  description: string
  ipAddress?: string
}

export interface CustomerAccount {
  id: string
  fullName: string
  email: string
  phone: string
  status: CustomerAccountStatus
  createdAt: string
  lastLogin: string
  activityLogs: CustomerActivityLog[]
}

export interface AdminNotification {
  id: string
  timestamp: string
  type: 'new_registration' | 'suspicious_activity' | 'blocked_attempt'
  title: string
  message: string
  read: boolean
}

export interface ProductReview {
  id: string
  productId: number
  userName: string
  rating: number
  comment: string
  date: string
}


interface HomepageState {
  // Products inventory state
  products: Product[]
  updateProduct: (productId: number, updatedFields: Partial<Product>) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  deleteProduct: (productId: number) => void

  // Orders list state
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  updateOrderDelivery: (orderId: string, deliveryData: Partial<Order>) => void

  // Global settings state
  whatsappNumber: string
  deliveryFee: number
  freeDeliveryLimit: number
  enableCod: boolean
  enableOnline: boolean
  enableWhatsappCheckout: boolean
  updateSettings: (settings: Partial<{
    whatsappNumber: string
    deliveryFee: number
    freeDeliveryLimit: number
    enableCod: boolean
    enableOnline: boolean
    enableWhatsappCheckout: boolean
  }>) => void

  // Cart state
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  cartStep: 'cart' | 'checkout' | 'razorpay' | 'success'
  setCartStep: (step: 'cart' | 'checkout' | 'razorpay' | 'success') => void

  // Location selector state
  selectedLocation: string
  setSelectedLocation: (location: string) => void

  // Category filter state
  activeFilter: string
  setActiveFilter: (filter: string) => void

  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchFocused: boolean
  setSearchFocused: (focused: boolean) => void

  // Authentication state
  isAuthModalOpen: boolean
  setAuthModalOpen: (open: boolean) => void
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isAuthLoading: boolean
  setAuthLoading: (loading: boolean) => void
  registeredUsers: UserProfile[]
  registerUser: (newUser: UserProfile) => void

  // Banners state
  banners: Banner[]
  addBanner: (banner: Omit<Banner, 'id'>) => void
  updateBanner: (bannerId: number, updatedFields: Partial<Banner>) => void
  deleteBanner: (bannerId: number) => void

  // Delivery partner state
  deliveryPartners: DeliveryPartner[]
  addDeliveryPartner: (partner: Omit<DeliveryPartner, 'id'>) => void
  updateDeliveryPartner: (partnerId: number, updatedFields: Partial<DeliveryPartner>) => void
  deleteDeliveryPartner: (partnerId: number) => void
  assignDeliveryBoy: (orderId: string, name: string, phone: string) => void
  fetchProducts: () => Promise<void>
  fetchBanners: () => Promise<void>
  fetchOrders: () => Promise<void>
  fetchVendors: () => Promise<void>
  fetchDeliveryPartners: () => Promise<void>

  // New Inventory State
  vendors: Vendor[]
  purchaseOrders: PurchaseOrder[]
  stockMovements: StockMovement[]
  returns: InventoryReturn[]
  addVendor: (vendor: Omit<Vendor, 'id'>) => void
  updateVendor: (vendorId: string, updatedFields: Partial<Vendor>) => void
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'orderDate' | 'totalCost'>) => void
  updatePurchaseOrderStatus: (poId: string, status: PurchaseOrder['status']) => void
  receivePurchaseOrder: (poId: string, items: { variantSku: string; receivedQty: number; damagedQty: number; notes: string }[], user: string) => void
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void
  adjustStock: (productId: number, variantSku: string, changeQty: number, type: StockMovement['type'], reason: string, user: string, referenceNo?: string) => void
  createReturn: (item: Omit<InventoryReturn, 'id' | 'date' | 'restocked'>) => void
  updateReturnStatus: (returnId: string, status: InventoryReturn['status'], restock: boolean, user: string) => void

  // Customer Profile State
  customers: CustomerAccount[]
  adminNotifications: AdminNotification[]
  fetchCustomers: () => Promise<void>
  updateCustomerStatus: (customerId: string, status: CustomerAccountStatus, reason?: string, adminName?: string) => void
  markNotificationRead: (notificationId: string) => void

  // Wishlist & Product Reviews State
  wishlist: number[]
  reviews: ProductReview[]
  toggleWishlist: (productId: number) => void
  addReview: (review: Omit<ProductReview, 'id' | 'date'>) => void
  fetchReviews: (productId: number) => Promise<void>
}

const INITIAL_REVIEWS: ProductReview[] = [
  { id: 'REV-1', productId: 1, userName: 'Ananya Roy', rating: 5, comment: 'Extremely fresh chicken breast! Perfectly cleaned and delivered right on time.', date: '2026-06-25T14:30:00Z' },
  { id: 'REV-2', productId: 1, userName: 'Rohan Mehta', rating: 4, comment: 'Good juicy quality. Packaging was vacuum sealed and cold.', date: '2026-06-20T10:15:00Z' },
  { id: 'REV-3', productId: 9, userName: 'Suresh Raina', rating: 5, comment: 'Tender goat loin chops! The mutton curry turned out delicious.', date: '2026-06-22T18:00:00Z' }
]

const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'CUST-101',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    status: 'active',
    createdAt: '2026-01-15T10:30:00Z',
    lastLogin: '2026-06-27T08:45:00Z',
    activityLogs: [
      { id: 'LOG-001', timestamp: '2026-06-27T08:45:00Z', type: 'login', description: 'User logged in successfully via OTP', ipAddress: '103.21.124.5' },
      { id: 'LOG-002', timestamp: '2026-06-26T14:20:00Z', type: 'order', description: 'Placed Order #FDH-7402 worth ₹1,147' },
      { id: 'LOG-003', timestamp: '2026-01-15T10:30:00Z', type: 'status_change', description: 'Account created and verified' }
    ]
  },
  {
    id: 'CUST-102',
    fullName: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '9812345678',
    status: 'active',
    createdAt: '2026-02-01T14:10:00Z',
    lastLogin: '2026-06-25T19:12:00Z',
    activityLogs: [
      { id: 'LOG-004', timestamp: '2026-06-25T19:12:00Z', type: 'login', description: 'User logged in via mobile app', ipAddress: '49.207.210.18' },
      { id: 'LOG-005', timestamp: '2026-06-25T19:30:00Z', type: 'order', description: 'Placed Order #FDH-8105 worth ₹2,450' }
    ]
  },
  {
    id: 'CUST-103',
    fullName: 'Amit Kumar',
    email: 'amit.k@example.com',
    phone: '9840123456',
    status: 'suspended',
    createdAt: '2026-03-10T09:15:00Z',
    lastLogin: '2026-06-20T11:00:00Z',
    activityLogs: [
      { id: 'LOG-006', timestamp: '2026-06-20T11:00:00Z', type: 'status_change', description: 'Account suspended due to multiple unverified COD cancellations' },
      { id: 'LOG-007', timestamp: '2026-06-18T16:40:00Z', type: 'security_alert', description: 'Flagged for 3 consecutive high-value COD returns' }
    ]
  },
  {
    id: 'CUST-104',
    fullName: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '9899887766',
    status: 'blocked',
    createdAt: '2026-04-05T11:20:00Z',
    lastLogin: '2026-06-15T10:05:00Z',
    activityLogs: [
      { id: 'LOG-008', timestamp: '2026-06-15T10:05:00Z', type: 'status_change', description: 'Account blocked by Super Admin (Policy Violation)' },
      { id: 'LOG-009', timestamp: '2026-06-15T10:04:00Z', type: 'security_alert', description: 'Suspicious bot activity detected during payment checkout' }
    ]
  }
]

const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: 'NOTIF-001', timestamp: '2026-06-27T10:15:00Z', type: 'new_registration', title: 'New Customer Registered', message: 'Rahul Sharma registered a new verified account via mobile OTP.', read: false },
  { id: 'NOTIF-002', timestamp: '2026-06-27T09:30:00Z', type: 'blocked_attempt', title: 'Blocked Account Attempt', message: 'Blocked user Vikram Singh attempted to log in from IP 182.72.45.10.', read: false },
  { id: 'NOTIF-003', timestamp: '2026-06-26T18:00:00Z', type: 'suspicious_activity', title: 'Security Risk Flagged', message: 'Customer Amit Kumar reached maximum allowed COD cancellations.', read: true }
]

const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'VND-001',
    name: 'Standard Poultry Farms',
    contactPerson: 'Rahul Sharma',
    phone: '9876543210',
    email: 'poultry@standardfarms.com',
    address: 'Ghazipur Poultry Market, Delhi - 110096',
    gstNumber: '07AAAAA1111A1Z1',
    status: 'active',
    productsSupplied: 12,
    totalPurchases: 45,
    totalSpend: 245000,
    deliveryPerformance: 98
  },
  {
    id: 'VND-002',
    name: 'Coastal Seafood Co.',
    contactPerson: 'Suresh Kumar',
    phone: '9812345678',
    email: 'orders@coastalseafood.com',
    address: 'Sassoon Docks, Colaba, Mumbai - 400005',
    gstNumber: '27BBBBB2222B2Z2',
    status: 'active',
    productsSupplied: 10,
    totalPurchases: 28,
    totalSpend: 380000,
    deliveryPerformance: 92
  },
  {
    id: 'VND-003',
    name: 'Himalayan Organic Meats',
    contactPerson: 'Tashi Namgyal',
    phone: '9988776655',
    email: 'info@himalayanmeats.com',
    address: 'Industrial Area, Solan, Himachal Pradesh - 173212',
    gstNumber: '02CCCCC3333C3Z3',
    status: 'active',
    productsSupplied: 14,
    totalPurchases: 15,
    totalSpend: 185000,
    deliveryPerformance: 88
  }
];

const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2026-001',
    vendorId: 'VND-001',
    vendorName: 'Standard Poultry Farms',
    items: [
      {
        productId: 1,
        variantSku: 'FDH-CHI-001-500G',
        name: 'Premium Chicken Breast (Boneless) (500g)',
        quantity: 100,
        unitCost: 174,
        totalCost: 17400
      },
      {
        productId: 2,
        variantSku: 'FDH-CHI-002-500G',
        name: 'Tender Chicken Thigh (Boneless) (500g)',
        quantity: 50,
        unitCost: 188,
        totalCost: 9400
      }
    ],
    totalCost: 26800,
    orderDate: '2026-06-20T10:00:00.000Z',
    expectedDeliveryDate: '2026-06-25T17:00:00.000Z',
    status: 'delivered',
    notes: 'Urgent stock replenishment for weekend demand.'
  },
  {
    id: 'PO-2026-002',
    vendorId: 'VND-002',
    vendorName: 'Coastal Seafood Co.',
    items: [
      {
        productId: 20,
        variantSku: 'FDH-FIS-020-1KG',
        name: 'Vanjaram (Seer Fish) Steaks (1kg)',
        quantity: 30,
        unitCost: 818,
        totalCost: 24540
      }
    ],
    totalCost: 24540,
    orderDate: '2026-06-25T14:30:00.000Z',
    expectedDeliveryDate: '2026-06-29T18:00:00.000Z',
    status: 'shipped',
    notes: 'Ensure cold chain temperature is maintained.'
  },
  {
    id: 'PO-2026-003',
    vendorId: 'VND-003',
    vendorName: 'Himalayan Organic Meats',
    items: [
      {
        productId: 31,
        variantSku: 'FDH-MUT-031-500G',
        name: 'Premium Mutton Curry Cut (500g)',
        quantity: 40,
        unitCost: 489,
        totalCost: 19560
      }
    ],
    totalCost: 19560,
    orderDate: '2026-06-26T16:00:00.000Z',
    expectedDeliveryDate: '2026-07-02T12:00:00.000Z',
    status: 'pending',
    notes: 'Monthly contract purchase.'
  }
];

const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'MOV-001',
    productId: 1,
    productName: 'Premium Chicken Breast (Boneless)',
    variantSku: 'FDH-CHI-001-500G',
    type: 'receipt',
    quantityChanged: 100,
    previousStock: 20,
    newStock: 120,
    reason: 'Purchase Order Receipt PO-2026-001',
    user: 'Warehouse Manager',
    date: '2026-06-25T11:20:00.000Z',
    referenceNo: 'PO-2026-001'
  },
  {
    id: 'MOV-002',
    productId: 1,
    productName: 'Premium Chicken Breast (Boneless)',
    variantSku: 'FDH-CHI-001-500G',
    type: 'fulfillment',
    quantityChanged: -2,
    previousStock: 120,
    newStock: 118,
    reason: 'Order Fulfillment FDH-9014',
    user: 'System Automator',
    date: '2026-06-27T05:46:00.000Z',
    referenceNo: 'FDH-9014'
  },
  {
    id: 'MOV-003',
    productId: 3,
    productName: 'Fresh Chicken Wings',
    variantSku: 'FDH-CHI-003-500G',
    type: 'damage',
    quantityChanged: -5,
    previousStock: 45,
    newStock: 40,
    reason: 'Cold chain storage failure during sorting',
    user: 'Warehouse Staff',
    date: '2026-06-27T08:15:00.000Z',
    referenceNo: 'DMG-2026-081'
  }
];

const INITIAL_RETURNS: InventoryReturn[] = [
  {
    id: 'RET-001',
    type: 'customer',
    orderId: 'FDH-9014',
    productId: 20,
    variantSku: 'FDH-FIS-020-500G',
    productName: 'Vanjaram (Seer Fish) Steaks',
    quantity: 1,
    reason: 'Package seal was damaged during delivery',
    status: 'approved',
    date: '2026-06-27T09:30:00.000Z',
    restocked: false
  },
  {
    id: 'RET-002',
    type: 'vendor',
    poId: 'PO-2026-001',
    vendorId: 'VND-001',
    productId: 2,
    variantSku: 'FDH-CHI-002-500G',
    productName: 'Tender Chicken Thigh (Boneless)',
    quantity: 10,
    reason: 'Excess fat layers did not meet quality standards',
    status: 'pending',
    date: '2026-06-26T14:00:00.000Z',
    restocked: false
  }
];

// Initial 36 products database
const INITIAL_PRODUCTS: Product[] = [
  // CHICKEN (6 items - only Breast, Thigh, Wing, Liver, Feet, Skin - all raw)
  {
    id: 1,
    name: 'Premium Chicken Breast (Boneless)',
    category: 'chicken',
    weight: '500g',
    price: 249,
    originalPrice: 320,
    rating: 4.9,
    reviews: 1250,
    badge: 'Fresh Raw Cut',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 2,
    name: 'Tender Chicken Thigh (Boneless)',
    category: 'chicken',
    weight: '500g',
    price: 269,
    originalPrice: 340,
    rating: 4.8,
    reviews: 840,
    badge: 'Fresh Raw Thighs',
    image: 'https://images.unsplash.com/photo-1606728035253-49e196321de5?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 3,
    name: 'Fresh Chicken Wings',
    category: 'chicken',
    weight: '500g',
    price: 199,
    originalPrice: 250,
    rating: 4.7,
    reviews: 620,
    badge: 'Raw Wings',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 4,
    name: 'Fresh Chicken Liver',
    category: 'chicken',
    weight: '250g',
    price: 99,
    originalPrice: 130,
    rating: 4.7,
    reviews: 540,
    badge: 'Nutrient Rich',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 5,
    name: 'Cleaned Chicken Feet',
    category: 'chicken',
    weight: '500g',
    price: 139,
    originalPrice: 190,
    rating: 4.5,
    reviews: 150,
    badge: 'Rich Collagen',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 6,
    name: 'Fresh Chicken Skin',
    category: 'chicken',
    weight: '250g',
    price: 89,
    originalPrice: 120,
    rating: 4.4,
    reviews: 90,
    badge: 'Fresh Cut',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },

  // GOAT (MUTTON) (13 items)
  {
    id: 7,
    name: 'Premium Goat Leg (Curry Cut)',
    category: 'mutton',
    weight: '500g',
    price: 699,
    originalPrice: 850,
    rating: 4.9,
    reviews: 950,
    badge: 'Rich Marrow',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 8,
    name: 'Tender Goat Shoulder',
    category: 'mutton',
    weight: '500g',
    price: 729,
    originalPrice: 899,
    rating: 4.8,
    reviews: 730,
    badge: 'Slow Cook',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 9,
    name: 'Tender Goat Loin Chops',
    category: 'mutton',
    weight: '400g',
    price: 649,
    originalPrice: 799,
    rating: 4.9,
    reviews: 480,
    badge: 'Juicy Chops',
    image: 'https://images.unsplash.com/photo-1602489146191-4d3753235b2e?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 10,
    name: 'Prime Goat Ribs',
    category: 'mutton',
    weight: '500g',
    price: 679,
    originalPrice: 820,
    rating: 4.8,
    reviews: 390,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1594002497111-a4ed451839db?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 11,
    name: 'Fresh Goat Neck Cuts',
    category: 'mutton',
    weight: '500g',
    price: 599,
    originalPrice: 740,
    rating: 4.7,
    reviews: 290,
    badge: 'Flavorful',
    image: 'https://images.unsplash.com/photo-1588168333986-5079a17a0b36?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 12,
    name: 'Goat Breast Boneless',
    category: 'mutton',
    weight: '500g',
    price: 629,
    originalPrice: 770,
    rating: 4.7,
    reviews: 190,
    badge: 'Rich Fat',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6e994a52b?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 13,
    name: 'Premium Goat Shank (Nalli)',
    category: 'mutton',
    weight: '2 Pieces',
    price: 689,
    originalPrice: 850,
    rating: 4.9,
    reviews: 540,
    badge: 'Nalli Special',
    image: 'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 14,
    name: 'Goat Head Meat (Thala Kari)',
    category: 'mutton',
    weight: '500g',
    price: 499,
    originalPrice: 600,
    rating: 4.6,
    reviews: 310,
    badge: 'Traditional',
    image: 'https://images.unsplash.com/photo-1508736793122-f516e1ba69cf?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 15,
    name: 'Fresh Goat Liver (Kaleji)',
    category: 'mutton',
    weight: '250g',
    price: 299,
    originalPrice: 380,
    rating: 4.9,
    reviews: 1120,
    badge: 'Iron Rich',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 16,
    name: 'Fresh Goat Heart',
    category: 'mutton',
    weight: '250g',
    price: 249,
    originalPrice: 320,
    rating: 4.7,
    reviews: 140,
    badge: 'Cleaned',
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 17,
    name: 'Fresh Goat Kidney (Gurda)',
    category: 'mutton',
    weight: '250g',
    price: 249,
    originalPrice: 320,
    rating: 4.8,
    reviews: 210,
    badge: 'Fresh Cuts',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 18,
    name: 'Fresh Goat Brain (Bheja)',
    category: 'mutton',
    weight: '2 Pieces',
    price: 279,
    originalPrice: 350,
    rating: 4.8,
    reviews: 890,
    badge: 'Delicacy',
    image: 'https://images.unsplash.com/photo-1602489146191-4d3753235b2e?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 19,
    name: 'Goat Intestines (Cleaned Boti)',
    category: 'mutton',
    weight: '500g',
    price: 349,
    originalPrice: 450,
    rating: 4.6,
    reviews: 430,
    badge: 'Cleaned',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },

  // FISH & SEAFOOD (10 items)
  {
    id: 20,
    name: 'Vanjaram (Seer Fish) Steaks',
    category: 'fish',
    weight: '500g',
    price: 649,
    originalPrice: 799,
    rating: 4.9,
    reviews: 1650,
    badge: 'Premium Seer',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 21,
    name: 'Mathi (Sardine) Fresh',
    category: 'fish',
    weight: '500g',
    price: 189,
    originalPrice: 240,
    rating: 4.7,
    reviews: 920,
    badge: 'Omega 3 Rich',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 22,
    name: 'Ayala (Mackerel) Fresh Whole',
    category: 'fish',
    weight: '500g',
    price: 249,
    originalPrice: 320,
    rating: 4.8,
    reviews: 710,
    badge: 'Daily Catch',
    image: 'https://images.unsplash.com/photo-1535401991746-da3d9055713e?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 23,
    name: 'Nethili (Anchovy) Cleaned',
    category: 'fish',
    weight: '250g',
    price: 149,
    originalPrice: 190,
    rating: 4.8,
    reviews: 540,
    badge: 'Crispy Fry Special',
    image: 'https://images.unsplash.com/photo-1611175694989-4870edaa44a4?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 24,
    name: 'White Pomfret (Vavval) Whole',
    category: 'fish',
    weight: '500g',
    price: 599,
    originalPrice: 750,
    rating: 4.9,
    reviews: 880,
    badge: 'Gourmet Selection',
    image: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 25,
    name: 'Koduva (Barramundi) Fillets',
    category: 'fish',
    weight: '400g',
    price: 499,
    originalPrice: 600,
    rating: 4.8,
    reviews: 430,
    badge: 'Clean Fillet',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 26,
    name: 'Sankara (Red Snapper) Whole',
    category: 'fish',
    weight: '500g',
    price: 329,
    originalPrice: 420,
    rating: 4.7,
    reviews: 310,
    badge: 'Snapper Special',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 27,
    name: 'Freshwater Tilapia (Cleaned)',
    category: 'fish',
    weight: '500g',
    price: 219,
    originalPrice: 280,
    rating: 4.6,
    reviews: 290,
    badge: 'Lean Protein',
    image: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 28,
    name: 'Rohu Fish (Curry Cut)',
    category: 'fish',
    weight: '500g',
    price: 239,
    originalPrice: 300,
    rating: 4.7,
    reviews: 680,
    badge: 'Bengali Special',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 29,
    name: 'Katla Fish Curry Cut',
    category: 'fish',
    weight: '500g',
    price: 249,
    originalPrice: 320,
    rating: 4.7,
    reviews: 540,
    badge: 'Sweetwater Special',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },

  // CRAB & PRAWNS (7 items, mapped to fish category)
  {
    id: 30,
    name: 'Premium Mud Crab (Large)',
    category: 'fish',
    weight: '2 Pieces',
    price: 599,
    originalPrice: 750,
    rating: 4.8,
    reviews: 340,
    badge: 'Catch of the Day',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 31,
    name: 'Fresh Blue Swimmer Crab',
    category: 'fish',
    weight: '500g',
    price: 499,
    originalPrice: 620,
    rating: 4.7,
    reviews: 210,
    badge: 'Tender Sweet Meat',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 32,
    name: 'Premium Soft-Shell Crabs',
    category: 'fish',
    weight: '4 Pieces',
    price: 699,
    originalPrice: 850,
    rating: 4.9,
    reviews: 150,
    badge: 'Rare Delicacy',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 33,
    name: 'Jumbo Tiger Prawns (De-veined)',
    category: 'fish',
    weight: '400g',
    price: 549,
    originalPrice: 690,
    rating: 4.9,
    reviews: 1120,
    badge: 'Jumbo Size',
    image: 'https://images.unsplash.com/photo-1559742811-8242f2aebc95?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 34,
    name: 'Fresh White Prawns (Cleaned)',
    category: 'fish',
    weight: '400g',
    price: 399,
    originalPrice: 490,
    rating: 4.8,
    reviews: 890,
    badge: 'Ready to Cook',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 35,
    name: 'Colossal Jumbo Prawns',
    category: 'fish',
    weight: '300g',
    price: 629,
    originalPrice: 790,
    rating: 4.9,
    reviews: 430,
    badge: 'King Size',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60',
    inStock: true
  },
  {
    id: 36,
    name: 'Freshwater Scampi (Cleaned)',
    category: 'fish',
    weight: '400g',
    price: 579,
    originalPrice: 720,
    rating: 4.8,
    reviews: 260,
    badge: 'Giant Scampi',
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=500&auto=format&fit=crop&q=60',
    inStock: true
  }
]

const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Farm Fresh Meat Delivered To Your Doorstep',
    subtitle: 'Premium chicken, fish, mutton and ready-to-cook products prepared under strict hygiene standards and delivered chilled.',
    badge: 'FDH Signature Standard',
    imageUrl: '/banner.png',
    buttonText: 'Fresh Cuts',
    link: '#categories',
    active: true
  },
  {
    id: 2,
    title: 'Sunday Mutton Feast - Up to 15% Off!',
    subtitle: 'Get tender, juicy prime goat ribs and shoulder cuts delivered clean-room fresh. Place your scheduled order now.',
    badge: 'Weekend Special Offer',
    imageUrl: '/mutton_banner.png',
    buttonText: 'Order Mutton',
    link: '/category/mutton',
    active: true
  },
  {
    id: 3,
    title: 'Premium Tender Chicken cuts - Hygienic Room prepped',
    subtitle: 'Antibiotic-free, clean-room cut premium chicken drumsticks, breasts, and wings delivered chilled.',
    badge: 'Signature Poultry Cuts',
    imageUrl: '/chicken_banner.png',
    buttonText: 'Order Chicken',
    link: '/category/chicken',
    active: true
  }
]

const INITIAL_PARTNERS: DeliveryPartner[] = [
  { id: 1, name: 'Karthik Raja', phone: '9840123456', status: 'active' },
  { id: 2, name: 'Suresh Kumar', phone: '9790987654', status: 'active' },
  { id: 3, name: 'Mohammed Ali', phone: '9600112233', status: 'active' }
]

// Mock orders to populate the admin panel on first load
const INITIAL_ORDERS: Order[] = [
  {
    id: 'FDH-7402',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210',
    customerAddress: 'Apt 4B, Sea Breeze Apartments, Bandra West, Mumbai - 400050',
    items: [
      {
        id: 1,
        name: 'Premium Chicken Breast (Boneless)',
        weight: '500g',
        price: 249,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60',
        qty: 2
      },
      {
        id: 9,
        name: 'Tender Goat Loin Chops',
        weight: '400g',
        price: 649,
        image: 'https://images.unsplash.com/photo-1602489146191-4d3753235b2e?w=500&auto=format&fit=crop&q=60',
        qty: 1
      }
    ],
    paymentMethod: 'cod',
    subtotal: 1147,
    deliveryFee: 0,
    total: 1147,
    status: 'delivered',
    date: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
    deliveryType: 'immediate',
    deliveryBoyName: 'Karthik Raja',
    deliveryBoyPhone: '9840123456'
  },
  {
    id: 'FDH-8821',
    customerName: 'Priya Patel',
    customerPhone: '9922883311',
    customerAddress: 'Flat 1202, Heights Residency, HSR Layout, Bangalore - 560102',
    items: [
      {
        id: 7,
        name: 'Premium Goat Leg (Curry Cut)',
        weight: '500g',
        price: 699,
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop&q=60',
        qty: 1
      }
    ],
    paymentMethod: 'online',
    subtotal: 699,
    deliveryFee: 0,
    total: 699,
    status: 'preparing',
    date: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    deliveryType: 'scheduled',
    scheduledDate: new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0], // Tomorrow
    scheduledSlot: 'Morning 8 AM - 11 AM'
  },
  {
    id: 'FDH-9014',
    customerName: 'Amit Kumar',
    customerPhone: '9525016352',
    customerAddress: 'Pocket C-2, Vasant Kunj, New Delhi - 110070',
    items: [
      {
        id: 20,
        name: 'Vanjaram (Seer Fish) Steaks',
        weight: '500g',
        price: 649,
        image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=500&auto=format&fit=crop&q=60',
        qty: 1
      },
      {
        id: 3,
        name: 'Fresh Chicken Wings',
        weight: '500g',
        price: 199,
        image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500&auto=format&fit=crop&q=60',
        qty: 1
      }
    ],
    paymentMethod: 'whatsapp',
    subtotal: 848,
    deliveryFee: 0,
    total: 848,
    status: 'pending',
    date: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
  }
]

// Mappings for Supabase integration
const mapProductFromDb = (dbProduct: any): Product => {
  const category = dbProduct.category || ''
  const name = dbProduct.name || ''
  const badge = dbProduct.badge || ''
  
  const generatedDescription = `Premium fresh quality ${name}. Hand-selected and vacuum sealed for freshness. Category: ${category}.`
  const generatedTags = [
    category,
    badge,
    ...name.split(' '),
    category === 'chicken' ? ['poultry', 'meat', 'raw'] : [],
    category === 'mutton' ? ['lamb', 'goat', 'meat', 'red meat', 'curry'] : [],
    category === 'fish' ? ['seafood', 'prawns', 'crab', 'river fish', 'sea fish'] : [],
    category === 'eggs' ? ['egg', 'poultry', 'protein', 'breakfast'] : [],
  ].flat().map(s => String(s).toLowerCase().trim()).filter(Boolean)

  return {
    id: Number(dbProduct.id),
    name: dbProduct.name,
    category: dbProduct.category,
    weight: dbProduct.weight,
    price: Number(dbProduct.price),
    originalPrice: Number(dbProduct.original_price || dbProduct.originalPrice || dbProduct.price),
    rating: Number(dbProduct.rating || 5.0),
    reviews: Number(dbProduct.reviews_count || dbProduct.reviews || 12),
    badge: dbProduct.badge || '',
    image: dbProduct.image || '',
    inStock: dbProduct.in_stock !== undefined ? dbProduct.in_stock : true,
    description: generatedDescription,
    tags: generatedTags,
  }
}

const mapProductToDb = (product: any): any => {
  const dbProduct: any = {}
  
  if (product.id !== undefined) dbProduct.id = product.id
  if (product.name !== undefined) dbProduct.name = product.name
  if (product.category !== undefined) dbProduct.category = product.category
  if (product.weight !== undefined) dbProduct.weight = product.weight
  if (product.price !== undefined) dbProduct.price = Number(product.price)
  
  if (product.originalPrice !== undefined) {
    dbProduct.original_price = Number(product.originalPrice)
  } else if (product.original_price !== undefined) {
    dbProduct.original_price = Number(product.original_price)
  }
  
  if (product.rating !== undefined) dbProduct.rating = Number(product.rating)
  
  if (product.reviews !== undefined) {
    dbProduct.reviews = Number(product.reviews)
  } else if (product.reviewsCount !== undefined) {
    dbProduct.reviews = Number(product.reviewsCount)
  } else if (product.reviews_count !== undefined) {
    dbProduct.reviews = Number(product.reviews_count)
  }
  
  if (product.badge !== undefined) dbProduct.badge = product.badge
  if (product.image !== undefined) dbProduct.image = product.image
  
  if (product.inStock !== undefined) {
    dbProduct.in_stock = Boolean(product.inStock)
  } else if (product.in_stock !== undefined) {
    dbProduct.in_stock = Boolean(product.in_stock)
  }
  
  return dbProduct
}

const mapBannerFromDb = (dbBanner: any): Banner => ({
  id: Number(dbBanner.id),
  title: dbBanner.title,
  subtitle: dbBanner.subtitle,
  badge: dbBanner.badge || '',
  imageUrl: dbBanner.image_url || '',
  buttonText: dbBanner.button_text || '',
  link: dbBanner.link || '',
  active: dbBanner.active,
  archived: dbBanner.archived
})

const mapBannerToDb = (banner: any): any => {
  const dbBanner = { ...banner }
  if (banner.imageUrl !== undefined) {
    dbBanner.image_url = banner.imageUrl
    delete dbBanner.imageUrl
  }
  if (banner.buttonText !== undefined) {
    dbBanner.button_text = banner.buttonText
    delete dbBanner.buttonText
  }
  return dbBanner
}

const mapOrderFromDb = (dbOrder: any): Order => ({
  id: dbOrder.id,
  customerName: dbOrder.customer_name || dbOrder.customerName || 'Customer',
  customerPhone: dbOrder.customer_phone || dbOrder.customerPhone || '',
  customerAddress: dbOrder.customer_address || dbOrder.address || dbOrder.customerAddress || '',
  items: dbOrder.items || [],
  paymentMethod: dbOrder.payment_method || dbOrder.paymentMethod || 'cod',
  subtotal: Number(dbOrder.subtotal || dbOrder.total || 0),
  deliveryFee: Number(dbOrder.delivery_fee || dbOrder.deliveryFee || 0),
  total: Number(dbOrder.total || 0),
  status: dbOrder.status || dbOrder.order_status || 'pending',
  date: dbOrder.date || dbOrder.createdAt || new Date().toISOString(),
  latitude: dbOrder.latitude ? Number(dbOrder.latitude) : undefined,
  longitude: dbOrder.longitude ? Number(dbOrder.longitude) : undefined,
  distanceKm: dbOrder.distance_km ? Number(dbOrder.distance_km) : undefined,
  estimatedDeliveryTime: dbOrder.estimated_delivery_time,
  assignedDeliveryPartner: dbOrder.assigned_delivery_partner || dbOrder.delivery_boy_name,
  deliveryType: dbOrder.delivery_type || dbOrder.deliveryType,
  scheduledDate: dbOrder.scheduled_date || dbOrder.scheduledDate,
  scheduledSlot: dbOrder.scheduled_slot || dbOrder.scheduledSlot,
  scheduledTime: dbOrder.scheduled_time || dbOrder.scheduledTime,
  assignedRiderId: dbOrder.assigned_rider_id || dbOrder.assignedRiderId,
  rescheduleReason: dbOrder.reschedule_reason || dbOrder.rescheduleReason,
  deliveryBoyName: dbOrder.delivery_boy_name || dbOrder.assigned_delivery_partner,
  deliveryBoyPhone: dbOrder.delivery_boy_phone
})

const mapOrderToDb = (order: any): any => {
  const dbOrder: any = {
    id: order.id,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    customer_address: order.customerAddress || order.address,
    items: order.items,
    payment_method: order.paymentMethod,
    subtotal: order.subtotal || order.total,
    delivery_fee: order.deliveryFee || 0,
    total: order.total,
    status: order.status,
    date: order.date || order.createdAt
  }
  
  if (order.latitude !== undefined) dbOrder.latitude = order.latitude
  if (order.longitude !== undefined) dbOrder.longitude = order.longitude
  if (order.distanceKm !== undefined) dbOrder.distance_km = order.distanceKm
  if (order.estimatedDeliveryTime !== undefined) dbOrder.estimated_delivery_time = order.estimatedDeliveryTime
  if (order.assignedDeliveryPartner !== undefined) dbOrder.assigned_delivery_partner = order.assignedDeliveryPartner
  if (order.deliveryType !== undefined) dbOrder.delivery_type = order.deliveryType
  if (order.scheduledDate !== undefined) dbOrder.scheduled_date = order.scheduledDate
  if (order.scheduledSlot !== undefined) dbOrder.scheduled_slot = order.scheduledSlot
  if (order.scheduledTime !== undefined) dbOrder.scheduled_time = order.scheduledTime
  if (order.assignedRiderId !== undefined) dbOrder.assigned_rider_id = order.assignedRiderId
  if (order.rescheduleReason !== undefined) dbOrder.reschedule_reason = order.rescheduleReason
  if (order.deliveryBoyName !== undefined) dbOrder.delivery_boy_name = order.deliveryBoyName
  if (order.deliveryBoyPhone !== undefined) dbOrder.delivery_boy_phone = order.deliveryBoyPhone
  
  return dbOrder
}

export const useStore = create<HomepageState>((set) => ({
  // Products inventory state
  products: INITIAL_PRODUCTS.map((p) => {
    const sku = `FDH-${p.category.substring(0, 3).toUpperCase()}-${String(p.id).padStart(3, '0')}`;
    const barcode = `890${String(p.id).padStart(10, '0')}`;
    const costPrice = Math.round(p.price * 0.7);
    const currentStock = p.inStock ? 50 + (p.id % 5) * 10 : 0;
    const reservedStock = p.inStock ? (p.id % 4) * 2 : 0;
    
    const variants = [
      {
        sku: `${sku}-500G`,
        name: `${p.name} (500g)`,
        weight: '500g',
        price: p.price,
        costPrice: costPrice,
        stock: Math.round(currentStock * 0.6),
        reservedStock: Math.round(reservedStock * 0.6),
        reorderLevel: 5,
        barcode: `${barcode}1`
      },
      {
        sku: `${sku}-1KG`,
        name: `${p.name} (1kg)`,
        weight: '1kg',
        price: Math.round(p.price * 1.8),
        costPrice: Math.round(costPrice * 1.8),
        stock: Math.round(currentStock * 0.4),
        reservedStock: Math.round(reservedStock * 0.4),
        reorderLevel: 5,
        barcode: `${barcode}2`
      }
    ];

    const vId = `VND-00${(p.id % 3) + 1}`;
    const vName = vId === 'VND-001' ? 'Standard Poultry Farms' : vId === 'VND-002' ? 'Coastal Seafood Co.' : 'Himalayan Organic Meats';

    const generatedDescription = `Premium fresh quality ${p.name}. Hand-selected and vacuum sealed for freshness. Category: ${p.category}.`
    const generatedTags = [
      p.category,
      p.badge,
      ...p.name.split(' '),
      p.category === 'chicken' ? ['poultry', 'meat', 'raw'] : [],
      p.category === 'mutton' ? ['lamb', 'goat', 'meat', 'red meat', 'curry'] : [],
      p.category === 'fish' ? ['seafood', 'prawns', 'crab', 'river fish', 'sea fish'] : [],
      p.category === 'eggs' ? ['egg', 'poultry', 'protein', 'breakfast'] : [],
    ].flat().map(s => String(s).toLowerCase().trim()).filter(Boolean)

    return {
      ...p,
      sku,
      barcode,
      brand: 'Fresh Direct Home',
      vendorId: vId,
      vendorName: vName,
      costPrice,
      reorderLevel: 10,
      reservedStock,
      variants,
      description: generatedDescription,
      tags: generatedTags
    };
  }),
  updateProduct: (productId, updatedFields) =>
    set((state) => {
      fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, updatedFields }),
        cache: 'no-store'
      }).then(res => res.json()).then(res => {
        if (res.error) console.error('Error updating product:', res.error)
      }).catch(err => {
        console.error('Network error updating product:', err)
      })

      return {
        products: state.products.map((p) =>
          p.id === productId ? { ...p, ...updatedFields } : p
        ),
      }
    }),
  addProduct: (product) =>
    set((state) => {
      const nextId = state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) + 1 : 1
      const newProduct = { 
        ...product, 
        id: nextId, 
        inStock: true,
        rating: 5,
        reviews: 0
      }
      
      fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
        cache: 'no-store'
      }).then(res => res.json()).then(res => {
        if (res.error) console.error('Error adding product:', res.error)
      }).catch(err => {
        console.error('Network error adding product:', err)
      })
      
      return {
        products: [...state.products, newProduct],
      }
    }),
  deleteProduct: (productId) =>
    set((state) => {
      console.log(`[DELETE PRODUCT FRONTEND] Attempting to delete product. ID sent from frontend:`, productId)
      
      fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
        cache: 'no-store'
      }).then(res => res.json()).then(res => {
        if (res.error) {
          console.error('[DELETE PRODUCT FRONTEND] Error deleting product:', res.error)
        } else {
          console.log('[DELETE PRODUCT FRONTEND] Successfully received success response from API:', res)
        }
      }).catch(err => {
        console.error('[DELETE PRODUCT FRONTEND] Network error deleting product:', err)
      })

      return {
        products: state.products.filter((p) => String(p.id) !== String(productId)),
      }
    }),

  // Orders list state
  orders: INITIAL_ORDERS,
  addOrder: (order) =>
    set((state) => {
      const newOrders = [order, ...state.orders]
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('fdh_orders_cache', JSON.stringify(newOrders))
        } catch (e) {
          console.warn('LocalStorage save error:', e)
        }
      }

      if (isSupabaseConfigured() && supabase) {
        const rawPayload = mapOrderToDb(order)
        const cleanPayload: any = {}
        Object.keys(rawPayload).forEach(k => {
          if (rawPayload[k] !== undefined && rawPayload[k] !== null) cleanPayload[k] = rawPayload[k]
        })

        // 1. Primary insertion into public.orders table
        supabase.from('orders').insert([cleanPayload]).then(async ({ data, error }) => {
          if (error) {
            console.warn('[Supabase Insert Warning] Full schema insert failed on public.orders, running core payload fallback:', error.message || error)
            const corePayload = {
              id: order.id,
              customer_name: order.customerName,
              customer_phone: order.customerPhone,
              customer_address: order.customerAddress || order.address || 'Address',
              items: order.items,
              payment_method: order.paymentMethod,
              subtotal: order.subtotal || order.total,
              delivery_fee: order.deliveryFee || 0,
              total: order.total,
              status: order.status,
              date: order.date || new Date().toISOString()
            }
            const { error: coreErr } = await supabase.from('orders').insert([corePayload])
            if (coreErr) {
              console.error('[Supabase Insert Error] Failed to insert into public.orders:', coreErr.message || coreErr)
            } else {
              console.log('[Supabase Insert Success] Order saved to public.orders core schema!')
            }
          } else {
            console.log('[Supabase Insert Success] Order saved successfully to public.orders!')
          }
        })

        // 2. Dual insertion into public.scheduled_orders if table exists
        if (order.deliveryType === 'scheduled' || order.scheduledDate || order.scheduledSlot) {
          const schedPayload: any = {
            id: order.id,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            customer_address: order.customerAddress || order.address || 'Address',
            items: order.items,
            payment_method: order.paymentMethod,
            total: order.total,
            status: order.status,
            scheduled_date: order.scheduledDate || new Date().toISOString().split('T')[0],
            scheduled_slot: order.scheduledSlot || order.scheduledTime || '10:00 AM - 01:00 PM',
            scheduled_time: order.scheduledTime || order.scheduledSlot
          }
          if (order.assignedRiderId) schedPayload.assigned_rider_id = order.assignedRiderId
          if (order.rescheduleReason) schedPayload.reschedule_reason = order.rescheduleReason

          supabase.from('scheduled_orders').upsert([schedPayload]).then(({ error }) => {
            if (error) {
              if (error.code === '42P01' || error.message?.includes('schema cache')) {
                console.info('[Supabase Note] public.scheduled_orders table not yet created in remote DB schema. Saved via public.orders.')
              } else {
                console.warn('[Supabase scheduled_orders sync note]:', error.message || error)
              }
            } else {
              console.log('[Supabase Insert Success] Scheduled order inserted into public.scheduled_orders!')
            }
          })
        }
      }
      return {
        orders: newOrders,
      }
    }),
  updateOrderStatus: (orderId, status) =>
    set((state) => {
      const newOrders = state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('fdh_orders_cache', JSON.stringify(newOrders))
        } catch (e) {
          console.warn('LocalStorage save error:', e)
        }
      }
      if (isSupabaseConfigured() && supabase) {
        supabase.from('orders').update({ status }).eq('id', orderId).then(({ error }) => {
          if (error) console.error('Error updating order status in Supabase:', error)
        })
        supabase.from('scheduled_orders').update({ status }).eq('id', orderId).then(() => {})
      }
      return {
        orders: newOrders,
      }
    }),
  updateOrderDelivery: (orderId, deliveryData) =>
    set((state) => {
      const newOrders = state.orders.map((o) =>
        o.id === orderId ? { ...o, ...deliveryData } : o
      )
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('fdh_orders_cache', JSON.stringify(newOrders))
        } catch (e) {
          console.warn('LocalStorage save error:', e)
        }
      }
      if (isSupabaseConfigured() && supabase) {
        const updatePayload: any = {}
        if (deliveryData.scheduledDate !== undefined) updatePayload.scheduled_date = deliveryData.scheduledDate
        if (deliveryData.scheduledSlot !== undefined) updatePayload.scheduled_slot = deliveryData.scheduledSlot
        if (deliveryData.scheduledTime !== undefined) updatePayload.scheduled_time = deliveryData.scheduledTime
        if (deliveryData.assignedRiderId !== undefined) updatePayload.assigned_rider_id = deliveryData.assignedRiderId
        if (deliveryData.rescheduleReason !== undefined) updatePayload.reschedule_reason = deliveryData.rescheduleReason
        if (deliveryData.status !== undefined) updatePayload.status = deliveryData.status

        supabase.from('orders').update(updatePayload).eq('id', orderId).then(({ error }) => {
          if (error) console.error('Error updating order delivery in Supabase:', error)
          else console.log('[Supabase Update Success] Delivery updates saved for order:', orderId)
        })
        supabase.from('scheduled_orders').update(updatePayload).eq('id', orderId).then(() => {})
      }
      return {
        orders: newOrders,
      }
    }),

  // Global settings state
  whatsappNumber: '918525016352',
  deliveryFee: 49,
  freeDeliveryLimit: 499,
  enableCod: true,
  enableOnline: true,
  enableWhatsappCheckout: true,
  updateSettings: (settingsFields) =>
    set((state) => ({
      ...state,
      ...settingsFields,
    })),

  // Cart initial state
  items: [],
  totalItems: 0,
  subtotal: 0,
  isCartOpen: false,
  setIsCartOpen: (open) => set({ isCartOpen: open }),
  cartStep: 'cart',
  setCartStep: (step) => set({ cartStep: step }),

  addItem: (product) =>
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === product.id)
      let newItems = [...state.items]

      if (existingIndex > -1) {
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          qty: newItems[existingIndex].qty + 1,
        }
      } else {
        newItems.push({ ...product, qty: 1 })
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.qty, 0)
      const subtotal = newItems.reduce((sum, item) => sum + item.price * item.qty, 0)

      return { items: newItems, totalItems, subtotal }
    }),

  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id)
      const totalItems = newItems.reduce((sum, item) => sum + item.qty, 0)
      const subtotal = newItems.reduce((sum, item) => sum + item.price * item.qty, 0)
      return { items: newItems, totalItems, subtotal }
    }),

  updateQty: (id, qty) =>
    set((state) => {
      if (qty <= 0) {
        const newItems = state.items.filter((item) => item.id !== id)
        const totalItems = newItems.reduce((sum, item) => sum + item.qty, 0)
        const subtotal = newItems.reduce((sum, item) => sum + item.price * item.qty, 0)
        return { items: newItems, totalItems, subtotal }
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, qty } : item
      )
      const totalItems = newItems.reduce((sum, item) => sum + item.qty, 0)
      const subtotal = newItems.reduce((sum, item) => sum + item.price * item.qty, 0)

      return { items: newItems, totalItems, subtotal }
    }),

  clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),

  // Location selector initial state
  selectedLocation: '',
  setSelectedLocation: (location) => set({ selectedLocation: location }),

  // Category filter initial state
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  // Search initial state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchFocused: false,
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),

  // Auth initial state
  isAuthModalOpen: false,
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  user: null,
  isAuthLoading: true,
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('fdh_user_session', JSON.stringify(user))
      } else {
        localStorage.removeItem('fdh_user_session')
        localStorage.removeItem('fdh_admin_session')
      }
    }
    set({ user })
  },
  registeredUsers: [],
  registerUser: (newUser) =>
    set((state) => ({
      registeredUsers: [
        ...state.registeredUsers.filter((u) => {
          if (newUser.email && u.email === newUser.email) return false
          if (newUser.phone && u.phone === newUser.phone) return false
          return true
        }),
        newUser,
      ],
    })),

  // Banners actions
  banners: INITIAL_BANNERS,
  addBanner: (banner) => set((state) => {
    const nextId = state.banners.reduce((max, b) => Math.max(max, b.id), 0) + 1
    const newBanner = { ...banner, id: nextId }
    if (isSupabaseConfigured() && supabase) {
      supabase.from('banners').insert([mapBannerToDb(newBanner)]).then(({ error }) => {
        if (error) console.error('Error adding banner to Supabase:', error)
      })
    }
    return { banners: [...state.banners, newBanner] }
  }),
  updateBanner: (bannerId, updatedFields) => set((state) => {
    if (isSupabaseConfigured() && supabase) {
      supabase.from('banners').update(mapBannerToDb(updatedFields)).eq('id', bannerId).then(({ error }) => {
        if (error) console.error('Error updating banner in Supabase:', error)
      })
    }
    return {
      banners: state.banners.map((b) => b.id === bannerId ? { ...b, ...updatedFields } : b)
    }
  }),
  deleteBanner: (bannerId) => set((state) => {
    if (isSupabaseConfigured() && supabase) {
      supabase.from('banners').update({ archived: true, active: false }).eq('id', bannerId).then(({ error }) => {
        if (error) console.error('Error archiving banner in Supabase:', error)
      })
    }
    return {
      banners: state.banners.map((b) => b.id === bannerId ? { ...b, archived: true, active: false } : b)
    }
  }),

  // Delivery partner actions
  deliveryPartners: INITIAL_PARTNERS,
  vendors: INITIAL_VENDORS,
  purchaseOrders: INITIAL_PURCHASE_ORDERS,
  stockMovements: INITIAL_STOCK_MOVEMENTS,
  returns: INITIAL_RETURNS,
  addDeliveryPartner: (partner) => set((state) => {
    const nextId = state.deliveryPartners.reduce((max, dp) => Math.max(max, dp.id), 0) + 1
    const newPartner = { ...partner, id: nextId }
    if (isSupabaseConfigured() && supabase) {
      supabase.from('delivery_partners').insert([{
        id: nextId,
        name: partner.name,
        phone: partner.phone,
        status: partner.status
      }]).then(({ error }) => {
        if (error) console.error('Error adding delivery partner in Supabase:', error)
      })
    }
    return { deliveryPartners: [...state.deliveryPartners, newPartner] }
  }),
  updateDeliveryPartner: (partnerId, updatedFields) => set((state) => {
    if (isSupabaseConfigured() && supabase) {
      const dbFields: any = {}
      if (updatedFields.name !== undefined) dbFields.name = updatedFields.name
      if (updatedFields.phone !== undefined) dbFields.phone = updatedFields.phone
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status
      if (Object.keys(dbFields).length > 0) {
        supabase.from('delivery_partners').update(dbFields).eq('id', partnerId).then(({ error }) => {
          if (error) console.error('Error updating delivery partner in Supabase:', error)
        })
      }
    }
    return {
      deliveryPartners: state.deliveryPartners.map((dp) => dp.id === partnerId ? { ...dp, ...updatedFields } : dp)
    }
  }),
  deleteDeliveryPartner: (partnerId) => set((state) => {
    if (isSupabaseConfigured() && supabase) {
      supabase.from('delivery_partners').delete().eq('id', partnerId).then(({ error }) => {
        if (error) console.error('Error deleting delivery partner in Supabase:', error)
      })
    }
    return {
      deliveryPartners: state.deliveryPartners.filter((dp) => dp.id !== partnerId)
    }
  }),
  assignDeliveryBoy: (orderId, name, phone) => set((state) => {
    const o = state.orders.find((ord) => ord.id === orderId)
    const nextStatus = o ? (o.status === 'pending' || o.status === 'preparing' ? 'out-for-delivery' : o.status) : 'out-for-delivery'
    
    if (isSupabaseConfigured() && supabase) {
      supabase.from('orders').update({
        delivery_boy_name: name,
        delivery_boy_phone: phone,
        status: nextStatus
      }).eq('id', orderId).then(({ error }) => {
        if (error) console.error('Error assigning delivery boy in Supabase:', error)
      })
    }
    
    return {
      orders: state.orders.map((ord) =>
        ord.id === orderId
          ? { ...ord, deliveryBoyName: name, deliveryBoyPhone: phone, status: nextStatus }
          : ord
      )
    }
  }),

  // Customer Profile State
  customers: INITIAL_CUSTOMERS,
  adminNotifications: INITIAL_ADMIN_NOTIFICATIONS,
  fetchCustomers: async () => {
    if (!isSupabaseConfigured() || !supabase) return
    try {
      const { data, error } = await supabase.from('users').select('*').eq('role', 'customer').order('created_at', { ascending: false })
      if (error) throw error
      if (data && data.length > 0) {
        set({
          customers: data.map((c: any) => ({
            id: c.id,
            fullName: c.full_name || c.name || 'Customer',
            email: c.email || '',
            phone: c.phone || '',
            status: c.status || 'active',
            createdAt: c.created_at || new Date().toISOString(),
            lastLogin: c.last_login || new Date().toISOString(),
            activityLogs: c.activity_logs || []
          }))
        })
      }
    } catch (e: any) {
      console.error('Failed to fetch customers from Supabase:', e?.message || e)
    }
  },
  updateCustomerStatus: (customerId, status, reason, adminName = 'Super Admin') => set((state) => {
    const updatedCustomers = state.customers.map((c) => {
      if (c.id === customerId) {
        const newLog: CustomerActivityLog = {
          id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toISOString(),
          type: 'status_change',
          description: `Account status updated to ${status.toUpperCase()} by ${adminName}. ${reason ? `Reason: ${reason}` : ''}`
        }
        return {
          ...c,
          status,
          activityLogs: [newLog, ...c.activityLogs]
        }
      }
      return c
    })

    if (isSupabaseConfigured() && supabase) {
      supabase.from('users').update({ status }).eq('id', customerId).then(({ error }) => {
        if (error) console.error('Error updating customer status in Supabase:', error)
      })
    }

    return { customers: updatedCustomers }
  }),
  markNotificationRead: (notifId) => set((state) => ({
    adminNotifications: state.adminNotifications.map((n) => n.id === notifId ? { ...n, read: true } : n)
  })),

  // Wishlist & Reviews Actions
  wishlist: [1, 9], // Default sample bookmarked product IDs
  reviews: INITIAL_REVIEWS,
  toggleWishlist: (productId) => set((state) => {
    const exists = state.wishlist.includes(productId)
    const updatedWishlist = exists
      ? state.wishlist.filter((id) => id !== productId)
      : [...state.wishlist, productId]

    if (isSupabaseConfigured() && supabase) {
      if (exists) {
        supabase.from('wishlist').delete().eq('product_id', productId).then(({ error }) => {
          if (error) console.error('Error removing wishlist item in Supabase:', error)
        })
      } else {
        supabase.from('wishlist').insert([{ user_phone: 'guest', product_id: productId }]).then(({ error }) => {
          if (error) console.error('Error adding wishlist item in Supabase:', error)
        })
      }
    }

    return { wishlist: updatedWishlist }
  }),
  addReview: (review) => set((state) => {
    const newRev: ProductReview = {
      ...review,
      id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString()
    }
    const updatedReviews = [newRev, ...state.reviews]

    if (isSupabaseConfigured() && supabase) {
      supabase.from('reviews').insert([{
        product_id: review.productId,
        user_name: review.userName,
        rating: review.rating,
        comment: review.comment
      }]).then(({ error }) => {
        if (error) console.error('Error adding review in Supabase:', error)
      })
    }

    return { reviews: updatedReviews }
  }),
  fetchReviews: async (productId) => {
    if (!isSupabaseConfigured() || !supabase) return
    try {
      const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId)
      if (error) throw error
      if (data && data.length > 0) {
        const mapped: ProductReview[] = data.map((r: any) => ({
          id: r.id,
          productId: r.product_id,
          userName: r.user_name,
          rating: r.rating,
          comment: r.comment,
          date: r.created_at
        }))
        set((state) => ({
          reviews: [...mapped, ...state.reviews.filter((r) => r.productId !== productId)]
        }))
      }
    } catch (e: any) {
      console.error('Failed to fetch reviews from Supabase:', e?.message || e)
    }
  },

  addVendor: (vendor) => set((state) => {
    const nextId = `VND-00${state.vendors.length + 1}`;
    const newVendor = { ...vendor, id: nextId, totalPurchases: 0, totalSpend: 0, deliveryPerformance: 100 };
    if (isSupabaseConfigured() && supabase) {
      supabase.from('vendors').insert([{
        id: nextId,
        name: vendor.name,
        contact_person: vendor.contactPerson,
        phone: vendor.phone,
        email: vendor.email || '',
        address: vendor.address || '',
        gst_number: vendor.gstNumber || '',
        status: 'active'
      }]).then(({ error }) => {
        if (error) console.error('Error adding vendor to Supabase:', error)
      })
    }
    return {
      vendors: [...state.vendors, newVendor]
    }
  }),
  updateVendor: (vendorId, updatedFields) => set((state) => {
    if (isSupabaseConfigured() && supabase) {
      const dbFields: any = {}
      if (updatedFields.name !== undefined) dbFields.name = updatedFields.name
      if (updatedFields.contactPerson !== undefined) dbFields.contact_person = updatedFields.contactPerson
      if (updatedFields.phone !== undefined) dbFields.phone = updatedFields.phone
      if (updatedFields.email !== undefined) dbFields.email = updatedFields.email
      if (updatedFields.address !== undefined) dbFields.address = updatedFields.address
      if (updatedFields.gstNumber !== undefined) dbFields.gst_number = updatedFields.gstNumber
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status

      if (Object.keys(dbFields).length > 0) {
        supabase.from('vendors').update(dbFields).eq('id', vendorId).then(({ error }) => {
          if (error) console.error('Error updating vendor in Supabase:', error)
        })
      }
    }
    return {
      vendors: state.vendors.map((v) => v.id === vendorId ? { ...v, ...updatedFields } : v)
    }
  }),
  createPurchaseOrder: (po) => set((state) => {
    const nextId = `PO-2026-${String(state.purchaseOrders.length + 1).padStart(3, '0')}`;
    const totalCost = po.items.reduce((sum, item) => sum + item.totalCost, 0);
    const newPo: PurchaseOrder = {
      ...po,
      id: nextId,
      totalCost,
      orderDate: new Date().toISOString(),
    };
    return {
      purchaseOrders: [...state.purchaseOrders, newPo]
    }
  }),
  updatePurchaseOrderStatus: (poId, status) => set((state) => ({
    purchaseOrders: state.purchaseOrders.map((po) => po.id === poId ? { ...po, status } : po)
  })),
  receivePurchaseOrder: (poId, receivedItems, user) => set((state) => {
    const po = state.purchaseOrders.find(p => p.id === poId);
    if (!po) return {};

    let updatedProducts = [...state.products];
    let newMovements: StockMovement[] = [];

    receivedItems.forEach((recv) => {
      const productIndex = updatedProducts.findIndex(p => p.variants?.some(v => v.sku === recv.variantSku));
      if (productIndex > -1) {
        const product = updatedProducts[productIndex];
        const updatedVariants = product.variants?.map((v) => {
          if (v.sku === recv.variantSku) {
            const previousStock = v.stock;
            const newStock = previousStock + recv.receivedQty;
            
            newMovements.push({
              id: `MOV-${String(state.stockMovements.length + newMovements.length + 1).padStart(3, '0')}`,
              productId: product.id,
              productName: product.name,
              variantSku: v.sku,
              type: 'receipt',
              quantityChanged: recv.receivedQty,
              previousStock,
              newStock,
              reason: `PO Receipt ${poId} - ${recv.notes || 'Good Condition'}`,
              user,
              date: new Date().toISOString(),
              referenceNo: poId
            });

            return { ...v, stock: newStock };
          }
          return v;
        }) || [];

        const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        updatedProducts[productIndex] = {
          ...product,
          inStock: totalStock > 0,
          variants: updatedVariants
        };
      }
    });

    const updatedPOs = state.purchaseOrders.map(p => p.id === poId ? { ...p, status: 'delivered' as const } : p);
    
    const updatedVendors = state.vendors.map(v => {
      if (v.id === po.vendorId) {
        return {
          ...v,
          totalPurchases: v.totalPurchases + 1,
          totalSpend: v.totalSpend + po.totalCost,
          deliveryPerformance: Math.min(100, Math.max(80, v.deliveryPerformance + (newMovements.some(m => m.reason.includes('damage')) ? -2 : 1)))
        };
      }
      return v;
    });

    return {
      products: updatedProducts,
      purchaseOrders: updatedPOs,
      stockMovements: [...state.stockMovements, ...newMovements],
      vendors: updatedVendors
    };
  }),
  addStockMovement: (movement) => set((state) => {
    const nextId = `MOV-${String(state.stockMovements.length + 1).padStart(3, '0')}`;
    const newMovement: StockMovement = {
      ...movement,
      id: nextId,
      date: new Date().toISOString()
    };
    return {
      stockMovements: [...state.stockMovements, newMovement]
    }
  }),
  adjustStock: (productId, variantSku, changeQty, type, reason, user, referenceNo) => set((state) => {
    let newMovements: StockMovement[] = [];
    const updatedProducts = state.products.map((p) => {
      if (p.id === productId) {
        const updatedVariants = p.variants?.map((v) => {
          if (v.sku === variantSku) {
            const previousStock = v.stock;
            const newStock = Math.max(0, previousStock + changeQty);
            newMovements.push({
              id: `MOV-${String(state.stockMovements.length + newMovements.length + 1).padStart(3, '0')}`,
              productId,
              productName: p.name,
              variantSku,
              type,
              quantityChanged: changeQty,
              previousStock,
              newStock,
              reason,
              user,
              date: new Date().toISOString(),
              referenceNo
            });
            return { ...v, stock: newStock };
          }
          return v;
        }) || [];

        const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        return {
          ...p,
          inStock: totalStock > 0,
          variants: updatedVariants
        };
      }
      return p;
    });

    return {
      products: updatedProducts,
      stockMovements: [...state.stockMovements, ...newMovements]
    };
  }),
  createReturn: (item) => set((state) => {
    const nextId = `RET-${String(state.returns.length + 1).padStart(3, '0')}`;
    const newReturn: InventoryReturn = {
      ...item,
      id: nextId,
      date: new Date().toISOString(),
      restocked: false
    };
    return {
      returns: [newReturn, ...state.returns]
    }
  }),
  updateReturnStatus: (returnId, status, restock, user) => set((state) => {
    const ret = state.returns.find(r => r.id === returnId);
    if (!ret) return {};

    let updatedProducts = [...state.products];
    let newMovements: StockMovement[] = [];

    if (status === 'approved' && restock && !ret.restocked) {
      const pIdx = updatedProducts.findIndex(p => p.id === ret.productId);
      if (pIdx > -1) {
        const p = updatedProducts[pIdx];
        const updatedVariants = p.variants?.map((v) => {
          if (v.sku === ret.variantSku) {
            const prev = v.stock;
            const next = prev + ret.quantity;
            newMovements.push({
              id: `MOV-${String(state.stockMovements.length + newMovements.length + 1).padStart(3, '0')}`,
              productId: p.id,
              productName: p.name,
              variantSku: v.sku,
              type: 'return',
              quantityChanged: ret.quantity,
              previousStock: prev,
              newStock: next,
              reason: `Customer Return Restock ${returnId}`,
              user,
              date: new Date().toISOString(),
              referenceNo: ret.orderId || ret.poId
            });
            return { ...v, stock: next };
          }
          return v;
        }) || [];

        const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
        updatedProducts[pIdx] = {
          ...p,
          inStock: totalStock > 0,
          variants: updatedVariants
        };
      }
    }

    const updatedReturns = state.returns.map(r => 
      r.id === returnId 
        ? { ...r, status, restocked: restock ? true : r.restocked } 
        : r
    );

    return {
      returns: updatedReturns,
      products: updatedProducts,
      stockMovements: newMovements.length > 0 ? [...state.stockMovements, ...newMovements] : state.stockMovements
    };
  }),

  // Async Database Fetching Methods
  fetchProducts: async () => {
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' })
      const { data, error } = await res.json()
      if (error) throw error
      if (data && data.length > 0) {
        set({ products: data })
      } else {
        const dbProducts = INITIAL_PRODUCTS
        await fetch('/api/admin/products', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbProducts) 
        })
        set({ products: dbProducts })
      }
    } catch (e: any) {
      console.error('Failed to fetch products:', e?.message || e?.details || e)
    }
  },
  fetchBanners: async () => {
    if (!isSupabaseConfigured() || !supabase) return
    try {
      const { data, error } = await supabase.from('banners').select('*').order('id', { ascending: true })
      if (error) throw error
      if (data && data.length > 0) {
        console.log('[Supabase Audit] Fetched banners:', data.length)
        set({ banners: data.map(mapBannerFromDb) })
      } else {
        const dbBanners = INITIAL_BANNERS.map(mapBannerToDb)
        const { error: insertErr } = await supabase.from('banners').insert(dbBanners)
        if (insertErr) console.error('Error prepopulating Supabase banners:', insertErr.message || insertErr.details || insertErr)
      }
    } catch (e: any) {
      console.error('Failed to fetch banners from Supabase:', e?.message || e?.details || e)
    }
  },
  fetchOrders: async () => {
    let localCache: Order[] = []
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('fdh_orders_cache')
        if (cached) localCache = JSON.parse(cached)
      } catch (e) {}
    }

    if (!isSupabaseConfigured() || !supabase) {
      if (localCache.length > 0) {
        set({ orders: localCache })
      }
      return
    }

    try {
      const { data: ordersData, error: ordersErr } = await supabase.from('orders').select('*').order('date', { ascending: false })
      if (ordersErr) throw ordersErr

      const { data: schedData } = await supabase.from('scheduled_orders').select('*')

      let combinedOrders = ordersData ? ordersData.map(mapOrderFromDb) : []
      
      if (schedData && schedData.length > 0) {
        console.log('[Supabase Audit] Fetched scheduled_orders table records:', schedData.length)
        const mappedSched = schedData.map(mapOrderFromDb)
        
        const existingIds = new Set(combinedOrders.map(o => o.id))
        mappedSched.forEach(so => {
          if (!existingIds.has(so.id)) {
            combinedOrders.push(so)
          }
        })
      }

      // Merge local cache if any local order is newer or missing
      if (localCache.length > 0) {
        const existingIds = new Set(combinedOrders.map(o => o.id))
        localCache.forEach(lo => {
          if (!existingIds.has(lo.id)) {
            combinedOrders.unshift(lo)
          }
        })
      }

      if (combinedOrders.length > 0) {
        console.log('[Supabase Audit] Total active orders mapped into state:', combinedOrders.length)
        set({ orders: combinedOrders })
      } else {
        const dbOrders = INITIAL_ORDERS.map(mapOrderToDb)
        const { error: insertErr } = await supabase.from('orders').insert(dbOrders)
        if (insertErr) console.error('Error prepopulating Supabase orders:', insertErr.message || insertErr.details || insertErr)
      }
    } catch (e: any) {
      console.error('Failed to fetch orders from Supabase:', e?.message || e?.details || e)
      if (localCache.length > 0) {
        set({ orders: localCache })
      }
    }
  },
  fetchVendors: async () => {
    if (!isSupabaseConfigured() || !supabase) return
    try {
      const { data, error } = await supabase.from('vendors').select('*')
      if (error) {
        if (error.code === '42P01' || error.message?.includes('schema cache')) {
          console.info('Note: Supabase table public.vendors not found in database schema yet.')
          return
        }
        throw error
      }
      if (data && data.length > 0) {
        console.log('[Supabase Audit] Fetched vendors:', data.length)
        const mapped = data.map((v: any) => ({
          id: v.id,
          name: v.name,
          contactPerson: v.contact_person || '',
          phone: v.phone || '',
          email: v.email || '',
          address: v.address || '',
          gstNumber: v.gst_number || '',
          status: v.status || 'active',
          totalPurchases: v.total_purchases || 0,
          totalSpend: v.total_spend || 0,
          deliveryPerformance: v.delivery_performance || 100,
          productsSupplied: v.products_supplied || 0
        }))
        set({ vendors: mapped })
      } else {
        // DB empty — use local seed data. Inserts require service role key; skip silently.
        console.info('[Vendors] No vendors in DB yet. Using local seed data.')
        set({ vendors: INITIAL_VENDORS })
      }
    } catch (e: any) {
      console.warn('Supabase vendors sync note:', e?.message || e)
    }
  },
  fetchDeliveryPartners: async () => {
    if (!isSupabaseConfigured() || !supabase) return
    try {
      const { data, error } = await supabase.from('delivery_partners').select('*')
      if (error) {
        if (error.code === '42P01' || error.message?.includes('schema cache')) {
          console.info('Note: Supabase table public.delivery_partners not found in database schema yet.')
          return
        }
        throw error
      }
      if (data && data.length > 0) {
        console.log('[Supabase Audit] Fetched delivery partners:', data.length)
        const mapped = data.map((dp: any) => ({
          id: dp.id,
          name: dp.name,
          phone: dp.phone,
          status: dp.status || 'active'
        }))
        set({ deliveryPartners: mapped })
      } else {
        // DB empty — use local seed data. Inserts require service role key; skip silently.
        console.info('[Delivery Partners] No partners in DB yet. Using local seed data.')
        set({ deliveryPartners: INITIAL_PARTNERS })
      }
    } catch (e: any) {
      console.warn('Supabase delivery partners sync note:', e?.message || e)
    }
  },
}))
