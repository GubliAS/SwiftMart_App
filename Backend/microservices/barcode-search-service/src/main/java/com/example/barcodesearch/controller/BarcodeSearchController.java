package com.example.barcodesearch.controller;

import com.example.barcodesearch.service.BarcodeSearchService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/barcode")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BarcodeSearchController {
    private final BarcodeSearchService barcodeSearchService;

    @GetMapping("/search/{barcode}")
    public ResponseEntity<?> searchByBarcode(@PathVariable String barcode) {
        try {
            Object product = barcodeSearchService.searchByBarcode(barcode);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Error searching barcode: " + e.getMessage()));
        }
    }

    @PostMapping("/scan")
    public ResponseEntity<?> scanBarcode(@RequestBody BarcodeScanRequest request) {
        try {
            Object product = barcodeSearchService.searchByBarcode(request.getBarcode());
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Error scanning barcode: " + e.getMessage()));
        }
    }

    public static class BarcodeScanRequest {
        private String barcode;

        public String getBarcode() {
            return barcode;
        }

        public void setBarcode(String barcode) {
            this.barcode = barcode;
        }
    }

    @Data
    public static class ErrorResponse {
        private final String error;
    }
} 