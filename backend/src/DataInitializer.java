package com.expense.config;

import com.expense.model.Expense;
import com.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ExpenseRepository expenseRepository;

    @Override
    public void run(String... args) {
        if (expenseRepository.count() == 0) {
            expenseRepository.save(Expense.builder()
                .title("Grocery Shopping").amount(new BigDecimal("1850.00"))
                .date(LocalDate.now().minusDays(1)).category(Expense.Category.FOOD)
                .paymentMethod(Expense.PaymentMethod.UPI).build());
            expenseRepository.save(Expense.builder()
                .title("Monthly Bus Pass").amount(new BigDecimal("500.00"))
                .date(LocalDate.now().minusDays(2)).category(Expense.Category.TRANSPORT)
                .paymentMethod(Expense.PaymentMethod.CARD).build());
            expenseRepository.save(Expense.builder()
                .title("Netflix Subscription").amount(new BigDecimal("649.00"))
                .date(LocalDate.now().minusDays(3)).category(Expense.Category.ENTERTAINMENT)
                .paymentMethod(Expense.PaymentMethod.CARD).build());
            expenseRepository.save(Expense.builder()
                .title("Electricity Bill").amount(new BigDecimal("1200.00"))
                .date(LocalDate.now().minusDays(5)).category(Expense.Category.UTILITIES)
                .paymentMethod(Expense.PaymentMethod.NET_BANKING).build());
            expenseRepository.save(Expense.builder()
                .title("Online Course").amount(new BigDecimal("2999.00"))
                .date(LocalDate.now().minusDays(7)).category(Expense.Category.EDUCATION)
                .paymentMethod(Expense.PaymentMethod.CARD).build());
        }
    }
}
