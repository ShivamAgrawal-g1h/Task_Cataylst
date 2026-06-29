# 🚀 Task Catalyst (Version 1)

> **Version 1 — Initial AI-Powered Productivity Companion**

Task Catalyst is an AI-assisted task management application designed to help users organize work, prioritize tasks intelligently, and improve productivity through AI-powered recommendations and coaching.

This repository represents the **initial implementation (V1)** of the project. It establishes the core architecture, user authentication, task management system, Google Gemini integration, and responsive user interface that later versions build upon.

---

# 📖 Project Overview

Task Catalyst combines modern web technologies with Artificial Intelligence to create a personal productivity companion.

Instead of functioning as a traditional to-do application, the system provides:

* AI-generated motivational quotes
* AI productivity coaching
* Intelligent task prioritization
* Personalized work scheduling
* Secure cloud-based task storage
* Responsive user experience

This version serves as the foundation for future architectural improvements and advanced AI capabilities.

---

# ✨ Features

## Authentication

* User Registration
* User Login
* Secure authentication using Supabase Auth

---

## Dashboard

* Personalized greeting
* Live productivity statistics
* Pending task summary
* Completed task summary
* Overdue task count
* AI-generated motivational quote
* AI task recommendation
* Top priority tasks

---

## Task Management

* Create tasks
* Edit tasks
* Delete tasks
* Mark tasks as completed
* Postpone tasks
* Category support
* Importance rating (1–5)
* Deadline management
* Estimated completion time
* Task filtering
* Task sorting

---

## AI Coach

Google Gemini powered assistant capable of:

* Productivity coaching
* Answering planning questions
* Motivation
* General work guidance

Includes:

* Quick prompt buttons
* Personality analysis
* Basic productivity insights

---

## Settings

Users can configure:

* Display name
* Gemini API Key
* Working hours
* Productivity preferences

---

# 🧠 Priority Algorithm

Each task receives a calculated priority score based on three factors.

| Factor           | Weight |
| ---------------- | ------ |
| Importance       | 40%    |
| Deadline Urgency | 40%    |
| Quick Win Bonus  | 20%    |

The score helps determine which task should receive the highest attention.

---

# 🛠 Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Supabase

### AI

* Google Gemini API

### Database

PostgreSQL (Supabase)

---

# 📂 Project Structure

```
Task_Catalyst/
│
├── public/
│
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── supabase/
│
├── package.json
├── vite.config.js
└── README.md
```

---

# 🗄 Database

The application currently uses two primary tables.

### tasks

Stores:

* title
* description
* deadline
* importance
* category
* status
* priority score
* postpone count

---

### user_profiles

Stores:

* profile information
* work schedule
* Gemini API key
* productivity type

---

# 🔐 Security

* Row Level Security (RLS) enabled
* User-specific data isolation
* Secure authentication using Supabase Auth
* Automatic profile creation using database trigger

---

# 🚀 Running the Project

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Create a `.env` file and add your Supabase credentials.

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
```

---

## Start Development Server

```bash
npm run dev
```

---

## Production Build

```bash
npm run build
```

---

# 📌 Current Limitations (Version 1)

Although fully functional, Version 1 has several architectural limitations.

* AI interactions are largely reactive.
* Dashboard intelligence is limited.
* Recommendation engine is rule-based.
* No autonomous AI reasoning.
* No intervention system.
* Limited modularization.
* Basic settings management.
* Initial UI implementation.

These limitations become the focus of subsequent versions.

---

# 🎯 Learning Objectives

This project was developed to explore:

* Modern React development
* Component-based architecture
* Backend integration with Supabase
* Authentication systems
* Database design
* Google Gemini API integration
* Responsive UI design
* AI-assisted productivity applications

---

# 👨‍💻 Author

**Shivam Agrawal**

Malaviya National Institute of Technology (MNIT), Jaipur

---

**Version:** V1 – Initial Foundation
