# 🧩 ToGetHer RESTful API

Express.js + MongoDB + JWT Authentications

## 📖 Deskripsi

ToGetHer API adalah RESTful API yang dikembangkan menggunakan **Express.js** sebagai backend framework dan **MongoDB** sebagai database.  
API ini dirancang untuk mendukung aplikasi yang berfokus pada **pemberdayaan perempuan** dengan menyediakan informasi bantuan kategori pendidikan anak, modal usaha, kesehatan, bantuan ekonomi, dan pelatihan.
Fitur keamanan telah diterapkan menggunakan menggunakan **JWT (JSON Web Token)** untuk otentikasi dan otorisasi setiap endpoint yang membutuhkan akses pengguna terverifikasi.

## 🚀 Fitur Utama

- Registrasi dan login pengguna dengan JWT
- Middleware untuk verifikasi token JWT
- Manajemen data user (profil, password)
- CRUD Mitra
- CRUD Kategori Bantuan
- CRUD Bantuan
- CRUD Pengajuan Bantuan
- CRUD Tracking Pengajuan
- CRUD Form Pengajuan
- CRUD Jawaban Form
- CRUD Bukti Penerimaan Bantuan
- CRUD Testimoni

## API Endpoints

### Base URL

`https://together-server-production.up.railway.app`

### Root Endpoint

- **Method**: `GET`
- **URL**: `/`
- **Deskripsi**: Mengecek apakah API berjalan dengan benar
- **Response Success (200)**:

```json
{
  "message": "Welcome to ToGetHer API!"
}
```

## Auth API

### 1. Register

- **Method**: `POST`
- **URL**: `/auth/register`
- **Deskripsi**: Mendaftarkan pengguna baru.
- **Request Body**:

```json
{
  "nama": "Nama Anda",
  "username": "username anda",
  "password": "password anda",
  "no_telp": "no telp anda",
  "alamat": "Alamat Anda"
}
```

- **Response Success (201)**:

```json
{
  "message": "Registrasi berhasil",
  "user": {
    "_id": "id",
    "nama": "Nama Anda",
    "username": "username anda",
    "no_telp": "no telp anda",
    "alamat": "Alamat Anda"
  }
}
```

- **Response Error (400)**:

```json
{
  "message": "Username sudah digunakan"
}
```

### 2. Login

- **Method**: `POST`
- **URL**: `/auth/login`
- **Deskripsi**: Login pengguna dan mendapatkan token JWT.
- **Request Body**:

```json
{
  "username": "usernameanda",
  "password": "passwordanda"
}
```

- **Response Success (200)**:

```json
{
  "message": "Login berhasil",
  "token": "yourtoken",
  "user": {
    "_id": "id",
    "nama": "Nama Anda",
    "username": "username anda",
    "no_telp": "no telp anda",
    "alamat": "Alamat Anda"
  }
}
```

- **Response Error (404)**:

```json
{
  "message": "Username atau password salah"
}
```

## User API

### 1. Get All Users

- **Method**: GET
- **URL**: /users
- **Deskripsi**: Mendapatkan semua data user.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:

```json
{
  "message": "Berhasil mengambil data use",
  "users": [
    {
      "_id": "id",
      "nama": "Nama Anda",
      "username": "usernameanda",
      "no_telp": "notelpanda",
      "alamat": "Alamat Anda"
    }
  ]
}
```

- **Response Error (403)**:

```json
{
  "message": "Token tidak valid atau sudah kedaluwarsa"
}
```

### 2. Get User by ID

- **Method**: `GET`
- **URL**: `/users/:id`
- **Deskripsi**: Mendapatkan data user berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:

```json
{
  "message": "Berhasil mengambil data user",
  "user": {
    "_id": "id",
    "nama": "Nama Anda",
    "username": "username anda",
    "no_telp": "no telp anda",
    "alamat": "Alamat Anda"
  }
}
```

- **Response Error (403)**:

```json
{
  "message": "Token tidak valid atau sudah kedaluwarsa"
}
```

- **Response Error (404)**:

```json
{
  "message": "User tidak ditemukan"
}
```

### 3. Update Profile

