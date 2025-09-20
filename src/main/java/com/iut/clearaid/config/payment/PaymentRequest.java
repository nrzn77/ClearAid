// PaymentRequest.java
package com.iut.clearaid.config.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
public class PaymentRequest {

    @NotBlank(message = "bankAccountNumber is required")
    // simple pattern: digits only, 6-24 digits (adjust as needed)
    @Pattern(regexp = "\\d{6,24}", message = "bankAccountNumber must be 6-24 digits")
    private String bankAccountNumber;

    @NotNull(message = "amount is required")
    @DecimalMin(value = "100.00", message = "amount must be >= 0.01")
    private BigDecimal amount;

    @NotBlank(message = "paymentInfo is required")
    private String paymentInfo; // free-form (e.g. payer name, note)

    public PaymentRequest() {}

    public PaymentRequest(String bankAccountNumber, BigDecimal amount, String paymentInfo) {
        this.bankAccountNumber = bankAccountNumber;
        this.amount = amount;
        this.paymentInfo = paymentInfo;
    }

    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentInfo() { return paymentInfo; }
    public void setPaymentInfo(String paymentInfo) { this.paymentInfo = paymentInfo; }
}
