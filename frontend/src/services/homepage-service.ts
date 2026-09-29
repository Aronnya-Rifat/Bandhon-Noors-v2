/**
 * Bandhon Noors Homepage Service
 *
 * Handles homepage content API requests.
 */


import {
  apiRequest,
  getApiAssetUrl,
} from "@/lib/api";
import type {
  HomepageContent,
} from "@/types/homepage";




export async function getHeroImages(): Promise<string[]> {


  const content =
    await apiRequest<HomepageContent[]>(
      "/homepage/hero"
    );



  return content
    .filter(
      (item) => item.image_url
    )
    .map(
  (item) =>
    getApiAssetUrl(
      item.image_url!,
    ),
);

}
export async function getHomepageContent(): Promise<HomepageContent[]> {

  return apiRequest<HomepageContent[]>(
    "/homepage"
  );

}


export async function getHomepageSection(
  sectionName: string,
): Promise<HomepageContent | null> {


  const content =
    await getHomepageContent();


  return (
    content.find(
      (item) =>
        item.section_name === sectionName
    )
    ?? null
  );

}

export function getAdminHomepageContent(
  token: string,
): Promise<HomepageContent[]> {
  return apiRequest<HomepageContent[]>(
    "/admin/homepage",
    {
      token,
    },
  );
}

export function uploadAdminHeroImage(
  token: string,
  file: File,
): Promise<HomepageContent> {
  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  return apiRequest<HomepageContent>(
    "/admin/homepage",
    {
      method: "POST",
      token,
      body: formData,
    },
  );
}

export function updateAdminHomepageContent(
  token: string,
  contentId: number,
  update: {
    title?: string;
    description?: string;
    button_text?: string;
    button_link?: string;
    display_order?: number;
    is_active?: boolean;
  },
): Promise<HomepageContent> {
  return apiRequest<HomepageContent>(
    `/admin/homepage/${contentId}`,
    {
      method: "PUT",
      token,
      body: update,
    },
  );
}

export function deleteAdminHomepageContent(
  token: string,
  contentId: number,
): Promise<{
  message: string;
}> {
  return apiRequest<{
    message: string;
  }>(
    `/admin/homepage/${contentId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

export function reorderAdminHomepageContent(
  token: string,
  ids: number[],
): Promise<HomepageContent[]> {
  return apiRequest<HomepageContent[]>(
    "/admin/homepage/reorder",
    {
      method: "PUT",
      token,
      body: ids,
    },
  );
}
