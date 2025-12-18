# 🚗 Vehicle Rental System – Backend API

A complete backend solution for managing a **vehicle rental system**, including vehicle inventory, customers, bookings, authentication, and role-based authorization.

---

## 🔗 Live API URL
https://vehiclerentalsystem-seven.vercel.app/

---

## 🎯 Project Overview

This project provides a modular and secure backend API for a vehicle rental system with the following core features:

- **Vehicles Management** – Manage vehicle inventory with availability tracking  
- **Customers Management** – Create and manage customer accounts  
- **Bookings Managements** – Rent vehicles, calculate costs, handle returns  
- **Authentication & Authorization** – JWT-based authentication with role-based access control (Admin/Customer)

The backend is structured using a **clean modular architecture** with separated layers for routes, controllers, and services.

---

## 🛠️ Technology Stack

- **Node.js + TypeScript**  - Language 
- **Express.js** - Framework
- **PostgreSQL** - Database
- **bcrypt** - Hashed Password
- **jsonwebtoken** - JWT(Authentication & Authorization)  
- **pg** - DB ORM

---

## 🗃️ Database Schema

### **Users Table**
| Field | Notes |
|-------|--------|
| id | Auto-generated |
| name | Required |
| email | Required, unique, lowercase |
| password | Hashed using bcrypt |
| phone | Required |
| role | 'admin' or 'customer' |

### **Vehicles Table**
| Field | Notes |
|-------|--------|
| id | Auto-generated |
| vehicle_name | Required |
| type | car, bike, van, SUV |
| registration_number | Unique |
| daily_rent_price | Positive number |
| availability_status | available / booked |

### **Bookings Table**
| Field | Notes |
|-------|--------|
| id | Auto-generated |
| customer_id | FK → Users |
| vehicle_id | FK → Vehicles |
| rent_start_date | Required |
| rent_end_date | Must be after start date |
| total_price | Positive |
| status | active / cancelled / returned |

---

## 🔐 Authentication & Authorization

### **User Roles**
- **Admin** – Full access  
- **Customer** – Limited to own bookings & profile  

### **Auth Flow**
- Signup & Signin via `/api/v1/auth/...`
- Login returns a **JWT token**
- Protected routes require header:
- Middleware validates:
- Token validity  
- Role-based permissions  

---

## 🌐 API Endpoints

### **Authentication**
| Method | Endpoint | Access | Description |
|--------|----------|---------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user |
| POST | `/api/v1/auth/signin` | Public | Login and get JWT token |

---

### **Vehicles**
| Method | Endpoint | Access | Description |
|--------|----------|---------|-------------|
| POST | `/api/v1/vehicles` | Admin | Add vehicle |
| GET | `/api/v1/vehicles` | Public | Get all vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | Get one vehicle |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin | Update vehicle |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin | Delete vehicle |

---

### **Users**
| Method | Endpoint | Access | Description |
|--------|----------|---------|-------------|
| GET | `/api/v1/users` | Admin | View all users |
| PUT | `/api/v1/users/:userId` | Admin/Customer | Update profile or role |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user |

---

### **Bookings**
| Method | Endpoint | Access | Description |
|--------|----------|---------|-------------|
| POST | `/api/v1/bookings` | Customer/Admin | Create booking |
| GET | `/api/v1/bookings` | Role-based | Admin: all, Customer: own |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | Cancel or return |

---
## Setup And Usage Instructions

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```bash
CONNECTION_STRING = 'postgresql://neondb_owner:npg_aNlwHiDUMMY-CONNECTUION-STRINGoler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

PORT = DUMMY-PORT

SECRET = 'c4a09912bDUMMY-SECRET9844aaa6'


```

Start the server

```bash
  npm run dev
```

API base URL: 

```bash
  https://localhost:5000/api/v1
```
## Github Repository

🔗 https://github.com/mohebul123/VehicleRental-System-BackendAPI-.git

## Live Deployment

🔗 https://vehiclerentalsystem-seven.vercel.app/



