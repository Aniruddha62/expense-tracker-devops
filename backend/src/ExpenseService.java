package com.expense.service;

import com.expense.model.Expense;
import com.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public Expense create(Expense expense) {
        log.info("Creating expense: {} - {}", expense.getTitle(), expense.getAmount());
        return expenseRepository.save(expense);
    }

    public List<Expense> getAll() {
        return expenseRepository.findAllOrderByDateDesc();
    }

    public Optional<Expense> getById(Long id) {
        return expenseRepository.findById(id);
    }

    public List<Expense> getByCategory(Expense.Category category) {
        return expenseRepository.findByCategory(category);
    }

    public List<Expense> getByDateRange(LocalDate start, LocalDate end) {
        return expenseRepository.findByDateBetween(start, end);
    }

    public List<Expense> search(String keyword) {
        return expenseRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public Expense update(Long id, Expense updated) {
        Expense existing = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found: " + id));
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setAmount(updated.getAmount());
        existing.setDate(updated.getDate());
        existing.setCategory(updated.getCategory());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setNotes(updated.getNotes());
        return expenseRepository.save(existing);
    }

    public void delete(Long id) {
        expenseRepository.deleteById(id);
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    public Map<String, Object> getMonthlySummary(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end   = start.withDayOfMonth(start.lengthOfMonth());

        BigDecimal total = expenseRepository.sumAmountByDateRange(start, end);
        List<Object[]> byCategory = expenseRepository.sumByCategory(start, end);

        Map<String, BigDecimal> categoryBreakdown = new LinkedHashMap<>();
        for (Object[] row : byCategory) {
            categoryBreakdown.put(row[0].toString(), (BigDecimal) row[1]);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("year", year);
        summary.put("month", month);
        summary.put("totalSpent", total != null ? total : BigDecimal.ZERO);
        summary.put("categoryBreakdown", categoryBreakdown);
        summary.put("expenseCount", expenseRepository.findByDateBetween(start, end).size());
        return summary;
    }

    public Map<String, Object> getDashboardStats() {
        LocalDate now       = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate weekStart  = now.minusDays(now.getDayOfWeek().getValue() - 1);

        BigDecimal monthTotal = expenseRepository.sumAmountByDateRange(monthStart, now);
        BigDecimal weekTotal  = expenseRepository.sumAmountByDateRange(weekStart, now);
        List<Object[]> byCategory = expenseRepository.sumByCategory(monthStart, now);

        Map<String, BigDecimal> categoryBreakdown = new LinkedHashMap<>();
        for (Object[] row : byCategory) {
            categoryBreakdown.put(row[0].toString(), (BigDecimal) row[1]);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalThisMonth",  monthTotal != null ? monthTotal : BigDecimal.ZERO);
        stats.put("totalThisWeek",   weekTotal  != null ? weekTotal  : BigDecimal.ZERO);
        stats.put("totalExpenses",   expenseRepository.count());
        stats.put("categoryBreakdown", categoryBreakdown);
        stats.put("recentExpenses",  expenseRepository.findAllOrderByDateDesc()
            .stream().limit(5).toList());
        return stats;
    }
}
