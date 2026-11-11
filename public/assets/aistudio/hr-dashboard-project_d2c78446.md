# HR Management Dashboard: Project Structure & AI Build Prompt

Stack: **PHP 8+ (PDO) · MySQL · HTML/CSS/vanilla JS**

---

## 1. Project Structure

```
hr-dashboard/
├── index.php                  # Redirects to dashboard
├── dashboard.php              # Stat cards + overview
├── employees.php              # Employee list + add/edit/delete
├── departments.php            # Department list + add/edit/delete
├── salaries.php               # Salary list + add/edit/delete
├── attendance.php             # Attendance list + add/edit/delete + filters
├── report.php                 # HR report (joined data) + filters + CSV export
│
├── config/
│   └── database.php           # PDO connection (reads from constants)
│
├── includes/
│   ├── header.php             # <head>, theme bootstrap, opens layout
│   ├── sidebar.php            # Left navigation
│   ├── topbar.php             # Page title + theme toggle
│   └── footer.php             # Closes layout, loads JS
│
├── actions/
│   ├── employee_save.php
│   ├── employee_delete.php
│   ├── department_save.php
│   ├── department_delete.php
│   ├── salary_save.php
│   ├── salary_delete.php
│   ├── attendance_save.php
│   ├── attendance_delete.php
│   └── report_export.php      # CSV download
│
├── models/
│   ├── Employee.php
│   ├── Department.php
│   ├── Salary.php
│   ├── Attendance.php
│   └── Report.php             # Runs the joined report query
│
├── assets/
│   ├── css/
│   │   ├── variables.css      # Design tokens (light + dark)
│   │   ├── layout.css         # Sidebar, topbar, grid
│   │   ├── components.css     # Buttons, cards, tables, modals, badges, forms
│   │   └── animations.css     # Keyframes + transitions
│   ├── js/
│   │   ├── theme.js           # Light/dark toggle, localStorage
│   │   ├── modal.js           # Add/edit modal logic
│   │   ├── table.js           # Search, sort
│   │   └── app.js             # Counters, toasts, init
│   └── icons/                 # Inline SVG icons
│
├── database/
│   ├── schema.sql             # CREATE TABLE statements
│   └── seed.sql               # Sample data
│
└── README.md                  # Setup steps
```

---

## 2. Database (`database/schema.sql`)

```sql
CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

CREATE TABLE Department (
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE Employee (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_name VARCHAR(100) NOT NULL,
  department_id INT,
  email VARCHAR(100),
  FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE Salary (
  salary_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  basic_salary DECIMAL(10,2) NOT NULL,
  bonus DECIMAL(10,2),
  FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Attendance (
  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  attendance_date DATE NOT NULL,
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);
```

## 3. Sample Data (`database/seed.sql`)

```sql
INSERT INTO Department (department_id, department_name) VALUES
(1,'Human Resources'),(2,'Finance'),(3,'IT'),(4,'Marketing');

INSERT INTO Employee (employee_id, employee_name, department_id, email) VALUES
(101,'Alice Smith',1,'alice@company.com'),
(102,'Bob Johnson',2,'bob@company.com'),
(103,'Charlie Brown',3,'charlie@company.com'),
(104,'Diana Prince',4,'diana@company.com'),
(105,'Edward Norton',3,'edward@company.com');

INSERT INTO Salary (salary_id, employee_id, basic_salary, bonus) VALUES
(1,101,50000.00,5000.00),(2,102,60000.00,6000.00),(3,103,70000.00,7000.00),
(4,104,55000.00,5500.00),(5,105,72000.00,7500.00);

INSERT INTO Attendance (attendance_id, employee_id, attendance_date, status) VALUES
(1,101,'2025-04-01','Present'),(2,101,'2025-04-02','Present'),
(3,102,'2025-04-01','Absent'),(4,102,'2025-04-02','Present'),
(5,103,'2025-04-01','Leave'),(6,103,'2025-04-02','Present'),
(7,104,'2025-04-01','Present'),(8,105,'2025-04-01','Absent');
```

## 4. Report Query (Q1)

```sql
SELECT e.employee_name, d.department_name, e.email,
       s.basic_salary, s.bonus, a.attendance_date, a.status
FROM Employee e
LEFT JOIN Department d ON e.department_id = d.department_id
LEFT JOIN Salary s     ON e.employee_id   = s.employee_id
LEFT JOIN Attendance a ON e.employee_id   = a.employee_id
ORDER BY e.employee_name, a.attendance_date;
```

---

## 5. AI Prompt (copy everything below into your AI tool)

````
Build a complete HR Management Dashboard website using PHP 8+ (PDO, prepared statements) and MySQL. Use plain HTML, CSS and vanilla JavaScript only. No PHP framework, no CSS framework. Chart.js via CDN is allowed if a chart is needed.

## Database
Database name: hr_management. Use the schema and sample data in database/schema.sql and database/seed.sql (provided below). Generate those two files exactly as given, and a config/database.php with a PDO connection (host, db name, user, password as constants at the top, ERRMODE_EXCEPTION, utf8mb4).

[PASTE schema.sql AND seed.sql FROM SECTIONS 2 AND 3 HERE]

## Project structure
Follow this structure exactly:

[PASTE THE TREE FROM SECTION 1 HERE]

