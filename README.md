<div align="center">
  <h1>💸 UPI Payments Backend API</h1>
  <p>A robust, secure, and lightweight backend for a UPI-like digital wallet and payment system.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black" alt="Swagger" />
  </p>

  <h3>🔗 <a href="https://upi-payements-backend.onrender.com/api-docs/#/">View Live API Documentation</a></h3>
</div>

---

## 📖 Overview

The **UPI Payments Backend API** provides the core infrastructure for simulating a digital wallet platform. It allows users to register, authenticate securely via JWT, manage their wallet balances, and seamlessly transfer funds to other users—mimicking the real-world functionality of UPI (Unified Payments Interface).

## ✨ Key Features

- **🔐 Secure Authentication:** User registration and login utilizing bcrypt for password hashing and JWT (with secure HTTP-only cookies) for session management.
- **💰 Wallet Management:** Endpoints to check current wallet balance and manage digital funds.
- **🔄 Peer-to-Peer Transactions:** Robust transaction system allowing users to instantly send and receive funds.
- **📚 Interactive API Documentation:** Auto-generated Swagger documentation for easy API exploration and testing.
- **🛡️ Data Validation & Error Handling:** Comprehensive request validation and graceful error handling.

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Security:** bcryptjs, jsonwebtoken, cookie-parser, cors
- **Documentation:** swagger-autogen, swagger-ui-express
- **Development:** nodemon, dotenv

## 📂 Project Structure

```text
├── src/
│   ├── app.js             # Express app setup and middleware configuration
│   ├── index.js           # Application entry point and server startup
│   ├── controllers/       # Request handlers (Auth, Txn, Wallet)
│   ├── db/                # Database connection configuration
│   ├── middleware/        # Custom middleware (e.g., Auth verification)
│   ├── models/            # Mongoose schemas (User, Transaction)
│   ├── routes/            # API route definitions
│   └── utils/             # Helper utilities and error classes
├── .env                   # Environment variables (Create this)
├── .sample.env            # Template for environment variables
├── swagger.js             # Swagger autogen configuration
├── swagger_output.json    # Auto-generated Swagger spec
└── package.json           # Dependencies and scripts
```

## 🗄️ Database Models

The core data of the application is powered by two main Mongoose schemas.

### 👤 User Model (`src/models/user.model.js`)
Handles all user identity, authentication, and wallet balances.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| **`_id`** | `ObjectId` | Auto-generated | Unique identifier for the user |
| **`name`** | `String` | **Required** | Full name of the user |
| **`email`** | `String` | **Required**, **Unique** | User's email address |
| **`phone`** | `String` | **Required**, **Unique** | User's phone number |
| **`password`** | `String` | **Required**, Hashed | Encrypted account password |
| **`upiID`** | `String` | **Unique**, Auto | Auto-generated UPI ID (e.g., `name@phonepe`) |
| **`mpin`** | `String` | Hashed | 4-6 digit encrypted PIN for transactions |
| **`balance`** | `Number` | Default: `10000` | Current wallet balance in INR/Paise |
| **`refreshToken`**| `String` | - | JWT token for session persistence |

> **Methods**: `isPasswordCorrect()`, `isMpinCorrect()`, `generateAccessToken()`, `generateRefreshToken()`  
> **Hooks**: Automatically hashes the `password` and `mpin` before saving. Dynamically generates a `upiID` using the user's email if not explicitly provided.

<br>

### 💸 Transaction Model (`src/models/transaction.model.js`)
Serves as the ledger tracking the movement of funds between users.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| **`_id`** | `ObjectId` | Auto-generated | Unique identifier for the transaction |
| **`sender`** | `ObjectId` | **Required**, Ref: `User`| The user initiating the transfer |
| **`receiver`** | `ObjectId` | Ref: `User` | The user receiving the funds |
| **`type`** | `String` | Enum, Default: `TRANSFER`| `TRANSFER`, `ADD_MONEY`, `WITHDRAW`, `BILL_PAY` |
| **`amount`** | `Number` | **Required** | The transaction amount |
| **`status`** | `String` | Enum, Default: `SUCCESS` | `SUCCESS`, `FAILED`, `PENDING` |

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster, here we are using MongoDB Atlas)

### 2. Clone and Install
Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd UPI-payements-backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory. You can use `.sample.env` as a reference:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port on which the server runs | `3000` |
| `MONGODB_URI` | MongoDB connection string (Atlas or Local) | `mongodb+srv://...` |
| `DB_NAME` | Name of the database | `upi_wallet` |
| `ACCESS_TOKEN_SECRET` | Secret key for signing access JWTs | `your_secret_key` |
| `ACCESS_TOKEN_EXPIRY` | Expiration time for access token | `15m`, `1d` |
| `REFRESH_TOKEN_SECRET` | Secret key for signing refresh JWTs | `your_refresh_secret` |
| `REFRESH_TOKEN_EXPIRY` | Expiration time for refresh token | `7d` |

> [!TIP]
> A `.sample.env` file is provided in the repository. Simply copy its contents to a `.env` file and fill in your details.

### 4. Generate API Documentation
Before starting the server, generate the Swagger documentation file:

```bash
npm run swagger
```

### 5. Start the Development Server
Run the app in development mode using Nodemon:

```bash
npm run dev
```

The server should now be running on `http://localhost:3000`.

## 🌐 API Endpoints

### 1. Swagger UI
You can access the interactive Swagger UI to explore and test the endpoints visually:
- **🌍 Live Demo:** 👉 **[https://upi-payements-backend.onrender.com/api-docs](https://upi-payements-backend.onrender.com/api-docs)**
- **💻 Local:** 👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)** (When running locally)

### 2. Postman Collection
A fully configured Postman collection is included in this repository. 
- **File:** `UPI-Payments-Backend.postman_collection.json`
- **How to use:** Open Postman ➔ Click **Import** ➔ Select the file. All routes and example request bodies will be instantly available for testing!

### 📝 Detailed API Routes

#### Base
- **`GET /api/v1/`** - Health check and welcome message.

#### 🔐 Auth (`/api/v1/auth`)
- **`POST /register`** - Register a new user.
- **`POST /login`** - Login and receive access tokens.
- **`POST /setMpin`** - Set or update the UPI MPIN *(Requires Auth)*.
- **`GET /getProfile`** - Fetch current user profile *(Requires Auth)*.
- **`POST /logoutUser`** - Logout and clear session cookies *(Requires Auth)*.

#### 💰 Wallet (`/api/v1/wallet`)
- **`POST /addMoney`** - Add funds to your wallet *(Requires Auth)*.
- **`POST /withdrawMoney`** - Withdraw funds from your wallet *(Requires Auth)*.

#### 💸 Transactions (`/api/v1/txn`)
- **`POST /sendviaUPI`** - Send money to another user via UPI ID *(Requires Auth)*.
- **`POST /getTransaction`** - Retrieve details of a specific transaction *(Requires Auth)*.

## 🗺️ Roadmap & Future Scope

As a learning project focused on mastering backend concepts, the following advanced features are planned for future implementation:
- **Caching (Redis)**: Implement Redis to cache frequently accessed data (like user profiles) and reduce database load.
- **Rate Limiting**: Add rate-limiting middleware to prevent brute-force attacks and DDoS on authentication and transaction routes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Anandx3505/UPI-payements-backend/issues) if you want to contribute.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 👨‍💻 Author

**Anand Chaudhary**

## 📄 License

This project is licensed under the **ISC** License.
