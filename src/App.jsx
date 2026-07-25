import React, { useState, useEffect, useRef } from "react";
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
      id: 2,
      tanggal: "2026-06-02",
      judul: "Juara 2 English Debate Competition Tingkat Kota",
      isi: "Selamat kepada tim debat kita yang berhasil meraih Juara 2 pada kompetisi debat bahasa Inggris tingkat kota bulan lalu. Pencapaian ini adalah hasil dari latihan intensif selama dua bulan terakhir.\n\nTerima kasih kepada seluruh anggota yang telah mendukung dan tutor pembimbing yang selalu setia menemani proses latihan.",
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
  { key: "beranda", label: "Beranda", icon: Home },
  { key: "struktur", label: "Struktur Organisasi", icon: Users },
  { key: "socmed", label: "Media Sosial", icon: Share2 },
  { key: "berita", label: "Berita & Pengumuman", icon: Newspaper },
  { key: "anggota", label: "Data Anggota", icon: GraduationCap },
  { key: "daftarulang", label: "Daftar Ulang", icon: ClipboardList },
  { key: "rekap", label: "Rekap Nilai & Kas", icon: BarChart3 },
  { key: "tutor", label: "Tutor Pengajar", icon: Award },
  { key: "admin", label: "Panel Admin", icon: UserCog },
];

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

  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get(STORAGE_KEY);
        if (res && res.value) setData(JSON.parse(res.value));
        else {
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
        <div style={{ color: "#c9a24d", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: 1 }}>
          Memuat English Community…
        </div>
      </div>
    );
  }

  const activeItem = NAV_ITEMS.find((n) => n.key === tab);

  return (
    <div className="ec-root">
      <GlobalStyle />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {sidebarOpen && <div className="ec-overlay" onClick={() => setSidebarOpen(false)} />}
        <aside
          className={`ec-sidebar${sidebarOpen ? " open" : ""}`}
          style={{ width: 250, background: "var(--navy-900)", borderRight: "1px solid var(--line)", padding: "22px 16px", display: "flex", flexDirection: "column", gap: 4 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 6px 22px" }}>
            <div className="ec-crest">
              {data.profil.logoUrl ? <img src={data.profil.logoUrl} alt="logo" /> : (data.profil.logo || "EC").slice(0, 3)}
            </div>
            <div>
              <div className="ec-serif" style={{ fontSize: 19, fontWeight: 700, color: "var(--text-hi)", lineHeight: 1.1 }}>{data.profil.nama}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-lo)", letterSpacing: ".5px" }}>{data.profil.tagline}</div>
            </div>
          </div>
          <div className="ec-divider" style={{ marginBottom: 10 }} />
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className={`ec-navlink${tab === item.key ? " active" : ""}`} onClick={() => goTo(item.key)}>
                <Icon size={16} />
                <span>{item.label}</span>
                {item.key === "admin" && isAdmin && <ShieldCheck size={13} style={{ marginLeft: "auto", color: "var(--gold)" }} />}
              </div>
            );
          })}
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <div className="ec-divider" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 10.5, color: "var(--text-lo)", lineHeight: 1.5 }}>
              Berdiri sejak {data.profil.berdiri}<br />© {new Date().getFullYear()} {data.profil.nama}
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <header style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", background: "rgba(6,15,31,.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--line)" }}>
            <div className="ec-only-mobile" onClick={() => setSidebarOpen(true)} style={{ cursor: "pointer", alignItems: "center" }}>
              <Menu size={20} color="var(--text-lo)" />
            </div>
            <div className="ec-serif" style={{ fontSize: 22, color: "var(--text-hi)" }}>{activeItem?.label}</div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              {saveFlash && <span className="ec-badge ec-fade"><Check size={12} /> Tersimpan</span>}
              {isAdmin ? (
                <span className="ec-badge"><Unlock size={12} /> Mode Admin</span>
              ) : (
                <span className="ec-badge" style={{ color: "var(--text-lo)", borderColor: "var(--line)" }}><Lock size={12} /> Mode Pengunjung</span>
              )}
            </div>
          </header>

          <div key={tab + (openBeritaId || "")} className="ec-fade" style={{ padding: "26px 24px 60px", maxWidth: 1100 }}>
            {tab === "beranda" && <Beranda data={data} goTo={goTo} />}
            {tab === "struktur" && <Struktur data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "socmed" && <SocMed data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "berita" && (
              openBeritaId
                ? <BeritaDetail data={data} id={openBeritaId} onBack={() => setOpenBeritaId(null)} />
                : <Berita data={data} persist={persist} isAdmin={isAdmin} onOpen={(id) => setOpenBeritaId(id)} />
            )}
            {tab === "anggota" && <Anggota data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "daftarulang" && <DaftarUlang data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "rekap" && <Rekap data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "tutor" && <Tutor data={data} persist={persist} isAdmin={isAdmin} />}
            {tab === "admin" && <AdminPanel data={data} persist={persist} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
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

function Beranda({ data, goTo }) {
  const totalAnggota = ["X", "XI", "XII"].reduce((a, k) => a + data.members[k].length, 0);
  const saldo = data.rekap.kas.reduce((acc, k) => acc + (k.tipe === "masuk" ? Number(k.jumlah) : -Number(k.jumlah)), 0);
  const latest = data.berita.slice().sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)).slice(0, 2);

  return (
    <div>
      <div className="ec-card" style={{ padding: "44px 36px", position: "relative", overflow: "hidden", marginBottom: 20 }}>
        <div className="ec-hero-glow" />
        <div style={{ position: "relative", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px" }}>
            <span className="ec-badge" style={{ marginBottom: 16 }}>Ekstrakurikuler · Sejak {data.profil.berdiri}</span>
            <h1 className="ec-serif" style={{ fontSize: 42, lineHeight: 1.15, margin: "14px 0 10px", color: "var(--text-hi)" }}>{data.profil.nama}</h1>
            <p style={{ color: "var(--gold-soft)", fontSize: 15, marginBottom: 18, letterSpacing: ".3px" }}>{data.profil.tagline}</p>
            <p style={{ color: "var(--text-lo)", fontSize: 14.5, lineHeight: 1.8, maxWidth: 560 }}>{data.profil.deskripsi}</p>
          </div>
          <div className="ec-flashcard">Aa</div>
        </div>

        <div className="ec-marquee-wrap" style={{ marginTop: 34 }}>
          <div className="ec-marquee-track">
            {[...WORDS, ...WORDS].map((w, i) => (
              <span key={i} className="ec-serif" style={{ fontSize: 20, color: "var(--text-lo)", opacity: 0.8 }}>
                {w} <span style={{ color: "var(--gold)" }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ec-card" style={{ display: "flex", flexWrap: "wrap", marginBottom: 20 }}>
        <div className="ec-stat"><span className="ec-label">Total Anggota</span><span className="ec-serif" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{totalAnggota}</span></div>
        <div className="ec-stat"><span className="ec-label">Tutor Pengajar</span><span className="ec-serif" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{data.tutors.length}</span></div>
        <div className="ec-stat"><span className="ec-label">Saldo Kas</span><span className="ec-serif" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{fmtIDR(saldo)}</span></div>
        <div className="ec-stat"><span className="ec-label">Berdiri Sejak</span><span className="ec-serif" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{data.profil.berdiri}</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="ec-card" style={{ padding: 28 }}>
          <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 12 }}>Visi</div>
          <p style={{ color: "var(--text-lo)", fontSize: 14, lineHeight: 1.8 }}>{data.profil.visi}</p>
        </div>
        <div className="ec-card" style={{ padding: 28 }}>
          <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)", marginBottom: 12 }}>Misi</div>
          <ul style={{ color: "var(--text-lo)", fontSize: 14, lineHeight: 1.9, paddingLeft: 18 }}>
            {data.profil.misi.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      </div>

      {latest.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="ec-serif" style={{ fontSize: 20, color: "var(--gold-soft)" }}>Sorotan Terbaru</div>
            <button className="ec-btn ghost" onClick={() => goTo("berita")}>Lihat Semua <ArrowUpRight size={13} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 16 }}>
            {latest.map((b) => (
              <div key={b.id} className="ec-card clickable" style={{ padding: 22 }} onClick={() => goTo("berita", b.id)}>
                <div style={{ fontSize: 11, color: "var(--gold-soft)", marginBottom: 8 }}>{fmtDate(b.tanggal)}</div>
                <div className="ec-serif" style={{ fontSize: 17, marginBottom: 8 }}>{b.judul}</div>
                <div style={{ color: "var(--text-lo)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  Baca selengkapnya <ArrowUpRight size={13} />
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
  const inti = [{ label: "Ketua", key: "ketua" }, { label: "Sekretaris", key: "sekretaris" }, { label: "Bendahara", key: "bendahara" }];

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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        {inti.map((it) => (
          <div key={it.key} className="ec-card" style={{ padding: 22, textAlign: "center" }}>
            <Crown size={18} color="var(--gold)" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".6px", color: "var(--text-lo)", marginBottom: 6 }}>{it.label}</div>
            {edit ? <input className="ec-input" value={form[it.key]} onChange={(e) => setForm({ ...form, [it.key]: e.target.value })} /> : <div className="ec-serif" style={{ fontSize: 18 }}>{data.struktur[it.key]}</div>}
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
    { key: "email", label: "Email", icon: Send, prefix: "" },
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
      {!edit && <p style={{ color: "var(--text-lo)", fontSize: 12.5, marginBottom: 16 }}>Klik salah satu kartu untuk membuka aplikasi atau tautannya langsung.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.key} className={`ec-card${!edit ? " clickable" : ""}`} style={{ padding: 24 }}
              onClick={() => { if (!edit) window.open(socialUrl(it.key, data.socmed[it.key]), "_blank"); }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Icon size={18} color="var(--gold)" />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{it.label}</span>
                {!edit && <ArrowUpRight size={14} style={{ marginLeft: "auto", color: "var(--text-lo)" }} />}
              </div>
              {edit ? (
                <input className="ec-input" value={form[it.key]} onClick={(e) => e.stopPropagation()} onChange={(e) => setForm({ ...form, [it.key]: e.target.value })} />
              ) : <div style={{ color: "var(--text-lo)", fontSize: 14 }}>{it.prefix}{data.socmed[it.key]}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   BERITA (list + detail)
--------------------------------------------------------- */
function Berita({ data, persist, isAdmin, onOpen }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ judul: "", isi: "", tanggal: new Date().toISOString().slice(0, 10) });

  function tambah() {
    if (!form.judul.trim() || !form.isi.trim()) return;
    persist({ ...data, berita: [{ id: uid(), ...form }, ...data.berita] });
    setForm({ judul: "", isi: "", tanggal: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  }
  function hapus(id, e) { e.stopPropagation(); persist({ ...data, berita: data.berita.filter((b) => b.id !== id) }); }

  return (
    <div>
      {isAdmin && (
        <div style={{ marginBottom: 18 }}>
          {!showForm ? <button className="ec-btn solid" onClick={() => setShowForm(true)}><Plus size={14} /> Tambah Berita</button> : (
            <div className="ec-card" style={{ padding: 22, marginBottom: 20 }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div><span className="ec-label">Judul</span><input className="ec-input" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} /></div>
                <div><span className="ec-label">Tanggal</span><input type="date" className="ec-input" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></div>
                <div><span className="ec-label">Isi Berita</span><textarea className="ec-input" rows={4} value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} /></div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="ec-btn solid" onClick={tambah}><Save size={13} /> Publikasikan</button>
                  <button className="ec-btn ghost" onClick={() => setShowForm(false)}>Batal</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{ display: "grid", gap: 14 }}>
        {data.berita.length === 0 && <EmptyState text="Belum ada berita atau pengumuman." />}
        {data.berita.slice().sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)).map((b) => (
          <div key={b.id} className="ec-card clickable" style={{ padding: 22, position: "relative" }} onClick={() => onOpen(b.id)}>
            <div style={{ fontSize: 11, color: "var(--gold-soft)", letterSpacing: ".5px", marginBottom: 8 }}>{fmtDate(b.tanggal)}</div>
            <div className="ec-serif" style={{ fontSize: 19, marginBottom: 8, color: "var(--text-hi)" }}>{b.judul}</div>
            <p style={{ color: "var(--text-lo)", fontSize: 13.5, lineHeight: 1.75, maxHeight: 42, overflow: "hidden" }}>{b.isi.split("\n")[0]}</p>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, color: "var(--gold-soft)", fontSize: 12.5 }}>
              Baca selengkapnya <ArrowUpRight size={13} />
            </div>
            {isAdmin && <button className="ec-btn danger" style={{ position: "absolute", top: 18, right: 18, padding: "6px 10px" }} onClick={(e) => hapus(b.id, e)}><Trash2 size={13} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BeritaDetail({ data, id, onBack }) {
  const b = data.berita.find((x) => x.id === id);
  if (!b) return <EmptyState text="Berita tidak ditemukan." />;
  return (
    <div>
      <button className="ec-btn ghost" onClick={onBack} style={{ marginBottom: 20 }}><ArrowLeft size={13} /> Kembali ke Daftar Berita</button>
      <div className="ec-card" style={{ padding: 36, maxWidth: 720 }}>
        <span className="ec-badge">{fmtDate(b.tanggal)}</span>
        <h1 className="ec-serif" style={{ fontSize: 30, margin: "16px 0 20px", lineHeight: 1.25 }}>{b.judul}</h1>
        {b.isi.split("\n").map((p, i) => p.trim() ? <p key={i} style={{ color: "var(--text-lo)", fontSize: 14.5, lineHeight: 1.9, marginBottom: 14 }}>{p}</p> : null)}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   DATA ANGGOTA
--------------------------------------------------------- */
function Anggota({ data, persist, isAdmin }) {
  const [kelas, setKelas] = useState("X");
  const [form, setForm] = useState({ nama: "", nis: "", status: "Aktif" });

  function tambah() {
    if (!form.nama.trim()) return;
    persist({ ...data, members: { ...data.members, [kelas]: [...data.members[kelas], { ...form }] } });
    setForm({ nama: "", nis: "", status: "Aktif" });
  }
  function hapus(idx) { persist({ ...data, members: { ...data.members, [kelas]: data.members[kelas].filter((_, i) => i !== idx) } }); }

  function handleImport(rows) {
    const parsed = rows.map((r) => ({
      nama: r.nama || r.name || "",
      nis: (r.nis || r.no_induk || r.id || "").toString(),
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
          <div style={{ minWidth: 120 }}>
            <span className="ec-label">NIS</span>
            <input className="ec-input" value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} />
          </div>
          <div style={{ minWidth: 130 }}>
            <span className="ec-label">Status</span>
            <select className="ec-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Aktif</option><option>Tidak Aktif</option>
            </select>
          </div>
          <button className="ec-btn solid" onClick={tambah}><Plus size={13} /> Tambah</button>
          <ImportButton label={`Impor ke Kelas ${kelas}`} onRows={handleImport} hint="Kolom: nama, nis, status" />
        </div>
      )}

      <div className="ec-card" style={{ overflow: "hidden" }}>
        <table className="ec-table">
          <thead><tr><th style={{ width: 40 }}>#</th><th>Nama</th><th>NIS</th><th>Status</th>{isAdmin && <th style={{ width: 60 }}></th>}</tr></thead>
          <tbody>
            {data.members[kelas].length === 0 && <tr><td colSpan={5} style={{ color: "var(--text-lo)", textAlign: "center", padding: 26 }}>Belum ada anggota kelas {kelas}.</td></tr>}
            {data.members[kelas].map((m, i) => (
              <tr key={i}>
                <td>{i + 1}</td><td>{m.nama}</td><td>{m.nis}</td>
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
  const [form, setForm] = useState({ nama: "", kelasAsal: "X", kelasBaru: "XI", kontak: "" });
  const [sent, setSent] = useState(false);

  function submit() {
    if (!form.nama.trim() || !form.kontak.trim()) return;
    const entry = { id: uid(), ...form, tanggal: new Date().toISOString().slice(0, 10) };
    persist({ ...data, daftarUlang: [entry, ...data.daftarUlang] });
    setForm({ nama: "", kelasAsal: "X", kelasBaru: "XI", kontak: "" });
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }
  function hapus(id) { persist({ ...data, daftarUlang: data.daftarUlang.filter((d) => d.id !== id) }); }

  return (
    <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 1fr" : "1fr", gap: 24 }}>
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
          <div><span className="ec-label">No. WhatsApp / Kontak</span><input className="ec-input" value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} /></div>
          <button className="ec-btn solid" onClick={submit}><Send size={13} /> Kirim Daftar Ulang</button>
          {sent && <div style={{ color: "#7fd9b0", fontSize: 12.5 }}>✓ Terkirim! Data kamu sudah tercatat.</div>}
        </div>
      </div>

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
              <div key={d.id} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 14, position: "relative" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.nama}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-lo)", marginTop: 4 }}>{d.kelasAsal} → {d.kelasBaru} · {d.kontak} · {fmtDate(d.tanggal)}</div>
                <button className="ec-btn danger" style={{ position: "absolute", top: 10, right: 10, padding: "4px 7px" }} onClick={() => hapus(d.id)}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
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

function RekapKehadiran({ data, persist, isAdmin }) {
  const [form, setForm] = useState({ tanggal: new Date().toISOString().slice(0, 10), kegiatan: "", hadir: "", keterangan: "" });
  function tambah() { if (!form.kegiatan.trim()) return; persist({ ...data, rekap: { ...data.rekap, kehadiran: [form, ...data.rekap.kehadiran] } }); setForm({ tanggal: new Date().toISOString().slice(0, 10), kegiatan: "", hadir: "", keterangan: "" }); }
  function hapus(i) { persist({ ...data, rekap: { ...data.rekap, kehadiran: data.rekap.kehadiran.filter((_, idx) => idx !== i) } }); }
  function handleImport(rows) {
    const parsed = rows.map((r) => ({ tanggal: r.tanggal || new Date().toISOString().slice(0, 10), kegiatan: r.kegiatan || "", hadir: (r.hadir || "").toString(), keterangan: r.keterangan || "" })).filter((r) => r.kegiatan);
    if (parsed.length === 0) { alert("Tidak ada baris valid. Pastikan ada kolom 'kegiatan'."); return; }
    persist({ ...data, rekap: { ...data.rekap, kehadiran: [...parsed, ...data.rekap.kehadiran] } });
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button className="ec-btn ghost" onClick={() => exportExcel("rekap-kehadiran.xlsx", data.rekap.kehadiran)}><Download size={13} /> Ekspor Excel</button>
      </div>
      {isAdmin && (
        <div className="ec-card" style={{ padding: 16, marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div><span className="ec-label">Tanggal</span><input type="date" className="ec-input" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><span className="ec-label">Kegiatan</span><input className="ec-input" value={form.kegiatan} onChange={(e) => setForm({ ...form, kegiatan: e.target.value })} /></div>
          <div><span className="ec-label">Hadir (mis. 20/24)</span><input className="ec-input" value={form.hadir} onChange={(e) => setForm({ ...form, hadir: e.target.value })} /></div>
          <div style={{ flex: 1, minWidth: 140 }}><span className="ec-label">Keterangan</span><input className="ec-input" value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} /></div>
          <button className="ec-btn solid" onClick={tambah}><Plus size={13} /> Catat</button>
          <ImportButton onRows={handleImport} hint="Kolom: tanggal, kegiatan, hadir, keterangan" />
        </div>
      )}
      <div className="ec-card" style={{ overflow: "hidden" }}>
        <table className="ec-table">
          <thead><tr><th>Tanggal</th><th>Kegiatan</th><th>Kehadiran</th><th>Keterangan</th>{isAdmin && <th style={{ width: 50 }}></th>}</tr></thead>
          <tbody>
            {data.rekap.kehadiran.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--text-lo)" }}>Belum ada rekap kehadiran.</td></tr>}
            {data.rekap.kehadiran.map((k, i) => (
              <tr key={i}><td>{fmtDate(k.tanggal)}</td><td>{k.kegiatan}</td><td style={{ color: "var(--gold-soft)", fontWeight: 600 }}>{k.hadir}</td><td>{k.keterangan}</td>{isAdmin && <td><button className="ec-btn danger" style={{ padding: "5px 8px" }} onClick={() => hapus(i)}><Trash2 size={12} /></button></td>}</tr>
            ))}
          </tbody>
        </table>
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
   ADMIN PANEL
--------------------------------------------------------- */
function AdminPanel({ data, persist, isAdmin, setIsAdmin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState(data.profil);
  const [pwForm, setPwForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  useEffect(() => setForm(data.profil), [data.profil]);

  function login() {
    if (pw === data.auth.password) { setIsAdmin(true); setErr(""); setPw(""); }
    else setErr("Kata sandi salah. Coba lagi.");
  }
  function saveProfil() { persist({ ...data, profil: form }); }
  function updateMisi(i, val) { const next = [...form.misi]; next[i] = val; setForm({ ...form, misi: next }); }

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
          <div><span className="ec-label">Tagline</span><input className="ec-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
          <div><span className="ec-label">Tahun Berdiri</span><input className="ec-input" value={form.berdiri} onChange={(e) => setForm({ ...form, berdiri: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><span className="ec-label">Deskripsi</span><textarea className="ec-input" rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><span className="ec-label">Visi</span><textarea className="ec-input" rows={2} value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}>
            <span className="ec-label">Misi</span>
            {form.misi.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="ec-input" value={m} onChange={(e) => updateMisi(i, e.target.value)} />
                <button className="ec-btn danger" style={{ padding: "6px 10px" }} onClick={() => setForm({ ...form, misi: form.misi.filter((_, idx) => idx !== i) })}><Trash2 size={12} /></button>
              </div>
            ))}
            <button className="ec-btn ghost" onClick={() => setForm({ ...form, misi: [...form.misi, "Poin misi baru"] })}><Plus size={12} /> Tambah Poin Misi</button>
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
            <span className="ec-label">Kata Sandi Lama</span>
            <input type="password" className="ec-in" />
          </div>
        </div>
      </div>
    </div>
  );
}

