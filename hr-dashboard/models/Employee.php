<?php
/**
 * Employee Model
 */
class Employee {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get all employees with joined department
     */
    public function getAll(): array {
        $stmt = $this->db->query("
            SELECT e.employee_id, e.employee_name, e.department_id, e.email,
                   d.department_name
            FROM Employee e
            LEFT JOIN Department d ON e.department_id = d.department_id
            ORDER BY e.employee_id ASC
        ");
        return $stmt->fetchAll();
    }

    /**
     * Get employee by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT e.*, d.department_name 
            FROM Employee e
            LEFT JOIN Department d ON e.department_id = d.department_id
            WHERE e.employee_id = ?
        ");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Create employee
     */
    public function create(string $name, ?int $departmentId, string $email): int {
        $stmt = $this->db->prepare("
            INSERT INTO Employee (employee_name, department_id, email)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([trim($name), $departmentId ?: null, trim($email)]);
        return (int)$this->db->lastInsertId();
    }

    /**
     * Update employee
     */
    public function update(int $id, string $name, ?int $departmentId, string $email): bool {
        $stmt = $this->db->prepare("
            UPDATE Employee 
            SET employee_name = ?, department_id = ?, email = ?
            WHERE employee_id = ?
        ");
        return $stmt->execute([trim($name), $departmentId ?: null, trim($email), $id]);
    }

    /**
     * Delete employee and dependents gracefully within transaction
     */
    public function delete(int $id): array {
        try {
            $this->db->beginTransaction();

            // Delete associated attendance
            $stmtAtt = $this->db->prepare("DELETE FROM Attendance WHERE employee_id = ?");
            $stmtAtt->execute([$id]);

            // Delete associated salary
            $stmtSal = $this->db->prepare("DELETE FROM Salary WHERE employee_id = ?");
            $stmtSal->execute([$id]);

            // Delete employee
            $stmtEmp = $this->db->prepare("DELETE FROM Employee WHERE employee_id = ?");
            $stmtEmp->execute([$id]);

            $this->db->commit();
            return ['success' => true, 'message' => "Employee and associated records deleted."];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['success' => false, 'message' => "Failed to delete employee: " . $e->getMessage()];
        }
    }

    /**
     * Total employee count
     */
    public function count(): int {
        return (int)$this->db->query("SELECT COUNT(*) FROM Employee")->fetchColumn();
    }

    /**
     * Get employee counts grouped by department (for Chart)
     */
    public function getCountsByDepartment(): array {
        $stmt = $this->db->query("
            SELECT d.department_name, COUNT(e.employee_id) as total
            FROM Department d
            LEFT JOIN Employee e ON d.department_id = e.department_id
            GROUP BY d.department_id, d.department_name
            ORDER BY total DESC
        ");
        return $stmt->fetchAll();
    }
}
