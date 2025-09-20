// PaymentService.java
package com.iut.clearaid.config.payment;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service

public class PaymentService {

    public PaymentResponse processPayment(PaymentRequest request) {
        String txId = UUID.randomUUID().toString();

        // validation
        boolean isValid = request.getAmount() != null && request.getAmount().doubleValue() >= 100.0
                && request.getBankAccountNumber() != null
                && request.getBankAccountNumber().matches("\\d{6,17}");

        if (isValid) {
            return new PaymentResponse(
                    txId,
                    "SUCCESS",
                    String.format("Payment of %s processed for account %s",
                            request.getAmount(), maskAccount(request.getBankAccountNumber())),
                    Instant.now()
            );
        } else {
            return new PaymentResponse(
                    txId,
                    "FAILED",
                    "Payment rejected: amount must be >= 100 and account number must be 6–17 digits.",
                    Instant.now()
            );
        }
    }

    private String maskAccount(String accountNumber) {
        if (accountNumber == null) return "";
        int len = accountNumber.length();
        if (len <= 4) return accountNumber;
        return "*".repeat(len - 4) + accountNumber.substring(len - 4);
    }
}
