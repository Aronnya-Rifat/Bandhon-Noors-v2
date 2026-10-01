import { apiRequest } from "@/lib/api";

import type {
  CustomerOrderPage,
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
  page = 1,
): Promise<CustomerOrderPage> {
  const searchParams =
    new URLSearchParams({
      page: String(page),
      page_size: "20",
    });

  return apiRequest<CustomerOrderPage>(
    `/orders?${searchParams.toString()}`,
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

export function cancelCustomerOrder(
  token: string,
  orderId: number,
): Promise<Order> {
  return apiRequest<Order>(
    `/orders/${orderId}/cancel`,
    {
      method: "PATCH",
      token,
    },
  );
}
