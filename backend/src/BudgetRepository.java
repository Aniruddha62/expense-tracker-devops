package com.expense.repository;

import com.expense.model.Budget;
import com.expense.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByMonthAndYear(int month, int year);
    Optional<Budget> findByCategoryAndMonthAndYear(Expense.Category category, int month, int year);
}
