import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi. Cek file .env kamu."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Wrapper ini meniru API window.storage (get/set) yang dipakai di dalam
 * App.jsx, tapi datanya disimpan di tabel Supabase bernama "site_data"
 * sehingga SEMUA pengunjung web melihat data yang sama.
 *
 * Struktur tabel yang dibutuhkan (jalankan sekali di Supabase SQL editor):
 *
 * create table site_data (
 *   key text primary key,
 *   value text
 * );
 */
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
