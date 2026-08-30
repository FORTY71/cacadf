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
  "data": {
    "token": "PUBG-<user_key>-<serial>-SKYBAGSDISTRICTB7",
    "rng": 1760000300,
    "EXP": 1860000000
  }
}
```

- `token` (string, wajib): harus persis `PUBG-{user_key}-{serial}-SKYBAGSDISTRICTB7`
- `rng` (number, wajib): epoch; harus `rng + 30 > now` saat request
- `EXP` (number): epoch masa aktif, ditampilkan di `MAct.exdate`

Jika cocok, native `Check()` mengembalikan `"OK"` dan flag login tersimpan.

## Deploy

```
cd cacadf-vercel
vercel deploy --prod
```

Deployed ke `https://cacadf.vercel.app/connect` (URL sudah tertanam di libmundo.so hasil patch).

## Validasi key

Edit `api/connect.py` untuk menolak kunci tertentu (mis. whitelist kunci `caca`) sebelum membangun `token`.
