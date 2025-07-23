# 🍞 Bakery Management System - Backend API

Bu proje, fırın yönetim sistemi için Express.js tabanlı REST API'dir. Kullanıcıların malzemelerini, tariflerini yönetebileceği ve maliyet hesaplamaları yapabileceği bir sistemdir.

## 🚀 Özellikler

- **Authentication & Authorization**: JWT tabanlı kullanıcı girişi ve yetkilendirme
- **User Management**: Kullanıcı kaydı, girişi ve profil yönetimi
- **Ingredient Management**: Malzeme ekleme, düzenleme, silme ve stok takibi
- **Recipe Management**: Tarif oluşturma, düzenleme ve maliyet hesaplama
- **Measurement Units**: Ölçü birimleri yönetimi ve dönüşüm
- **Dashboard**: Özet bilgiler, istatistikler ve maliyet analizi
- **Cost Analysis**: Tarif bazında detaylı maliyet hesaplama
- **MongoDB Integration**: Mongoose ile veritabanı entegrasyonu

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel veya cloud)
- npm veya yarn

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Environment değişkenlerini ayarlayın:**
   ```bash
   # .env dosyası oluşturun
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bakery
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   ```

3. **MongoDB'yi başlatın:**
   ```bash
   # Yerel MongoDB için
   mongod
   
   # Veya MongoDB Atlas kullanın
   ```

4. **Uygulamayı başlatın:**
   ```bash
   # Development modu
   npm run dev
   
   # Production modu
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgileri

### Users
- `GET /api/users` - Tüm kullanıcılar (Admin)
- `PUT /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil (Admin)

### Ingredients
- `GET /api/ingredients` - Tüm malzemeler
- `GET /api/ingredients/:id` - Tek malzeme
- `POST /api/ingredients` - Yeni malzeme
- `PUT /api/ingredients/:id` - Malzeme güncelle
- `DELETE /api/ingredients/:id` - Malzeme sil

### Recipes
- `GET /api/recipes` - Tüm tarifler
- `GET /api/recipes/:id` - Tek tarif
- `POST /api/recipes` - Yeni tarif oluştur
- `PUT /api/recipes/:id` - Tarif güncelle
- `DELETE /api/recipes/:id` - Tarif sil
- `GET /api/recipes/:id/cost-analysis` - Tarif maliyet analizi

### Measurements
- `GET /api/measurements` - Ölçü birimleri
- `GET /api/measurements/categories` - Ölçü kategorileri
- `POST /api/measurements/convert` - Birim dönüşümü

### Dashboard
- `GET /api/dashboard` - Dashboard özet bilgileri
- `GET /api/dashboard/recipe-stats` - Tarif istatistikleri
- `GET /api/dashboard/ingredient-stats` - Malzeme istatistikleri
- `GET /api/dashboard/cost-analysis` - Maliyet analizi özeti

### Health Check
- `GET /api/health` - API durumu

## 🔐 Authentication

API, JWT (JSON Web Token) kullanır. Protected route'lar için Authorization header'ında Bearer token gönderilmelidir:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Veritabanı Modelleri

### User
- username, email, password
- role (user/admin)
- isActive

### Ingredient
- name, description, category
- unit, price, stock, minStock
- createdBy (User reference)

### Recipe
- name, description, category, difficulty
- preparationTime, cookingTime, servings
- ingredients (array of ingredient references with quantities)
- instructions (array of strings)
- notes
- createdBy (User reference)

## 💰 Maliyet Hesaplama

Sistem otomatik olarak tarif maliyetlerini hesaplar:

- **Toplam Maliyet**: Tarifteki tüm malzemelerin maliyeti
- **Porsiyon Başına Maliyet**: Toplam maliyet / porsiyon sayısı
- **Birim Dönüşümü**: Gram/kg, litre/ml gibi dönüşümler
- **Detaylı Analiz**: Malzeme bazında maliyet dağılımı

## 📈 Dashboard Özellikleri

- **Özet Bilgiler**: Tarif ve malzeme sayıları
- **Son Eklenenler**: Son eklenen tarifler ve malzemeler
- **Stok Durumu**: Kritik stok seviyesindeki malzemeler
- **Maliyet Analizi**: En pahalı tarifler ve ortalama maliyetler
- **İstatistikler**: Kategori bazında dağılımlar

## 🛡️ Güvenlik

- Şifreler bcrypt ile hashlenir
- JWT token'ları güvenli şekilde oluşturulur
- CORS koruması
- Input validation
- Error handling
- Kullanıcı bazlı veri izolasyonu

## 🧪 Test

```bash
# Health check
curl http://localhost:5000/api/health

# Kullanıcı kaydı
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# Kullanıcı girişi
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'

# Malzeme ekleme (token gerekli)
curl -X POST http://localhost:5000/api/ingredients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Un","category":"un","unit":"kilogram","price":15,"stock":10}'
```

## 📝 Lisans

ISC 