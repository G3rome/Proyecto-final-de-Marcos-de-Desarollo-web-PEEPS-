package com.example.demo.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.model.Transaccion;
import com.example.demo.model.Usuario;
import com.example.demo.repository.TransaccionRepository;
import com.example.demo.repository.UsuarioRepository;

// Re-adaptacion de controlador para el modulo premium y de pago-transaccion
@Controller
public class PremiumController {

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/premium")
    public String showPremiumPage(Model model) {

        return "premium-index :: content";
    }

    @PostMapping("/api/premium/comprar")
    @ResponseBody
    public ResponseEntity<?> comprarPremium(@RequestBody Map<String, String> payload, Principal principal) {
        String plan = payload.get("plan");

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Debes iniciar sesión para comprar un plan"));
        }

        Usuario usuario = usuarioRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Transaccion t = new Transaccion(usuario, plan, LocalDateTime.now());
        transaccionRepository.save(t);

        return ResponseEntity.ok(Map.of("mensaje", "Compra simulada exitosa", "plan", plan));
    }
}