- **Method**: `PATCH`
- **URL**: `/users/:id/profile`
- **Deskripsi**: Memperbarui profile user berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "nama": "Nama Anda",
  "username": "username baru anda",
  "no_telp": "no telp baru anda",
  "alamat": "Alamat Baru Anda"
}
```

- **Response Success (200)**:

```json
{
  "message": "Profil berhasil diperbarui",
  "user": {
    "_id": "id",
    "nama": "Nama Anda",
    "username": "username baru anda",
    "no_telp": "no telp baru anda",
    "alamat": "Alamat Baru Anda"
  }
}
```

- **Response Error (403)**:

```json
{
  "message": "Token tidak valid atau sudah kedaluwarsa"
}
```

### 3. Update Password

- **Method**: `PATCH`
- **URL**: `/users/:id/password`
- **Deskripsi**: Memperbarui password user berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "oldPassword": "yourpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

- **Response Success (200)**:

```json
{
  "message": "Password berhasil diperbarui"
}
```

- **Response Error (403)**:

```json
{
  "message": "Token tidak valid atau sudah kedaluwarsa"
}
```

### 5. Delete

- **Method**: `DELETE`
- **URL**: `/users/:id`
- **Deskripsi**: Menghapus user berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:

```json
{
  "message": "Berhasil menghapus data user"
}
```

- **Response Error (403)**:

```json
{
  "message": "Token tidak valid atau sudah kedaluwarsa"
}
```

## Mitra API

### 1. Create Mitra

- **Method**: `POST`
- **URL**: `/mitra`
- **Deskripsi**: Membuat mitra baru.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:

  - `nama` (text)
  - `no_telp` (text)
  - `alamat` (text)
  - `logo` (file)

- **Response Success (201)**:

```json
{
  "success": true,
  "message": "Mitra berhasil ditambahkan",
  "data": {
    "_id": "id",
    "nama": "Nama Mitra",
    "no_telp": "081234567890",
    "alamat": "Alamat Mitra",
    "logo": "https://res.cloudinary.com/....jpg",
    "createdAt": "2025-11-06T10:00:00Z"
  }
}
```

- **Response Error (400)**:

```json
{
  "success": false,
  "message": "Semua field wajib diisi"
}
```

- **Response Error (500)**:

```json
{
  "success": false,
  "message": "Gagal menambahkan mitra",
  "error": "Error message"
}
```

### 2. Get All Mitra

- **Method**: `GET`
- **URL**: `/mitra`
- **Deskripsi**: Mendapatkan semua data mitra.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:

```json
{
  "success": true,
  "message": "Berhasil mengambil semua data mitra",
  "page": 1,
  "totalPages": 3,
  "totalData": 24,
  "data": [
    {
      "_id": "id",
      "nama": "Nama Mitra",
      "no_telp": "081234567890",
      "alamat": "Alamat Mitra",
      "logo": "https://res.cloudinary.com/....jpg"
    }
  ]
}
```

- **Response Error (403)**:

```json
{
  "message": "Token tidak valid atau sudah kedaluwarsa"
}
```

- **Response Error (500)**:

```json
{
  "success": false,
  "message": "Gagal mengambil data mitra",
  "error": "Error message"
}
```

### 3. Get Mitra by ID

- **Method**: `GET`
- **URL**: `/mitra/:id`
- **Deskripsi**: Mendapatkan data mitra berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:

```json
{
  "success": true,
  "message": "Berhasil mendapatkan data mitra",
  "data": {
    "_id": "id",
    "nama": "Mitra A",
    "no_telp": "08123456789",
    "alamat": "Alamat mitra",
    "logo": "https://res.cloudinary.com/...jpg"
  }
}
```

- **Response Error (500)**:

```json
{
  "success": false,
  "message": "Gagal mengambil data mitra",
  "error": "Error message"
}
```

### 4. Update Mitra

- **Method**: `PATCH`
- **URL**: `/mitra/:id`
- **Deskripsi**: Memperbarui data mitra berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:

  - `nama` (text)
  - `no_telp` (text)
  - `alamat` (text)
  - `logo` (file)

- **Response Success (200)**:

```json
{
  "success": true,
  "message": "Berhasil memperbarui data mitra",
  "data": {
    "_id": "id",
    "nama": "Nama Mitra Baru",
    "no_telp": "No Telepon Baru",
    "alamat": "Alamat Baru Mitra"
    "logo": "https://res.cloudinary.com/...jpg"
  }
}
```

- **Response Error (500)**:

```json
{
  "success": false,
  "message": "Gagal memperbarui data mitra",
  "error": "Error message"
}
```

### 5. Delete Mitra

- **Method**: `DELETE`
- **URL**: `/mitra/:id`
- **Deskripsi**: Menghapus data mitra berdasarkan ID.
- **Headers**:

  - `Authorization: Bearer <token>`

- **Response Success (200)**:

```json
{
  "success": true,
  "message": "Mitra berhasil dihapus"
}
```

- **Response Error (500)**:

```json
{
  "success": false,
  "message": "Gagal menghapus mitra",
  "error": "Error message"
}
```

### 6. Delete All Mitra

- **Method**: `DELETE`
- **URL**: `/mitra`
- **Deskripsi**: Menghapus semua data mitra.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:

```json
{
  "success": true,
  "message": "Semua mitra berhasil dihapus",
  "deletedCount": 15
}
```

- **Response Error (500)**:

```json
{
  "success": false,
  "message": "Gagal menghapus semua mitra",
  "error": "Error message"
}
```

## Kategori API

### 1. Create Kategori

- **Method**: `POST`
- **URL**: `/kategori`
- **Deskripsi**: Membuat kategori baru.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:

  ```json
  {
    "nama_kategori": "Nama Kategori"
  }
  ```

- **Response Success (201)**:
  ```json
  {
    "message": "Kategori berhasil dibuat",
    "kategori": {
      "_id": "id",
      "nama_kategori": "Nama Kategori"
    }
  }
  ```

### 2. Get All Kategori

- **Method**: `GET`
- **URL**: `/kategori`
- **Deskripsi**: Mendapatkan semua data kategori.
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data kategori",
    "kategori": [
      {
        "_id": "id",
        "nama_kategori": "Nama Kategori"
      }
    ]
  }
  ```

