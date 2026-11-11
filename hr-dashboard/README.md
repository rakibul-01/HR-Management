# HR Management Dashboard

A complete, modern HR Management Dashboard built with **PHP 8+ (PDO)**, **MySQL**, **HTML5**, **CSS3**, and **vanilla JavaScript**. Features clean SaaS styling, dark/light theme switching, responsive sidebar navigation, CRUD operations with CSRF protection, and joined reporting with CSV export.

---

## 🚀 Features

- **Executive Dashboard**:
  - 4 animated stat cards: Total Employees, Departments, Total Payroll, Present Today.
  - Interactive Donut Chart showing employee distribution per department via Chart.js.
  - Quick view of recent attendance logs.
- **Employee Directory**:
  - Full CRUD modal management (name, department assignment, email).
  - Live client-side search and multi-column sorting.
  - Cascading deletion handling within safe database transactions.
- **Department Management**:
  - CRUD operations with employee assignment counts.
  - Relational integrity check preventing accidental deletion of populated departments.
- **Salary & Payroll**:
  - Employee compensation management (Basic Salary + Bonus).
  - Automatically computed Total Salary column with formatted monetary tabular numerals.
- **Attendance Tracker**:
  - Record daily attendance with status indicators (`Present`, `Absent`, `Leave`).
  - Filtering by employee, status, and custom date range.
- **Comprehensive HR Report**:
  - Executes a multi-table `LEFT JOIN` linking Employee, Department, Salary, and Attendance.
  - Live multi-field filtering (department, status, date range, keyword search).
  - One-click **CSV Export** with UTF-8 BOM encoding for Excel.
  - Printer-friendly stylesheet (`window.print()`).
- **UI & Accessibility**:
  - Light and Dark mode with `localStorage` persistence and zero theme flash.
  - Responsive design: desktop fixed sidebar, tablet collapsed icons, mobile slide-in drawer.
  - Semantic HTML, WCAG AA contrast, and smooth CSS transitions.

---

## 📁 Project Structure

```
hr-dashboard/
├── index.php                  # Redirects to dashboard
├── dashboard.php              # Stat cards + overview + chart
├── employees.php              # Employee directory CRUD
├── departments.php            # Department list CRUD
├── salaries.php               # Salary records + computed totals
├── attendance.php             # Attendance tracking + filters
├── report.php                 # Joined HR report + CSV export & print
│
├── config/
│   └── database.php           # PDO connection, CSRF tokens, flash messages
│
├── includes/
│   ├── header.php             # <head>, theme bootstrap, open layout
│   ├── sidebar.php            # Left navigation + icons
│   ├── topbar.php             # Page title + theme toggle + mobile hamburger
│   └── footer.php             # Close layout + load scripts
│
├── actions/
│   ├── employee_save.php      # Employee create/update handler
│   ├── employee_delete.php    # Employee deletion handler
│   ├── department_save.php    # Department create/update handler
│   ├── department_delete.php  # Department deletion handler
│   ├── salary_save.php        # Salary create/update handler
│   ├── salary_delete.php      # Salary deletion handler
│   ├── attendance_save.php    # Attendance create/update handler
│   ├── attendance_delete.php  # Attendance deletion handler
│   └── report_export.php      # CSV download stream
│
├── models/
│   ├── Employee.php           # Employee queries & aggregates
│   ├── Department.php         # Department queries & validations
│   ├── Salary.php             # Salary queries & total payroll
│   ├── Attendance.php         # Attendance queries & present counts
│   └── Report.php             # Joined report query execution
│
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design tokens (light + dark)
│   │   ├── layout.css         # Sidebar, topbar, grid layout
│   │   ├── components.css     # Buttons, cards, tables, modals, badges
│   │   └── animations.css     # Staggered transitions & count-ups
│   └── js/
│       ├── theme.js           # Light/dark mode switcher
│       ├── modal.js           # Modal dialog management
│       ├── table.js           # Search & column sorting
│       └── app.js             # Counter animations & toasts
│
├── database/
│   ├── schema.sql             # MySQL table definitions
│   └── seed.sql               # Initial sample data
│
└── README.md                  # Setup & usage instructions
```

---

## 🛠️ Setup Instructions

### 1. Requirements
- PHP 8.0 or higher with PDO and PDO_MySQL extensions enabled.
- MySQL 5.7+ or MariaDB 10.3+.
- A local server environment such as the built-in PHP development server, XAMPP, WAMP, MAMP, or Docker.

### 2. Database Setup
1. Open your MySQL client (terminal or phpMyAdmin).
2. Execute the schema file to create the `hr_management` database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Populate with sample data:
   ```bash
   mysql -u root -p hr_management < database/seed.sql
   ```

### 3. Database Configuration
Open `config/database.php` and verify your MySQL credentials:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'hr_management');
define('DB_USER', 'root');
define('DB_PASS', ''); // Set your MySQL password if any
define('DB_CHARSET', 'utf8mb4');
```

### 4. Run the Application
You can run the application directly using PHP's built-in web server from the `hr-dashboard/` folder:
```bash
cd hr-dashboard
php -S localhost:8000
```
Open your browser and navigate to:
```
http://localhost:8000
```

Alternatively, if using **XAMPP / WAMP**:
1. Copy the `hr-dashboard/` directory to your web root (`htdocs` or `www`).
2. Start Apache and MySQL services in the control panel.
3. Visit `http://localhost/hr-dashboard`.

---

## 🔒 Security Best Practices Implemented

- **Prepared Statements**: 100% of SQL queries use PDO prepared statements with bound parameters to prevent SQL injection.
- **CSRF Protection**: All POST forms include a cryptographically secure token validated on each submission.
- **XSS Prevention**: All dynamic HTML outputs are sanitized via `htmlspecialchars()`.
- **Server-Side Validation**: Rigorous validation of emails, positive numbers, enum statuses, and required fields.
- **Post/Redirect/Get (PRG)**: Prevents duplicate submissions upon browser page refresh.
