import { apiRequest } from "@/lib/api";
import type {
  Order,
  OrderStatus,
} from "@/types/order";
import type {
  Category,
} from "@/types/category";
import type {
    AdminProductPage,
  AdminDashboard,
  AdminProductUpdate,
  AdminProductCreate,
  AdminVariant,
  AdminProductMedia,
AdminVariantCreate,
InventoryTransaction,
InventoryTransactionType,
InventoryVariant,
AdminCategoryCreate,
AdminCategoryUpdate,
AdminCustomerPage,
AdminInvitation,
AdminInvitationCreate,
AdminStaffUser,
AdminReviewPage,
AdminStaffCreate,
} from "@/types/admin";
import type {
  Product,
} from "@/types/product";
export function getAdminDashboard(
  token: string,
): Promise<AdminDashboard> {
  return apiRequest<AdminDashboard>(
    "/admin/dashboard",
    {
      token,
    },
  );
}

export function getAdminOrders(
  token: string,
): Promise<Order[]> {
  return apiRequest<Order[]>(
    "/admin/orders",
    {
      token,
    },
  );
}

export function updateAdminOrderStatus(
  token: string,
  orderId: number,
  status: OrderStatus,
): Promise<Order> {
  const encodedStatus =
    encodeURIComponent(status);

  return apiRequest<Order>(
    `/admin/orders/${orderId}/status?new_status=${encodedStatus}`,
    {
      method: "PATCH",
      token,
    },
  );
}
export function getAdminProducts(
  token: string,
  options: {
    page?: number;
    query?: string;
    categoryId?: number;
  } = {},
): Promise<AdminProductPage> {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "page",
    String(options.page ?? 1),
  );

  searchParams.set(
    "page_size",
    "50",
  );

  if (options.query?.trim()) {
    searchParams.set(
      "query",
      options.query.trim(),
    );
  }

  if (
    options.categoryId !== undefined
  ) {
    searchParams.set(
      "category_id",
      String(options.categoryId),
    );
  }

  return apiRequest<AdminProductPage>(
    `/admin/products?${searchParams.toString()}`,
    {
      token,
    },
  );
}

export function updateAdminProduct(
  token: string,
  productId: number,
  update: AdminProductUpdate,
): Promise<Product> {
  return apiRequest<Product>(
    `/admin/products/${productId}`,
    {
      method: "PUT",
      token,
      body: update,
    },
  );
}


export function getAdminProduct(
  token: string,
  productId: number,
): Promise<Product> {
  return apiRequest<Product>(
    `/admin/products/${productId}`,
    {
      token,
    },
  );
}

export function createAdminProduct(
  token: string,
  product: AdminProductCreate,
): Promise<Product> {
  return apiRequest<Product>(
    "/admin/products",
    {
      method: "POST",
      token,
      body: product,
    },
  );
}

export function getAdminProductVariants(
  productId: number,
): Promise<AdminVariant[]> {
  return apiRequest<AdminVariant[]>(
    `/products/${productId}/variants`,
  );
}

export function createAdminProductVariant(
  token: string,
  productId: number,
  variant: AdminVariantCreate,
): Promise<AdminVariant> {
  return apiRequest<AdminVariant>(
    `/admin/products/${productId}/variants`,
    {
      method: "POST",
      token,
      body: variant,
    },
  );
}

export function getAdminProductMedia(
  productId: number,
): Promise<AdminProductMedia[]> {
  return apiRequest<AdminProductMedia[]>(
    `/products/${productId}/media`,
  );
}

export function uploadAdminProductImage(
  token: string,
  productId: number,
  file: File,
  options: {
    altText?: string;
    displayOrder?: number;
    isPrimary?: boolean;
  } = {},
): Promise<AdminProductMedia> {
  const formData =
    new FormData();

  formData.append(
    "product_id",
    productId.toString(),
  );

  formData.append(
    "file",
    file,
  );

  formData.append(
    "alt_text",
    options.altText ?? "",
  );

  formData.append(
    "display_order",
    (
      options.displayOrder ?? 0
    ).toString(),
  );

  formData.append(
    "is_primary",
    (
      options.isPrimary ?? false
    ).toString(),
  );

  return apiRequest<AdminProductMedia>(
    "/admin/upload/product-image",
    {
      method: "POST",
      token,
      body: formData,
    },
  );
}

