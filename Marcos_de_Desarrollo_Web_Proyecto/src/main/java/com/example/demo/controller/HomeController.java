package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller  // ← Para servir HTML
public class HomeController {
    
    @GetMapping("/")
    public String index() {
        return "index";  // Sirve templates/index.html
    }
}