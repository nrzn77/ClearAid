// PaymentGatewayController.java

package com.iut.clearaid.controller;
import com.iut.clearaid.config.payment.PaymentRequest;
import com.iut.clearaid.config.payment.PaymentResponse;
import com.iut.clearaid.config.payment.PaymentService;
import com.iut.clearaid.utility.PDFGenerator;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentGatewayController {

    private final PaymentService paymentService;

    public PaymentGatewayController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * POST /payments/process
     * { "bankAccountNumber": "1234567890", "amount": 10.50, "paymentInfo": "Donation" }
     */
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(
            @Valid @RequestBody PaymentRequest paymentRequest,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            String err = bindingResult.getFieldErrors().stream()
                    .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                    .findFirst()
                    .orElse("Invalid payment request");
            return ResponseEntity.badRequest().body(new ErrorResponse(err));
        }

        // process payment
        PaymentResponse response = paymentService.processPayment(paymentRequest);

        // generate PDF
        byte[] pdfBytes = PDFGenerator.generateReceipt(response, paymentRequest);
        String pdfBase64 = java.util.Base64.getEncoder().encodeToString(pdfBytes);

        // wrap into combined response
        Map<String, Object> result = new HashMap<>();
        result.put("paymentResponse", response);
        result.put("pdfReceiptBase64", pdfBase64);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }



    // Simple error wrapper
    @Setter
    @Getter
    static class ErrorResponse {
        private String error;
        public ErrorResponse() {}
        public ErrorResponse(String error) { this.error = error; }

    }
}
