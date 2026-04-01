export type OrderItem = {
  id: number;
  status: string;
  product_name: string;
  orders: {
    customer_name: string;
    customer_email: string;
  }[];
};
