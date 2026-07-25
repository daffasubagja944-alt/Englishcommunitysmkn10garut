# English Community — Website

Web profil & manajemen internal ekstrakurikuler English Community. Dibangun dengan React + Vite, data disimpan di Supabase (gratis) supaya semua pengunjung melihat data yang sama.

## 1. Setup Supabase (database gratis)

1. Buat akun & project baru di https://supabase.com (gratis).
2. Di dashboard project, buka **SQL Editor** → jalankan query ini sekali saja:

   ```sql
   create table site_data (
     key text primary key,
     value text
   );

   alter table site_data enable row level security;

   create policy "public read" on site_data
     for select using (true);

   create policy "public write" on site_data
     for insert with check (true);

   create policy "public update" on site_data
     for update using (true);
   ```

   > Catatan keamanan: kebijakan di atas mengizinkan siapa saja dengan anon key membaca & menulis data — ini setara dengan model keamanan aplikasi aslinya (password admin hanya gerbang di sisi tampilan, bukan di server). Kalau nanti mau lebih aman, bisa ditambah Supabase Auth. Untuk web ekstrakurikuler sekolah biasanya ini cukup.

3. Buka **Project Settings → API**. Catat dua nilai ini:
   - `Project URL`
   - `anon public` key

## 2. Jalankan di komputer (opsional, buat coba dulu)

```bash
npm install
cp .env.example .env
# lalu isi .env dengan Project URL & anon key dari Supabase
npm run dev
```

Buka `http://localhost:5173`.

## 3. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit: English Community website"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

File `.env` **tidak akan ikut ter-upload** ke GitHub (sudah masuk `.gitignore`) — ini memang sengaja, karena env variable diisi lewat dashboard hosting, bukan lewat repo.

## 4. Deploy ke Vercel (gratis, paling gampang)

1. Buka https://vercel.com → login pakai akun GitHub.
2. Klik **Add New → Project**, pilih repo yang baru di-push tadi.
3. Vercel otomatis mendeteksi framework Vite. Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = Project URL dari Supabase
   - `VITE_SUPABASE_ANON_KEY` = anon public key dari Supabase
4. Klik **Deploy**. Setelah selesai, web sudah live di URL `nama-project.vercel.app` dan bisa diakses siapa saja.
5. Ke depannya, setiap kali kamu `git push` ke branch `main`, Vercel otomatis build & update web-nya.

## Info tambahan

- Password admin default: `admin123` (bisa diganti lewat panel Admin di web setelah login).
- Data awal (berita, struktur, dll) ada di `DEFAULT_DATA` dalam `src/App.jsx` — hanya dipakai sekali saat tabel Supabase masih kosong.
