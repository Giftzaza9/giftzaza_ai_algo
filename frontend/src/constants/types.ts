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
  title: string;
  description: string;
  source: 'bloomingdale' | 'amazon';
  views: number;
  tags: string[];
  similarity: number;
  rulebased_tags: string[];
  gptTagging: GPTTagging[];
  hil: boolean;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  price: number;
  image: string;
  link: string;
  rating: number;
  curated: boolean;
  price_currency: string;
};

export type ProfileData = {
  styles: string[];
  interests: string[];
  title: string;
  relation: string;
  age: string;
  gender: string;
  occasion: string;
  occasion_date: string;
  budget: string;
};
