package com.example.demo.controller;


import com.example.demo.model.Cancion;
import com.example.demo.repository.CancionRepository; 
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
}