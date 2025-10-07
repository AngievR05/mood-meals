# 🌈 MoodMeals

**MoodMeals** is a full-stack web app that connects your **emotions to meals** — helping users track moods, reflect on emotional patterns, and get food suggestions that match or improve their current mood.

It’s built around **emotional wellness, personalisation, and aesthetic experience**, not just data and definitely not calories.

---

## 🚀 Features

### 🧠 Mood Tracking
- Log daily moods using emotion icons.
- Visualise weekly and monthly mood stats (graphs + calendar view).
- Add personal notes to track emotional trends.

### 🍱 Smart Meal Recommendations
- Logic that suggests meals based on mood type.
- Custom recipe cards with ingredients, instructions, and nutrition info.
- “Save Meal” and “View Recipe” interactions.

### 🛒 Grocery List
- Checklists for easy shopping.

### 🎨 Emotional UI
- Soft pastel colour palette tied to moods.
- Floating jar animation for mood bubbles.
- Clean, mobile-first UI — no dashboards, just vibes.

### 👥 Social & Progress Features
- Mood streak tracker.
- Friend interactions (view each other’s moods).
- Profile page with mood analytics and saved meals.

### 🧑‍💻 Admin Panel
- Role-based authentication.
- Manage meals, moods, and user data.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Axios, React Router, Toastify |
| **Styling** | CSS3 (custom UI), Flexbox & Grid, soft gradients |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (via XAMPP / phpMyAdmin) |
| **Auth** | JWT (JSON Web Token) |
| **Deployment** | AWS Lightsail (Ubuntu, Nginx, PM2, Let’s Encrypt) |

---

## ⚙️ Project Setup

### 🔹 Prerequisites
Make sure you have:
- Node.js (v18+)
- npm or yarn
- MySQL (via XAMPP or local install)
- Git
- VS Code

### 🔹 Clone the Repo
```bash
git clone https://github.com/yourusername/moodmeals.git
cd moodmeals
```

### 🔹 Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit your .env file with:
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=
# DB_NAME=moodmeals
# JWT_SECRET=your_secret_key
npm run dev
```

### 🔹 Frontend Setup
```bash
cd ../client
npm install
npm start
```

Frontend runs at **http://localhost:3000**, backend at **http://localhost:5000**

---

## ☁️ Deployment (AWS Lightsail)

1. Create a Lightsail instance (Ubuntu, Node.js).
2. Install:
   ```bash
   sudo apt update && sudo apt install nginx mysql-server
   ```
3. Upload your project via Git or SSH.
4. Run backend with **PM2**.
5. Serve frontend with **Nginx** reverse proxy.
6. Add SSL with **Certbot / Let’s Encrypt**.

---

## 📊 Database Structure

| Table | Description |
|--------|--------------|
| **users** | stores user info, roles, auth data |
| **moods** | tracks daily moods, emotion type, note, date |
| **meals** | recipe data linked to moods |
| **grocery_list** | user-specific grocery items |
| **feedback** | optional user feedback logs |

> All tables in **3NF**, relational structure with foreign keys.

---

## 🧠 Logic Overview

| Mood | Suggested Meals |
|------|------------------|
| Happy | Vibrant, colorful dishes (fruit bowls, smoothies) |
| Sad | Comfort food (soups, pasta, chocolate) |
| Angry | Cooling, soothing meals (salads, tea) |
| Stressed | Light and calming (avocado toast, herbal tea) |
| Bored | Fun snacks or DIY recipes |
| Energised | High-protein or smoothie blends |
| Confused | Simple, grounding foods (oatmeal, rice bowls) |
| Grateful | Balanced, hearty dishes (grain bowls, stews) |

---

## 🪞 UI/UX Style Guide

- **Primary Colors:** `#5d9cec`, `#4a89dc`
- **Visual Style:** Rounded cards, glassmorphism, soft drop shadows
- **Fonts:** Modern sans-serif (Poppins, Inter)
- **Layout:** Mobile-first grid with responsive scaling
- **Animations:** Smooth transitions, pop-in mood bubbles

---

## 🧾 Documentation

- [x] Full CRUD operations (Meals, Moods, Users)
- [x] JWT Auth with roles
- [x] MySQL schema in 3NF
- [x] SEO + Analytics integrated
- [x] Deployed on AWS (Lightsail)

---

## 🧑‍🎓 Author

**Angie van Rooyen** — Developer & UI/UX Designer  
💡 *“Designed for the mind, powered by emotion.”*  

[GitHub](https://github.com/yourusername) • [LinkedIn](https://linkedin.com/in/yourusername)

---

## 🪄 License

This project is licensed under the **MIT License** — free to use, modify, and improve.

---

## 🩵 Acknowledgements

- Inspiration from emotional wellness apps and mood journaling tools.
- UI assets and mood icons designed with care in Figma.
- Thanks to open-source libraries and the MERN community.
