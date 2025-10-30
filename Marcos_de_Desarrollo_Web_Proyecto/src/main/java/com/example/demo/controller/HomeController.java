package com.example.demo.controller;

// --- Importaciones necesarias ---
import com.example.demo.model.Cancion; // (1) Importa tu Entidad
import com.example.demo.repository.CancionRepository; // (2) Importa tu Repositorio
import org.springframework.beans.factory.annotation.Autowired; // (3) Importa Autowired
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model; // (4) Importa Model
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List; // (5) Importa List

@Controller
public class HomeController {
    
    // (6) Inyección de Dependencia:
    // Spring te "presta" una instancia del repositorio para que puedas usarlo.
    @Autowired
    private CancionRepository cancionRepository; 
    
    @GetMapping("/")
    public String index(Model model) { // (7) Añadimos "Model model" como parámetro
        
        // (8) Obtenemos TODAS las canciones de la base de datos
        List<Cancion> canciones = cancionRepository.findAll();
        
        // (9) Añadimos la lista de canciones al "modelo".
        // Ahora, 'index.html' tendrá acceso a una variable llamada "canciones".
        model.addAttribute("canciones", canciones); 
        
        return "index"; // Sirve templates/index.html
    }
}