### 3. Get Kategori by ID

- **Method**: `GET`
- **URL**: `/kategori/:id`
- **Deskripsi**: Mendapatkan data kategori berdasarkan ID.
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mendapatkan data kategori",
    "kategori": {
      "_id": "id",
      "nama_kategori": "Nama Kategori"
    }
  }
  ```

### 4. Update Kategori

- **Method**: `PATCH`
- **URL**: `/kategori/:id`
- **Deskripsi**: Memperbarui data kategori berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "nama_kategori": "Nama Kategori Baru"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil memperbarui data kategori",
    "data": {
      "_id": "id",
      "nama_kategori": "Nama Kategori Baru"
    }
  }
  ```

### 5. Delete Kategori

- **Method**: `DELETE`
- **URL**: `/kategori/:id`
- **Deskripsi**: Menghapus data kategori berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil menghapus kategori"
  }
  ```

### 6. Delete All Kategori

- **Method**: `DELETE`
- **URL**: `/kategori`
- **Deskripsi**: Menghapus semua data kategori.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil menghapus semua kategori"
  }
  ```

## Bantuan API

### 1. Create Bantuan

- **Method**: `POST`
- **URL**: `/bantuan`
- **Deskripsi**: Membuat bantuan baru.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `kategori_id` (text)
  - `mitra_id` (text)
  - `judul` (text)
  - `deskripsi` (text)
  - `syarat` (text)
  - `jumlah penerima` (text)
  - `jangkauan` (text)
  - `bentuk_bantuan` (text)
  - `nominal` (text)
  - `periode_mulai` (text),
  - `periode_berakhir` (text),
  - `foto` (file)
- **Response Success (201)**:
  ```json
  {
    "success": true,
    "message": "Bantuan berhasil dibuat",
    "data": {
      "_id": "id",
      "kategori_id": "id_kategori",
      "mitra_id": "id_mitra",
      "judul": "Nama Bantuan",
      "deskripsi": "Deskripsi Bantuan",
      "syarat": "Syarat Bantuan",
      "jumlah_penerima": "Jumlah Penerima",
      "jangkauan": "Jangkauan Bantuan",
      "bentuk_bantuan": "Bentuk Bantuan",
      "nominal": "Nominal Bantuan",
      "periode_mulai": "Periode Mulai",
      "periode_berakhir": "Periode Berakhir",
      "is_active": true,
      "foto": "url_foto"
    }
  }
  ```

### 2. Get All Bantuan

