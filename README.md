# 🔐 Authentication System

A **JWT-based Authentication System API** built with **Node.js, Express.js, and MongoDB**.
It provides secure user authentication and authorization features, including **registration, login, password reset via email verification, change password, and logout functionality**.

## 🚀 Features

* **User Registration** → Create a new account with proper validation.
* **Login** → Authenticate users with email & password using JWT.
* **Forgot Password** → Send a password reset link via email.
* **Reset Password** → Secure password reset with email verification.
* **Change Password** → Authenticated users can update their password.
* **Show User Details** → Fetch and display profile information.
* **Logout** → Invalidate JWT token on logout.

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Authentication & Security**:

  * JSON Web Token (JWT) for authentication
  * Bcrypt.js for password hashing
* **Email Services**: Nodemailer with Ethereal for password reset emails

## 🔑 How It Works

1. On registration → password is hashed and stored in MongoDB.
2. On login → server generates a **JWT token** for the user.
3. On forgot password → system sends a reset link to user’s email (via Ethereal).
4. On reset → user can securely set a new password.
5. Authenticated users can also **change password** or **view details**.

## 📌 Use Cases

* Can be used as a **starter template** for Node.js + MongoDB projects requiring authentication.
* Useful for **secure REST API development** for web and mobile apps.

