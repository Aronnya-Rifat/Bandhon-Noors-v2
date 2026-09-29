import { apiRequest } from "@/lib/api";

import type {
  Order,
  OrderCreate,
} from "@/types/order";

export function createCustomerOrder(
  token: string,
  order: OrderCreate,
): Promise<Order> {
  return apiRequest<Order>(
    "/orders",
    {
      method: "POST",
      token,
      body: order,
    },
  );
}

export function getCustomerOrders(
  token: string,
): Promise<Order[]> {
  return apiRequest<Order[]>(
    "/orders",
    {
      token,
    },
  );
}

export function getCustomerOrder(
  token: string,
  orderId: number,
): Promise<Order> {
  return apiRequest<Order>(
    `/orders/${orderId}`,
    {
      token,
    },
  );
}
