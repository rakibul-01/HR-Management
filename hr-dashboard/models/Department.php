<?php
/**
 * Department Model
 */
class Department {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get all departments with employee counts
     */
    public function getAll(): array {
        $stmt = $this->db->query("
            SELECT d.department_id, d.department_name, COUNT(e.employee_id) AS employee_count
            FROM Department d
            LEFT JOIN Employee e ON d.department_id = e.department_id
            GROUP BY d.department_id, d.department_name
            ORDER BY d.department_id ASC
        ");
        return $stmt->fetchAll();
    }

    /**
     * Find department by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM Department WHERE department_id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Create department
     */
    public function create(string $name): int {
        $stmt = $this->db->prepare("INSERT INTO Department (department_name) VALUES (?)");
        $stmt->execute([trim($name)]);
        return (int)$this->db->lastInsertId();
    }

    /**
     * Update department
     */
    public function update(int $id, string $name): bool {
        $stmt = $this->db->prepare("UPDATE Department SET department_name = ? WHERE department_id = ?");
        return $stmt->execute([trim($name), $id]);
    }

    /**
     * Delete department safely (blocks if employees are assigned)
     */
    public function delete(int $id): array {
        $checkStmt = $this->db->prepare("SELECT COUNT(*) FROM Employee WHERE department_id = ?");
        $checkStmt->execute([$id]);
        $empCount = (int)$checkStmt->fetchColumn();

        if ($empCount > 0) {
            return [
                'success' => false,
                'message' => "Cannot delete department: {$empCount} employee(s) are assigned to it."
            ];
        }

        $stmt = $this->db->prepare("DELETE FROM Department WHERE department_id = ?");
        $stmt->execute([$id]);
        return ['success' => true, 'message' => "Department deleted successfully."];
    }

    /**
     * Count total departments
     */
    public function count(): int {
        return (int)$this->db->query("SELECT COUNT(*) FROM Department")->fetchColumn();
    }
}
