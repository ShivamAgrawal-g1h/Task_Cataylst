# 🚀 Task Catalyst

> **An AI-Powered Productivity Companion that evolves from a task manager into an intelligent productivity assistant.**

Task Catalyst is a modern productivity application built to help students plan work, manage deadlines, and receive contextual AI guidance based on their actual workload.

Unlike traditional task managers that simply store tasks, Task Catalyst understands the user's productivity context and uses Google's Gemini AI to generate personalized recommendations, coaching, motivational content, and intelligent prioritization.

---

# 📌 Version

**Current Version:** **V3**

Version 3 transforms Task Catalyst from an AI-assisted task manager into a **context-aware productivity assistant**, introducing a modular quote engine, richer AI reasoning, and a significantly smarter Dashboard experience.

---

# 📖 Overview

Task Catalyst was designed around one philosophy:

> **A productivity application should actively help users make better decisions—not simply record tasks.**

The application combines modern web technologies with Artificial Intelligence to provide:

* Secure cloud-based task management
* Intelligent prioritization
* Context-aware AI coaching
* Personalized motivation
* Productivity insights
* Responsive user experience

---

# ✨ Key Features

## 🔐 Authentication

* Email & Password authentication
* Secure user accounts via Supabase Auth
* Automatic profile creation
* Protected user data using Row-Level Security (RLS)

---

## 📋 Intelligent Task Management

Manage tasks using:

* Title
* Description
* Deadline
* Importance Rating
* Estimated Time
* Categories
* Status
* Priority Score
* Postponement Tracking

Supported operations:

* Create
* Edit
* Delete
* Complete
* Postpone
* Filter
* Sort

---

## 📊 Smart Dashboard

The Dashboard serves as the central productivity workspace.

It provides:

* Personalized greeting
* Daily motivational quote
* Productivity statistics
* Pending task overview
* Overdue task monitoring
* AI-generated recommendations
* Top priority tasks
* Quick task completion
* Quote management interface

---

# 🤖 Context-Aware AI Coach (New in V3)

Version 3 significantly upgrades the AI coaching system.

Instead of generating generic responses, Gemini now reasons using the user's actual productivity context.

The AI analyses:

* Pending tasks
* Overdue tasks
* Tasks due within 72 hours
* Priority scores
* Estimated completion time
* Postponement history
* Previous conversation context

This enables the coach to recommend concrete actions rather than generic productivity advice.

---

## 🧠 Intelligent Task Reasoning

The AI assistant now:

* Identifies urgent tasks
* Detects productivity risks
* References task titles directly
* Explains why a recommendation is important
* Suggests concrete next actions
* Maintains short conversation history for contextual responses

The goal is to make responses actionable rather than motivational alone.

---

# 🌟 Advanced Motivation System

Version 3 continues to build upon the customizable motivation engine introduced previously.

The quote system now supports multiple sources while maintaining clean architectural separation between AI generation and quote selection.

---

## Quote Sources

Motivational quotes can originate from:

* Gemini AI
* Personal custom quotes
* Built-in inspiration library

Every displayed quote clearly identifies its source.

---

## Four Quote Modes

Users can choose how motivational content is selected.

### Mixed

Combines:

* AI-generated quotes
* Personal quotes
* Built-in classics

---

### AI Only

Uses Gemini whenever available.

Gracefully falls back when AI is unavailable.

---

### My Quotes

Displays only user-created motivational quotes.

---

### Pinned Quote

Always displays one fixed quote selected by the user.

Ideal for long-term personal goals.

---

## Custom Quote Library

Users can:

* Add quotes
* Edit quotes
* Delete quotes
* Pin favorites
* Prevent duplicate entries

All preferences are stored locally for a personalized experience.

---

# 🧠 AI Capabilities

Google Gemini powers:

### Productivity Coaching

Interactive conversations based on the user's actual task list.

---

### Task Recommendations

Suggests which task should be completed first and explains the reasoning.

---

### Motivation

Generates personalized motivational quotes.

---

