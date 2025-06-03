# Shop-Sphere Auth Hub — Frontend

### Description

The **Shop-Sphere Auth Hub Frontend** is a modern React (Vite) application that provides the user interface for a multi-shop authentication platform. It handles signup, login with "Remember Me", user dashboards, and subdomain-based shop views. Designed for scalability and seamless user experience across multiple subdomains, it complements the backend built with Node.js and MongoDB.

Built with **React 19**, **Tailwind CSS**, **React Router DOM v7**, and **TypeScript**, it ensures a clean UI with robust state handling, token management, and secure session persistence.

---

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)

---

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sabbirsami/shop-sphere-auth-hub-frontend
   ```

2. **Navigate into the project directory:**

   ```bash
   cd shop-sphere-auth-hub-frontend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

---

### Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the project for production
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint to check code quality

---

### Features

- User Signup with validation
- Unique shop names per user (global namespace)
- User Login with "Remember Me" session support
- JWT token-based session handling
- Subdomain-based dynamic dashboards (e.g., `http://beautyhub.localhost:5173`)
- Cross-subdomain authentication persistence
- Loading state during token verification
- Profile access with shop list and logout option
- Tailwind CSS-powered UI for fast and responsive design

---

### Usage

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open the app:**

   Visit [http://localhost:5173](http://localhost:5173) to start.

3. **After login:**

   Clicking on a shop name will redirect to `http://<shopname>.localhost:5173`, where the dashboard will validate the session and show the shop-specific message.

---

### Pages and Behavior

#### 1. **Signup Page**

- Fields: `username`, `password`, `shops[]`
- Validation:
  - At least 3 unique shop names
  - Password must be 8+ chars, with at least 1 number and 1 special character

#### 2. **Signin Page**

- Fields: `username`, `password`, `rememberMe`
- Session duration:
  - 7 days with Remember Me
  - 30 minutes without it
- Displays error messages for invalid credentials

#### 3. **Dashboard**

- Shows profile icon
- Clicking icon reveals:
  - List of shop names
  - Logout button with confirmation

#### 4. **Shop Subdomain Dashboards**

- Example: `http://beautyhub.localhost:5173`
- Message displayed: _"This is beautyhub shop"_
- Includes token/session verification and a loading spinner

---

### Token Handling

- Tokens are stored using **cookies (via js-cookie)** for subdomain persistence
- Token is validated on each subdomain using the backend
- Auto-redirect to login if the token is invalid or expired

---

### Dependencies

- `react` & `react-dom`: UI framework
- `react-router-dom`: Routing and navigation
- `react-hook-form`: Form handling and validation
- `js-cookie`: Cookie management for tokens
- `react-hot-toast`: Toast notifications
- `lucide-react`: Icons

---

### Development Practices

- Type-safe with TypeScript
- Modular folder structure
- ESLint + Prettier for clean code
- Tailwind CSS for fast UI development
- React Router DOM v7's nested routing
- Graceful fallback for 404s