- **Method**: `GET`
- **URL**: `/bantuan`
- **Deskripsi**: Mendapatkan semua data bantuan.
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data bantuan",
    "data": [
      {
        "_id": "id",
        "kategori": {
          "_id": "id_kategori",
          "nama": "Nama Kategori"
        },
        "mitra": {
          "_id": "id_mitra",
          "nama": "Nama Mitra"
        },
        "judul": "Nama Bantuan",
        "deskripsi": "Deskripsi Bantuan",
        "syarat": "Syarat Bantuan",
        "jumlah_penerima": "Jumlah Penerima",
        "jangkauan": "Jangkauan Bantuan",
        "bentuk_bantuan": "Bentuk Bantuan",
        "nominal": "Nominal Bantuan",
        "periode_mulai": "Periode Mulai",
        "periode_berakhir": "Periode Berakhir",
        "is_active": true,
        "foto": "url_foto"
      }
    ]
  }
  ```

### 3. Get Bantuan by ID

- **Method**: `GET`
- **URL**: `/bantuan/:id`
- **Deskripsi**: Mendapatkan data bantuan berdasarkan ID.
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mendapatkan data bantuan",
    "data": {
      "_id": "id",
      "kategori": {
        "_id": "id_kategori",
        "nama": "Nama Kategori"
      },
      "mitra": {
        "_id": "id_mitra",
        "nama": "Nama Mitra"
      },
      "judul": "Nama Bantuan",
      "deskripsi": "Deskripsi Bantuan",
      "syarat": "Syarat Bantuan",
      "jumlah_penerima": "Jumlah Penerima",
      "jangkauan": "Jangkauan Bantuan",
      "bentuk_bantuan": "Bentuk Bantuan",
      "nominal": "Nominal Bantuan",
      "periode_mulai": "Periode Mulai",
      "periode_berakhir": "Periode Berakhir",
      "is_active": true,
      "foto": "url_foto"
    }
  }
  ```

### 4. Update Bantuan

- **Method**: `PATCH`
- **URL**: `/bantuan/:id`
- **Deskripsi**: Memperbarui data bantuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `kategori_id` (text)
  - `mitra_id` (text)
  - `judul` (text)
  - `deskripsi` (text)
  - `foto` (file)
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil memperbarui data bantuan",
    "data": {
      "_id": "id",
      "kategori_id": "id_kategori",
      "mitra_id": "id_mitra",
      "judul": "Nama Bantuan Baru",
      "deskripsi": "Deskripsi Bantuan Baru",
      "foto": "url_foto_baru"
    }
  }
  ```

### 5. Delete Bantuan

- **Method**: `DELETE`
- **URL**: `/bantuan/:id`
- **Deskripsi**: Menghapus data bantuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "message": "Bantuan berhasil dihapus"
  }
  ```

### 6. Delete All Bantuan

- **Method**: `DELETE`
- **URL**: `/bantuan`
- **Deskripsi**: Menghapus semua data bantuan.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "success": true,
    "message": "Semua bantuan berhasil dihapus"
  }
  ```

## Pengajuan Bantuan API

### 1. Create Pengajuan

- **Method**: `POST`
- **URL**: `/pengajuan`
- **Deskripsi**: Membuat pengajuan bantuan baru.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "bantuan_id": "id_bantuan"
  }
  ```
- **Response Success (201)**:
  ```json
  {
    "message": "Pengajuan berhasil dibuat",
    "pengajuan": {
      "_id": "id_pengajuan",
      "user_id": "id_user",
      "bantuan_id": "id_bantuan",
      "status_pengajuan": "diproses",
      "catatan_admin": null
    }
  }
  ```

### 2. Get All Pengajuan

- **Method**: `GET`
- **URL**: `/pengajuan`
- **Deskripsi**: Mendapatkan semua data pengajuan.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data pengajuan",
    "pengajuan": [
      {
        "_id": "id_pengajuan",
        "user_id": {
          "_id": "id_user",
          "nama": "Nama User",
          "username": "username_user",
          "no_telp": "no telp user"
        },
        "bantuan_id": {
          "_id": "id_bantuan",
          "judul": "Nama Bantuan",
          "bentuk_bantuan": "Bentuk bantuan"
        },
        "status_pengajuan": "diproses",
        "catatan_admin": null
      }
    ]
  }
  ```

### 3. Get All Pengajuan by User

- **Method**: `GET`
- **URL**: `/pengajuan/user`
- **Deskripsi**: Mendapatkan semua data pengajuan berdasarkan user yang login.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data pengajuan",
    "pengajuan": [
      {
        "_id": "id_pengajuan",
        "user_id": "id_user",
        "bantuan_id": {
          "_id": "id_bantuan",
          "judul": "Nama Bantuan",
          "bentuk_bantuan": "Bentuk bantuan"
        },
        "status_pengajuan": "pending",
        "catatan_admin": null
      }
    ]
  }
  ```

