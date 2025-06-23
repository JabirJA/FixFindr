Here’s an updated **README.md** draft that reflects **Fix Finder's current architecture (PostgreSQL, Express, React)**, your current/planned features, and correct tooling!

---

# 🛠️ Fix Finder

Fix Finder is an on-demand home repair and contractor booking platform built with the **React + Express + PostgreSQL** stack. It connects users with verified local contractors for repairs, installations, and services, supporting secure bookings, communication, and payments.

---

## 📁 Project Structure

```
fix-finder/
├── fix-finder-frontend/      // React Frontend
├── fix-finder-backend/       // Express + PostgreSQL Backend
├── docs/                     // API docs, workflows
├── .gitignore
└── README.md
```

---

## 🚀 Tech Stack

| Frontend      | Backend            | Other Tools           |
| ------------- | ------------------ | --------------------- |
| React         | Node.js + Express  | PostgreSQL            |
| CSS / SCSS    | JWT Authentication | Paystack (Payments)   |
| React Router  | RESTful APIs       | Cloudinary (Media)    |
| Axios         | Bcrypt             | Dotenv                |
| React Context | Joi (Validation)   | Postman (API Testing) |

---

## 🧭 Features (MVP)

✅ **Implemented**

* 👤 User & Contractor registration/login (JWT-based auth)
* 📆 Booking system with contractor pricing
* ✅ Contractor availability management
* 🛠️ Proof of job completion upload
* 💳 Integrated Paystack payment workflow
* 🛡️ Admin dashboard for contractor management

🚧 **Planned / In Progress**

* 💬 User-Contractor messaging system
* ✉️ Email & SMS notifications
* ⭐ Ratings & reviews system
* 📊 Admin analytics dashboard
* 📱 Mobile app (React Native)

---

## 📌 Available Services

```
🛢️ Gas Delivery  
🧊 Refrigerator/Freezer Repair  
🐜 Pest Control  
🚰 Water Tanker Delivery  
🔆 Inverter/Solar Technician  
🎨 House Painting  
🧹 House Cleaning  
📷 CCTV Installation  
🛠️ Handyman  
```

---

## 🌐 API Endpoints (Sample)

**Base URL:** `http://localhost:5050/api`

### 🔐 Auth

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | /auth/register | Register user/contractor |
| POST   | /auth/login    | Login + receive token    |

### 👤 User

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| GET    | /user/me       | Get current user profile |
| GET    | /user/bookings | Get user bookings        |

### 🛠️ Contractor

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| PATCH  | /contractor/available         | Toggle contractor availability |
| POST   | /contractor/job-complete/\:id | Upload job completion proof    |

### 📆 Booking

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | /bookings              | Create a new booking       |
| PATCH  | /bookings/\:id/confirm | Confirm + finalize payment |

---

## ⚙️ Getting Started (Development)

### 🔧 Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL (local or cloud instance)
* Paystack developer account

---

### 📦 Backend Setup

```bash
cd fix-finder-backend
npm install
cp .env.example .env   # Fill in POSTGRES_URI, JWT_SECRET, PAYSTACK_KEY, etc.
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd fix-finder-frontend
npm install
npm run dev
```

---

## 📌 Roadmap

* [ ] User-contractor messaging system
* [ ] Ratings & reviews
* [ ] SMS/email notifications
* [ ] Admin analytics dashboard
* [ ] Mobile app (React Native)

---

## 🧑‍💻 Author

**Fix Finder Project**
🚀 Built for connecting customers with trusted contractors.

---

## 📄 License

This project is licensed under the **MIT License**.
