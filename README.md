# 🌿 Mood Meals


**Mood Meals** is a full-stack web application that connects emotions with nutrition — helping users log moods, visualize emotional patterns, and discover personalized meals to enhance mental well-being.  
It’s more than a CRUD project — it’s an emotionally intelligent, data-driven wellness experience built with empathy and modern web standards.

<p align="center">
  <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/MacBook%20Air%20-%205.png" width="950" alt="Mood Meals Cover Image"/>
</p>

🌐 **Live Demo:** [https://moodmeals.site](https://moodmeals.site)

---

## 🧠 Project Overview

Mood Meals merges emotional awareness and mindful eating into one soft, user-centered experience.  
Users can log how they feel, and the app suggests recipes designed to balance or support that emotional state.

| Mood | Meal Type Example |
|------|--------------------|
| 😌 Stressed | Calming, magnesium-rich meals |
| 😴 Tired | Energizing breakfasts |
| 😄 Happy | Bright, celebratory snacks |
| 😔 Sad | Comforting, low-sugar recipes |

The project integrates **secure authentication, advanced SQL relationships**, and **cloud deployment** to simulate a production-ready environment.

---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js, Context API, Custom CSS |
| **Backend** | Node.js, Express.js, RESTful API |
| **Database** | MySQL (3NF), XAMPP / GCP instance |
| **Hosting** | Google Cloud Platform (Ubuntu VM) |
| **Version Control** | Git + GitHub |
| **Analytics & SEO** | Google Analytics 4, Sitemap, Meta Tags |
| **Auth & Security** | JWT, bcrypt hashing, CORS, dotenv |

---

## 🪄 Key Features

- 🔐 **Authentication System:** JWT-based secure login/register flow with hashed passwords.
- 😋 **Mood-to-Meal Mapping:** Dynamic recipe recommendations tied to emotional context.
- 📊 **Mood Tracker & Calendar:** Visualize weekly or monthly trends.
- 🛒 **Grocery List:** Add, edit, reorder, and mark items as purchased.
- 💾 **Save & Favorite Recipes:** Personalized dashboard for user meals.
- 💡 **Glassy Mood Jar:** Animated, data-driven visualization of mood history.
- 🌐 **SEO & Analytics:** Indexed pages, GA4 tracking, meta optimization.
- 📱 **Responsive UI:** Mobile-first layout, tested on multiple breakpoints.

---

## 🖼️ Screenshots

| Section | Example Screenshot |
|----------|--------------------|
| Login | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20223910.png" width="950" alt="Mood Meals Cover Image"/>|
| Register | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20224102.png" width="950" alt="Mood Meals Cover Image"/>|
| Home Page | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20223932.png" width="950" alt="Mood Meals Cover Image"/>|
| Mood Tracker | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20223946.png" width="950" alt="Mood Meals Cover Image"/> |
| Recipe Page | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20224033.png" width="950" alt="Mood Meals Cover Image"/>|
| Grocery List | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20224002.png" width="950" alt="Mood Meals Cover Image"/> |
| Friends | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20224012.png" width="950" alt="Mood Meals Cover Image"/> |
| Profile | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20224020.png" width="950" alt="Mood Meals Cover Image"/> |
| Admin Panel (Meals) | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20224044.png" width="950" alt="Mood Meals Cover Image"/> |
| Admin Panel (Feedback) | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Screenshot%202025-11-10%20224053.png" width="950" alt="Mood Meals Cover Image"/> |
| Mood Board | <img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/UI/Mood%20Board.png" width="950" alt="Mood Meals Cover Image"/> |

---

## 📁 Project Structure

```
mood-meals/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # App screens (Home, Tracker, Recipes, Profile)
│   │   ├── styles/        # Custom CSS for each component
│   │   ├── utils/         # Auth + analytics helpers
│   │   └── App.js         # Core routing + state logic
│   ├── public/            # index.html + SEO + GA scripts
│   └── package.json
│
├── server/                # Node.js + Express backend
│   ├── routes/            # API endpoints (auth, meals, moods, groceries)
│   ├── controllers/       # Endpoint logic
│   ├── middleware/        # JWT + error handling
│   ├── config/            # Database connection
│   └── server.js          # App entry point
│
├── database/              # SQL schema + seed data
├── sitemap.xml            # SEO indexing
├── robots.txt             # Crawler access
└── README.md
```

---

## 🧩 Installation & Setup (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/AngievR05/mood-meals.git
cd mood-meals
```

### 2. Install Dependencies
#### Frontend
```bash
cd client
npm install
```
#### Backend
```bash
cd ../server
npm install
```

### 3. Environment Variables
Create `.env` files in both `server/` and `client/`.

#### Example (`server/.env`)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=moodmeals
JWT_SECRET=supersecret
PORT=5000
```
#### Example (`client/.env`)
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 4. Run App Locally
Start backend:
```bash
cd server
npm run dev
```
Start frontend:
```bash
cd ../client
npm start
```
Access app at → `http://localhost:3000`

---

## 🚀 Deployment Guide (Production)

### Hosting Environment
**Google Cloud Platform (GCP)**  
- VM: Ubuntu Server  
- Public IP linked to domain `moodmeals.site`  
- Ports open: 22 (SSH), 80 (HTTP), 443 (HTTPS)

### Deployment Steps
#### 1. SSH into VM
```bash
ssh yourusername@VM_PUBLIC_IP
```
#### 2. Pull Latest Code
```bash
cd ~/mood-meals/mood-meals/mood-meals
git pull origin main
```
#### 3. Backend Setup
```bash
cd server
npm install
pm2 start server.js --name moodmeals-backend
pm2 save && pm2 startup
```
#### 4. Frontend Setup
```bash
cd ../client
npm install
npm run build
sudo systemctl restart nginx
```
#### 5. Enable HTTPS (Certbot)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d moodmeals.site
```
#### 6. Verify Deployment
- Backend Health: `curl http://localhost:5000/api/health`
- Frontend: [https://moodmeals.site](https://moodmeals.site)

---

## 🧮 Database Schema (MySQL)

**Tables:**  
`users`, `moods`, `recipes`, `mood_logs`, `groceries`, `saved_meals`

**Relationships:**  
- Each mood log references a user (`user_id` FK)  
- Recipes tagged by mood category  
- Groceries linked to meals via FK  
- Saved meals linked to user preferences  

All tables normalized to **3rd Normal Form (3NF)** for data integrity.
<img src="https://github.com/AngievR05/mood-meals/blob/main/mood-meals/documentation/Entity-Relationship%20Diagram/mood_meals_ERD.png" width="950" alt="Mood Meals Cover Image"/>
---

## 🧱 Challenges & Solutions

| Challenge | Solution |
|------------|-----------|
| Emotion-based recipe logic | Built dynamic mapping between moods and recipe tags |
| Persistent authentication | Implemented JWT token storage and refresh mechanism |
| SEO & Indexing | Added sitemap.xml, GA4, meta titles/descriptions |
| Responsive UI | Custom mobile-first CSS (no frameworks) |
| Real-time data sync | Used React hooks for instant UI updates |

---

## 🪞 Reflection – *Angie van Rooyen*

Mood Meals demonstrates a deep integration of **human-centered UX** and **data-driven backend logic**.  
It bridges emotional wellness with nutrition tracking, offering a soft, personal, and intuitive user experience.

Extra achievements:
- Deployed live with HTTPS, SEO, and analytics.  
- Fully modular React architecture.  
- Real-world production standards (auth, normalization, deployment pipeline).

This project taught me to merge **creative UX empathy** with **full-stack scalability**, proving that emotional intelligence and technology can work hand in hand.

---

## 🔮 Future Improvements

- Role-based access (admin, nutritionist, user)  
- Multi-language support  
- AI-based meal recommendations  
- Social mood sharing  
- Native mobile integration (React Native)

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Angie van Rooyen**  
📧 support@moodmeals.co.za  
🌐 [moodmeals.site](https://moodmeals.site)  
📂 [GitHub Repo](https://github.com/AngievR05/mood-meals)

---

## 🎥 Walkthrough Video

🎬 A 5–10 minute video demonstration is included in the repository under:  
`/docs/moodmeals_demo.mp4`

---

## 🧭 Badges

![React](https://img.shields.io/badge/Frontend-React.js-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![GCP](https://img.shields.io/badge/Deployment-GCP-yellow)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Status](https://img.shields.io/badge/Status-Live%20on%20moodmeals.site-brightgreen)

---
