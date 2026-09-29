import { apiRequest } from "@/lib/api";

import type {
  AddressCreate,
  AddressUpdate,
  CustomerAddress,
} from "@/types/address";

export function getCustomerAddresses(
  token: string,
): Promise<CustomerAddress[]> {
  return apiRequest<CustomerAddress[]>(
    "/addresses",
    {
      token,
    },
  );
}

export function createCustomerAddress(
  token: string,
  address: AddressCreate,
): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>(
    "/addresses",
    {
      method: "POST",
      token,
      body: address,
    },
  );
}

export function updateCustomerAddress(
  token: string,
  addressId: number,
  address: AddressUpdate,
): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>(
    `/addresses/${addressId}`,
    {
      method: "PUT",
      token,
      body: address,
    },
  );
}

export function deleteCustomerAddress(
  token: string,
  addressId: number,
): Promise<CustomerAddress> {
  return apiRequest<CustomerAddress>(
    `/addresses/${addressId}`,
    {
      method: "DELETE",
      token,
    },
  );
}
