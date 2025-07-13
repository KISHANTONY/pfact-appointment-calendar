# 🗓️ Clinic Appointment Calendar

A responsive calendar interface for clinic staff to view, manage, and schedule patient appointments. Built with **React** and styled for mobile and desktop views.

---

## ✨ Features

- 🔐 **Login Authentication** (static demo credentials)
- 🗓️ **Desktop Month View Calendar**
  - View patient names and appointment times per date
  - Click a date to open a modal and book/edit/delete appointments
- 📱 **Mobile Day View**
  - View one day at a time with a date picker
  - Scroll vertically to manage appointments
- ✅ **Appointment Filters** (by doctor and patient)
- 💾 **Data Persistence via localStorage**
- 🎨 **Modern UI**
  - Polished color palette (calm + professional)
  - Accent highlights for today, weekends, and active dates
  - Minimal dot indicators for calendar tiles

---

## 🖥️ Tech Stack

- **React** (Vite)
- **React Router**
- **React Calendar**
- **HTML5 / CSS3**
- Responsive Design with custom media queries

---

## 🔑 Login Credentials

```
Email: staff@clinic.com  
Password: 123456
```

---

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clinic-calendar-app.git
   cd clinic-calendar-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

4. Open in your browser:  
   `http://localhost:5173`

---

## 📁 Project Structure

```
.
├── public/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   └── CalendarPage.jsx
│   ├── data/
│   │   └── lists.js
│   ├── styles/
│   │   ├── main.css
│   │   ├── login.css
│   │   └── calendar.css
│   ├── App.jsx
│   └── main.jsx
└── README.md
```

---

## 📷 Screenshots

> Include screenshots of:
> - Desktop calendar
> - Mobile day view
> - Booking modal

---

## 💡 Future Improvements

- 🔄 Backend API integration (MongoDB + Express)
- 📆 Availability checker (slot conflict warnings)
- 🧑‍⚕️ Role-based dashboards (doctor vs. admin)
- 📨 Email notifications on appointment creation

---

## 👨‍💻 Author

**Kishan K Tony**  
📧 kishankktony@gmail.com  
📱 +91 90486 25492

---

## 📜 License

This project is licensed for educational/demo use. Attribution encouraged.