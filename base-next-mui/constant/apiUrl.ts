export const API_URL = {
  // auth
  socialLogin: "auth/social-login",
  login: "auth/login",
  register: "auth/register",
  refreshToken: "auth/refresh-token",
  changePassword: "auth/change-password",

  // user
  user: "user",
  userByName: "user/name",
  userProfile: "user/profile",
  userLock: "user/lock",

  // role
  role: "role",
  roleComboBox: "role/combo-box",

  // category
  category: "category",
  categoryComboBox: "category/combo-box",

  // brand
  brand: "brand",
  brandComboBox: "brand/combo-box",

  // product
  product: "product",
  productFiltered: "product/filtered",
  productRequest: "product/request",
  productTop: "product/top",
  productFeatured: "product/featured",
  productSearch: "product/search",
  productRelated: "product/related",

  // cart
  cart: "cart",

  // order
  order: "order",
  recentOrder: "order/recent",
  orderCancel: "order/cancel",
  orderConfirm: "order/confirm",
  orderStatus: "order/status",
  createOrderUrl: "order/url",

  // review
  review: "review",
  reviewByProduct: "review/product",

  // report
  saleReport: "report/sale",
  orderReport: "report/order",
  outOfStockReport: "report/out-of-stock",
  brandPerformanceReport: "report/brand-performance",
  categoryPerformanceReport: "report/category-performance",
  productRatingReport: "report/product-rating",
  topCustomerReport: "report/top-customer",

  // post
  post: "post",
  postPreview: "post/preview",
  postRelated: (id: string) => `post/${id}/related`,

  // configuration
  bannerConfig: "configuration/banner",
  emailConfig: "configuration/email",

  // dashboard
  dashboardCard: "dashboard/card",
  dashboardTopProduct: "dashboard/top-product",
  dashboardSale: "dashboard/sale",
  dashboardStockAlert: "dashboard/stock-alert",
};
