Here’s a complete `docs/API.md` file you can copy-paste directly into your project:

```markdown
# 📚 Fix Finder API Documentation

Welcome to the Fix Finder API documentation. This document outlines all available endpoints, their methods, expected request bodies, and responses for both users and contractors.

---

## 🌐 Base URL

```

[http://localhost:5000/api](http://localhost:5000/api)

````

---

## 🔐 Auth Endpoints

### `POST /auth/register`

Register a new user or contractor.

```json
{
  "role": "user", // or "contractor"
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure123"
}
````

### `POST /auth/login`

Authenticate and receive JWT token.

```json
{
  "email": "jane@example.com",
  "password": "secure123"
}
```

**Response:**

```json
{
  "token": "jwt-token",
  "user": {
    "_id": "...",
    "name": "Jane Doe",
    "role": "user"
  }
}
```

---

## 👤 User Endpoints

### `GET /user/me`

Returns the authenticated user's profile.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

### `GET /user/bookings`

Returns all bookings made by the user.

---

## 🛠️ Contractor Endpoints

### `POST /contractor/register`

Create or update contractor profile.

```json
{
  "bio": "Experienced electrician",
  "skills": ["Electrical", "Installation"],
  "location": "Lagos, Nigeria"
}
```

### `PATCH /contractor/available`

Toggle contractor availability.

```json
{
  "available": true
}
```

### `GET /contractor/bookings`

Get all bookings assigned to contractor.

### `POST /contractor/job-complete/:id`

Upload proof of job completion (e.g., images, notes).

```json
{
  "notes": "Job completed successfully.",
  "images": ["https://cloudinary.com/photo.jpg"]
}
```

---

## 📆 Booking Endpoints

### `POST /bookings`

Create a booking request.

```json
{
  "contractorId": "abc123",
  "service": "Fix leaking pipe",
  "location": "Abuja",
  "preferredDate": "2025-05-20"
}
```

### `GET /bookings/:id`

Get details of a specific booking.

### `PATCH /bookings/:id/price`

Contractor sets the final price.

```json
{
  "finalPrice": 7500
}
```

### `PATCH /bookings/:id/confirm`

User confirms the job and proceeds to payment.

---

## 💰 Payment Endpoints

### `POST /payments/initiate`

Start Paystack payment process.

```json
{
  "bookingId": "booking123",
  "amount": 7500
}
```

### `POST /payments/verify`

Verify payment after Paystack redirect.

```json
{
  "reference": "paystack_ref_123"
}
```

### `POST /payments/release/:id`

Admin releases funds to contractor after user approval.

---

## 🛡️ Admin Endpoints

### `GET /admin/complaints`

Retrieve all submitted user complaints.

### `GET /admin/bookings`

Fetch all bookings in the system.

### `POST /admin/release-payment`

Manually release payment.

```json
{
  "bookingId": "booking123"
}
```

---

## 🔒 Authentication & Roles

All protected routes require a JWT token.

**Header format:**

```
Authorization: Bearer <token>
```

Role-based access is enforced:

* `user` – Can create and confirm bookings
* `contractor` – Can set prices and upload proofs
* `admin` – Can view all data and release payments

---

## ❌ Error Response Format

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

## 📫 Need Help?

Contact the maintainer at: `support@fixfinder.dev`

---

Happy Building! 🚀

```

Would you also like a `docs/database-schema.md` for MongoDB models or a Postman collection to go with this?
```
