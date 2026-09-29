/**
 * Homepage CMS Type
 */

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
