# 🌤️ Weather Dashboard — Frontend Setup Guide

This guide outlines how to set up the frontend for the Real-Time Weather Monitoring Dashboard using **React.js**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## 🛠️ 1. Prerequisites

Ensure the following are installed:

- **Node.js** (v18+ recommended)
- **npm** or **yarn**

Verify installation:
```bash
node -v
npm -v
```

---

## ⚙️ 2. Create the Vite + React Project

```bash
npm create vite@latest frontend
# When prompted, choose: React + JavaScript
cd frontend
```

Install project dependencies:

```bash
npm install
```

---

## 🎨 3. Install and Configure Tailwind CSS

### Install Tailwind and PostCSS tools:

```bash
npm install -D tailwindcss@3.4.3 postcss autoprefixer
npx tailwindcss init -p

```

### Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

### Replace the contents of your `postcss.config.cjs` with the following:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

### Replace the contents of `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📦 4. Install Other Frontend Dependencies

```bash
npm install axios recharts socket.io-client
```

These are used for:
- `axios`: API communication
- `recharts`: Forecast graphs
- `socket.io-client`: Real-time updates via WebSocket

---

## 🗂️ 5. Suggested Project Structure

```plaintext
frontend/
├── public/
├── src/
│   ├── assets/             # Icons, images, etc.
│   ├── components/         # Reusable UI components
│   ├── pages/              # Dashboard and other pages
│   ├── services/           # API communication (axios)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 6. Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 7. Optional: Add `.gitignore`

If it wasn’t auto-generated, create a `.gitignore` file and add:

```gitignore
node_modules/
dist/
.env
```

---

✅ Your frontend environment is now ready for development!
