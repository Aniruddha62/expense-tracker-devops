package com.expense;

import com.expense.model.Expense;
import com.expense.repository.ExpenseRepository;
import com.expense.service.ExpenseService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock ExpenseRepository expenseRepository;
    @InjectMocks ExpenseService expenseService;

    @Test
    void shouldCreateExpense() {
        Expense e = Expense.builder()
            .title("Test").amount(new BigDecimal("100")).date(LocalDate.now())
            .category(Expense.Category.FOOD).build();
        when(expenseRepository.save(e)).thenReturn(e);

        Expense result = expenseService.create(e);

        assertNotNull(result);
        assertEquals("Test", result.getTitle());
        verify(expenseRepository).save(e);
    }

    @Test
    void shouldReturnAllExpenses() {
        List<Expense> list = List.of(
            Expense.builder().title("A").amount(BigDecimal.TEN).build(),
            Expense.builder().title("B").amount(BigDecimal.ONE).build()
        );
        when(expenseRepository.findAllOrderByDateDesc()).thenReturn(list);

        List<Expense> result = expenseService.getAll();
        assertEquals(2, result.size());
    }

    @Test
    void shouldReturnExpenseById() {
        Expense e = Expense.builder().id(1L).title("Rent").build();
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(e));

        Optional<Expense> result = expenseService.getById(1L);
        assertTrue(result.isPresent());
        assertEquals("Rent", result.get().getTitle());
    }

    @Test
    void shouldDeleteExpense() {
        expenseService.delete(1L);
        verify(expenseRepository).deleteById(1L);
    }

    @Test
    void shouldUpdateExpense() {
        Expense existing = Expense.builder().id(1L).title("Old").amount(new BigDecimal("100"))
            .date(LocalDate.now()).category(Expense.Category.FOOD)
            .paymentMethod(Expense.PaymentMethod.CASH).build();
        Expense updated  = Expense.builder().title("New").amount(new BigDecimal("200"))
            .date(LocalDate.now()).category(Expense.Category.TRANSPORT)
            .paymentMethod(Expense.PaymentMethod.CARD).build();

        when(expenseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(expenseRepository.save(any())).thenReturn(existing);

        Expense result = expenseService.update(1L, updated);
        assertNotNull(result);
        verify(expenseRepository).save(existing);
    }
}
