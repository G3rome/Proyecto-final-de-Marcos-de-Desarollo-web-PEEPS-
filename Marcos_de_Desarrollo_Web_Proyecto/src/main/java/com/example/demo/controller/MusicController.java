package com.example.demo.controller;

// --- Importaciones necesarias ---
import com.example.demo.model.Cancion; // (1) Importa tu Entidad
import com.example.demo.repository.CancionRepository; // (2) Importa tu Repositorio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Controller
@RequestMapping("/music")
public class MusicController {
    
    // (3) Inyecta el repositorio para usar la BD
    @Autowired
    private CancionRepository cancionRepository;

    /**
     * (4) MÉTODO MODIFICADO:
     * Ahora recibe un 'id' (Long) en lugar de 4 Strings.
     */
    @GetMapping("/reproductor")
    public String reproductor(@RequestParam Long id, Model model) {
        
        // (5) Busca la canción por su ID en la BD.
        // Si no la encuentra, lanza un error 404 (Canción no encontrada).
        Cancion cancion = cancionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Canción no encontrada"));
        
        // (6) Pasa la canción encontrada al modelo (esto ya lo hacías y está perfecto).
        model.addAttribute("cancion", cancion);
        
        return "reproductor"; // Renderiza 'reproductor.html'
    }

    /**
     * (7) MÉTODO NUEVO: API PARA EL BUSCADOR
     * Este endpoint reemplazará tu 'cancionesMock' en main.js
     * @ResponseBody le dice a Spring que devuelva JSON, no una página HTML.
     */
    @GetMapping("/api/buscar")
    @ResponseBody 
    public List<Cancion> buscarCanciones(@RequestParam String query) {
        // (8) Usa la consulta personalizada que definimos en el Repositorio
        return cancionRepository.findByTituloContainingIgnoreCaseOrArtistaContainingIgnoreCase(query, query);
    }
}