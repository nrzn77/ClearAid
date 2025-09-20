package com.iut.clearaid.utility;

import com.iut.clearaid.config.payment.PaymentRequest;
import com.iut.clearaid.config.payment.PaymentResponse;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

public class PDFGenerator {

    public static byte[] generateReceipt(PaymentResponse response, PaymentRequest request) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Payment Receipt", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" ")); // empty line

            // Receipt Details
            document.add(new Paragraph("Transaction ID: " + response.getTransactionId()));
            document.add(new Paragraph("Status: " + response.getStatus()));
            document.add(new Paragraph("Message: " + response.getMessage()));
            document.add(new Paragraph("Timestamp: " +
                    DateTimeFormatter.ISO_INSTANT.format(response.getTimestamp())));

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Account: " + request.getBankAccountNumber()));
            document.add(new Paragraph("Amount: " + request.getAmount()));
            document.add(new Paragraph("Payment Info: " + request.getPaymentInfo()));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF receipt", e);
        }
    }
}
