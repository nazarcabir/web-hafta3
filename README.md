# BEUBlog - Modern Full-Stack Blog Platformu

BEUBlog, React ve Node.js kullanılarak geliştirilmiş, modern bir kullanıcı deneyimi sunan, tam kapsamlı bir blog platformudur. Bu proje, istenen tüm gereksinimleri karşılamak üzere, temiz kod prensipleri ve şık bir tasarım anlayışıyla sıfırdan inşa edilmiştir.

## 🚀 Öne Çıkan Özellikler

-   **✨ Şık Tasarım**: Glassmorphism ve modern UI/UX prensipleriyle tasarlanmış premium frontend.
-   **🌓 Dinamik Tema**: Koyu (Dark) ve Aydınlık (Light) mod desteği (Sistem tercihine duyarlı).
-   **📝 Zengin Metin Editörü**: React Quill entegrasyonu ile WYSIWYG yazı oluşturma deneyimi.
-   **🔐 Güvenli Kimlik Doğrulama**: JWT (JSON Web Token) ve bcryptjs ile güvenli giriş/kayıt sistemi.
-   **📸 Görsel Yönetimi**: Multer ile 10MB limitli akıllı görsel yükleme (JPEG, PNG, WebP, SVG).
-   **🛡️ Moderasyon ve Roller**: Kullanıcı ve Admin rolleri, yazı onay/askıya alma mekanizması.
-   **🔍 SEO Dostu**: Slugify ile otomatik URL (slug) oluşturma.
-   **🐳 Docker Desteği**: Production build için optimize edilmiş Docker ve Docker Compose yapılandırması.

## 🛠️ Teknoloji Yığını

### Frontend
-   **React 18 + Vite** (Yüksek performanslı build)
-   **React Router DOM** (SPA Yönlendirme)
-   **React Quill** (Zengin Metin Editörü)
-   **Axios** (API İstemcisi)
-   **Lucide React** (Modern İkon Seti)
-   **Vanilla CSS** (CSS Variables & Glassmorphism)

### Backend
-   **Node.js + Express 5** (RESTful API)
-   **MongoDB + Mongoose** (Veritabanı & ODM)
-   **JWT** (Authentication)
-   **Multer** (Dosya Yükleme)
-   **Bcryptjs** (Parola Şifreleme)

## 📋 Tamamlanan Görevler (Completed Tasks)

İstediğin tüm adımlar başarıyla tamamlandı:
-   [x] Proje mimarisi planlandı ve implementation plan oluşturuldu.
-   [x] Node.js, Git ve MongoDB kurulumları doğrulandı/yapıldı.
-   [x] Backend REST API (Auth, Posts, Categories, Upload) geliştirildi.
-   [x] Frontend SPA (React + Vite) modern UI tasarımıyla kodlandı.
-   [x] Dark/Light mode ve Tema Context yapısı kuruldu.
-   [x] Yazı beğenme, kategori filtreleme ve arama altyapısı eklendi.
-   [x] Dockerfile ve docker-compose yapılandırmaları tamamlandı.
-   [x] Proje yerel Git deposuna alındı ve GitHub reposuna (`main` branch) push edildi.

## 🔧 Kurulum ve Çalıştırma

### Docker ile (Önerilen)
Projenin en güncel ve kararlı hali için Docker kullanmanız önerilir:

```bash
# Servisleri ayağa kaldır
docker compose up --build -d
```

-   **Frontend:** `http://localhost`
-   **Backend API:** `http://localhost:5000`

### Manuel Kurulum

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📜 Lisans
Bu proje eğitim ve portfolyo amacıyla geliştirilmiştir.

---
Geliştiren: **Antigravity AI** & **nazarcabir**