### 4. Get Pengajuan by ID

- **Method**: `GET`
- **URL**: `/pengajuan/:id`
- **Deskripsi**: Mendapatkan data pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mendapatkan data pengajuan",
    "pengajuan": {
      "_id": "id_pengajuan",
      "user": {
        "_id": "id_user",
        "nama": "Nama User",
        "username": "username_user",
        "no_telp": "no telp user",
        "alamat": "alamat user"
      },
      "bantuan": {
        "_id": "id_bantuan",
        "judul": "Nama Bantuan",
        "deskripsi": "Deskripsi bantuan",
        "bentuk_bantuan": "Bentuk bantuan"
      },
      "status_pengajuan": "diproses",
      "catatan_admin": null
    }
  }
  ```

### 5. Update Status Pengajuan

- **Method**: `PATCH`
- **URL**: `/pengajuan/:id/status`
- **Deskripsi**: Memperbarui status pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "status_pengajuan": "selesai",
    "catatan_admin": "Bantuan sudah diterima oleh penerima"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "message": "Status pengajuan berhasil diperbarui",
    "data": {
      "_id": "id_pengajuan",
      "user": {
        "_id": "id_user",
        "nama": "Nama User"
      },
      "bantuan": {
        "_id": "id_bantuan",
        "judul": "Nama Bantuan"
      },
      "status_pengajuan": "selesai",
      "catatan_admin": "Bantuan sudah diterima oleh penerima"
    }
  }
  ```

### 6. Delete Pengajuan

- **Method**: `DELETE`
- **URL**: `/pengajuan/:id`
- **Deskripsi**: Menghapus data pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil menghapus data pengajuan"
  }
  ```

## Tracking Pengajuan API

### 1. Create Tracking Pengajuan

- **Method**: `POST`
- **URL**: `/tracking-pengajuan`
- **Deskripsi**: Membuat tracking pengajuan baru.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "pengajuan_id": "id_pengajuan",
    "status": "Status Tracking",
    "keterangan": "Keterangan Tracking"
  }
  ```
- **Response Success (201)**:
  ```json
  {
    "message": "Tracking pengajuan berhasil ditambahkan",
    "data": {
      "_id": "id_tracking",
      "pengajuan_id": "id_pengajuan",
      "status": "Status Tracking",
      "keterangan": "Keterangan Tracking"
    }
  }
  ```

### 2. Get All Tracking Pengajuan

- **Method**: `GET`
- **URL**: `/tracking-pengajuan`
- **Deskripsi**: Mendapatkan semua data tracking pengajuan.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Data tracking berhasil diambil",
    "data": [
      {
        "_id": "id_tracking",
        "pengajuan_id": {
          "_id": "id_pengajuan",
          "user_id": {
            "_id": "id_user",
            "nama": "Nama User",
            "username": "username_user"
          },
          "bantuan_id": {
            "_id": "id_bantuan",
            "judul": "Nama Bantuan"
          },
          "status_pengajuan": "Status Pengajuan",
          "catatan_admin": "Catatan Pengajuan dari Admin"
        },
        "status": "Status Tracking",
        "keterangan": "Keterangan Tracking"
      }
    ]
  }
  ```

### 3. Get Tracking Pengajuan by ID

- **Method**: `GET`
- **URL**: `/tracking-pengajuan/:id`
- **Deskripsi**: Mendapatkan data tracking pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Detail tracking berhasil diambil",
    "data": [
      {
        "_id": "id_tracking",
        "pengajuan_id": {
          "_id": "id_pengajuan",
          "user_id": {
            "_id": "id_user",
            "nama": "Nama User",
            "username": "username_user"
          },
          "bantuan_id": {
            "_id": "id_bantuan",
            "judul": "Nama Bantuan"
          },
          "status_pengajuan": "Status Pengajuan",
          "catatan_admin": "Catatan Pengajuan dari Admin"
        },
        "status": "Status Tracking",
        "keterangan": "Keterangan Tracking"
      }
    ]
  }
  ```

