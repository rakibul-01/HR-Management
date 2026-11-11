<?php
/**
 * Salary Model
 */
class Salary {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get all salaries with employee and department info
     */
    public function getAll(): array {
        $stmt = $this->db->query("
            SELECT s.salary_id, s.employee_id, s.basic_salary, s.bonus,
                   (s.basic_salary + COALESCE(s.bonus, 0)) AS total_salary,
                   e.employee_name, d.department_name
            FROM Salary s
            JOIN Employee e ON s.employee_id = e.employee_id
            LEFT JOIN Department d ON e.department_id = d.department_id
            ORDER BY s.salary_id ASC
        ");
        return $stmt->fetchAll();
    }

    /**
     * Get salary by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT s.*, e.employee_name
            FROM Salary s
            JOIN Employee e ON s.employee_id = e.employee_id
            WHERE s.salary_id = ?
        ");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Create or assign salary
     */
    public function create(int $employeeId, float $basicSalary, ?float $bonus = 0.0): int {
        $stmt = $this->db->prepare("
            INSERT INTO Salary (employee_id, basic_salary, bonus)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$employeeId, $basicSalary, $bonus ?: 0.00]);
        return (int)$this->db->lastInsertId();
    }

    /**
     * Update salary
     */
    public function update(int $id, int $employeeId, float $basicSalary, ?float $bonus = 0.0): bool {
        $stmt = $this->db->prepare("
            UPDATE Salary
            SET employee_id = ?, basic_salary = ?, bonus = ?
            WHERE salary_id = ?
        ");
        return $stmt->execute([$employeeId, $basicSalary, $bonus ?: 0.00, $id]);
    }

    /**
     * Delete salary record
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM Salary WHERE salary_id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Compute total payroll sum (basic + bonus)
     */
    public function getTotalPayroll(): float {
        $stmt = $this->db->query("
            SELECT COALESCE(SUM(basic_salary + COALESCE(bonus, 0)), 0) AS total_payroll
            FROM Salary
        ");
        return (float)$stmt->fetchColumn();
    }
}
