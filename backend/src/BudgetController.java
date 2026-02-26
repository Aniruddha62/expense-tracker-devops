package com.expense.controller;

import com.expense.model.Budget;
import com.expense.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> save(@Valid @RequestBody Budget budget) {
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetService.save(budget));
    }

    @GetMapping
    public ResponseEntity<?> getByMonthYear(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(budgetService.getByMonthYear(month, year));
    }

    @GetMapping("/vs-actual")
    public ResponseEntity<Map<String, Object>> vsActual(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.ok(budgetService.getBudgetVsActual(month, year));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
