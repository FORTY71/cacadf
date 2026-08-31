# cacadf-vercel

Backend server untuk login CONTRA (com.installer.null) yang sudah dipatch.

## Struktur respons JSON

App melakukan `POST https://cacadf.vercel.app/connect` dengan body form:

```
game=PUBG&user_key=<kunci>&serial=<uuid>
```

`serial` = `UUID.nameUUIDFromBytes(android_id.getBytes())` (UUIDv3, deterministik per device).

Respons yang diharapkan app (parser `Java_com_bgmi_LogAct_Check`):

```json
{
  "status": "OK",
  "data": {
    "token": "PUBG-<user_key>-<serial>-SKYBAGSDISTRICTB7",
    "rng": 1760000300,
    "EXP": 1860000000
  }
}
```

- `status` (wajib, top-level): hanya dicek KEBERADAANNYA. Jika tidak ada, app mencari
  `reason`/`message`/`msg`; jika tidak ada juga -> app menampilkan **"Invalid key"**.
  Inilah bug sebelumnya: response lama tanpa `status`.
- `token` (string, wajib): harus persis `PUBG-{user_key}-{serial}-SKYBAGSDISTRICTB7`.
  `serial` adalah serial yang dikirim app di body POST (UUIDv3 dari
  `android_id + Build.MODEL + Build.BRAND`), server cukup memakai nilai tersebut.
- `rng` (number, wajib): epoch; harus `rng + 30 > now` saat request
- `EXP` (number): epoch masa aktif, ditampilkan di `MAct.exdate`

Jika cocok, native `Check()` mengembalikan `"OK"` dan flag login tersimpan.

## Deploy

```
cd cacadf-vercel
vercel deploy --prod
```

Deployed ke `https://cacadf.vercel.app/` — URL yang tertanam di libmundo.so
adalah ROOT `/` (tanpa path). `vercel.json` memakai `rewrites` `/` dan
`/connect` -> `/api/connect` supaya POST app ke root dilayani handler.

## Validasi key

Edit `api/connect.py` untuk menolak kunci tertentu (mis. whitelist kunci `caca`) sebelum membangun `token`.
