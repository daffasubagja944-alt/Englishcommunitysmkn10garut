import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Home, Users, Share2, Newspaper, GraduationCap, ClipboardList,
  BarChart3, UserCog, Instagram, Music2, Menu, Plus, Trash2,
  Lock, Unlock, Save, LogOut, Check, ArrowLeft, ArrowUpRight,
  Wallet, ListChecks, Award, Pencil, Send, Crown, ShieldCheck,
  Upload, Download, KeyRound, ImagePlus, FolderOpen, Vote,
  MessageCircle, Image as ImageIcon
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
    tagline: { id: "Speak. Connect. Grow.", en: "Speak. Connect. Grow." },
    deskripsi: {
      id: "English Community adalah wadah bagi siswa-siswi yang ingin mengasah kemampuan berbahasa Inggris melalui diskusi, debat, drama, dan kegiatan kolaboratif lainnya. Kami percaya bahasa adalah jembatan menuju dunia yang lebih luas.",
      en: "English Community is a space for students who want to sharpen their English skills through discussion, debate, drama, and other collaborative activities. We believe language is a bridge to a wider world.",
    },
    visi: {
      id: "Menjadi komunitas yang menumbuhkan kepercayaan diri berbahasa Inggris dan membuka wawasan global bagi setiap anggotanya.",
      en: "To become a community that builds confidence in English and opens global perspectives for every member.",
    },
    misi: [
      { id: "Mengadakan latihan rutin speaking, listening, dan writing.", en: "Holding regular speaking, listening, and writing practice." },
      { id: "Menyelenggarakan kompetisi dan sharing session berbahasa Inggris.", en: "Organizing English competitions and sharing sessions." },
      { id: "Membangun budaya kolaboratif antaranggota lintas angkatan.", en: "Building a collaborative culture across member generations." },
    ],
    berdiri: "2019",
    jurusanList: ["LPS", "DKV", "TJKT", "TKRO", "TBSM"],
  },
  struktur: {
    ketua: "Nama Ketua",
    wakilKetua: "Nama Wakil Ketua",
    sekretaris: "Nama Sekretaris",
    wakilSekretaris: "Nama Wakil Sekretaris",
    bendahara: "Nama Bendahara",
    wakilBendahara: "Nama Wakil Bendahara",
    divisi: [
      { nama: "Divisi PDD", ketua: "Nama Ketua PDD", wakil: "Nama Wakil PDD", anggota: [] },
      { nama: "Divisi Humas", ketua: "Nama Ketua Humas", wakil: "Nama Wakil Humas", anggota: [] },
      { nama: "Divisi Koordinasi Acara", ketua: "Nama Ketua Acara", wakil: "Nama Wakil Acara", anggota: [] },
    ],
  },
  socmed: {
    instagram: "englishcommunity",
    tiktok: "englishcommunity",
    gdrive: "",
    waNumber: "",
  },
  berita: [
    {
      id: 1,
      tanggal: "2026-07-10",
      judul: { id: "Open Recruitment Anggota Baru 2026/2027", en: "Open Recruitment for New Members 2026/2027" },
      isi: {
        id: "English Community membuka pendaftaran anggota baru untuk kelas X. Yuk bergabung dan tingkatkan kemampuan bahasa Inggrismu bersama kami! Kegiatan meliputi latihan speaking mingguan, klub menulis, dan simulasi debat yang dipandu langsung oleh tutor berpengalaman.\n\nPendaftaran dibuka mulai minggu ini melalui koordinator kelas masing-masing. Jangan lewatkan kesempatan untuk berkembang bersama komunitas yang suportif.",
        en: "English Community is opening registration for new members from grade X. Join us and improve your English together! Activities include weekly speaking practice, a writing club, and debate simulations guided by experienced tutors.\n\nRegistration opens this week through each class coordinator. Don't miss the chance to grow together with a supportive community.",
      },
      gambarList: [],
    },
    {
      id: 2,
      tanggal: "2026-06-02",
      judul: { id: "Juara 2 English Debate Competition Tingkat Kota", en: "2nd Place at the City English Debate Competition" },
      isi: {
        id: "Selamat kepada tim debat kita yang berhasil meraih Juara 2 pada kompetisi debat bahasa Inggris tingkat kota bulan lalu. Pencapaian ini adalah hasil dari latihan intensif selama dua bulan terakhir.\n\nTerima kasih kepada seluruh anggota yang telah mendukung dan tutor pembimbing yang selalu setia menemani proses latihan.",
        en: "Congratulations to our debate team for winning 2nd place at last month's city-level English debate competition. This achievement is the result of two months of intensive practice.\n\nThanks to all members who supported the team and the tutors who accompanied the training process.",
      },
      gambarList: [],
    },
  ],
  tutors: [
    { nama: "Mr. Adi Pratama", bidang: "Speaking & Public Speaking" },
    { nama: "Ms. Sarah Wijaya", bidang: "Writing & Grammar" },
  ],
  members: {
    X: [{ nama: "Contoh Nama", nisn: "0024001", jurusan: "LPS", status: "Aktif" }],
    XI: [{ nama: "Contoh Nama", nisn: "0023001", jurusan: "LPS", status: "Aktif" }],
    XII: [{ nama: "Contoh Nama", nisn: "0022001", jurusan: "LPS", status: "Aktif" }],
  },
  daftarUlang: [],
  daftarUlangOpen: true,
  rekap: {
    nilai: [{ nama: "Contoh Nama", kelas: "X", nilai: "88", keterangan: "Aktif & konsisten" }],
    kas: [{ tanggal: "2026-07-01", keterangan: "Kas awal", tipe: "masuk", jumlah: 500000 }],
    kehadiran: [],
  },
};

const STORAGE_KEY = "ec-site-data";

