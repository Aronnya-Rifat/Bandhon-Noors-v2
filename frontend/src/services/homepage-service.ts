/**
 * Bandhon Noors Homepage Service
 *
 * Handles homepage content API requests.
 */


import { apiRequest } from "@/lib/api";


export interface HomepageContent {

  id: number;

  section_name: string;

  title: string | null;

  description: string | null;

  image_url: string | null;

  button_text: string | null;

  button_link: string | null;

  display_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;

}



export async function getHeroImages(): Promise<string[]> {


  const content =
    await apiRequest<HomepageContent[]>(
      "/homepage/hero"
    );


  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";



  return content
    .filter(
      (item) => item.image_url
    )
    .map(
      (item) =>
        `${API_URL}${item.image_url}`
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