export function deleteAdminProductMedia(
  token: string,
  mediaId: number,
): Promise<AdminProductMedia> {
  return apiRequest<AdminProductMedia>(
    `/admin/media/${mediaId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

export function getInventoryVariants(
  token: string,
): Promise<InventoryVariant[]> {
  return apiRequest<InventoryVariant[]>(
    "/admin/inventory/variants",
    {
      token,
    },
  );
}

export function createInventoryTransaction(
  token: string,
  data: {
    variant_id: number;
    change_amount: number;
    transaction_type: InventoryTransactionType;
    note?: string;
  },
): Promise<InventoryTransaction> {
  return apiRequest<InventoryTransaction>(
    "/admin/inventory",
    {
      method: "POST",
      token,
      body: data,
    },
  );
}

export function getInventoryHistory(
  token: string,
  variantId: number,
): Promise<InventoryTransaction[]> {
  return apiRequest<InventoryTransaction[]>(
    `/admin/inventory/${variantId}/history`,
    {
      token,
    },
  );
}


export function createAdminCategory(
  token: string,
  category: AdminCategoryCreate,
): Promise<Category> {
  return apiRequest<Category>(
    "/admin/categories",
    {
      method: "POST",
      token,
      body: category,
    },
  );
}

export function updateAdminCategory(
  token: string,
  categoryId: number,
  update: AdminCategoryUpdate,
): Promise<Category> {
  return apiRequest<Category>(
    `/admin/categories/${categoryId}`,
    {
      method: "PUT",
      token,
      body: update,
    },
  );
}

export function uploadAdminCategoryImage(
  token: string,
  categoryId: number,
  file: File,
): Promise<Category> {
  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  return apiRequest<Category>(
    `/admin/categories/${categoryId}/image`,
    {
      method: "POST",
      token,
      body: formData,
    },
  );
}


export function getAdminCustomers(
  token: string,
  options: {
    page?: number;
    query?: string;
  } = {},
): Promise<AdminCustomerPage> {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "page",
    String(options.page ?? 1),
  );

  searchParams.set(
    "page_size",
    "50",
  );

  if (options.query?.trim()) {
    searchParams.set(
      "query",
      options.query.trim(),
    );
  }

  return apiRequest<AdminCustomerPage>(
    `/admin/customers?${searchParams.toString()}`,
    {
      token,
    },
  );
}
export function createAdminInvitation(
  token: string,
  data: AdminInvitationCreate,
): Promise<AdminInvitation> {
  return apiRequest<AdminInvitation>(
    "/admin/invitations",
    {
      method: "POST",
      token,
      body: data,
    },
  );
}

export function getAdminInvitations(
  token: string,
): Promise<AdminInvitation[]> {
  return apiRequest<AdminInvitation[]>(
    "/admin/invitations",
    {
      token,
    },
  );
}

export function reviewAdminInvitation(
  token: string,
  invitationId: number,
  decision:
    | "approve"
    | "reject",
): Promise<AdminInvitation> {
  return apiRequest<AdminInvitation>(
    `/admin/invitations/${invitationId}/${decision}`,
    {
      method: "POST",
      token,
    },
  );
}

export function getAdminStaff(
  token: string,
): Promise<AdminStaffUser[]> {
  return apiRequest<AdminStaffUser[]>(
    "/admin/users",
    {
      token,
    },
  );
}

export function updateAdminStaffStatus(
  token: string,
  adminId: number,
  isActive: boolean,
): Promise<AdminStaffUser> {
  return apiRequest<AdminStaffUser>(
    `/admin/users/${adminId}/status`,
    {
      method: "PATCH",
      token,
      body: {
        is_active: isActive,
      },
    },
  );
}
export function getAdminReviews(
  token: string,
  options: {
    page?: number;
    visibility?: "visible" | "hidden";
  } = {},
): Promise<AdminReviewPage> {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "page",
    String(options.page ?? 1),
  );

  searchParams.set(
    "page_size",
    "50",
  );

  if (options.visibility) {
    searchParams.set(
      "visibility",
      options.visibility,
    );
  }

  return apiRequest<AdminReviewPage>(
    `/admin/reviews?${searchParams.toString()}`,
    {
      token,
    },
  );
}


export function updateAdminReviewVisibility(
  token: string,
  reviewId: number,
  isVisible: boolean,
): Promise<{
  id: number;
  is_visible: boolean;
}> {
  return apiRequest(
    `/admin/reviews/${reviewId}/visibility?is_visible=${isVisible}`,
    {
      method: "PATCH",
      token,
    },
  );
}
export function createAdminStaff(
  token: string,
  data: AdminStaffCreate,
): Promise<AdminStaffUser> {
  return apiRequest<AdminStaffUser>(
    "/admin/users",
    {
      method: "POST",
      token,
      body: data,
    },
  );
}