/* ---------------------------------------------------------
   STYLE — Ultra Premium Liquid Glass Design System
--------------------------------------------------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; }

    .ec-root {
      --navy-950: #05070d;
      --navy-900: #090d17;
      --navy-800: #0f1522;
      --navy-700: #161e30;
      --navy-600: #2a3752;
      --line: rgba(140,170,255,.09);
      --gold: #5686dd;
      --gold-soft: #93b6ee;
      --accent: #3d5a99;
      --text-hi: #f2f5fa;
      --text-lo: #8792a8;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--navy-950);
      color: var(--text-hi);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      line-height: 1.5;
    }
    .ec-serif {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      letter-spacing: -.02em;
    }

    .ec-fade { animation: ecFadeIn .5s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes ecFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .ec-card {
      background: rgba(255,255,255,.02);
      backdrop-filter: blur(32px) saturate(180%);
      -webkit-backdrop-filter: blur(32px) saturate(180%);
      border: 1px solid rgba(255,255,255,.06);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04);
      transition: border-color .4s cubic-bezier(0.16, 1, 0.3, 1),
                  background .4s cubic-bezier(0.16, 1, 0.3, 1),
                  transform .4s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow .4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ec-card:hover { background: rgba(255,255,255,.035); border-color: rgba(255,255,255,.12); }
    .ec-card.clickable { cursor: pointer; }
    .ec-card.clickable:hover {
      border-color: rgba(86,134,221,.45);
      transform: translateY(-3px);
      box-shadow: 0 20px 46px rgba(0,0,0,.45), 0 0 0 1px rgba(86,134,221,.08), inset 0 1px 0 rgba(255,255,255,.06);
    }

    .ec-navlink {
      display: flex; align-items: center; gap: 11px;
      padding: 10px 13px; border-radius: 12px;
      color: var(--text-lo); cursor: pointer;
      border-left: 2px solid transparent;
      transition: all .35s cubic-bezier(0.16, 1, 0.3, 1);
      font-size: 13.5px; font-weight: 500; letter-spacing: .1px;
    }
    .ec-navlink:hover { background: rgba(255,255,255,.045); color: var(--text-hi); transform: translateX(2px); }
    .ec-navlink.active {
      background: linear-gradient(135deg, rgba(86,134,221,.14), rgba(255,255,255,.03));
      border-left: 2px solid var(--gold);
      color: var(--text-hi);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
    }

    .ec-btn {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 9px 16px; border-radius: 12px;
      font-size: 13px; font-weight: 600; letter-spacing: 0;
      cursor: pointer; border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.025); color: var(--text-hi);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      transition: all .35s cubic-bezier(0.16, 1, 0.3, 1); white-space: nowrap;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .ec-btn:hover {
      border-color: rgba(255,255,255,.18);
      background: rgba(255,255,255,.06);
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(0,0,0,.35);
    }
    .ec-btn:active { transform: translateY(-1px); }
    .ec-btn.solid { background: var(--text-hi); color: var(--navy-950); border-color: var(--text-hi); }
    .ec-btn.solid:hover { background: var(--gold-soft); border-color: var(--gold-soft); box-shadow: 0 14px 32px rgba(86,134,221,.28); }
    .ec-btn.danger { border-color: rgba(255,255,255,.07); color: #d99a9a; }
    .ec-btn.danger:hover { background: rgba(180,60,60,.22); border-color: #7a3a3a; color: #ffb0b0; box-shadow: 0 12px 28px rgba(180,60,60,.22); }
    .ec-btn.ghost { border-color: rgba(255,255,255,.07); color: var(--text-lo); }
    .ec-btn.ghost:hover { background: rgba(255,255,255,.05); color: var(--text-hi); }

    .ec-input {
      width: 100%; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.07);
      color: var(--text-hi); border-radius: 12px; padding: 10px 13px;
      font-size: 13.5px; outline: none; transition: all .3s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .ec-input:focus { border-color: var(--gold); background: rgba(255,255,255,.04); box-shadow: 0 0 0 3px rgba(86,134,221,.12); }
    .ec-label { font-size: 11px; text-transform: uppercase; letter-spacing: .8px; font-weight: 600; color: var(--text-lo); margin-bottom: 6px; display: block; }

    .ec-divider { height: 1px; background: rgba(255,255,255,.07); }

    .ec-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 10.5px; letter-spacing: .4px; text-transform: uppercase; font-weight: 600;
      color: var(--text-lo); background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.06);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-radius: 999px;
      padding: 6px 12px;
    }

    .ec-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    .ec-table th {
      text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: .6px; font-weight: 700;
      color: var(--text-lo); padding: 12px 14px; border-bottom: 1px solid var(--line);
    }
    .ec-table td { padding: 12px 14px; border-bottom: 1px solid var(--line); color: var(--text-hi); }
    .ec-table tr { transition: background .25s ease; }
    .ec-table tr:hover td { background: rgba(255,255,255,.025); }

    .ec-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .ec-scrollbar::-webkit-scrollbar-thumb { background: var(--navy-600); border-radius: 4px; }

    .ec-crest {
      width: 46px; height: 46px; border-radius: 14px;
      background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.09);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      color: var(--gold-soft); font-weight: 700; font-family: 'Outfit', sans-serif;
      font-size: 17px; letter-spacing: -.02em;
      flex-shrink: 0; overflow: hidden;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
    }
    .ec-crest img { width: 100%; height: 100%; object-fit: cover; }

    .ec-orbs { position: fixed; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; background: radial-gradient(ellipse at top, #090d17 0%, #05070d 60%); }
    .ec-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
    .ec-orb-a { width: 520px; height: 520px; top: -160px; left: -140px; background: radial-gradient(circle, rgba(86,134,221,.26) 0%, transparent 70%); animation: ecFloat 18s ease-in-out infinite; }
    .ec-orb-b { width: 560px; height: 560px; bottom: -200px; right: -160px; background: radial-gradient(circle, rgba(61,90,153,.28) 0%, transparent 70%); animation: ecFloat 22s ease-in-out infinite reverse; }
    .ec-orb-c { width: 420px; height: 420px; top: 38%; left: 46%; background: radial-gradient(circle, rgba(30,50,90,.30) 0%, transparent 70%); animation: ecFloat 26s ease-in-out infinite; }
    @keyframes ecFloat {
      0%, 100% { transform: translate(0,0) scale(1); }
      50% { transform: translate(30px,-30px) scale(1.08); }
    }

    .ec-shell { position: relative; z-index: 1; display: flex; min-height: 100vh; gap: 16px; padding: 16px; box-sizing: border-box; }

    .ec-sidebar {
      width: 260px; flex-shrink: 0;
      border-radius: 22px;
      position: sticky; top: 16px; height: calc(100vh - 32px);
      overflow-y: auto;
      background: rgba(255,255,255,.02);
      border: 1px solid rgba(255,255,255,.07);
      backdrop-filter: blur(36px) saturate(180%);
      -webkit-backdrop-filter: blur(36px) saturate(180%);
      box-shadow: 0 12px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.04);
      padding: 22px 16px;
      display: flex; flex-direction: column; gap: 4px;
    }

    .ec-header-glass {
      position: sticky; top: 16px; z-index: 20;
      display: flex; align-items: center; gap: 12px;
      padding: 15px 22px; border-radius: 18px;
      background: rgba(255,255,255,.02);
      border: 1px solid rgba(255,255,255,.07);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      box-shadow: 0 8px 28px rgba(0,0,0,.3);
    }

    .ec-hero-glow {
      position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(560px 300px at 12% 0%, rgba(86,134,221,.08), transparent 65%);
    }

    .ec-marquee-wrap { overflow: hidden; position: relative; }
    .ec-marquee-wrap::before, .ec-marquee-wrap::after {
      content: ""; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2;
    }
    .ec-marquee-wrap::before { left: 0; background: linear-gradient(90deg, var(--navy-950), transparent); }
    .ec-marquee-wrap::after { right: 0; background: linear-gradient(270deg, var(--navy-950), transparent); }
    .ec-marquee-track {
      display: flex; gap: 36px; white-space: nowrap; width: max-content;
      animation: ecMarquee 34s linear infinite;
    }
    @keyframes ecMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    .ec-flashcard {
      width: 78px; height: 78px; border-radius: 18px;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.08);
      backdrop-filter: blur(20px);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif; font-weight: 700;
      font-size: 30px; color: var(--gold-soft);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
    }

    .ec-stat {
      display: flex; flex-direction: column; gap: 4px; padding: 20px 22px;
      border-right: 1px solid var(--line);
    }
    .ec-stat:last-child { border-right: none; }

    /* --- Dev Credit Badge (subtle, understated) --- */
    .ec-devbadge {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 5px 4px;
      border-radius: 8px;
      text-decoration: none;
      cursor: pointer;
      opacity: .62;
      transition: opacity .3s ease;
      margin-bottom: 12px;
    }
    .ec-devbadge:hover { opacity: 1; }
    .ec-devbadge-icon {
      width: 18px; height: 18px; border-radius: 50%;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: var(--text-lo);
      transition: color .3s ease, border-color .3s ease;
    }
    .ec-devbadge-text { display: flex; flex-direction: column; line-height: 1.15; }
    .ec-devbadge-name { font-size: 10.5px; font-weight: 600; color: var(--text-lo); transition: color .3s ease; }
    .ec-devbadge-sub { font-size: 9.5px; color: var(--text-lo); opacity: .75; }
    .ec-devbadge:hover .ec-devbadge-name { color: var(--gold-soft); }
    .ec-devbadge:hover .ec-devbadge-icon { color: var(--gold-soft); border-color: rgba(147,182,238,.4); }

    @media (max-width: 860px) {
      .ec-shell { padding: 0; gap: 0; }
      .ec-sidebar { position: fixed; z-index: 40; left: 0; top: 0; bottom: 0; height: 100vh; width: 270px; border-radius: 0; transform: translateX(-100%); transition: transform .4s cubic-bezier(0.16, 1, 0.3, 1); }
      .ec-sidebar.open { transform: translateX(0); }
      .ec-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 30; backdrop-filter: blur(3px); }
      .ec-stat { border-right: none; border-bottom: 1px solid var(--line); }
      .ec-main { padding: 0 !important; }
      .ec-header-glass { border-radius: 0; top: 0; }
      .ec-content { padding: 16px 16px 60px !important; }
    }
    .ec-content { padding: 0 4px 40px; }
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

// Ambil teks sesuai bahasa aktif. Aman untuk data lama yang masih string biasa.
function bi(field, lang) {
  if (field && typeof field === "object") return field[lang] ?? field.id ?? field.en ?? "";
  return field || "";
}

const UI_TEXT = {
  id: {
    totalAnggota: "Total Anggota", tutorPengajar: "Tutor Pengajar", saldoKas: "Saldo Kas",
    berdiriSejak: "Berdiri Sejak", visi: "Visi", misi: "Misi",
    sorotan: "Sorotan Terbaru", lihatSemua: "Lihat Semua", baca: "Baca selengkapnya",
    kembali: "Kembali ke Daftar Berita",
  },
  en: {
    totalAnggota: "Total Members", tutorPengajar: "Tutors", saldoKas: "Cash Balance",
    berdiriSejak: "Founded", visi: "Vision", misi: "Mission",
    sorotan: "Latest Highlights", lihatSemua: "View All", baca: "Read more",
    kembali: "Back to News List",
  },
};

function mergeWithDefaults(def, loaded) {
  if (loaded === undefined || loaded === null) return def;
  if (Array.isArray(def)) return Array.isArray(loaded) ? loaded : def;
  if (typeof def === "object" && typeof loaded === "object" && !Array.isArray(loaded)) {
    const out = { ...loaded };
    Object.keys(def).forEach((k) => { out[k] = mergeWithDefaults(def[k], loaded[k]); });
    return out;
  }
  return loaded;
}

function socialUrl(key, value) {
  if (!value) return "#";
  if (value.startsWith("http")) return value;
  const handle = value.replace(/^@/, "");
  if (key === "instagram") return `https://instagram.com/${handle}`;
  if (key === "tiktok") return `https://www.tiktok.com/@${handle}`;
  if (key === "gdrive") return value;
  return "#";
}

