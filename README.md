# 💸 PayBondhu

**PayBondhu** is a digital wallet API system built with **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**. It supports multi-role access (Admin, User, Agent), wallet management, transaction handling (including cash-in/out, and others), and authentication using JWT.

---

## 🚀 Base URL

### Base API: [https://pay-bondhu-server.vercel.app/api/v1](https://pay-bondhu-server.vercel.app/api/v1)

---

## 🚀 Features

- 👤 User & Agent Registration
- 🔐 JWT Authentication (Access & Refresh Tokens)
- 🧾 Role-Based Access Control (Admin, User, Agent)
- 💼 Automatic Wallet Creation on Signup (৳50 Initial Balance)
- 💳 Cash-In, Cash-Out, Transfer Transactions
- 📊 Admin Approval for Agents
- 📌 Transaction Logs with Sender/Receiver Info
- 📄 Clean Code Structure with TypeScript

---

## 🔧 Technologies Used

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **Zod Validation**
- **Yarn** (as package manager)

---

## 📁 Project Structure

```
src/
├──app
│   ├──modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── wallet/
│   │   └── transaction/
│   ├── middlewares/
│   ├── config/
│   ├── utils/
│   ├── routes
│   ├── config/
│   ├── errorHelpers/
│   └── interfaces/
├── app.ts
├── server.ts
```

---

## 📦 Installation

```bash
git clone https://github.com/sumonkaysar/PayBondhu-server.git
cd PayBondhu-server
yarn install
```

---

## 🔗 API Endpoints

All endpoints (except register, login, and refresh-token) require a JWT **_access_token_** in headers:

```
http
Headers: Authorization: <access_token>
```

## 👤 User Endpoints

| Method | Endpoint            | Description                   |
| ------ | ------------------- | ----------------------------- |
| POST   | `/users/register`   | Register (User/Agent)         |
| GET    | `/users/all-users`  | Get all users (Admin)         |
| PATCH  | `/users/`           | Update user info (User/Agent) |
| PATCH  | `/users/:id/status` | Update user status (Admin)    |

### User Registration (Agent or User)

- **Admin:** No need to create, it will be created on server starting
- **User:** Need to pass (name, phoneNumber, and password). And role (USER) is optional.
- **Agent:** Need to pass (name, phoneNumber, and password, role). And role (AGENT) must required to register as an agent. Agent's status is "PENDING" by default. Agent must be approved by Admin to do transactions.

  #### Sample Payload

  ```
    JSON: User creation (No need to put role, by default it is user)
    {
      "name": "User Name",
      "phoneNumber": "01800000000",
      "password": "password123"
    }

    JSON: Agent creation(Need a role with 'AGENT' value)
    {
      "name": "Agent Name",
      "role": "AGENT"
      "phoneNumber": "01800000000",
      "password": "password123"
    }
  ```

### Get all users (Admin only)

- **Admin:** Only admin can get all users. Admin can filter all agents or users. Pagination is also added.

### Update user info (User/Agent)

- **User/Agent:** Can update their name.

  #### Sample Payload

  ```
    JSON:
    {
      "name": "Update name",
    }
  ```

### Update user/agent status (Admin)

- **Admin:** Only Admin can update a user or agent status (PENDING, ACTIVE, BLOCKED, SUSPENDED, DELETED). Agent's status is pending by default. Admin will approve agent

  #### Sample Payload

  ```
    JSON:
    {
      "status": "BLOCKED",
    }
  ```

---

## 🔐 Authentication Endpoints

| Method | Endpoint               | Description                                                  |
| ------ | ---------------------- | ------------------------------------------------------------ |
| POST   | `/auth/login`          | Users login (User/Agent/Admin)                               |
| GET    | `/auth/logout`         | Users logout (User/Agent/Admin)                              |
| PATCH  | `/auth/reset-password` | User reset/change password (User/Agent/Admin)                |
| GET    | `/auth/refresh-token`  | Get a new access token with refresh token (User/Agent/Admin) |

### User Login (Agent or User or Admin)

- **Agent/User/Admin:** Need to pass (phoneNumber, and password)

  #### Sample Payload

  ```
    JSON: User Login
    {
      "phoneNumber": "01800000000",
      "password": "password123"
    }
  ```

