import {
  Bar,
  CartItem,
  Coupon,
  Line,
  Messages,
  Order,
  Pie,
  Product,
  ShippingInfo,
  Stats,
  User,
} from "./types";

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type AllMessageResponse = {
  success: boolean;
  messages: Messages[];
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type userResponse = {
  success: boolean;
  user: User;
};

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type AllProductResponse = {
  success: boolean;
  products: Product[];
};

export type AllCategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type SearchProductsResponse = {
  success: boolean;
  products: Product[];
  totalPage: number;
};

export type productDetailsResponse = {
  success: boolean;
  product: Product;
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};
export type NewCouponResponse = {
  success: boolean;
  message: string;
};
export type ApplyCouponResponse = {
  success: boolean;
  discount: number;
};
export type AllCouponResponse = {
  status: string;
  coupons: Coupon[];
};

export type PieResponse = {
  success: boolean;
  charts: Pie;
};
export type BarResponse = {
  success: boolean;
  charts: Bar;
};
export type LineResponse = {
  success: boolean;
  charts: Line;
};

export type SearchProductRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};
export type NewProductRequest = {
  id: string;
  formData: FormData;
};
export type NewCouponRequest = {
  id: string;
  formData: FormData;
};

export type NewMessageRequest = {
  id: string;
  formData: FormData;
};
export type deleteCouponRequest = {
  adminId: string;
  couponId: string;
};
export type deleteMessageRequest = {
  adminId: string;
  messageId: string;
};
export type updateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};
export type deleteProductRequest = {
  userId: string;
  productId: string;
};

export type newOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  shippingCharge: number;
  tax: number;
  discount: number;
  total: number;
  user: string;
  subtotal: number;
};

export type orderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type updateOrderRequest = {
  userId: string;
  orderId: string;
};

export type deleteUserRequest = {
  userId: string;
  adminUserId: string;
};
export type deleteOrderRequest = {
  userId: string;
  orderId: string;
};
export type deleteMyOrderRequest = {
  userId: string;
  orderId: string;
};
