/**
 * Property type matching the database schema
 */
export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  status: "available" | "rented" | "sold" | "maintenance";
  images: string[] | null;
  cover_image: string[] | null;
  drive_folder_id: string | null;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Property type for display purposes (formatted)
 */
export interface PropertyDisplay {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  featured: boolean;
}
