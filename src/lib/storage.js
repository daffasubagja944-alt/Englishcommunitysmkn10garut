import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi. Cek file .env kamu."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const storage = {
  async get(key) {
    const { data, error } = await supabase
      .from("site_data")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return { value: data.value };
  },

  async set(key, value) {
    const { error } = await supabase
      .from("site_data")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) throw error;
    return { value };
  },
};
