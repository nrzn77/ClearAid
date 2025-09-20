// PaymentResponse.java
package com.iut.clearaid.config.payment;


import org.springframework.stereotype.Service;
import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;


import java.time.Instant;

@Setter
@Getter
public class PaymentResponse {

    private String transactionId;
    private String status; // "SUCCESS" or "FAILED"
    private String message;
    private Instant timestamp;

    public PaymentResponse(String transactionId, String status, String message, Instant timestamp) {
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }



    // PaymentService.java
    public PaymentResponse processPayment(PaymentRequest request) {
        String txId = UUID.randomUUID().toString();

        boolean isValid = request.getAmount().doubleValue() >= 100.0
                && request.getBankAccountNumber().matches("\\d{8,17}");

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
                    "Payment rejected: amount must be >= 100 and account number must be 8–17 digits.",
                    Instant.now()
            );
        }
    }
    private String maskAccount(String accountNumber) {
        return accountNumber.replaceAll("\\d(?=\\d{4})", "*");
    }



};


