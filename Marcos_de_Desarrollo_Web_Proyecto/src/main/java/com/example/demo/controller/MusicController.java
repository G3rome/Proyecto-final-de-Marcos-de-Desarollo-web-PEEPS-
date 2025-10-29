package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/music")
public class MusicController {
    
    @GetMapping("/reproductor")
    public String reproductor(
            @RequestParam String titulo,
            @RequestParam String artista,
            @RequestParam String cover,
            @RequestParam String src,
            Model model) {
        
        // Crear objeto con los datos de la canción
        Cancion cancion = new Cancion(titulo, artista, cover, src);
        
        // Pasar la canción al modelo
        model.addAttribute("cancion", cancion);
        
        return "reproductor";
    }
    
    // Clase interna para representar una canción
    public static class Cancion {
        private String titulo;
        private String artista;
        private String cover;
        private String src;
        
        public Cancion(String titulo, String artista, String cover, String src) {
            this.titulo = titulo;
            this.artista = artista;
            this.cover = cover;
            this.src = src;
        }
        
        public String getTitulo() {
            return titulo;
        }
        
        public String getArtista() {
            return artista;
        }
        
        public String getCover() {
            return cover;
        }
        
        public String getSrc() {
            return src;
        }
        
        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }
        
        public void setArtista(String artista) {
            this.artista = artista;
        }
        
        public void setCover(String cover) {
            this.cover = cover;
        }
        
        public void setSrc(String src) {
            this.src = src;
        }
    }
}