### 4. Update Tracking Pengajuan

- **Method**: `PATCH`
- **URL**: `/tracking-pengajuan/:id`
- **Deskripsi**: Memperbarui data tracking pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "status": "Status Tracking Baru",
    "keterangan": "Catatan Tracking Baru"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "message": "Tracking pengajuan berhasil diperbarui",
    "data": {
      "_id": "id_tracking",
      "pengajuan_id": "id_pengajuan",
      "status": "Status Tracking Baru",
      "tanggal": "Tanggal tracking pengajuan diperbarui",
      "keterangan": "Catatan Tracking Baru"
    }
  }
  ```

### 5. Delete Tracking Pengajuan

- **Method**: `DELETE`
- **URL**: `/tracking-pengajuan/:id`
- **Deskripsi**: Menghapus data tracking pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Tracking berhasil dihapus"
  }
  ```

## Form Pengajuan API

### 1. Create Form Pengajuan

- **Method**: `POST`
- **URL**: `/form-pengajuan`
- **Deskripsi**: Membuat form pengajuan baru.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "kategori_id": "Kategori ID",
    "bantuan_id": "id_bantuan",
    "nama_field": "Field Pertanyaan",
    "type_field": "text",
    "is_required": true,
    "opsi": [],
    "is_general": false
  }
  ```
- **Response Success (201)**:
  ```json
  {
    "message": "Form pengajuan berhasil dibuat",
    "data": {
      "_id": "id_form",
      "kategori_id": "Kategori ID",
      "bantuan_id": "id_bantuan",
      "nama_field": "Field Pertanyaan",
      "type_field": "text",
      "is_required": true,
      "opsi": [],
      "is_general": false
    }
  }
  ```

### 2. Get All Form Pengajuan

- **Method**: `GET`
- **URL**: `/form-pengajuan`
- **Deskripsi**: Mendapatkan semua data form pengajuan.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data form pengajuan",
    "data": [
      {
        "_id": "id_form",
        "kategori_id": {
          "_id": "id_kategori",
          "nama_kategori": "Nama Kategori"
        },
        "bantuan_id": "id_bantuan",
        "nama_field": "Field Pertanyaan",
        "type_field": "text",
        "is_required": true,
        "opsi": [],
        "is_general": false
      }
    ]
  }
  ```

### 3. Get Form Pengajuan by ID

- **Method**: `GET`
- **URL**: `/form-pengajuan/:id`
- **Deskripsi**: Mendapatkan data form pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mendapatkan data form pengajuan",
    "data": {
      "_id": "id_form",
      "kategori_id": {
        "_id": "id_kategori",
        "nama_kategori": "Nama Kategori"
      },
      "bantuan_id": "id_bantuan",
      "nama_field": "Field Pertanyaan",
      "type_field": "text",
      "is_required": true,
      "opsi": [],
      "is_general": false
    }
  }
  ```

### 4. Update Form Pengajuan

- **Method**: `PATCH`
- **URL**: `/form-pengajuan/:id`
- **Deskripsi**: Memperbarui data form pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "kategori_id": "Kategori ID",
    "bantuan_id": "id_bantuan",
    "nama_field": "Field Pertanyaan",
    "type_field": "text",
    "is_required": true,
    "opsi": [],
    "is_general": false
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "message": "Form pengajuan berhasil diperbarui",
    "data": {
      "_id": "id_form",
      "kategori_id": "Kategori ID",
      "bantuan_id": "id_bantuan",
      "nama_field": "Field Pertanyaan",
      "type_field": "text",
      "is_required": true,
      "opsi": [],
      "is_general": false
    }
  }
  ```

### 5. Delete Form Pengajuan

