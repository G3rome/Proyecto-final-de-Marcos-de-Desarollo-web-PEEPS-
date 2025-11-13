package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import com.example.demo.model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.ui.Model;

@Controller
public class PremiumController {

    @GetMapping("/premium")
    public String showPremiumPage(Model model) {
        // Usuario de ejemplo
        Usuario usuarioEjemplo = new Usuario();
        usuarioEjemplo.setNombreCompleto("Andrew Example");
        usuarioEjemplo.setEmail("andrew@email.com");

        model.addAttribute("usuario", usuarioEjemplo);
        return "premium-index";
    }
}
