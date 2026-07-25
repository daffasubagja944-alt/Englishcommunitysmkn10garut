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
};import { createClient } from "@supabase/supabase-js";

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
};import { createClient } from "@supabase/supabase-js";

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
};import { createClient } from "@supabase/supabase-js";

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
};import { createClient } from "@supabase/supabase-js";

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
};import { createClient } from "@supabase/supabase-js";

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
};import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Home, Users, Share2, Newspaper, GraduationCap, ClipboardList,
  BarChart3, UserCog, Instagram, Music2, Menu, Plus, Trash2,
  Lock, Unlock, Save, LogOut, Check, ArrowLeft, ArrowUpRight,
  Wallet, ListChecks, Award, Pencil, Send, Crown, ShieldCheck,
  Upload, Download, KeyRound, ImagePlus
} from "lucide-react";
import { storage } from "./lib/storage";

/* ---------------------------------------------------------
   DEFAULT DATA
--------------------------------------------------------- */
const DEFAULT_DATA = {
  auth: { password: "admin123" },
  profil: {
    logo: "EC",
    logoUrl: "",
    nama: "English Community",
    tagline: "Speak. Connect. Grow.",
    deskripsi:
      "English Community adalah wadah bagi siswa-siswi yang ingin mengasah kemampuan berbahasa Inggris melalui diskusi, debat, drama, dan kegiatan kolaboratif lainnya. Kami percaya bahasa adalah jembatan menuju dunia yang lebih luas.",
    visi:
      "Menjadi komunitas yang menumbuhkan kepercayaan diri berbahasa Inggris dan membuka wawasan global bagi setiap anggotanya.",
    misi: [
      "Mengadakan latihan rutin speaking, listening, dan writing.",
      "Menyelenggarakan kompetisi dan sharing session berbahasa Inggris.",
      "Membangun budaya kolaboratif antaranggota lintas angkatan.",
    ],
    berdiri: "2019",
  },
  struktur: {
    ketua: "Nama Ketua",
    sekretaris: "Nama Sekretaris",
    bendahara: "Nama Bendahara",
    divisi: [
      { nama: "Divisi PDD", ketua: "Nama Ketua PDD", wakil: "Nama Wakil PDD" },
      { nama: "Divisi Humas", ketua: "Nama Ketua Humas", wakil: "Nama Wakil Humas" },
      { nama: "Divisi Koordinasi Acara", ketua: "Nama Ketua Acara", wakil: "Nama Wakil Acara" },
    ],
  },
  socmed: {
    instagram: "englishcommunity",
    tiktok: "englishcommunity",
    email: "englishcommunity@sekolah.sch.id",
  },
  berita: [
    {
      id: 1,
      tanggal: "2026-07-10",
      judul: "Open Recruitment Anggota Baru 2026/2027",
      isi: "English Community membuka pendaftaran anggota baru untuk kelas X. Yuk bergabung dan tingkatkan kemampuan bahasa Inggrismu bersama kami! Kegiatan meliputi latihan speaking mingguan, klub menulis, dan simulasi debat yang dipandu langsung oleh tutor berpengalaman.\n\nPendaftaran dibuka mulai minggu ini melalui koordinator kelas masing-masing. Jangan lewatkan kesempatan untuk berkembang bersama komunitas yang suportif.",
    },
    {
      id: 2,8proses latihan.",
    },
  ],
  tutors: [
    { nama: "Mr. Adi Pratama", bidang: "Speaking & Public Speaking" },
    { nama: "Ms. Sarah Wijaya", bidang: "Writing & Grammar" },
  ],
  members: {
    X: [{ nama: "Contoh Nama", nis: "24001", status: "Aktif" }],
    XI: [{ nama: "Contoh Nama", nis: "23001", status: "Aktif" }],
    XII: [{ nama: "Contoh Nama", nis: "22001", status: "Aktif" }],
  },
  daftarUlang: [],
  rekap: {
    nilai: [{ nama: "Contoh Nama", kelas: "X", nilai: "88", keterangan: "Aktif & konsisten" }],
    kas: [{ tanggal: "2026-07-01", keterangan: "Kas awal", tipe: "masuk", jumlah: 500000 }],
    kehadiran: [{ tanggal: "2026-07-05", kegiatan: "Latihan Speaking", hadir: "20/24", keterangan: "-" }],
  },
};