- **Method**: `DELETE`
- **URL**: `/form-pengajuan/:id`
- **Deskripsi**: Menghapus data form pengajuan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Form pengajuan berhasil dihapus"
  }
  ```

## Jawaban Form API

### 1. Create Jawaban Form

- **Method**: `POST`
- **URL**: `/jawaban-form`
- **Deskripsi**: Membuat jawaban form baru.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `pengajuan_id`(text)
  - `form_id` (text)
  - `jawaban` (text/file)
- **Response Success (201)**:
  ```json
  {
    "message": "Jawaban form berhasil ditambahkan",
    "data": {
      "_id": "id_jawaban",
      "pengajuan_id": "id_pengajuan",
      "form_id": "id_form",
      "jawaban": "jawaban"
    }
  }
  ```

### 2. Get All Jawaban Form

- **Method**: `GET`
- **URL**: `/jawaban-form`
- **Deskripsi**: Mendapatkan semua data jawaban form.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil semua jawaban form",
    "data": [
      {
        "_id": "id_jawaban",
        "pengajuan_id": {
          "_id": "id_pengajuan",
          "user_id": {
            "_id": "id_user",
            "nama": "Nama User",
            "username": "username"
          },
          "status_pengajuan": "status_pengajuan"
        },
        "form_id": {
          "_id": "id_form",
          "nama_field": "Field Pertanyaan",
          "type_field": "text",
          "is_required": true
        },
        "jawaban": "jawaban"
      }
    ]
  }
  ```

### 3. Get Jawaban Form by ID

- **Method**: `GET`
- **URL**: `/jawaban-form/:id`
- **Deskripsi**: Mendapatkan data jawaban form berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data jawaban form",
    "data": [
      {
        "_id": "id_jawaban",
        "pengajuan_id": {
          "_id": "id_pengajuan",
          "user_id": {
            "_id": "id_user",
            "nama": "Nama User",
            "username": "username"
          },
          "status_pengajuan": "status_pengajuan"
        },
        "form_id": {
          "_id": "id_form",
          "nama_field": "Field Pertanyaan",
          "type_field": "text",
          "is_required": true
        },
        "jawaban": "jawaban"
      }
    ]
  }
  ```

### 4. Update Jawaban Form

- **Method**: `PATCH`
- **URL**: `/jawaban-form/:id`
- **Deskripsi**: Memperbarui data jawaban form berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `pengajuan_id`(text)
  - `form_id` (text)
  - `jawaban` (text/file)
- **Response Success (200)**:
  ```json
  {
    "message": "Jawaban form berhasil diperbarui",
    "data": {
      "_id": "id_jawaban",
      "pengajuan_id": "id_pengajuan",
      "form_id": "id_form",
      "jawaban": "jawaban"
    }
  }
  ```

### 5. Delete Jawaban Form

- **Method**: `DELETE`
- **URL**: `/jawaban-form/:id`
- **Deskripsi**: Menghapus data jawaban form berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Jawaban form berhasil dihapus"
  }
  ```

## Bukti Penerimaan Bantuan API

### 1. Create Bukti Penerimaan

- **Method**: `POST`
- **URL**: `/bukti-penerimaan`
- **Deskripsi**: Membuat bukti penerimaan bantuan baru.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `pengajuan_id`(text)
  - `foto` (file)
  - `keterangan` (text)
- **Response Success (201)**:
  ```json
  {
    "message": "Bukti penerimaan berhasil ditambahkan",
    "data": {
      "_id": "id_bukti",
      "pengajuan_id": "id_pengajuan",
      "foto": "url_foto_bukti",
      "keterangan": "keterangan",
      "status_verifikasi": "diverifikasi"
    }
  }
  ```

### 2. Get All Bukti Penerimaan

- **Method**: `GET`
- **URL**: `/bukti-penerimaan`
- **Deskripsi**: Mendapatkan semua data bukti penerimaan.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil semua bukti penerimaan",
    "count": 1,
    "data": {
      "_id": "id_bukti",
      "pengajuan_id": {
        "_id": "id_pengajuan",
        "status_pengajuan": "status_pengajuan"
      },
      "foto": "url_foto_bukti",
      "keterangan": "keterangan",
      "status_verifikasi": "diverifikasi",
      "foto": "url_foto_bukti"
    }
  }
  ```

### 3. Get Bukti Penerimaan by ID

- **Method**: `GET`
- **URL**: `/bukti-penerimaan/:id`
- **Deskripsi**: Mendapatkan data bukti penerimaan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data bukti penerimaan",
    "data": {
      "_id": "id_bukti",
      "pengajuan_id": {
        "_id": "id_pengajuan",
        "status_pengajuan": "status_pengajuan"
      },
      "foto": "url_foto_bukti",
      "keterangan": "keterangan",
      "status_verifikasi": "diverifikasi",
      "foto": "url_foto_bukti"
    }
  }
  ```

