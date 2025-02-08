# Expense Tracker

A full-stack expense tracking application with React frontend and Node.js backend.

## Project Structure

## **App Structure for Expense Tracker**  

### **1. Frontend (React.js with Vite)**  
- **Main Component:** `Dashboard.jsx` (Single UI for everything)  
- **State Management:** Context API (to keep it simple)  
- **Routing:** React Router (optional, since it's a single dashboard UI)  
- **Libraries:**  
  - `Recharts` (for visualization)  
  - `Axios` (for API calls)  
  - `date-fns` (for handling dates)  

### **Component Breakdown**  
- **`App.jsx`** → Root component  
- **`Dashboard.jsx`** → Main screen containing:  
  - **Expense Input** (Add/Edit Form)  
  - **Categorization Section**  
  - **Graphs & Charts** (Bar, Pie, or Line chart)  
  - **Reports Section** (Monthly/Yearly Summaries)  
- **`ExpenseForm.jsx`** → Handles adding/editing expenses  
- **`ExpenseList.jsx`** → Displays expenses in a list  
- **`CategoryFilter.jsx`** → Allows filtering by category  
- **`Reports.jsx`** → Shows monthly/yearly summaries  
- **`Charts.jsx`** → Displays expenses visually  

---

### **2. Backend (Node.js + Express.js)**  
- **Framework:** Express.js  
- **Middlewares:**  
  - `body-parser` (for handling JSON requests)  
  - `cors` (to allow frontend-backend communication)  
  - `dotenv` (for environment variables)  

### **API Routes**  
| Method | Route                 | Description                  |
|--------|-----------------------|------------------------------|
| `POST` | `/api/expenses`        | Add a new expense           |
| `GET`  | `/api/expenses`        | Get all expenses            |
| `PUT`  | `/api/expenses/:id`    | Edit an expense             |
| `DELETE` | `/api/expenses/:id`  | Delete an expense           |
| `GET`  | `/api/reports/monthly` | Get monthly summary         |
| `GET`  | `/api/reports/yearly`  | Get yearly summary          |

---

### **3. Database (MongoDB - Mongoose ORM)**  
#### **Collections & Schema**  

#### **Expense Model (`Expense.js`)**  
```js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
```

---

### **4. Project Structure**  
```
/expense-tracker
├── src
│   ├── components
│   │   ├── Dashboard.jsx
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── Reports.jsx
│   │   ├── Charts.jsx
│   ├── App.jsx
│   ├── index.jsx
├── package.json
├── vite.config.js
│
│── backend (Node.js + Express)
│   ├── models
│   │   ├── Expense.js
│   ├── routes
│   │   ├── expenses.js
│   │   ├── reports.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│
│── README.md
```