### Logout (Agent or User or Admin)

- **Agent/User/Admin:** No payload needed

### Reset/change password (Agent or User or Admin)

- **Agent/User/Admin:** Can change password. Need to pass (oldPassword and newPassword)

  #### Sample Payload

  ```
    JSON:
    {
      "newPassword": "Sk12345@",
      "oldPassword": "Sk12345@a"
    }
  ```

### Get a new access token with refresh token (Agent or User or Admin)

- **Agent/User/Admin:** No need to pass payload

---

## 💼 Wallet Endpoints

| Method | Endpoint                    | Description                        |
| ------ | --------------------------- | ---------------------------------- |
| GET    | `/wallets/all-wallets`      | Get all wallets (Admin)            |
| GET    | `/wallets/me`               | Get my wallet (User/Agent)         |
| PATCH  | `/wallets/:id/block-status` | Update wallet block status (Admin) |

### Get all wallets (Admin only)

- **Admin:** Only Admin can get all wallets with filter and pagination system. No need to pass any payload.

### Get my wallet (User/Agent)

- **User/Agent:** can get their wallets. No need to pass any payload.

### Update wallet block status (Admin Only)

- **Admin:** Only Admin can update user or agent wallets block status. Need to pass isBlocked as a boolean (true or false)

  #### Sample Payload

  ```
    JSON:
    {
      "isBlocked": true
    }
  ```

---

## 💸 Transaction Endpoints

| Method | Endpoint                         | Description                                    |
| ------ | -------------------------------- | ---------------------------------------------- |
| POST   | `/transactions/add-money`        | Add money from external source (User or Agent) |
| POST   | `/transactions/withdraw`         | Withdraw money to external source (User)       |
| POST   | `/transactions/send-money`       | Send money to another user (User)              |
| POST   | `/transactions/cash-in`          | Cash in to user (Agent)                        |
| POST   | `/transactions/cash-out`         | Cash out from user (User)                      |
| get    | `/transactions/me`               | Get my all transactions (User or Agent)        |
| get    | `/transactions/all-transactions` | Get all transactions (Admin)                   |
| get    | `/transactions/:id/reverse`      | Reverse a transaction (Admin)                  |

### Add money from external source (User or Agent)

- **User/Agent:** Can add money from external sources like bank or card. Need to pass (through and amount).

  #### Sample Payload

  ```
    JSON: through is external source
    {
      "amount": 300,
      "through": "Bank"
    }
  ```

### Withdraw money to external source (User)

- **User:** Can withdraw money to external sources like bank or atm. Need to pass (through and amount).

  #### Sample Payload

  ```
    JSON:
    {
      "amount": 300,
      "through": "Bank"
    }
  ```

### Send money to another user (User) (User to User)

- **User:** Can send money to another user (User to User). Need to pass (receiver and amount), receiver must be a phone number of another User.

  #### Sample Payload

  ```
    JSON:
    {
      "receiver": "+8801712345678",
      "amount": 300
    }
  ```

### Cash in from agent (User) (Agent to User)

- **Agent:** Can cash in money to user (Agent to User). Need to pass (receiver and amount), receiver must be a phone number of a User.

  #### Sample Payload

  ```
    JSON:
    {
      "receiver": "+8801712345678",
      "amount": 300
    }
  ```

### Send money to another user (User) (User to User)

- **User:** Can cash out money to Agent (User to Agent). Need to pass (receiver and amount), receiver must be a phone number of an Agent.

  #### Sample Payload

  ```
    JSON:
    {
      "receiver": "+8801712345678",
      "amount": 300
    }
  ```

### Get my transactions (User/Agent)

- **User/Agent:** can get their transactions with filter and pagination system. No need to pass any payload.

### Get all transaction (Admin only)

- **Admin:** Only Admin can get all transactions with filter and pagination system. No need to pass any payload.

### Reverse a transaction (Admin Only)

- **Admin:** Only Admin can reverse a transaction. No need to pass any payload.

---

### ✍️ Author

**Sumon Kaysar** <br>
📧 sumon.kaysar.sk@gmail.com <br>
🌐 [Facebook](https://facebook.com/sumon.kaysar.sk) • [GitHub](https://github.com/sumonkaysar)

---