### 4. Update Bukti Penerimaan

- **Method**: `PATCH`
- **URL**: `/bukti-penerimaan/:id`
- **Deskripsi**: Memperbarui data bukti penerimaan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `pengajuan_id`(text)
  - `foto` (file)
  - `keterangan` (text)
- **Response Success (200)**:
  ```json
  {
    "message": "Bukti penerimaan berhasil diperbarui",
    "data": {
      "_id": "id_bukti",
      "pengajuan_id": "id_pengajuan",
      "foto": "url_foto_bukti_baru",
      "keterangan": "keterangan baru",
      "status_verifikasi": "status verifikasi baru"
    }
  }
  ```

### 5. Verify Bukti Penerimaan

- **Method**: `PATCH`
- **URL**: `/bukti-penerimaan/:id/verify`
- **Deskripsi**: Memverifikasi bukti penerimaan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Bukti penerimaan berhasil disetujui oleh admin",
    "data": {
      "_id": "id_bukti",
      "pengajuan_id": "id_pengajuan",
      "foto": "url_foto_bukti",
      "keterangan": "keterangan",
      "status_verifikasi": "status verifikasi",
      "catatan_admin": "catatan"
    }
  }
  ```

### 6. Delete Bukti Penerimaan

- **Method**: `DELETE`
- **URL**: `/bukti-penerimaan/:id`
- **Deskripsi**: Menghapus data bukti penerimaan berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Bukti penerimaan berhasil dihapus"
  }
  ```

## Testimoni API

### 1. Create Testimoni

- **Method**: `POST`
- **URL**: `/testimoni`
- **Deskripsi**: Membuat testimoni baru.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `pengajuan_id` (text)
  - `foto` (file)
  - `keterangan` (text)
- **Response Success (201)**:
  ```json
  {
    "message": "Testimoni berhasil ditambahkan",
    "data": {
      "pengajuan_id": "id_pengajuan",
      "foto": "url_foto_testimoni",
      "keterangan": "Isi Testimoni"
    }
  }
  ```

### 2. Get All Testimoni

- **Method**: `GET`
- **URL**: `/testimoni`
- **Deskripsi**: Mendapatkan semua data testimoni.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil semua testimoni",
    "count": 1,
    "data": {
      "_id": "id_testimoni",
      "pengajuan_id": {
        "_id": "id_pengajuan",
        "status_pengajuan": "status_pengajuan"
      },
      "foto": "url_foto_testimoni",
      "keterangan": "Isi Testimoni"
    }
  }
  ```

### 3. Get Testimoni by ID

- **Method**: `GET`
- **URL**: `/testimoni/:id`
- **Deskripsi**: Mendapatkan data testimoni berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Berhasil mengambil data testimoni",
    "data": {
      "_id": "id_testimoni",
      "pengajuan_id": {
        "_id": "id_pengajuan",
        "status_pengajuan": "status_pengajuan"
      },
      "foto": "url_foto_testimoni",
      "keterangan": "Isi Testimoni"
    }
  }
  ```

### 4. Update Testimoni

- **Method**: `PATCH`
- **URL**: `/testimoni/:id`
- **Deskripsi**: Memperbarui data testimoni berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `pengajuan_id` (text)
  - `foto` (file)
  - `keterangan` (text)
- **Response Success (200)**:
  ```json
  {
    "message": "Testimoni berhasil diperbarui",
    "data": {
      "pengajuan_id": "id_pengajuan",
      "foto": "url_foto_testimoni_baru",
      "keterangan": "Isi Testimoni Baru"
    }
  }
  ```

### 5. Delete Testimoni

- **Method**: `DELETE`
- **URL**: `/testimoni/:id`
- **Deskripsi**: Menghapus data testimoni berdasarkan ID.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response Success (200)**:
  ```json
  {
    "message": "Testimoni berhasil dihapus"
  }
  ```

## Her-AI API

### 1. Ask Her-AI

- **Method**: `POST`
- **URL**: `/her-ai`
- **Deskripsi**: Mengirimkan pertanyaan ke Her-AI.
- **Request Body**:
  ```json
  {
    "question": "Pertanyaan Anda"
  }
  ```
- **Response Success (200)**:
  ```json
  {
    "answer": "Jawaban dari Her-AI"
  }
  ```
