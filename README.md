# Zorvyn Finance Dashboard

Zorvyn is a responsive finance dashboard built with React, Vite, TypeScript, Tailwind CSS, Zustand, and Recharts. It provides a polished interface for tracking transactions, viewing summary metrics, exploring finance insights, and switching between viewer and admin roles.

## Project Overview

This project is designed as a lightweight financial operations dashboard. It focuses on clarity, responsive layouts, and a product-like user experience rather than a starter-template feel. The app includes persistent transaction data, global UI state, role-based actions, dark mode, and finance-focused charts.

## Features Implemented

- Role-based UI with Viewer and Admin modes
- Top navbar with app title, role switch, and dark mode toggle
- Fixed left sidebar navigation with icons and labels
- Finance summary cards for balance, income, and expenses
- Recharts-based dashboard charts with mock financial data
- Transactions table with search, filter, sort, and empty states
- Admin-only add and delete transaction actions
- Global Zustand store for shared state management
- Persistent transactions and UI preferences via localStorage
- Responsive layout for mobile and desktop
- Reusable UI primitives for cards, buttons, and section containers

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Recharts
- Lucide React

## How to Run the Project

### Prerequisites

- Node.js 18 or later
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Optional lint check

```bash
npm run lint
```

## Folder Structure

```text
zorvyn/
├─ src/
│  ├─ assets/
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Card.tsx
│  │  │  └─ SectionContainer.tsx
│  │  ├─ Dashboard.tsx
│  │  ├─ Insights.tsx
│  │  ├─ Sidebar.tsx
│  │  └─ Transactions.tsx
│  ├─ store/
│  │  └─ appStore.ts
│  ├─ utils/
│  │  └─ currency.ts
│  ├─ App.tsx
│  ├─ App.css
│  ├─ index.css
│  └─ main.tsx
├─ public/
├─ tailwind.config.js
├─ postcss.config.js
├─ eslint.config.js
├─ package.json
└─ vite.config.ts
```

## Approach

The app is structured around a single global Zustand store so that the dashboard, transactions table, role switch, filters, and theme remain in sync across the UI. Transactions are persisted to localStorage to retain data after refreshes, while Tailwind provides the visual system for spacing, responsive layout, hover states, and dark mode.

Reusable UI components such as Card, Button, and SectionContainer keep the interface consistent and reduce repetition. Recharts is used for the finance visualizations, and the data is mocked but calculated dynamically where it matters, such as totals, filtering, and insights.

## Notes

- The app is currently seeded with mock finance data.
- Admin users can add and delete transactions.
- Viewer users can only inspect the data.
- Dark mode is persisted and can be toggled from the navbar.
