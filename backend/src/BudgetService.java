package com.expense.service;

import com.expense.model.Budget;
import com.expense.model.Expense;
import com.expense.repository.BudgetRepository;
import com.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public Budget save(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> getByMonthYear(int month, int year) {
        return budgetRepository.findByMonthAndYear(month, year);
    }

    public Map<String, Object> getBudgetVsActual(int month, int year) {
        List<Budget> budgets = budgetRepository.findByMonthAndYear(month, year);
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end   = start.withDayOfMonth(start.lengthOfMonth());
        List<Object[]> actuals = expenseRepository.sumByCategory(start, end);

        Map<String, BigDecimal> actualMap = new HashMap<>();
        for (Object[] row : actuals) {
            actualMap.put(row[0].toString(), (BigDecimal) row[1]);
        }

        List<Map<String, Object>> comparison = new ArrayList<>();
        for (Budget b : budgets) {
            BigDecimal spent = actualMap.getOrDefault(b.getCategory().name(), BigDecimal.ZERO);
            double pct = b.getMonthlyLimit().compareTo(BigDecimal.ZERO) > 0
                ? spent.doubleValue() / b.getMonthlyLimit().doubleValue() * 100 : 0;
            Map<String, Object> item = new HashMap<>();
            item.put("category",   b.getCategory());
            item.put("budget",     b.getMonthlyLimit());
            item.put("spent",      spent);
            item.put("remaining",  b.getMonthlyLimit().subtract(spent));
            item.put("percentage", Math.round(pct));
            item.put("overBudget", spent.compareTo(b.getMonthlyLimit()) > 0);
            comparison.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("month", month);
        result.put("year",  year);
        result.put("budgetComparison", comparison);
        return result;
    }

    public void delete(Long id) { budgetRepository.deleteById(id); }
}
