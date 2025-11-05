package com.example.demo.controller;


import com.example.demo.model.Cancion;
import com.example.demo.repository.CancionRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
import java.util.Map;


@Controller
@RequestMapping("/music")
public class MusicController {
    
    // Inyecta el repositorio para usar la BD
    @Autowired
    private CancionRepository cancionRepository;


    @GetMapping("/reproductor")
    public String reproductor(@RequestParam Long id, Model model) {
        
        Cancion cancion = cancionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Canción no encontrada"));
        
        model.addAttribute("cancion", cancion);
        
        return "reproductor"; 
    }

    /**
    @ResponseBody 
     */
    @GetMapping("/api/buscar")
    @ResponseBody 
    public List<Cancion> buscarCanciones(@RequestParam String query) {
        return cancionRepository.findByTituloContainingIgnoreCaseOrArtistaContainingIgnoreCase(query, query);
    }

    // --- NUEVO ENDPOINT (1): Para alternar el estado de 'Like' ---
    @PostMapping("/api/cancion/{id}/toggle-like")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id) {
        Optional<Cancion> optCancion = cancionRepository.findById(id);
        
        if (optCancion.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Cancion cancion = optCancion.get();
        // Invierte el estado actual
        cancion.setLiked(!cancion.isLiked()); 
        cancionRepository.save(cancion);
        
        Map<String, Object> respuesta = Map.of(
            "mensaje", "Estado de 'Like' actualizado",
            "cancionId", cancion.getId(),
            "esLiked", cancion.isLiked()
        );
        return ResponseEntity.ok(respuesta);
    }

    // --- NUEVO ENDPOINT (2): Para obtener todas las canciones con 'Like' ---
    @GetMapping("/api/canciones/liked")
    @ResponseBody
    public List<Cancion> getLikedSongs() {
        return cancionRepository.findByLikedTrue();
    }
    
}