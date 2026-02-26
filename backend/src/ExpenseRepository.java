package com.expense.repository;

import com.expense.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategory(Expense.Category category);

    List<Expense> findByDateBetween(LocalDate start, LocalDate end);

    List<Expense> findByCategoryAndDateBetween(Expense.Category category, LocalDate start, LocalDate end);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.date BETWEEN :start AND :end")
    BigDecimal sumAmountByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e " +
           "WHERE e.date BETWEEN :start AND :end GROUP BY e.category")
    List<Object[]> sumByCategory(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT e FROM Expense e ORDER BY e.date DESC")
    List<Expense> findAllOrderByDateDesc();

    List<Expense> findByTitleContainingIgnoreCase(String keyword);
}
