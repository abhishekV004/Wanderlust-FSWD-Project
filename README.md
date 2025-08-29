# 🌍 Wanderlust – Travel Booking & Exploration App

Wanderlust is a **full-stack travel application** built using **MongoDB, Express, Node.js, HTML, CSS, JavaScript, Bootstrap, and EJS**.  
It allows users to explore destinations, add new places with **MapTiler-powered geocoding**, upload images, and leave reviews – all with authentication and secure sessions.  

🔗 **Live Demo:** [Wanderlust on Render](https://wanderlust-fswd-project.onrender.com/)

---

## ✨ Features

- 🏞️ Explore and view travel destinations on a map  
- 📍 **Geocoding with MapTiler** – automatically convert addresses into coordinates  
- ➕ Add, edit, and delete travel listings  
- 📝 Reviews & comments system  
- 🔐 Secure authentication (Signup/Login/Logout)  
- 🗂️ Session management for logged-in users  
- 📸 Image upload support (Cloudinary/Multer)  
- 🎨 Responsive UI with Bootstrap  
- 🌐 Hosted on Render  

---

## 🛠️ Tech Stack

### **Frontend**
- HTML5, CSS3, JavaScript (ES6+)  
- Bootstrap 5 (Responsive UI)  
- EJS (Templating Engine)  

### **Backend**
- Node.js  
- Express.js  

### **Database**
- MongoDB (Atlas)  
- Mongoose (ODM)  

### **Authentication & Security**
- Passport.js (Local strategy)  
- bcrypt (Password hashing)  
- express-session (Session management)  
- connect-flash (Error & success messages)  

### **Image & File Handling**
- Multer (File upload middleware)  
- Cloudinary (Image hosting & CDN)  

### **Maps & Geocoding**
- **MapTiler API** – Maps & geocoding services  
- @maptiler/client (API integration)  

### **Deployment & Tools**
- Render (Hosting)  
- Git & GitHub (Version control)  
- dotenv (Environment variable management)  

---

## 🚀 Getting Started

### Prerequisites
- Install [Node.js](https://nodejs.org/) (v16 or later)  
- Install [MongoDB](https://www.mongodb.com/atlas) account or local setup  
- Create an account at [MapTiler](https://www.maptiler.com/) for API key  

---

### Installation

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/wanderlust.git
   cd wanderlust
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   MAPTILER_API_KEY=your_maptiler_api_key
   ```

4. Run the project  
   ```bash
   npm start
   ```

5. Open in browser:  
   ```
   http://localhost:3000
   ```

---

## 📖 Usage

- Sign up or log in to your account  
- Add new travel listings with **images & geocoded locations**  
- View listings on an interactive **MapTiler-powered map**  
- Leave reviews and ratings  
- Edit or delete your own listings  

---

## 🛡️ License

This project is licensed under the MIT License – you are free to use and modify it.  

---

## 👨‍💻 Author

Developed as a **Full Stack Web Development Major Project** using MERN stack skills.
By Abhishek Vishwakarma  

🔗 **Live Project:** [Wanderlust on Render](https://wanderlust-fswd-project.onrender.com/)  