## Pages and features
1. dashboard.php: 4 stat cards (Employees, Departments, Total Payroll, Present Today) with count-up animation. Below them, a bar or donut chart of employees per department and a small table of the latest attendance records.
2. employees.php: table with search, sortable columns, add/edit in a modal, delete with a confirm dialog. Fields: name, department (select), email.
3. departments.php: same CRUD pattern. Fields: department name.
4. salaries.php: same CRUD pattern. Fields: employee (select), basic salary, bonus (optional). Show total (basic + bonus) as a computed column.
5. attendance.php: same CRUD pattern with date and status (Present, Absent, Leave). Filters: employee, status, date range.
6. report.php: the HR report with columns employee_name, department_name, email, basic_salary, bonus, attendance_date, status. Use the LEFT JOIN query below. Add filters (department, status, date range), a search box, a Export CSV button (actions/report_export.php) and a Print button.

Report query:
SELECT e.employee_name, d.department_name, e.email, s.basic_salary, s.bonus, a.attendance_date, a.status
FROM Employee e
LEFT JOIN Department d ON e.department_id = d.department_id
LEFT JOIN Salary s ON e.employee_id = s.employee_id
LEFT JOIN Attendance a ON e.employee_id = a.employee_id
ORDER BY e.employee_name, a.attendance_date;

## Layout
- SaaS-style dashboard layout.
- Fixed left sidebar with logo mark, nav links (Dashboard, Employees, Departments, Salaries, Attendance, Report) using inline SVG icons plus labels, and the active link highlighted with a colored pill and an animated indicator.
- The sidebar collapses to icons only on tablet widths and becomes a slide-in drawer with a hamburger button on mobile.
- Top bar on the right side of the sidebar: page title on the left, theme toggle button on the right. Nothing else.
- Main content area has a max width, generous padding, and card-based sections.

## Design
- Simple, modern, colourful and aesthetic. Clean whitespace, rounded corners (12-16px), soft layered shadows, subtle gradients used sparingly.
- Palette (define as CSS variables in variables.css):
  - Primary: indigo/violet (#6366F1 to #8B5CF6 gradient for primary buttons and active nav)
  - Accents: emerald (#10B981), amber (#F59E0B), rose (#F43F5E), sky (#0EA5E9)
  - Each stat card gets its own accent color with a tinted icon background.
  - Status badges: Present = emerald, Absent = rose, Leave = amber (soft tinted background, colored text, small dot).
  - Each department gets a consistent colored chip.
- Typography: Inter (Google Fonts), clear hierarchy, tabular numbers for money.
- Light mode is the default. Provide a dark and light toggle (sun/moon icon) that switches via a data-theme attribute on <html>, saves the choice in localStorage, and is applied before first paint to avoid a flash. Dark mode uses deep slate backgrounds (not pure black) with the same accent colors adjusted for contrast.
- Tables: sticky header, row hover highlight, zebra-free clean rows, right-aligned numbers, currency formatting.
- Forms and modals: floating or clear labels, focus rings in the primary color, inline validation messages.

## Animations and transitions
- Smooth 200-300ms transitions on theme change (background, text, border colors), hover states, buttons and nav links.
- Page content fades and slides up on load, with staggered entry for cards and table rows.
- Stat numbers count up on load.
- Modals scale and fade in with a blurred backdrop.
- Toast notifications slide in from the corner after save or delete, then auto-dismiss.
- Buttons have a subtle lift on hover and press effect on click.
- Respect prefers-reduced-motion by disabling non-essential animation.

## UI text rules
- Keep the UI minimal. No marketing copy, no helper paragraphs, no decorative subtitles, no lorem ipsum.
- Only use necessary text: nav labels, page titles, table headers, form labels, button labels, and short toasts or empty states ("No records").

## Code requirements
- Use PDO prepared statements for every query. Escape all output with htmlspecialchars.
- Add CSRF tokens to every form and validate on the server.
- Validate and sanitize all input server-side (required fields, numeric salary values, valid email, valid date, status limited to Present, Absent, Leave).
- Put database logic in the models/ classes, not inside the page files.
- Deleting a department or employee that has related records must be handled gracefully (block with a clear message or delete dependents in a transaction).
- Use the Post/Redirect/Get pattern after form submission.
- Reuse includes/header.php, sidebar.php, topbar.php and footer.php on every page; set the page title with a variable.
- Keep code clean, commented where useful, and consistent in naming.
- Fully responsive from 360px up.
- Accessible: semantic HTML, labels on inputs, visible focus states, adequate contrast in both themes, aria-labels on icon-only buttons.

## Deliverables
1. Every file in the project structure with complete working code, no placeholders or TODOs.
2. README.md with setup steps (import schema.sql and seed.sql, edit config/database.php, run with `php -S localhost:8000` or XAMPP/WAMP).
3. Make sure the report page displays the sample data correctly and the CSV export works.

Output each file with its path as a heading followed by a code block.
````

---

## 6. Tips for Best Results

- If the AI cuts off, ask it to continue with the next files in the structure (CSS first, then includes, models, pages, actions).
- Ask for one layer at a time if your tool has output limits: 1) database + config + includes + CSS, 2) models + actions, 3) pages + JS.
- Test the report page first; it exercises all four tables.
