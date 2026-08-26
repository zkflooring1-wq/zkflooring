export interface Profile {
  id: string;
  email: string;
  role: "admin" | "editor";
  full_name: string | null;
  created_at: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  location: string;
  short_desc: string | null;
  description: Record<string, unknown>[] | string[];
  highlights: Record<string, unknown>[] | string[];
  client: string | null;
  duration: string | null;
  area: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Service {
  slug: string;
  title: string;
  category: string;
  image: string;
  summary: string | null;
  description: Record<string, unknown>[] | string[];
  features: Record<string, unknown>[] | string[];
  info_label: string | null;
  info_value: string | null;
  cta_text: string | null;
  cta_link: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  featured_image: string | null;
  categories: string[];
  tags: string[];
  seo_data: {
    seoTitle?: string;
    seoDescription?: string;
  };
  excerpt: string | null;
  author: string | null;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  sections: Record<string, unknown>;
  seo_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface Media {
  id: string;
  name: string;
  url: string;
  r2_key: string;
  type: string;
  size: number;
  created_at: string;
}export interface Team {
  id: number;
  name: string;
  role: string;
  image: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export interface Testimonial {
  id: number;
  name: string;
  username: string | null;
  body: string;
  image: string | null;
  rating: number;
  enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service: string | null;
  room_size: string | null;
  estimated_cost: string | null;
  message: string | null;
  source: string;
  status: "new" | "contacted" | "survey_booked" | "quote_sent" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
}
