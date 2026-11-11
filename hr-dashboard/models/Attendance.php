<?php
/**
 * Attendance Model
 */
class Attendance {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get attendance records with filters
     */
    public function getAll(array $filters = []): array {
        $sql = "
            SELECT a.attendance_id, a.employee_id, a.attendance_date, a.status,
                   e.employee_name, d.department_name
            FROM Attendance a
            JOIN Employee e ON a.employee_id = e.employee_id
            LEFT JOIN Department d ON e.department_id = d.department_id
            WHERE 1=1
        ";
        $params = [];

        if (!empty($filters['employee_id'])) {
            $sql .= " AND a.employee_id = ?";
            $params[] = (int)$filters['employee_id'];
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

        $sql .= " ORDER BY a.attendance_date DESC, a.attendance_id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Get single record by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT a.*, e.employee_name
            FROM Attendance a
            JOIN Employee e ON a.employee_id = e.employee_id
            WHERE a.attendance_id = ?
        ");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Create attendance entry
     */
    public function create(int $employeeId, string $date, string $status): int {
        $stmt = $this->db->prepare("
            INSERT INTO Attendance (employee_id, attendance_date, status)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$employeeId, $date, $status]);
        return (int)$this->db->lastInsertId();
    }

    /**
     * Update attendance entry
     */
    public function update(int $id, int $employeeId, string $date, string $status): bool {
        $stmt = $this->db->prepare("
            UPDATE Attendance
            SET employee_id = ?, attendance_date = ?, status = ?
            WHERE attendance_id = ?
        ");
        return $stmt->execute([$employeeId, $date, $status, $id]);
    }

    /**
     * Delete attendance record
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM Attendance WHERE attendance_id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Get latest attendance records for Dashboard
     */
    public function getLatest(int $limit = 5): array {
        $stmt = $this->db->prepare("
            SELECT a.attendance_id, a.attendance_date, a.status,
                   e.employee_name, d.department_name
            FROM Attendance a
            JOIN Employee e ON a.employee_id = e.employee_id
            LEFT JOIN Department d ON e.department_id = d.department_id
            ORDER BY a.attendance_date DESC, a.attendance_id DESC
            LIMIT ?
        ");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Count present today (or latest recorded date)
     */
    public function getPresentCount(?string $date = null): int {
        if ($date === null) {
            // Find most recent attendance date or today
            $maxDateStmt = $this->db->query("SELECT MAX(attendance_date) FROM Attendance");
            $date = $maxDateStmt->fetchColumn() ?: date('Y-m-d');
        }

        $stmt = $this->db->prepare("
            SELECT COUNT(DISTINCT employee_id) 
            FROM Attendance 
            WHERE attendance_date = ? AND status = 'Present'
        ");
        $stmt->execute([$date]);
        return (int)$stmt->fetchColumn();
    }
}
