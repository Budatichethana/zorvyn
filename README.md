# Zorvyn Finance Dashboard

Zorvyn is a responsive personal finance dashboard built using React, Vite, and TypeScript. It provides a clean interface for tracking transactions, visualizing financial data, and managing insights with role-based access.

---

## Live Demo

https://zorvyn-lilac.vercel.app

---

## Project Overview

Zorvyn is designed as a product-oriented dashboard focused on usability, performance, and scalability. It simulates a real-world financial management system with persistent state and dynamic data handling.

---

## Features

* Role-based access:

  * Viewer: Read-only access
  * Admin: Add and delete transactions

* Financial summary:

  * Total balance, income, and expenses
  * Dynamic calculations based on transactions

* Data visualization:

  * Interactive charts built using Recharts
  * Financial trend insights

* Transactions management:

  * Search, filter, and sort functionality
  * Empty state handling
  * Admin-only CRUD operations

* UI and experience:

  * Responsive design for mobile and desktop
  * Dark mode with persistent preference

* State management:

  * Centralized state using Zustand
  * Synchronization across components

* Persistence:

  * LocalStorage for transactions and UI settings

---

## Tech Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Zustand
* Recharts
* Lucide React

---

## How to Run the Project

### Prerequisites

* Node.js 18 or later
* npm

### Install dependencies

```bash id="9u3k2x"
npm install
```

### Start development server

```bash id="2h9x4c"
npm run dev
```

### Build for production

```bash id="p4c7dq"
npm run build
```

### Preview production build

```bash id="x8r1kz"
npm run preview
```

---

## Folder Structure

```text id="m7v2qa"
zorvyn/
├─ src/
│  ├─ components/
│  ├─ store/
│  ├─ utils/
│  ├─ App.tsx
│  └─ main.tsx
├─ public/
├─ package.json
└─ vite.config.ts
```

---

## Approach

The application uses a centralized Zustand store to manage global state, ensuring consistency across dashboard components, filters, and UI preferences. Transactions are persisted using localStorage to maintain data across sessions.

The UI is built using reusable components such as Card, Button, and SectionContainer to ensure consistency and scalability. Tailwind CSS is used for responsive design and styling, while Recharts handles data visualization.

---

## Future Improvements

* Backend integration (Node.js, Firebase, or similar)
* User authentication and authorization
* Export functionality (PDF or CSV)
* Real-time data updates

---

## Author

Chethana Budati
GitHub: https://github.com/Budatichethana