const STORAGE_KEY = "ec-site-data";

/* ---------------------------------------------------------
   STYLE
--------------------------------------------------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

    .ec-root {
      --navy-950: #060f1f;
      --navy-900: #0a1830;
      --navy-800: #102542;
      --navy-700: #17335a;
      --navy-600: #204070;
      --line: #21395f;
      --gold: #c9a24d;
      --gold-soft: #e3c98a;
      --text-hi: #f2f5fa;
      --text-lo: #91a4c4;
      font-family: 'Inter', sans-serif;
      background: var(--navy-950);
      color: var(--text-hi);
      min-height: 100vh;
    }
    .ec-serif { font-family: 'Cormorant Garamond', serif; }

    .ec-fade { animation: ecFadeIn .5s cubic-bezier(.22,.61,.36,1) both; }
    @keyframes ecFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .ec-card {
      background: linear-gradient(180deg, var(--navy-800), var(--navy-900));
      border: 1px solid var(--line);
      border-radius: 14px;
      transition: border-color .3s ease, transform .3s ease;
    }
    .ec-card:hover { border-color: var(--gold); }
    .ec-card.clickable { cursor: pointer; }
    .ec-card.clickable:hover { transform: translateY(-3px); }

    .ec-navlink {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      color: var(--text-lo); cursor: pointer;
      border: 1px solid transparent;
      transition: all .25s ease;
      font-size: 14px; letter-spacing: .2px;
    }
    .ec-navlink:hover { background: var(--navy-800); color: var(--text-hi); }
    .ec-navlink.active {
      background: linear-gradient(90deg, rgba(201,162,77,.15), rgba(201,162,77,.02));
      border-color: var(--gold);
      color: var(--gold-soft);
    }

    .ec-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 9px 16px; border-radius: 9px;
      font-size: 13px; font-weight: 600; letter-spacing: .3px;
      cursor: pointer; border: 1px solid var(--gold);
      background: transparent; color: var(--gold-soft);
      transition: all .25s ease; white-space: nowrap;
    }
    .ec-btn:hover { background: var(--gold); color: var(--navy-950); }
    .ec-btn.solid { background: var(--gold); color: var(--navy-950); }
    .ec-btn.solid:hover { background: var(--gold-soft); }
    .ec-btn.danger { border-color: #8a3a3a; color: #e19a9a; }
    .ec-btn.danger:hover { background: #8a3a3a; color: #fff; }
    .ec-btn.ghost { border-color: var(--line); color: var(--text-lo); }
    .ec-btn.ghost:hover { background: var(--navy-800); color: var(--text-hi); }

    .ec-input {
      width: 100%; background: var(--navy-900); border: 1px solid var(--line);
      color: var(--text-hi); border-radius: 8px; padding: 9px 12px;
      font-size: 13.5px; outline: none; transition: border-color .2s ease;
    }
    .ec-input:focus { border-color: var(--gold); }
    .ec-label { font-size: 11.5px; text-transform: uppercase; letter-spacing: .8px; color: var(--text-lo); margin-bottom: 5px; display: block; }

    .ec-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--line), transparent); }

    .ec-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; letter-spacing: .5px; text-transform: uppercase;
      color: var(--gold-soft); border: 1px solid var(--gold); border-radius: 999px;
      padding: 4px 10px;
    }

    .ec-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .ec-table th {
      text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .6px;
      color: var(--text-lo); padding: 10px 12px; border-bottom: 1px solid var(--line);
    }
    .ec-table td { padding: 10px 12px; border-bottom: 1px solid rgba(33,57,95,.5); color: var(--text-hi); }
    .ec-table tr:hover td { background: rgba(255,255,255,.02); }

    .ec-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .ec-scrollbar::-webkit-scrollbar-thumb { background: var(--navy-600); border-radius: 4px; }

    .ec-crest {
      width: 46px; height: 46px; border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, var(--gold-soft), var(--gold) 60%, #8a6c28);
      display: flex; align-items: center; justify-content: center;
      color: var(--navy-950); font-weight: 700; font-family: 'Cormorant Garamond', serif;
      font-size: 20px; box-shadow: 0 0 0 3px var(--navy-900), 0 0 0 4px var(--gold);
      flex-shrink: 0; overflow: hidden;
    }
    .ec-crest img { width: 100%; height: 100%; object-fit: cover; }

    .ec-hero-glow {
      position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(600px 300px at 20% 0%, rgba(201,162,77,.10), transparent 60%),
                  radial-gradient(500px 260px at 90% 10%, rgba(32,64,112,.35), transparent 60%);
    }

    .ec-marquee-wrap { overflow: hidden; position: relative; }
    .ec-marquee-wrap::before, .ec-marquee-wrap::after {
      content: ""; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2;
    }
    .ec-marquee-wrap::before { left: 0; background: linear-gradient(90deg, var(--navy-950), transparent); }
    .ec-marquee-wrap::after { right: 0; background: linear-gradient(270deg, var(--navy-950), transparent); }
    .ec-marquee-track {
      display: flex; gap: 40px; white-space: nowrap; width: max-content;
      animation: ecMarquee 26s linear infinite;
    }
    @keyframes ecMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    .ec-flashcard {
      width: 92px; height: 92px; border-radius: 16px;
      background: linear-gradient(160deg, var(--navy-800), var(--navy-900));
      border: 1px solid var(--gold);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', serif; font-weight: 700;
      font-size: 40px; color: var(--gold-soft);
      transform: rotate(-6deg);
      box-shadow: 0 18px 40px -12px rgba(0,0,0,.6);
      transition: transform .4s ease;
    }
    .ec-flashcard:hover { transform: rotate(0deg) scale(1.03); }

    .ec-stat {
      display: flex; flex-direction: column; gap: 4px; padding: 18px 20px;
      border-right: 1px solid var(--line);
    }
    .ec-stat:last-child { border-right: none; }

    @media (max-width: 860px) {
      .ec-sidebar { position: fixed; z-index: 40; left: 0; top: 0; bottom: 0; transform: translateX(-100%); transition: transform .3s ease; }
      .ec-sidebar.open { transform: translateX(0); }
      .ec-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 30; }
      .ec-stat { border-right: none; border-bottom: 1px solid var(--line); }
    }
    .ec-only-mobile { display: none; }
    @media (max-width: 860px) { .ec-only-mobile { display: flex; } }
  `}</style>
);

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
function fmtIDR(n) { return "Rp" + Number(n || 0).toLocaleString("id-ID"); }
function fmtDate(d) {
  try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return d; }
}
function uid() { return Date.now() + Math.floor(Math.random() * 1000); }

function socialUrl(key, value) {
  if (!value) return "#";
  if (value.startsWith("http")) return value;
  const handle = value.replace(/^@/, "");
  if (key === "instagram") return `https://instagram.com/${handle}`;
  if (key === "tiktok") return `https://www.tiktok.com/@${handle}`;
  if (key === "email") return `mailto:${value}`;
  return "#";
}

function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
        const normalized = rows.map((r) => {
          const out = {};
          Object.keys(r).forEach((k) => { out[k.toString().trim().toLowerCase()] = r[k]; });
          return out;
        });
        resolve(normalized);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function exportExcel(filename, rows) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, filename);
}

function ImportButton({ label = "Impor dari Excel", onRows, hint }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChan