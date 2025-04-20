package com.example.alpez.Controller;

import com.example.alpez.Entity.PaymentEntity;
import com.example.alpez.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/save")
    public PaymentEntity createPayment(@RequestBody PaymentEntity payment) {
        return paymentService.createPayment(payment);
    }

    @GetMapping("/getAll")
    public List<PaymentEntity> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{paymentId}")
    public PaymentEntity getPaymentById(@PathVariable Long paymentId) {
        return paymentService.getPaymentById(paymentId).orElse(null);
    }

    @PutMapping("/update/{paymentId}")
    public PaymentEntity updatePayment(@PathVariable Long paymentId, @RequestBody PaymentEntity updatedPayment) {
        return paymentService.updatePayment(paymentId, updatedPayment);
    }

    @DeleteMapping("/delete/{paymentId}")
    public String deletePayment(@PathVariable Long paymentId) {
        boolean deleted = paymentService.deletePayment(paymentId);
        if (deleted) {
            return "Payment deleted successfully.";
        }
        return "Payment not found.";
    }
}
