package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

// Re-adaptacion de controlador para el modulo premium
@Controller
public class PremiumController {

    @GetMapping("/premium")
    public String showPremiumPage(Model model) {

        return "premium-index :: content";
    }
}
