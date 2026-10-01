import { apiRequest } from "@/lib/api";

import type {
  PaymentOptions,
} from "@/types/order";


export function getPaymentOptions():
Promise<PaymentOptions> {
  return apiRequest<PaymentOptions>(
    "/payments/options",
  );
}
