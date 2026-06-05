import { supabase } from './supabase';

export interface SocialLink {
  platform: string;
  url: string;
  enabled: boolean;
  icon: string;
}

export interface HeaderContact {
  phone: string;
  phone_link: string;
  address: string;
  email: string;
}

export async function getSetting<T>(key: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error || !data) {
      console.error(`Error fetching setting ${key}:`, error?.message);
      return null;
    }
    return data.value as T;
  } catch (err) {
    console.error(`Unexpected error fetching setting ${key}:`, err);
    return null;
  }
}
