# 💎 Fundly — Ultra-Premium Finance Dashboard

**Fundly** is a state-of-the-art, high-performance financial management dashboard built with React. It combines a production-grade user experience with a "luxury fintech" aesthetic, featuring glassmorphism, dynamic glow effects, and intelligent data analysis.

![Fundly Dashboard Preview](https://via.placeholder.com/1200x600/050505/ffffff?text=Fundly+Premium+Dashboard+Preview)

---

## 🚀 Live Demo & Preview

*   **Live Demo:** [Link to your Vercel/GitHub Pages deployment]
*   **Design Language:** Luxury Dark Mode + Professional Light Mode.

---

## 🔥 Key Features

### 📊 Comprehensive Dashboard
Get a high-level overview of your net liquid assets, monthly income, and burn rates. Features real-time responsive charts powered by Recharts.

### 🧠 Smart Insights Engine
Beyond static numbers, Fundly provides an intelligent analysis layer:
*   **Monthly Trends:** Automatic calculation of spending changes (increase/decrease %).
*   **Budget Guard:** Real-time warnings if expenses exceed income.
*   **Category Highlights:** Instant identification of your highest spending category.
*   **Cash Stability:** Monitoring of net cash flow for financial health.

### 🔍 Interactive Data Filtering
Slice your data exactly how you need it:
*   **Global Filters:** Filter all charts and tables by Time Range (7d, 30d, 1y), Category, and Transaction Type.
*   **Real-time Search:** Instantly find specific transactions with a high-performance search bar.

### 🌓 Dual-Theme System
*   **Dark Mode:** A deep obsidian base with sapphire and gold accents (Luxury Glassmorphism).
*   **Light Mode:** A clean, professional slate-white theme for high-clarity environments.

### 📥 Enterprise Data Export
Professional data portability supporting **CSV** and **JSON** exports that respect your active filters and search terms.

### ⚡ Performance-Oriented UI
*   **Skeleton Loading:** Shimmer-effect placeholders for polished perceived performance.
*   **Micro-interactions:** Smooth transitions and hover states using Framer Motion.
*   **Persistence:** Automatic local storage synchronization for your financial records.

---

## 🛠 Tech Stack

*   **Core:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Lightning fast HMR)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) (Smooth layout transitions & micro-interactions)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variables for Theme Tokens
*   **Charts:** [Recharts](https://recharts.org/) (Composable charting library)
*   **Icons:** [Lucide React](https://lucide.dev/) (Beautifully consistent icon set)

---

## 📂 Project Structure

```text
finance-dashboard/
├── src/
│   ├── components/
│   │   └── borderglow.jsx  # Patent-pending custom glow hover wrapper
│   ├── App.jsx            # Main Application Logic & View Controller
│   ├── index.css          # Design System, Tokens, & Global Animations
│   └── main.jsx           # Entry Point
├── public/                # Static Assets
└── package.json           # Project Metadata & Dependencies
```

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/fundly-dashboard.git
    cd fundly-dashboard
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 🌐 Deployment

### Vercel (Recommended)
Fundly is optimized for Vercel. Simply push your code to GitHub and connect the repository for automatic CI/CD.

### GitHub Pages
Deploying via GitHub Actions:
1. Ensure `vite.config.js` has the correct `base` path (e.g., `/fundly-dashboard/`).
2. Use the `gh-pages` branch for deployment.

---

## 🧠 Design & Approach

*   **UX Hierarchy:** Designed with a "Financial Control Room" philosophy. High-value alerts use Gold accents, while growth/income metrics utilize Sapphire Blue.
*   **Glassmorphism:** Used to create depth and a premium "layered" feel on dark backgrounds.
*   **Interaction Design:** Every button, card, and row includes optimized hover states (BorderGlow) to provide tactile feedback without cluttering the interface.

---

## 📈 Future Roadmap

*   [ ] **Backend Integration:** Connect to a Node.js/Express API with PostgreSQL.
*   [ ] **Plaid API:** Real-time bank account synchronization.
*   [ ] **AI Forecasting:** Predict future spend based on historical patterns.
*   [ ] **Auth System:** Secure authentication with JWT or NextAuth.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for Modern Finance.**
