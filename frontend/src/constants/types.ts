export enum roleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  email: string;
  id: string;
  name: string;
  profile_picture: string;
  role: roleEnum;
}

export interface ApiResponse {
  data: any;
  error: any;
  status: number;
}

export type GPTTagging = {
  gender: string[];
  age_category: string[];
  interest: string[];
  occasion: string[];
  relationship: string[];
  style: string[];
};

export type Product = {
  id: string;
  _id?: string;
  title: string;
  description: string;
  source: 'bloomingdale' | 'amazon';
  views: number;
  tags: string[];
  similarity: number;
  rulebased_tags: string[];
  gptTagging: GPTTagging[];
  hil: boolean;
  is_active: boolean;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  price: number;
  image: string;
  link: string;
  rating: number;
  curated: boolean;
  price_currency: string;
  thumbnails?: string[];
  likes?: number;
};

export interface RecommendedProduct {
  _id: string;
  item_id: string | Product;
  title: string;
  tags: string[];
  matching_score: number;
}

export type Profile = {
  id: string;
  styles: string[];
  interests: string[];
  title: string;
  relation: string;
  age: string;
  gender: string;
  occasion: string;
  occasion_date: string;
  preferences: string[];
  min_price: number;
  max_price: number;
  user_id: string;
  profile_preferences: Record<string, string[]>;
  recommended_products: RecommendedProduct[];
  budget: string;
};

export type SavedItem = {
  profile_id: string;
  profile_title: string;
  savedProducts: Product[];
};