function waLink(number, text) {
  const digits = (number || "").replace(/[^0-9]/g, "");
  const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
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
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            const rows = await readExcelFile(file);
            onRows(rows);
          } catch (err) {
            alert("Gagal membaca file. Pastikan formatnya .xlsx, .xls, atau .csv.");
          }
          setBusy(false);
          e.target.value = "";
        }}
      />
      <button className="ec-btn ghost" onClick={() => ref.current.click()} disabled={busy}>
        <Upload size={13} /> {busy ? "Memproses…" : label}
      </button>
      {hint && <div style={{ fontSize: 11, color: "var(--text-lo)", marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

const NAV_ITEMS = [
  { key: "beranda", label: { id: "Beranda", en: "Home" }, icon: Home },
  { key: "struktur", label: { id: "Struktur Organisasi", en: "Organization Structure" }, icon: Users },
  { key: "socmed", label: { id: "Media Sosial", en: "Social Media" }, icon: Share2 },
  { key: "berita", label: { id: "Berita & Pengumuman", en: "News & Announcements" }, icon: Newspaper },
  { key: "anggota", label: { id: "Data Anggota", en: "Member Data" }, icon: GraduationCap },
  { key: "daftarulang", label: { id: "Daftar Ulang", en: "Re-registration" }, icon: ClipboardList },
  { key: "daftareskul", label: { id: "Daftar Ekstrakulikuler", en: "Join the Club" }, icon: ListChecks },
  { key: "evoting", label: { id: "E-Voting", en: "E-Voting" }, icon: Vote },
  { key: "rekap", label: { id: "Rekap Nilai & Kas", en: "Grades & Cash Recap" }, icon: BarChart3 },
  { key: "tutor", label: { id: "Tutor Pengajar", en: "Tutors" }, icon: Award },
  { key: "admin", label: { id: "Panel Admin", en: "Admin Panel" }, icon: UserCog },
];

/* ---------------------------------------------------------
   DEV CREDIT BADGE
--------------------------------------------------------- */
function DevBadge() {
  return (
    <a
      href="https://instagram.com/xnnzooo.id"
      target="_blank"
      rel="noreferrer"
      className="ec-devbadge"
    >
      <span className="ec-devbadge-icon"><Instagram size={10} color="currentColor" /></span>
      <span className="ec-devbadge-text">
        <span className="ec-devbadge-name">Dev Daffa</span>
        <span className="ec-devbadge-sub">@xnnzooo.id</span>
      </span>
    </a>
  );
}

/* ---------------------------------------------------------
   EMPTY STATE
--------------------------------------------------------- */
function EmptyState({ text }) {
  return (
    <div
      className="ec-card"
      style={{
        padding: 32,
        textAlign: "center",
        color: "var(--text-lo)",
        fontSize: 13.5,
        gridColumn: "1 / -1",
      }}
    >
      {text}
    </div>
  );
}

/* ---------------------------------------------------------
   ERROR BOUNDARY (biar kalau ada error, muncul pesannya
   di layar, bukan layar putih kosong)
--------------------------------------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, background: "#1a0000", color: "#ffb4b4", fontFamily: "monospace", fontSize: 13, minHeight: "100vh" }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>⚠️ Terjadi error:</div>
          <div style={{ whiteSpace: "pre-wrap", marginBottom: 14 }}>{String(this.state.error && this.state.error.message)}</div>
          <div style={{ opacity: 0.7, whiteSpace: "pre-wrap" }}>{this.state.error && this.state.error.stack}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------------------------------------------------------
   MAIN APP
--------------------------------------------------------- */
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("beranda");
  const [openBeritaId, setOpenBeritaId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("ec-lang") || "id"; } catch { return "id"; }
  });
  function toggleLang() {
    const next = lang === "id" ? "en" : "id";
    setLang(next);
    try { localStorage.setItem("ec-lang", next); } catch {}
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get(STORAGE_KEY);
        if (res && res.value) {
          const loaded = JSON.parse(res.value);
          const merged = mergeWithDefaults(DEFAULT_DATA, loaded);
          setData(merged);
          if (JSON.stringify(merged) !== JSON.stringify(loaded)) {
            storage.set(STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
          }
        } else {
          setData(DEFAULT_DATA);
          await storage.set(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        }
      } catch (e) { setData(DEFAULT_DATA); }
      setLoading(false);
    })();
  }, []);

  async function persist(next) {
    setData(next);
    try {
      await storage.set(STORAGE_KEY, JSON.stringify(next));
      setSaveFlash(true);
      setTimeout(() => setSaveFlash(false), 1400);
    } catch (e) { console.error("Gagal menyimpan", e); }
  }

  function goTo(tabKey, beritaId = null) {
    setTab(tabKey);
    setOpenBeritaId(beritaId);
    setSidebarOpen(false);
  }

  if (loading || !data) {
    return (
      <div className="ec-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ color: "#93b6ee", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "-.02em" }}>
          Memuat English Community…
        </div>
      </div>
    );
  }

  const activeItem = NAV_ITEMS.find((n) => n.key === tab);

  return (
    <div className="ec-root">
      <GlobalStyle />
      <div className="ec-orbs" aria-hidden="true">
        <span className="ec-orb ec-orb-a" />
        <span className="ec-orb ec-orb-b" />
        <span className="ec-orb ec-orb-c" />
      </div>
      <div className="ec-shell">
        {sidebarOpen && <div className="ec-overlay" onClick={() => setSidebarOpen(false)} />}
        <aside className={`ec-sidebar${sidebarOpen ? " open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 6px 18px" }}>
            <div className="ec-crest">
              {data.profil.logoUrl ? <img src={data.profil.logoUrl} alt="logo" /> : (data.profil.logo || "EC").slice(0, 3)}
            </div>
            <div>
              <div className="ec-serif" style={{ fontSize: 19, color: "var(--text-hi)", lineHeight: 1.15 }}>{data.profil.nama}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-lo)", letterSpacing: ".5px" }}>{bi(data.profil.tagline, lang)}</div>
            </div>
          </div>

          <DevBadge />

          <div className="ec-divider" style={{ marginBottom: 10 }} />
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className={`ec-navlink${tab === item.key ? " active" : ""}`} onClick={() => goTo(item.key)}>
                <Icon size={16} />
                <span>{bi(item.label, lang)}</span>
                {item.key === "admin" && isAdmin && <ShieldCheck size={13} style={{ marginLeft: "auto", color: "var(--gold)" }} />}
              </div>
            );
          })}
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <div className="ec-divider" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 10.5, color: "var(--text-lo)", lineHeight: 1.6 }}>
              Berdiri sejak {data.profil.berdiri}<br />© {new Date().getFullYear()} {data.profil.nama}
            </div>
          </div>
        </aside>

        <main className="ec-main" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <header className="ec-header-glass">
            <div className="ec-only-mobile" onClick={() => setSidebarOpen(true)} style={{ cursor: "pointer", alignItems: "center" }}>
              <Menu size={20} color="var(--text-lo)" />
            </div>
            {tab !== "beranda" && (
              <button className="ec-btn ghost" onClick={() => goTo("beranda")} style={{ flexShrink: 0 }}>
                <ArrowLeft size={13} /> {lang === "id" ? "Beranda" : "Home"}
              </button>
            )}
            <div className="ec-serif" style={{ fontSize: 21, color: "var(--text-hi)" }}>{bi(activeItem?.label, lang)}</div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              {saveFlash && <span className="ec-badge ec-fade"><Check size={12} /> Tersimpan</span>}
              {isAdmin ? (
                <span className="ec-badge" style={{ cursor: "pointer" }} onClick={() => goTo("admin")}><Unlock size={12} /> Mode Admin</span>
              ) : (
                <span className="ec-badge" style={{ cursor: "pointer" }} onClick={() => goTo("admin")}><Lock size={12} /> Login</span>
              )}
            </div>
          </header>

          <div key={tab + (openBeritaId || "")} className="ec-fade ec-content" style={{ maxWidth: 1100 }}>
          <ErrorBoundary>
            {tab === "beranda" && <Beranda data={data} goTo={goTo} lang={lang} toggleLang={toggleLang} />}
            {tab === "struktur" && <Struktur data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "socmed" && <SocMed data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "berita" && (
              openBeritaId
                ? <BeritaDetail data={data} id={openBeritaId} onBack={() => setOpenBeritaId(null)} lang={lang} />
                : <Berita data={data} persist={persist} isAdmin={isAdmin} onOpen={(id) => setOpenBeritaId(id)} lang={lang} />
            )}
            {tab === "anggota" && <Anggota data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "daftarulang" && <DaftarUlang data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "daftareskul" && <DaftarEkstrakurikuler data={data} />}
            {tab === "evoting" && <EVoting />}
            {tab === "rekap" && <Rekap data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "tutor" && <Tutor data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "admin" && <AdminPanel data={data} persist={persist} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
          </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   BERANDA
--------------------------------------------------------- */
const WORDS = ["Confidence", "Fluency", "Discussion", "Debate", "Storytelling", "Culture", "Growth", "Community"];

function Beranda({ data, goTo, lang, toggleLang }) {
  const t = UI_TEXT[lang];
  const totalAnggota = ["X", "XI", "XII"].reduce((a, k) => a + data.members[k].length, 0);
  const latest = data.berita.slice().sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)).slice(0, 2);

  return (
    <div>
      <div className="ec-card" style={{ padding: "44px 36px", position: "relative", overflow: "hidden", marginBottom: 20 }}>
        <div className="ec-hero-glow" />
        <div style={{ position: "relative", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px" }}>
            <div className="ec-crest" style={{ width: 64, height: 64, marginBottom: 16, fontSize: 26 }}>
              {data.profil.logoUrl ? <img src={data.profil.logoUrl} alt="logo" /> : (data.profil.logo || "EC").slice(0, 3)}
            </div>
            <span className="ec-badge" style={{ marginBottom: 16 }}>{lang === "id" ? "Ekstrakurikuler · Sejak" : "Extracurricular · Since"} {data.profil.berdiri}</span>
            <h1 className="ec-serif" style={{ fontSize: 42, lineHeight: 1.15, margin: "14px 0 10px", color: "var(--text-hi)" }}>{data.profil.nama}</h1>
            <p style={{ color: "var(--gold-soft)", fontSize: 15, marginBottom: 18, letterSpacing: ".3px", fontWeight: 600 }}>{bi(data.profil.tagline, lang)}</p>
            <p style={{ color: "var(--text-lo)", fontSize: 14.5, lineHeight: 1.85, maxWidth: 560 }}>{bi(data.profil.deskripsi, lang)}</p>
          </div>
          <button
            className="ec-flashcard"
            onClick={toggleLang}
            title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            style={{ cursor: "pointer", flexDirection: "column", gap: 2, fontFamily: "inherit", outline: "none" }}
          >
            <span>{lang === "id" ? "EN" : "ID"}</span>
            <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7 }}>{lang === "id" ? "🇬🇧" : "🇮🇩"}</span>
          </button>
        </div>

        <div className="ec-marquee-wrap" style={{ marginTop: 34 }}>
          <div className="ec-marquee-track">
            {[...WORDS, ...WORDS].map((w, i) => (
              <span key={i} className="ec-serif" style={{ fontSize: 17, color: "var(--text-lo)", opacity: 0.6 }}>
                {w} <span style={{ color: "var(--line)" }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ec-card" style={{ display: "flex", flexWrap: "wrap", marginBottom: 20 }}>
        <div className="ec-stat"><span className="ec-label">{t.totalAnggota}</span><span className="ec-serif" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{totalAnggota}</span></div>
        <div className="ec-stat"><span className="ec-label">{t.tutorPengajar}</span><span className="ec-serif" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{data.tutors.length}</span></div>
        <div className="ec-stat"><span className="ec-label">{t.berdiriSejak}</span><span className="ec-serif" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{data.profil.berdiri}</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="ec-card" style={{ padding: 28 }}>
          <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 12 }}>{t.visi}</div>
          <p style={{ color: "var(--text-lo)", fontSize: 14, lineHeight: 1.8 }}>{bi(data.profil.visi, lang)}</p>
        </div>
        <div className="ec-card" style={{ padding: 28 }}>
          <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 12 }}>{t.misi}</div>
          <ul style={{ color: "var(--text-lo)", fontSize: 14, lineHeight: 1.9, paddingLeft: 18 }}>
            {data.profil.misi.map((m, i) => <li key={i}>{bi(m, lang)}</li>)}
          </ul>
        </div>
      </div>

      {latest.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)" }}>{t.sorotan}</div>
            <button className="ec-btn ghost" onClick={() => goTo("berita")}>{t.lihatSemua} <ArrowUpRight size={13} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 16 }}>
            {latest.map((b) => (
              <div key={b.id} className="ec-card clickable" style={{ padding: 22 }} onClick={() => goTo("berita", b.id)}>
                <div style={{ fontSize: 11, color: "var(--gold-soft)", marginBottom: 8 }}>{fmtDate(b.tanggal)}</div>
                <div className="ec-serif" style={{ fontSize: 17, marginBottom: 8 }}>{bi(b.judul, lang)}</div>
                <div style={{ color: "var(--text-lo)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  {t.baca} <ArrowUpRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   STRUKTUR
--------------------------------------------------------- */
function Struktur({ data, persist, isAdmin }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(data.struktur);
  useEffect(() => setForm(data.struktur), [data.struktur]);
  function save() { persist({ ...data, struktur: form }); setEdit(false); }
  const inti = [
    { label: "Ketua", key: "ketua", wakilKey: "wakilKetua" },
    { label: "Sekretaris", key: "sekretaris", wakilKey: "wakilSekretaris" },
    { label: "Bendahara", key: "bendahara", wakilKey: "wakilBendahara" },
  ];

  return (
    <div>
      {isAdmin && (
        <div style={{ marginBottom: 18, display: "flex", gap: 10 }}>
          {!edit ? <button className="ec-btn" onClick={() => setEdit(true)}><Pencil size={13} /> Edit Struktur</button> : (
            <>
              <button className="ec-btn solid" onClick={save}><Save size={13} /> Simpan</button>
              <button className="ec-btn ghost" onClick={() => { setForm(data.struktur); setEdit(false); }}>Batal</button>
            </>
          )}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
        {inti.map((it) => (
          <div key={it.key} className="ec-card" style={{ padding: 22 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Crown size={18} color="var(--gold)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "var(--text-lo)" }}>{it.label}</div>
            </div>
            {["main", "wakil"].map((slot) => {
              const fieldKey = slot === "main" ? it.key : it.wakilKey;
              return (
                <div key={slot} style={{ marginBottom: 10 }}>
                  <span className="ec-label">{slot === "main" ? it.label : `Wakil ${it.label}`}</span>
                  {edit ? (
                    <input className="ec-input" value={form[fieldKey] || ""} onChange={(e) => setForm({ ...form, [fieldKey]: e.target.value })} />
                  ) : <div style={{ color: "var(--text-lo)", fontSize: 13.5 }}>{data.struktur[fieldKey]}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", margin: "26px 0 14px" }}>Divisi</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {(edit ? form.divisi : data.struktur.divisi).map((d, i) => (
          <div key={i} className="ec-card" style={{ padding: 22 }}>
            {edit ? (
              <input className="ec-input" style={{ marginBottom: 12, fontWeight: 600 }} value={d.nama}
                onChange={(e) => { const next = [...form.divisi]; next[i] = { ...next[i], nama: e.target.value }; setForm({ ...form, divisi: next }); }} />
            ) : <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 15 }}>{d.nama}</div>}
            {["ketua", "wakil"].map((role) => (
              <div key={role} style={{ marginBottom: 10 }}>
                <span className="ec-label">{role === "ketua" ? "Ketua Divisi" : "Wakil Divisi"}</span>
                {edit ? (
                  <input className="ec-input" value={d[role]} onChange={(e) => { const next = [...form.divisi]; next[i] = { ...next[i], [role]: e.target.value }; setForm({ ...form, divisi: next }); }} />
                ) : <div style={{ color: "var(--text-lo)", fontSize: 13.5 }}>{d[role]}</div>}
              </div>
            ))}
            <div>
              <span className="ec-label">Anggota Divisi</span>
              {edit ? (
                <div>
                  {(d.anggota || []).map((a, ai) => (
                    <div key={ai} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input
                        className="ec-input"
                        value={a}
                        onChange={(e) => {
                          const next = [...form.divisi];
                          const nextAnggota = [...(next[i].anggota || [])];
                          nextAnggota[ai] = e.target.value;
                          next[i] = { ...next[i], anggota: nextAnggota };
                          setForm({ ...form, divisi: next });
                        }}
                      />
                      <button
                        className="ec-btn danger"
                        style={{ padding: "6px 10px" }}
                        onClick={() => {
                          const next = [...form.divisi];
                          next[i] = { ...next[i], anggota: (next[i].anggota || []).filter((_, idx) => idx !== ai) };
                          setForm({ ...form, divisi: next });
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="ec-btn ghost"
                    onClick={() => {
                      const next = [...form.divisi];
                      next[i] = { ...next[i], anggota: [...(next[i].anggota || []), "Nama Anggota"] };
                      setForm({ ...form, divisi: next });
                    }}
                  >
                    <Plus size={12} /> Tambah Anggota
                  </button>
                </div>
              ) : (
                (d.anggota || []).length === 0 ? (
                  <div style={{ color: "var(--text-lo)", fontSize: 13.5 }}>Belum ada anggota.</div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-lo)", fontSize: 13.5, lineHeight: 1.8 }}>
                    {d.anggota.map((a, ai) => <li key={ai}>{a}</li>)}
                  </ul>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MEDIA SOSIAL
--------------------------------------------------------- */
function SocMed({ data, persist, isAdmin }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(data.socmed);
  useEffect(() => setForm(data.socmed), [data.socmed]);
  const items = [
    { key: "instagram", label: "Instagram", icon: Instagram, prefix: "@" },
    { key: "tiktok", label: "TikTok", icon: Music2, prefix: "@" },
    { key: "gdrive", label: "Dokumentasi", icon: FolderOpen, prefix: "" },
  ];
  function save() { persist({ ...data, socmed: form }); setEdit(false); }

  return (
    <div>
      {isAdmin && (
        <div style={{ marginBottom: 18, display: "flex", gap: 10 }}>
          {!edit ? <button className="ec-btn" onClick={() => setEdit(true)}><Pencil size={13} /> Edit Tautan</button> : (
            <>
              <button className="ec-btn solid" onClick={save}><Save size={13} /> Simpan</button>
              <button className="ec-btn ghost" onClick={() => { setForm(data.socmed); setEdit(false); }}>Batal</button>
            </>
          )}
        </div>
      )}
      {!edit && <p style={{ color: "var(--text-lo)", fontSize: 12.5, marginBottom: 16 }}>Klik salah satu kartu untuk membuka aplikasi atau tautannya langsung. Kartu Dokumentasi akan membuka folder Google Drive.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.key} className={`ec-card${!edit ? " clickable" : ""}`} style={{ padding: 24 }}
              onClick={() => { if (!edit && data.socmed[it.key]) window.open(socialUrl(it.key, data.socmed[it.key]), "_blank"); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Icon size={18} color="var(--gold)" />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{it.label}</span>
                {!edit && <ArrowUpRight size={14} style={{ marginLeft: "auto", color: "var(--text-lo)" }} />}
              </div>
              {edit ? (
                <input
                  className="ec-input"
                  placeholder={it.key === "gdrive" ? "https://drive.google.com/…" : ""}
                  value={form[it.key]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setForm({ ...form, [it.key]: e.target.value })}
                />
              ) : (
                <div style={{ color: "var(--text-lo)", fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {data.socmed[it.key]
                    ? (it.key === "gdrive" ? "Buka folder dokumentasi" : `${it.prefix}${data.socmed[it.key]}`)
                    : "Belum diatur"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {edit && (
        <div className="ec-card" style={{ padding: 24, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <MessageCircle size={18} color="var(--gold)" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Nomor WhatsApp Tujuan</span>
          </div>
          <p style={{ color: "var(--text-lo)", fontSize: 12, marginBottom: 10 }}>
            Digunakan sebagai tujuan pesan pada menu Daftar Ulang & Daftar Ekstrakulikuler. Contoh: 081234567890
          </p>
          <input className="ec-input" placeholder="08xxxxxxxxxx" value={form.waNumber} onChange={(e) => setForm({ ...form, waNumber: e.target.value })} />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   BERITA (list + detail)
--------------------------------------------------------- */
const EMPTY_BERITA_FORM = { judul: { id: "", en: "" }, isi: { id: "", en: "" }, tanggal: new Date().toISOString().slice(0, 10), gambarList: [""] };

function Berita({ data, persist, isAdmin, onOpen, lang }) {
  const t = UI_TEXT[lang];
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_BERITA_FORM);

  // Data lama mungkin masih string biasa (belum bilingual) — bungkus jadi { id, en }.
  function toBi(field) {
    if (field && typeof field === "object") return { id: field.id || "", en: field.en || "" };
    return { id: field || "", en: "" };
  }

  function bukaForm(existing) {
    if (existing) {
      setEditId(existing.id);
      setForm({
        judul: toBi(existing.judul),
        isi: toBi(existing.isi),
        tanggal: existing.tanggal,
        gambarList: existing.gambarList && existing.gambarList.length ? existing.gambarList : [""],
      });
    } else {
      setEditId(null);
      setForm(EMPTY_BERITA_FORM);
    }
    setShowForm(true);
  }

  function simpan() {
    if (!form.judul.id.trim() || !form.isi.id.trim()) return;
    const gambarList = form.gambarList.map((g) => g.trim()).filter(Boolean);
    if (editId) {
      persist({ ...data, berita: data.berita.map((b) => (b.id === editId ? { ...b, ...form, gambarList } : b)) });
    } else {
      persist({ ...data, berita: [{ id: uid(), ...form, gambarList }, ...data.berita] });
    }
    setForm(EMPTY_BERITA_FORM);
    setEditId(null);
    setShowForm(false);
  }
  function batal() { setForm(EMPTY_BERITA_FORM); setEditId(null); setShowForm(false); }
  function hapus(id, e) { e.stopPropagation(); persist({ ...data, berita: data.berita.filter((b) => b.id !== id) }); }
  function updateFoto(i, val) { const next = [...form.gambarList]; next[i] = val; setForm({ ...form, gambarList: next }); }
  function tambahFoto() { setForm({ ...form, gambarList: [...form.gambarList, ""] }); }
  function hapusFoto(i) { setForm({ ...form, gambarList: form.gambarList.filter((_, idx) => idx !== i) }); }

  return (
    <div>
      {isAdmin && (
        <div style={{ marginBottom: 18 }}>
          {!showForm ? <button className="ec-btn solid" onClick={() => bukaForm(null)}><Plus size={14} /> Tambah Berita</button> : (
            <div className="ec-card" style={{ padding: 22, marginBottom: 20 }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div className="ec-serif" style={{ fontSize: 16, color: "var(--gold-soft)" }}>{editId ? "Edit Berita" : "Berita Baru"}</div>
                <div><span className="ec-label">Judul (Indonesia)</span><input className="ec-input" value={form.judul.id} onChange={(e) => setForm({ ...form, judul: { ...form.judul, id: e.target.value } })} /></div>
                <div><span className="ec-label">Judul (English)</span><input className="ec-input" value={form.judul.en} onChange={(e) => setForm({ ...form, judul: { ...form.judul, en: e.target.value } })} /></div>
                <div><span className="ec-label">Tanggal</span><input type="date" className="ec-input" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></div>
                <div>
                  <span className="ec-label"><ImageIcon size={11} style={{ verticalAlign: "-2px", marginRight: 4 }} />URL Foto (bisa lebih dari satu)</span>
                  {form.gambarList.map((g, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input className="ec-input" placeholder="https://…" value={g} onChange={(e) => updateFoto(i, e.target.value)} />
                      {form.gambarList.length > 1 && (
                        <button className="ec-btn danger" style={{ padding: "6px 10px" }} onClick={() => hapusFoto(i)}><Trash2 size={12} /></button>
                      )}
                    </div>
                  ))}
                  <button className="ec-btn ghost" onClick={tambahFoto}><Plus size={12} /> Tambah Foto</button>
                </div>
                <div><span className="ec-label">Isi Berita (Indonesia)</span><textarea className="ec-input" rows={4} value={form.isi.id} onChange={(e) => setForm({ ...form, isi: { ...form.isi, id: e.target.value } })} /></div>
                <div><span className="ec-label">Isi Berita (English)</span><textarea className="ec-input" rows={4} value={form.isi.en} onChange={(e) => setForm({ ...form, isi: { ...form.isi, en: e.target.value } })} /></div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="ec-btn solid" onClick={simpan}><Save size={13} /> {editId ? "Simpan Perubahan" : "Publikasikan"}</button>
                  <button className="ec-btn ghost" onClick={batal}>Batal</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{ display: "grid", gap: 14 }}>
        {data.berita.length === 0 && <EmptyState text="Belum ada berita atau pengumuman." />}
        {data.berita.slice().sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)).map((b) => (
          <div key={b.id} className="ec-card clickable" style={{ padding: 22, position: "relative", overflow: "hidden" }} onClick={() => onOpen(b.id)}>
            {b.gambarList && b.gambarList.length > 0 && (
              b.gambarList.length === 1 ? (
                <img src={b.gambarList[0]} alt={bi(b.judul, lang)} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14, marginBottom: 16 }} />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(b.gambarList.length, 3)}, 1fr)`, gap: 6, marginBottom: 16 }}>
                  {b.gambarList.slice(0, 3).map((g, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={g} alt="" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 12 }} />
                      {i === 2 && b.gambarList.length > 3 && (
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.55)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                          +{b.gambarList.length - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
            <div style={{ fontSize: 11, color: "var(--gold-soft)", letterSpacing: ".5px", marginBottom: 8 }}>{fmtDate(b.tanggal)}</div>
            <div className="ec-serif" style={{ fontSize: 19, marginBottom: 8, color: "var(--text-hi)" }}>{bi(b.judul, lang)}</div>
            <p style={{ color: "var(--text-lo)", fontSize: 13.5, lineHeight: 1.75, maxHeight: 42, overflow: "hidden" }}>{bi(b.isi, lang).split("\n")[0]}</p>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, color: "var(--gold-soft)", fontSize: 12.5 }}>
              {t.baca} <ArrowUpRight size={13} />
            </div>
            {isAdmin && (
              <div style={{ position: "absolute", top: 18, right: 18, display: "flex", gap: 8 }}>
                <button className="ec-btn ghost" style={{ padding: "6px 10px" }} onClick={(e) => { e.stopPropagation(); bukaForm(b); }}><Pencil size={13} /></button>
                <button className="ec-btn danger" style={{ padding: "6px 10px" }} onClick={(e) => hapus(b.id, e)}><Trash2 size={13} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BeritaDetail({ data, id, onBack, lang }) {
  const t = UI_TEXT[lang];
  const b = data.berita.find((x) => x.id === id);
  if (!b) return <EmptyState text="Berita tidak ditemukan." />;
  const fotos = b.gambarList || [];
  return (
    <div>
      <button className="ec-btn ghost" onClick={onBack} style={{ marginBottom: 20 }}><ArrowLeft size={13} /> {t.kembali}</button>
      <div className="ec-card" style={{ padding: 36, maxWidth: 720, overflow: "hidden" }}>
        {fotos.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: fotos.length === 1 ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {fotos.map((g, i) => (
              <img key={i} src={g} alt="" style={{ width: "100%", maxHeight: fotos.length === 1 ? 380 : 220, objectFit: "cover", borderRadius: 16 }} />
            ))}
          </div>
        )}
        <span className="ec-badge">{fmtDate(b.tanggal)}</span>
        <h1 className="ec-serif" style={{ fontSize: 30, margin: "16px 0 20px", lineHeight: 1.25 }}>{bi(b.judul, lang)}</h1>
        {bi(b.isi, lang).split("\n").map((p, i) => p.trim() ? <p key={i} style={{ color: "var(--text-lo)", fontSize: 14.5, lineHeight: 1.9, marginBottom: 14 }}>{p}</p> : null)}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DATA ANGGOTA
--------------------------------------------------------- */
function Anggota({ data, persist, isAdmin }) {
  const [kelas, setKelas] = useState("X");
  const jurusanOpsi = data.profil.jurusanList || [];
  const [form, setForm] = useState({ nama: "", nisn: "", jurusan: jurusanOpsi[0] || "", status: "Aktif" });

  function tambah() {
    if (!form.nama.trim()) return;
    persist({ ...data, members: { ...data.members, [kelas]: [...data.members[kelas], { ...form }] } });
    setForm({ nama: "", nisn: "", jurusan: jurusanOpsi[0] || "", status: "Aktif" });
  }
  function hapus(idx) { persist({ ...data, members: { ...data.members, [kelas]: data.members[kelas].filter((_, i) => i !== idx) } }); }

  function handleImport(rows) {
    const parsed = rows.map((r) => ({
      nama: r.nama || r.name || "",
      nisn: (r.nisn || r.nis || r.no_induk || r.id || "").toString(),
      jurusan: r.jurusan || "",
      status: r.status || "Aktif",
    })).filter((r) => r.nama);
    if (parsed.length === 0) { alert("Tidak ada baris valid ditemukan. Pastikan ada kolom 'nama'."); return; }
    persist({ ...data, members: { ...data.members, [kelas]: [...data.members[kelas], ...parsed] } });
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["X", "XI", "XII"].map((k) => (
          <button key={k} className={`ec-btn ${kelas === k ? "solid" : "ghost"}`} onClick={() => setKelas(k)}>Kelas {k}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="ec-btn ghost" onClick={() => exportExcel(`anggota-kelas-${kelas}.xlsx`, data.members[kelas])}><Download size={13} /> Ekspor Excel</button>
        </div>
      </div>

      {isAdmin && (
        <div className="ec-card" style={{ padding: 18, marginBottom: 18, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span className="ec-label">Nama</span>
            <input className="ec-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          </div>
          <div style={{ minWidth: 130 }}>
            <span className="ec-label">NISN</span>
            <input className="ec-input" value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} />
          </div>
          <div style={{ minWidth: 130 }}>
            <span className="ec-label">Jurusan</span>
            <select className="ec-input" value={form.jurusan} onChange={(e) => setForm({ ...form, jurusan: e.target.value })}>
              {jurusanOpsi.length === 0 && <option value="">-</option>}
              {jurusanOpsi.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 130 }}>
            <span className="ec-label">Status</span>
            <select className="ec-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Aktif</option><option>Tidak Aktif</option>
            </select>
          </div>
          <button className="ec-btn solid" onClick={tambah}><Plus size={13} /> Tambah</button>
          <ImportButton label={`Impor ke Kelas ${kelas}`} onRows={handleImport} hint="Kolom: nama, nisn, jurusan, status" />
        </div>
      )}

      <div className="ec-card" style={{ overflow: "hidden" }}>
        <table className="ec-table">
          <thead><tr><th style={{ width: 40 }}>#</th><th>Nama</th><th>NISN</th><th>Jurusan</th><th>Status</th>{isAdmin && <th style={{ width: 60 }}></th>}</tr></thead>
          <tbody>
            {data.members[kelas].length === 0 && <tr><td colSpan={6} style={{ color: "var(--text-lo)", textAlign: "center", padding: 26 }}>Belum ada anggota kelas {kelas}.</td></tr>}
            {data.members[kelas].map((m, i) => (
              <tr key={i}>
                <td>{i + 1}</td><td>{m.nama}</td><td>{m.nisn}</td><td>{m.jurusan}</td>
                <td><span style={{ color: m.status === "Aktif" ? "#7fd9b0" : "var(--text-lo)" }}>{m.status}</span></td>
                {isAdmin && <td><button className="ec-btn danger" style={{ padding: "5px 8px" }} onClick={() => hapus(i)}><Trash2 size={12} /></button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DAFTAR ULANG
--------------------------------------------------------- */
function DaftarUlang({ data, persist, isAdmin }) {
  const jurusanOpsi = data.profil.jurusanList || [];
  const [form, setForm] = useState({ nama: "", kelasAsal: "X", kelasBaru: "XI", jurusan: jurusanOpsi[0] || "", eskul: "", kontak: "" });
  const [sent, setSent] = useState(false);

  function submit() {
    if (!form.nama.trim() || !form.kontak.trim()) return;
    const entry = { id: uid(), ...form, tanggal: new Date().toISOString().slice(0, 10) };
    persist({ ...data, daftarUlang: [entry, ...data.daftarUlang] });
    setForm({ nama: "", kelasAsal: "X", kelasBaru: "XI", jurusan: jurusanOpsi[0] || "", eskul: "", kontak: "" });
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }
  function hapus(id) { persist({ ...data, daftarUlang: data.daftarUlang.filter((d) => d.id !== id) }); }
  function toggleBuka() { persist({ ...data, daftarUlangOpen: !data.daftarUlangOpen }); }

  const isOpen = data.daftarUlangOpen !== false;

  return (
    <div>
      {isAdmin && (
        <div className="ec-card" style={{ padding: 16, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isOpen ? <Unlock size={16} color="#7fd9b0" /> : <Lock size={16} color="#e19a9a" />}
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Status Pendaftaran Ulang: {isOpen ? "Dibuka" : "Ditutup"}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-lo)" }}>Karena daftar ulang cuma setahun sekali, kunci formnya di luar periode pendaftaran.</div>
            </div>
          </div>
          <button className={`ec-btn ${isOpen ? "danger" : "solid"}`} onClick={toggleBuka}>
            {isOpen ? <><Lock size={13} /> Tutup Pendaftaran</> : <><Unlock size={13} /> Buka Pendaftaran</>}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 1fr" : "1fr", gap: 24 }}>
      {(isOpen || isAdmin) ? (
        <div className="ec-card" style={{ padding: 28, maxWidth: 460 }}>
          <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 6 }}>Form Daftar Ulang</div>
          <p style={{ color: "var(--text-lo)", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
            Bagi anggota yang telah naik kelas, silakan isi form berikut agar tetap tercatat sebagai anggota aktif English Community.
          </p>
          <div style={{ display: "grid", gap: 14 }}>
            <div><span className="ec-label">Nama Lengkap</span><input className="ec-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><span className="ec-label">Kelas Asal</span><select className="ec-input" value={form.kelasAsal} onChange={(e) => setForm({ ...form, kelasAsal: e.target.value })}><option>X</option><option>XI</option><option>XII</option></select></div>
              <div><span className="ec-label">Kelas Baru</span><select className="ec-input" value={form.kelasBaru} onChange={(e) => setForm({ ...form, kelasBaru: e.target.value })}><option>X</option><option>XI</option><option>XII</option></select></div>
            </div>
            <div><span className="ec-label">Jurusan</span>
              <select className="ec-input" value={form.jurusan} onChange={(e) => setForm({ ...form, jurusan: e.target.value })}>
                {jurusanOpsi.length === 0 && <option value="">-</option>}
                {jurusanOpsi.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div><span className="ec-label">Ikut Ekstrakurikuler Apa Saja</span><input className="ec-input" placeholder="mis. English Community, Basket" value={form.eskul} onChange={(e) => setForm({ ...form, eskul: e.target.value })} /></div>
            <div><span className="ec-label">No. WhatsApp / Kontak</span><input className="ec-input" value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} /></div>
            <button className="ec-btn solid" onClick={submit} disabled={!isOpen && !isAdmin}><Send size={13} /> Kirim Daftar Ulang</button>
            {!isOpen && isAdmin && <div style={{ color: "#e19a9a", fontSize: 12 }}>Form ini sedang ditutup untuk pengunjung. Kamu tetap bisa mengujinya sebagai admin.</div>}
            {sent && <div style={{ color: "#7fd9b0", fontSize: 12.5 }}>✓ Terkirim! Data kamu sudah tercatat.</div>}
          </div>
        </div>
      ) : (
        <div className="ec-card" style={{ padding: 40, maxWidth: 460, textAlign: "center" }}>
          <Lock size={26} color="var(--gold)" style={{ marginBottom: 14 }} />
          <div className="ec-serif" style={{ fontSize: 20, marginBottom: 8 }}>Pendaftaran Ulang Ditutup</div>
          <p style={{ color: "var(--text-lo)", fontSize: 13, lineHeight: 1.7 }}>
            Form daftar ulang sedang tidak dibuka. Periode daftar ulang akan diinformasikan kembali menjelang tahun ajaran baru.
          </p>
        </div>
      )}

      {isAdmin && (
        <div className="ec-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)" }}>Data Masuk</div>
            <button className="ec-btn ghost" onClick={() => exportExcel("daftar-ulang.xlsx", data.daftarUlang.map(({ id, ...rest }) => rest))}><Download size={13} /> Unduh Excel</button>
          </div>
          <p style={{ color: "var(--text-lo)", fontSize: 11.5, marginBottom: 14, lineHeight: 1.6 }}>
            Situs ini tidak dapat menulis langsung ke Google Sheets tanpa server/API terhubung. Semua data yang masuk tersimpan otomatis di sini — tinggal klik <b>Unduh Excel</b> kapan saja lalu unggah ke Google Sheets bila perlu.
          </p>
          <div style={{ display: "grid", gap: 10, maxHeight: 380, overflowY: "auto" }} className="ec-scrollbar">
            {data.daftarUlang.length === 0 && <EmptyState text="Belum ada pendaftaran ulang." />}
            {data.daftarUlang.map((d) => (
              <div key={d.id} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 14, position: "relative" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.nama}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-lo)", marginTop: 4 }}>{d.kelasAsal} → {d.kelasBaru} · {d.jurusan} · {d.kontak} · {fmtDate(d.tanggal)}</div>
                {d.eskul && <div style={{ fontSize: 12, color: "var(--text-lo)", marginTop: 2 }}>Eskul: {d.eskul}</div>}
                <button className="ec-btn danger" style={{ position: "absolute", top: 10, right: 10, padding: "4px 7px" }} onClick={() => hapus(d.id)}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

/* ---------------------------------------------------------
   REKAP
--------------------------------------------------------- */
function Rekap({ data, persist, isAdmin }) {
  const [sub, setSub] = useState("nilai");
  const subs = [{ key: "nilai", label: "Rekap Nilai", icon: Award }, { key: "kas", label: "Uang Kas", icon: Wallet }, { key: "kehadiran", label: "Kehadiran", icon: ListChecks }];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {subs.map((s) => { const Icon = s.icon; return <button key={s.key} className={`ec-btn ${sub === s.key ? "solid" : "ghost"}`} onClick={() => setSub(s.key)}><Icon size={13} /> {s.label}</button>; })}
      </div>
      {sub === "nilai" && <RekapNilai data={data} persist={persist} isAdmin={isAdmin} />}
      {sub === "kas" && <RekapKas data={data} persist={persist} isAdmin={isAdmin} />}
      {sub === "kehadiran" && <RekapKehadiran data={data} persist={persist} isAdmin={isAdmin} />}
    </div>
  );
}

function RekapNilai({ data, persist, isAdmin }) {
  const [form, setForm] = useState({ nama: "", kelas: "X", nilai: "", keterangan: "" });
  function tambah() { if (!form.nama.trim()) return; persist({ ...data, rekap: { ...data.rekap, nilai: [...data.rekap.nilai, form] } }); setForm({ nama: "", kelas: "X", nilai: "", keterangan: "" }); }
  function hapus(i) { persist({ ...data, rekap: { ...data.rekap, nilai: data.rekap.nilai.filter((_, idx) => idx !== i) } }); }
  function handleImport(rows) {
    const parsed = rows.map((r) => ({ nama: r.nama || "", kelas: (r.kelas || "X").toString(), nilai: (r.nilai || "").toString(), keterangan: r.keterangan || "" })).filter((r) => r.nama);
    if (parsed.length === 0) { alert("Tidak ada baris valid. Pastikan ada kolom 'nama'."); return; }
    persist({ ...data, rekap: { ...data.rekap, nilai: [...data.rekap.nilai, ...parsed] } });
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button className="ec-btn ghost" onClick={() => exportExcel("rekap-nilai.xlsx", data.rekap.nilai)}><Download size={13} /> Ekspor Excel</button>
      </div>
      {isAdmin && (
        <div className="ec-card" style={{ padding: 16, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ minWidth: 160, flex: 1 }}><span className="ec-label">Nama</span><input className="ec-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
          <div style={{ minWidth: 90 }}><span className="ec-label">Kelas</span><select className="ec-input" value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })}><option>X</option><option>XI</option><option>XII</option></select></div>
          <div style={{ minWidth: 90 }}><span className="ec-label">Nilai</span><input className="ec-input" value={form.nilai} onChange={(e) => setForm({ ...form, nilai: e.target.value })} /></div>
          <div style={{ minWidth: 160, flex: 1 }}><span className="ec-label">Keterangan</span><input className="ec-input" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} /></div>
          <button className="ec-btn solid" onClick={tambah}><Plus size={13} /> Tambah</button>
          <ImportButton onRows={handleImport} hint="Kolom: nama, kelas, nilai, keterangan" />
        </div>
      )}
      <div className="ec-card" style={{ overflow: "hidden" }}>
        <table className="ec-table">
          <thead><tr><th>Nama</th><th>Kelas</th><th>Nilai</th><th>Keterangan</th>{isAdmin && <th style={{ width: 50 }}></th>}</tr></thead>
          <tbody>
            {data.rekap.nilai.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--text-lo)" }}>Belum ada data nilai.</td></tr>}
            {data.rekap.nilai.map((n, i) => (
              <tr key={i}><td>{n.nama}</td><td>{n.kelas}</td><td style={{ color: "var(--gold-soft)", fontWeight: 600 }}>{n.nilai}</td><td>{n.keterangan}</td>{isAdmin && <td><button className="ec-btn danger" style={{ padding: "5px 8px" }} onClick={() => hapus(i)}><Trash2 size={12} /></button></td>}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RekapKas({ data, persist, isAdmin }) {
  const [form, setForm] = useState({ tanggal: new Date().toISOString().slice(0, 10), keterangan: "", tipe: "masuk", jumlah: "" });
  const saldo = data.rekap.kas.reduce((acc, k) => acc + (k.tipe === "masuk" ? Number(k.jumlah) : -Number(k.jumlah)), 0);
  function tambah() { if (!form.keterangan.trim() || !form.jumlah) return; persist({ ...data, rekap: { ...data.rekap, kas: [{ ...form, jumlah: Number(form.jumlah) }, ...data.rekap.kas] } }); setForm({ tanggal: new Date().toISOString().slice(0, 10), keterangan: "", tipe: "masuk", jumlah: "" }); }
  function hapus(i) { persist({ ...data, rekap: { ...data.rekap, kas: data.rekap.kas.filter((_, idx) => idx !== i) } }); }
  function handleImport(rows) {
    const parsed = rows.map((r) => ({
      tanggal: r.tanggal || new Date().toISOString().slice(0, 10),
      keterangan: r.keterangan || "",
      tipe: (r.tipe || "masuk").toString().toLowerCase().includes("keluar") ? "keluar" : "masuk",
      jumlah: Number(r.jumlah || 0),
    })).filter((r) => r.keterangan);
    if (parsed.length === 0) { alert("Tidak ada baris valid. Pastikan ada kolom 'keterangan'."); return; }
    persist({ ...data, rekap: { ...data.rekap, kas: [...parsed, ...data.rekap.kas] } });
  }
  return (
    <div>
      <div className="ec-card" style={{ padding: 22, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div><div className="ec-label">Saldo Kas Saat Ini</div><div className="ec-serif" style={{ fontSize: 30, color: "var(--gold-soft)" }}>{fmtIDR(saldo)}</div></div>
        <button className="ec-btn ghost" onClick={() => exportExcel("rekap-kas.xlsx", data.rekap.kas)}><Download size={13} /> Ekspor Excel</button>
      </div>
      {isAdmin && (
        <div className="ec-card" style={{ padding: 16, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div><span className="ec-label">Tanggal</span><input type="date" className="ec-input" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><span className="ec-label">Keterangan</span><input className="ec-input" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} /></div>
          <div><span className="ec-label">Tipe</span><select className="ec-input" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}><option value="masuk">Masuk</option><option value="keluar">Keluar</option></select></div>
          <div><span className="ec-label">Jumlah</span><input className="ec-input" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} /></div>
          <button className="ec-btn solid" onClick={tambah}><Plus size={13} /> Catat</button>
          <ImportButton onRows={handleImport} hint="Kolom: tanggal, keterangan, tipe, jumlah" />
        </div>
      )}
      <div className="ec-card" style={{ overflow: "hidden" }}>
        <table className="ec-table">
          <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Tipe</th><th>Jumlah</th>{isAdmin && <th style={{ width: 50 }}></th>}</tr></thead>
          <tbody>
            {data.rekap.kas.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--text-lo)" }}>Belum ada transaksi kas.</td></tr>}
            {data.rekap.kas.map((k, i) => (
              <tr key={i}><td>{fmtDate(k.tanggal)}</td><td>{k.keterangan}</td><td style={{ color: k.tipe === "masuk" ? "#7fd9b0" : "#e19a9a" }}>{k.tipe === "masuk" ? "Masuk" : "Keluar"}</td><td>{fmtIDR(k.jumlah)}</td>{isAdmin && <td><button className="ec-btn danger" style={{ padding: "5px 8px" }} onClick={() => hapus(i)}><Trash2 size={12} /></button></td>}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const KELAS_LIST = ["X", "XI", "XII"];
const STATUS_OPSI = ["Hadir", "Izin", "Sakit", "Alpa"];
const STATUS_WARNA = { Hadir: "#7fd9b0", Izin: "#93b6ee", Sakit: "#e8c25a", Alpa: "#e19a9a" };

function buatAbsensiDariRoster(members) {
  const absensi = {};
  KELAS_LIST.forEach((k) => { absensi[k] = (members[k] || []).map((m) => ({ nama: m.nama, status: "Hadir" })); });
  return absensi;
}

function RekapKehadiran({ data, persist, isAdmin }) {
  const [showForm, setShowForm] = useState(false);
  const [mingguLabel, setMingguLabel] = useState(`Minggu ke-${(data.rekap.kehadiran.length || 0) + 1}`);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [expanded, setExpanded] = useState(null);

  function buatMinggu() {
    if (!mingguLabel.trim()) return;
    const entry = { id: uid(), minggu: mingguLabel, tanggal, absensi: buatAbsensiDariRoster(data.members) };
    persist({ ...data, rekap: { ...data.rekap, kehadiran: [entry, ...data.rekap.kehadiran] } });
    setMingguLabel(`Minggu ke-${data.rekap.kehadiran.length + 2}`);
    setTanggal(new Date().toISOString().slice(0, 10));
    setShowForm(false);
    setExpanded(entry.id);
  }
  function hapusMinggu(id) { persist({ ...data, rekap: { ...data.rekap, kehadiran: data.rekap.kehadiran.filter((w) => w.id !== id) } }); }
  function updateStatus(weekId, kelas, idx, status) {
    const next = data.rekap.kehadiran.map((w) => {
      if (w.id !== weekId) return w;
      const absensiKelas = [...((w.absensi || {})[kelas] || [])];
      absensiKelas[idx] = { ...absensiKelas[idx], status };
      return { ...w, absensi: { ...w.absensi, [kelas]: absensiKelas } };
    });
    persist({ ...data, rekap: { ...data.rekap, kehadiran: next } });
  }

  function ringkasan(w) {
    let hadir = 0, total = 0;
    KELAS_LIST.forEach((k) => { ((w.absensi || {})[k] || []).forEach((a) => { total++; if (a.status === "Hadir") hadir++; }); });
    return `${hadir}/${total} hadir`;
  }

  function exportMinggu() {
    const rows = [];
    data.rekap.kehadiran.forEach((w) => {
      KELAS_LIST.forEach((k) => {
        ((w.absensi || {})[k] || []).forEach((a) => {
          rows.push({ minggu: w.minggu, tanggal: w.tanggal, kelas: k, nama: a.nama, status: a.status });
        });
      });
    });
    exportExcel("rekap-kehadiran.xlsx", rows);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "var(--text-lo)", fontSize: 12.5, maxWidth: 480, lineHeight: 1.7, margin: 0 }}>
          Setiap kartu mewakili satu pertemuan mingguan eskul. Daftar hadir otomatis diambil dari data anggota kelas X, XI, XII — tinggal ubah status tiap anggota per minggu.
        </p>
        <button className="ec-btn ghost" onClick={exportMinggu}><Download size={13} /> Ekspor Excel</button>
      </div>

      {isAdmin && (
        <div style={{ marginBottom: 18 }}>
          {!showForm ? (
            <button className="ec-btn solid" onClick={() => setShowForm(true)}><Plus size={14} /> Rekap Minggu Baru</button>
          ) : (
            <div className="ec-card" style={{ padding: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <span className="ec-label">Label Minggu</span>
                <input className="ec-input" value={mingguLabel} onChange={(e) => setMingguLabel(e.target.value)} />
              </div>
              <div>
                <span className="ec-label">Tanggal Pertemuan</span>
                <input type="date" className="ec-input" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
              </div>
              <button className="ec-btn solid" onClick={buatMinggu}><Save size={13} /> Buat Rekap</button>
              <button className="ec-btn ghost" onClick={() => setShowForm(false)}>Batal</button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {data.rekap.kehadiran.length === 0 && <EmptyState text="Belum ada rekap kehadiran mingguan." />}
        {data.rekap.kehadiran.map((w) => {
          const isOpen = expanded === w.id;
          return (
            <div key={w.id} className="ec-card" style={{ padding: 0, overflow: "hidden" }}>
              <div
                className="clickable"
                style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
                onClick={() => setExpanded(isOpen ? null : w.id)}
              >
                <div>
                  <div className="ec-serif" style={{ fontSize: 17 }}>{w.minggu}</div>
                  <div style={{ fontSize: 12, color: "var(--text-lo)" }}>{fmtDate(w.tanggal)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="ec-badge">{ringkasan(w)}</span>
                  {isAdmin && (
                    <button className="ec-btn danger" style={{ padding: "6px 9px" }} onClick={(e) => { e.stopPropagation(); hapusMinggu(w.id); }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid var(--line)", padding: "18px 22px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 18 }}>
                  {KELAS_LIST.map((k) => (
                    <div key={k}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10, color: "var(--gold-soft)" }}>Kelas {k}</div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {((w.absensi || {})[k] || []).length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-lo)" }}>Belum ada anggota.</div>}
                        {((w.absensi || {})[k] || []).map((a, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                            <span style={{ fontSize: 13 }}>{a.nama}</span>
                            {isAdmin ? (
                              <select
                                className="ec-input"
                                style={{ width: 100, padding: "5px 8px", fontSize: 12 }}
                                value={a.status}
                                onChange={(e) => updateStatus(w.id, k, idx, e.target.value)}
                              >
                                {STATUS_OPSI.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            ) : (
                              <span style={{ fontSize: 12, fontWeight: 600, color: STATUS_WARNA[a.status] || "var(--text-lo)" }}>{a.status}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   TUTOR
--------------------------------------------------------- */
function Tutor({ data, persist, isAdmin }) {
  const [form, setForm] = useState({ nama: "", bidang: "" });
  function tambah() { if (!form.nama.trim()) return; persist({ ...data, tutors: [...data.tutors, form] }); setForm({ nama: "", bidang: "" }); }
  function hapus(i) { persist({ ...data, tutors: data.tutors.filter((_, idx) => idx !== i) }); }
  return (
    <div>
      {isAdmin && (
        <div className="ec-card" style={{ padding: 16, marginBottom: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 160 }}><span className="ec-label">Nama Tutor</span><input className="ec-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><span className="ec-label">Bidang / Materi</span><input className="ec-input" value={form.bidang} onChange={(e) => setForm({ ...form, bidang: e.target.value })} /></div>
          <button className="ec-btn solid" onClick={tambah}><Plus size={13} /> Tambah Tutor</button>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
        {data.tutors.length === 0 && <EmptyState text="Belum ada data tutor." />}
        {data.tutors.map((t, i) => (
          <div key={i} className="ec-card" style={{ padding: 22, position: "relative" }}>
            <div className="ec-crest" style={{ marginBottom: 12 }}>{t.nama.slice(0, 1)}</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{t.nama}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-lo)", marginTop: 4 }}>{t.bidang}</div>
            {isAdmin && <button className="ec-btn danger" style={{ position: "absolute", top: 16, right: 16, padding: "5px 8px" }} onClick={() => hapus(i)}><Trash2 size={12} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   E-VOTING (COMING SOON)
--------------------------------------------------------- */
function EVoting() {
  return (
    <div className="ec-card" style={{ padding: 48, maxWidth: 520, textAlign: "center", margin: "20px auto" }}>
      <Vote size={30} color="var(--gold)" style={{ marginBottom: 16 }} />
      <div className="ec-serif" style={{ fontSize: 24, marginBottom: 10 }}>E-Voting — Coming Soon</div>
      <p style={{ color: "var(--text-lo)", fontSize: 13.5, lineHeight: 1.8, marginBottom: 22 }}>
        Developer Daffa Mufti sedang mengembangkan menu ini. Follow Instagram beliau di @xnnzooo.id agar beliau senang.
      </p>
      <a href="https://instagram.com/xnnzooo.id" target="_blank" rel="noreferrer" className="ec-btn solid" style={{ textDecoration: "none" }}>
        <Instagram size={13} /> Follow @xnnzooo.id
      </a>
    </div>
  );
}

/* ---------------------------------------------------------
   DAFTAR EKSTRAKULIKULER (langsung ke WhatsApp)
--------------------------------------------------------- */
function DaftarEkstrakurikuler({ data }) {
  const jurusanOpsi = data.profil.jurusanList || [];
  const [form, setForm] = useState({ nama: "", kelas: "X", jurusan: jurusanOpsi[0] || "" });
  const [err, setErr] = useState("");

  function kirim() {
    if (!form.nama.trim()) { setErr("Nama wajib diisi."); return; }
    if (!data.socmed.waNumber) { setErr("Nomor WhatsApp tujuan belum diatur oleh admin."); return; }
    setErr("");
    const pesan = `Halo, saya ingin mendaftar sebagai anggota ${data.profil.nama}.\nNama: ${form.nama}\nKelas: ${form.kelas}\nJurusan: ${form.jurusan}`;
    window.open(waLink(data.socmed.waNumber, pesan), "_blank");
  }

  return (
    <div className="ec-card" style={{ padding: 28, maxWidth: 460 }}>
      <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 6 }}>Daftar Ekstrakulikuler</div>
      <p style={{ color: "var(--text-lo)", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
        Isi data berikut, lalu tekan tombol untuk langsung diarahkan ke WhatsApp pendaftaran.
      </p>
      <div style={{ display: "grid", gap: 14 }}>
        <div><span className="ec-label">Nama Lengkap</span><input className="ec-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><span className="ec-label">Kelas</span><select className="ec-input" value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })}><option>X</option><option>XI</option><option>XII</option></select></div>
          <div><span className="ec-label">Jurusan</span>
            <select className="ec-input" value={form.jurusan} onChange={(e) => setForm({ ...form, jurusan: e.target.value })}>
              {jurusanOpsi.length === 0 && <option value="">-</option>}
              {jurusanOpsi.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>
        <button className="ec-btn solid" onClick={kirim}><MessageCircle size={13} /> Daftar via WhatsApp</button>
        {err && <div style={{ color: "#e19a9a", fontSize: 12.5 }}>{err}</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ADMIN PANEL
--------------------------------------------------------- */
function normalizeProfil(p) {
  const asBi = (v) => (v && typeof v === "object") ? { id: v.id || "", en: v.en || "" } : { id: v || "", en: "" };
  return {
    ...p,
    tagline: asBi(p.tagline),
    deskripsi: asBi(p.deskripsi),
    visi: asBi(p.visi),
    misi: (p.misi || []).map(asBi),
  };
}

function AdminPanel({ data, persist, isAdmin, setIsAdmin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState(() => normalizeProfil(data.profil));
  const [pwForm, setPwForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  useEffect(() => setForm(normalizeProfil(data.profil)), [data.profil]);

  function login() {
    if (pw === data.auth.password) { setIsAdmin(true); setErr(""); setPw(""); }
    else setErr("Kata sandi salah. Coba lagi.");
  }
  function saveProfil() { persist({ ...data, profil: form }); }
  function updateMisi(i, langKey, val) { const next = [...form.misi]; next[i] = { ...next[i], [langKey]: val }; setForm({ ...form, misi: next }); }

  function changePassword() {
    if (pwForm.lama !== data.auth.password) { setPwMsg({ type: "err", text: "Kata sandi lama tidak sesuai." }); return; }
    if (pwForm.baru.length < 4) { setPwMsg({ type: "err", text: "Kata sandi baru minimal 4 karakter." }); return; }
    if (pwForm.baru !== pwForm.konfirmasi) { setPwMsg({ type: "err", text: "Konfirmasi kata sandi tidak cocok." }); return; }
    persist({ ...data, auth: { password: pwForm.baru } });
    setPwForm({ lama: "", baru: "", konfirmasi: "" });
    setPwMsg({ type: "ok", text: "Kata sandi berhasil diperbarui." });
  }

  if (!isAdmin) {
    return (
      <div className="ec-card" style={{ padding: 40, maxWidth: 400, textAlign: "center" }}>
        <Lock size={26} color="var(--gold)" style={{ marginBottom: 14 }} />
        <div className="ec-serif" style={{ fontSize: 22, marginBottom: 8 }}>Masuk sebagai Admin</div>
        <p style={{ color: "var(--text-lo)", fontSize: 13, marginBottom: 20 }}>Masukkan kata sandi admin untuk mengelola seluruh isi situs.</p>
        <input type="password" className="ec-input" placeholder="Kata sandi" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} style={{ marginBottom: 12, textAlign: "center" }} />
        {err && <div style={{ color: "#e19a9a", fontSize: 12, marginBottom: 10 }}>{err}</div>}
        <button className="ec-btn solid" style={{ width: "100%", justifyContent: "center" }} onClick={login}><Unlock size={13} /> Masuk</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <span className="ec-badge"><ShieldCheck size={13} /> Anda masuk sebagai admin</span>
        <button className="ec-btn ghost" onClick={() => setIsAdmin(false)}><LogOut size={13} /> Keluar</button>
      </div>

      <div className="ec-card" style={{ padding: 26, marginBottom: 20 }}>
        <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 16 }}>Identitas Situs</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "center" }}>
          <div className="ec-crest" style={{ width: 60, height: 60 }}>
            {form.logoUrl ? <img src={form.logoUrl} alt="logo" /> : (form.logo || "EC").slice(0, 3)}
          </div>
          <div style={{ flex: 1 }}>
            <span className="ec-label"><ImagePlus size={11} style={{ verticalAlign: "-2px", marginRight: 4 }} />URL Gambar Logo (opsional)</span>
            <input className="ec-input" placeholder="https://…" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><span className="ec-label">Inisial Logo (cadangan, maks. 3 huruf)</span><input className="ec-input" maxLength={3} value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value.toUpperCase() })} /></div>
          <div><span className="ec-label">Nama Ekstrakurikuler</span><input className="ec-input" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
          <div><span className="ec-label">Tagline (Indonesia)</span><input className="ec-input" value={form.tagline.id} onChange={(e) => setForm({ ...form, tagline: { ...form.tagline, id: e.target.value } })} /></div>
          <div><span className="ec-label">Tagline (English)</span><input className="ec-input" value={form.tagline.en} onChange={(e) => setForm({ ...form, tagline: { ...form.tagline, en: e.target.value } })} /></div>
          <div><span className="ec-label">Tahun Berdiri</span><input className="ec-input" value={form.berdiri} onChange={(e) => setForm({ ...form, berdiri: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><span className="ec-label">Deskripsi (Indonesia)</span><textarea className="ec-input" rows={3} value={form.deskripsi.id} onChange={(e) => setForm({ ...form, deskripsi: { ...form.deskripsi, id: e.target.value } })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><span className="ec-label">Deskripsi (English)</span><textarea className="ec-input" rows={3} value={form.deskripsi.en} onChange={(e) => setForm({ ...form, deskripsi: { ...form.deskripsi, en: e.target.value } })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><span className="ec-label">Visi (Indonesia)</span><textarea className="ec-input" rows={2} value={form.visi.id} onChange={(e) => setForm({ ...form, visi: { ...form.visi, id: e.target.value } })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><span className="ec-label">Visi (English)</span><textarea className="ec-input" rows={2} value={form.visi.en} onChange={(e) => setForm({ ...form, visi: { ...form.visi, en: e.target.value } })} /></div>
          <div style={{ gridColumn: "1 / -1" }}>
            <span className="ec-label">Misi</span>
            {form.misi.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8 }}>
                <input className="ec-input" placeholder="Bahasa Indonesia" value={m.id} onChange={(e) => updateMisi(i, "id", e.target.value)} />
                <input className="ec-input" placeholder="English" value={m.en} onChange={(e) => updateMisi(i, "en", e.target.value)} />
                <button className="ec-btn danger" style={{ padding: "6px 10px" }} onClick={() => setForm({ ...form, misi: form.misi.filter((_, idx) => idx !== i) })}><Trash2 size={12} /></button>
              </div>
            ))}
            <button className="ec-btn ghost" onClick={() => setForm({ ...form, misi: [...form.misi, { id: "Poin misi baru", en: "New mission point" }] })}><Plus size={12} /> Tambah Poin Misi</button>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <span className="ec-label">Opsi Jurusan (untuk form Anggota, Daftar Ulang & Daftar Ekstrakulikuler)</span>
            {(form.jurusanList || []).map((j, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="ec-input" value={j} onChange={(e) => { const next = [...form.jurusanList]; next[i] = e.target.value; setForm({ ...form, jurusanList: next }); }} />
                <button className="ec-btn danger" style={{ padding: "6px 10px" }} onClick={() => setForm({ ...form, jurusanList: form.jurusanList.filter((_, idx) => idx !== i) })}><Trash2 size={12} /></button>
              </div>
            ))}
            <button className="ec-btn ghost" onClick={() => setForm({ ...form, jurusanList: [...(form.jurusanList || []), "Jurusan Baru"] })}><Plus size={12} /> Tambah Jurusan</button>
          </div>
        </div>
        <button className="ec-btn solid" style={{ marginTop: 18 }} onClick={saveProfil}><Save size={13} /> Simpan Identitas Situs</button>
      </div>

      <div className="ec-card" style={{ padding: 26, marginBottom: 20 }}>
        <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 6 }}>
          Ubah Sandi
        </div>
        <p style={{ color: "var(--text-lo)", fontSize: 12.5, marginBottom: 16 }}>
          Kata sandi tidak ditampilkan di mana pun – hanya Kamu yang tahu.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <span className="ec-label"><KeyRound size={11} style={{ verticalAlign: "-2px", marginRight: 4 }} />Kata Sandi Lama</span>
            <input type="password" className="ec-input" value={pwForm.lama} onChange={(e) => setPwForm({ ...pwForm, lama: e.target.value })} />
          </div>
          <div>
            <span className="ec-label">Kata Sandi Baru</span>
            <input type="password" className="ec-input" value={pwForm.baru} onChange={(e) => setPwForm({ ...pwForm, baru: e.target.value })} />
          </div>
          <div>
            <span className="ec-label">Konfirmasi Sandi Baru</span>
            <input type="password" className="ec-input" value={pwForm.konfirmasi} onChange={(e) => setPwForm({ ...pwForm, konfirmasi: e.target.value })} />
          </div>
        </div>
        {pwMsg.text && (
          <div style={{ color: pwMsg.type === "ok" ? "#7fd9b0" : "#e19a9a", fontSize: 12.5, marginBottom: 14 }}>
            {pwMsg.text}
          </div>
        )}
        <button className="ec-btn solid" onClick={changePassword}><Save size={13} /> Perbarui Kata Sandi</button>
      </div>
    </div>
  );
}