### Productivity Personality Analysis

Analyzes work patterns and classifies users into productivity profiles with personalized improvement suggestions.

---

# 📈 Priority Algorithm

Each task receives a dynamic Priority Score (0–100).

The score combines:

| Factor           | Weight |
| ---------------- | ------ |
| Importance       | 40%    |
| Deadline Urgency | 40%    |
| Quick Win Bonus  | 20%    |

Higher scores indicate tasks requiring immediate attention.

The AI coach uses this score as guidance while also considering deadlines, postponements and workload.

---

# 🏗 Architecture

Task Catalyst follows a modular architecture.

```
Dashboard
      │
      ▼
Gemini API
      │
      ▼
AI Response
      │
      ▼
Quote Engine
      │
      ├───────────────┐
      │               │
      ▼               ▼
Custom Quotes   Built-in Quotes
      │
      ▼
Dashboard UI
```

The quote engine is intentionally separated from Gemini, allowing future extensions without modifying AI logic.

---

# 🗄 Database

Current database schema consists of:

## tasks

Stores:

* Task details
* Deadlines
* Priority score
* Estimated time
* Postpone history
* Completion timestamp

---

## user_profiles

Stores:

* User profile
* Gemini API Key
* Productivity profile
* Work schedule

---

# 🔐 Security

Security features include:

* Row-Level Security (RLS)
* User-specific access control
* Secure authentication
* Protected profile data
* Private Gemini API key storage

Each user can only access their own information.

---

# 🛠 Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Supabase

### Database

* PostgreSQL

### AI

* Google Gemini API (Gemini 2.5 Flash)

---

# 📂 Project Structure

```text
Task_Catalyst/

├── public/
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── supabase/
├── package.json
├── vite.config.js
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Configure environment variables

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL

VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Run locally

```bash
npm run dev
```

Production build

```bash
npm run build
```

---

# 🔑 Gemini API Setup

1. Sign in to Google AI Studio.
2. Generate a free Gemini API key.
3. Open **Settings**.
4. Paste your API key.
5. Save changes.

Once configured, AI-powered features become immediately available.

---

# 🎯 Design Philosophy

Task Catalyst follows three guiding principles.

### Intelligent

The application should understand productivity context rather than simply store information.

### Helpful

Recommendations should reference the user's actual tasks instead of generic advice.

### Personalized

Every user should experience a workspace tailored to their own productivity style.

---

# 📌 Current Limitations

While Version 3 introduces significant AI and personalization improvements, several capabilities remain intentionally outside the current scope.

Current limitations include:

* AI-generated daily briefing
* Offline support is limited. Internet connectivity is required for authentication, database operations, and AI-powered features.
* Custom quotes are stored locally and are not synchronized across multiple devices.
* AI recommendations remain request-driven and do not continuously monitor productivity in the background.
* Priority scores are calculated using deterministic rules rather than adaptive machine learning.
* Calendar integrations (Google Calendar, Outlook, etc.) are not yet supported.
* Notifications, reminders, and background scheduling are not available in this version.
* Recurring task management is currently unavailable.
* Productivity analytics focus on task completion rather than long-term behavioral trends.
* AI assists with planning and recommendations but cannot automatically execute task management actions.
* Better automation and more features in settings

These limitations provide a clear roadmap for future architectural evolution while keeping the current application focused, reliable, and maintainable.

---

# 📜 Version History

| Version | Highlights                                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| V1      | Initial AI-powered productivity application with authentication, task management, AI coach, dashboard and priority scoring.                       |
| V2      | Advanced motivation system, modular quote engine, custom quotes, multiple quote modes and dashboard personalization.                              |
| **V3**  | Context-aware AI coach, richer prompt engineering, intelligent task reasoning, modular dashboard interactions and enhanced productivity guidance. |

---

# 👨‍💻 Author

**Shivam Agrawal**

Malaviya National Institute of Technology (MNIT), Jaipur

Electrical Engineering • AI • Full Stack Development

---

## ⭐ If you found this project interesting, consider giving it a star.
