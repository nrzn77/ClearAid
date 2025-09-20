// PaymentGatewayController.java

package com.iut.clearaid.config.payment;
import com.iut.clearaid.config.payment.PaymentResponse;
import com.iut.clearaid.config.payment.PaymentService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> processPayment(@Valid @RequestBody com.iut.clearaid.config.payment.PaymentRequest paymentRequest,
                                            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // return the first validation error message
            String err = bindingResult.getFieldErrors().stream()
                    .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                    .findFirst()
                    .orElse("Invalid payment request");
            return ResponseEntity.badRequest().body(new ErrorResponse(err));
        }

        // call the service to "process" the payment
        PaymentResponse response = paymentService.processPayment(paymentRequest);

        // return 201 Created with the response body
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
