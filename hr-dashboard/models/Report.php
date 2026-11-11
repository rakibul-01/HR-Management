<?php
/**
 * Report Model
 * Executes the joined HR report query with filters
 */
class Report {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Fetch joined HR records with optional filtering
     *
     * @param array $filters (department_id, status, start_date, end_date, search)
     * @return array
     */
    public function getJoinedReport(array $filters = []): array {
        $sql = "
            SELECT e.employee_name, d.department_name, e.email,
                   s.basic_salary, s.bonus, (COALESCE(s.basic_salary, 0) + COALESCE(s.bonus, 0)) AS total_compensation,
                   a.attendance_date, a.status
            FROM Employee e
            LEFT JOIN Department d ON e.department_id = d.department_id
            LEFT JOIN Salary s     ON e.employee_id   = s.employee_id
            LEFT JOIN Attendance a ON e.employee_id   = a.employee_id
            WHERE 1=1
        ";
        $params = [];

        if (!empty($filters['department_id'])) {
            $sql .= " AND e.department_id = ?";
            $params[] = (int)$filters['department_id'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND a.status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['start_date'])) {
            $sql .= " AND a.attendance_date >= ?";
            $params[] = $filters['start_date'];
        }

        if (!empty($filters['end_date'])) {
            $sql .= " AND a.attendance_date <= ?";
            $params[] = $filters['end_date'];
        }

        if (!empty($filters['search'])) {
            $sql .= " AND (e.employee_name LIKE ? OR e.email LIKE ? OR d.department_name LIKE ?)";
            $term = '%' . trim($filters['search']) . '%';
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $sql .= " ORDER BY e.employee_name ASC, a.attendance_date ASC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
