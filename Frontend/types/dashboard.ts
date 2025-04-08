export type DashboardCard = {
    revenue: number;
    revenueDiff: number;
    order: number;
    orderDiff: number;
    averageOrderValue: number;
    averageOrderValueDiff: number;
    newUser: number;
    newUserDiff: number;
}

export type DashboardSale = {
    date: Date;
    revenue: number;
}

export type DashboardTopProduct = {
    id: string;
    name: string;
    sales: number;
    imageUrls: string[];
}

export type StockAlert = {
    productId: string;
    productName: string;
    productImage: string;
    stock: number;
}
