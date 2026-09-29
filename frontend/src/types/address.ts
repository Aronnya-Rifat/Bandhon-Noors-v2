export interface CustomerAddress {
  id: number;
  customer_id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressCreate {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code?: string;
  is_default?: boolean;
}

export interface AddressUpdate {
  full_name?: string;
  phone?: string;
  address_line?: string;
  city?: string;
  postal_code?: string | null;
  is_default?: boolean;
}
