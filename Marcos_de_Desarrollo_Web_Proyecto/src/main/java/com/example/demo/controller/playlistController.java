package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.PlaylistRepository;
import com.example.demo.model.Playlist;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;

import com.example.demo.repository.CancionRepository;
import com.example.demo.repository.PlaylistCancionRepository;
import com.example.demo.model.Cancion;
import com.example.demo.model.PlaylistCancion;
import java.util.Map;
import java.util.Optional;

@Controller
public class playlistController {

    // Inyectamos el repositorio
    @Autowired
    private PlaylistRepository playlistRepository;

    @GetMapping("/playlist")
    public String playlist(
            @RequestHeader(value = "X-Requested-With", required = false) String requestedWith,
            Model model) {

        // Lógica nueva
        // Buscar todas las playlists de la base de datos
        List<Playlist> misPlaylists = playlistRepository.findAll();

        // Pasarlas al modelo para que Thymeleaf las use
        model.addAttribute("playlists", misPlaylists);

        // El resto de tu lógica SPA se queda igual
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "playlist-index :: playlistContent";
        }

        model.addAttribute("view", "playlist-index :: playlistContent");
        return "index";
    }

    @Autowired
    private CancionRepository cancionRepository;

    @Autowired
    private PlaylistCancionRepository playlistCancionRepository;

    // NUEVOS MÉTODOS API para crear y añadir canciones

    @PostMapping("/api/playlist/crear")
    @ResponseBody // Le dice a Spring que devuelva JSON, no una página HTML
    public Playlist crearPlaylist(@RequestBody Map<String, String> payload) {

        // Obtenemos el nombre que nos envió el JavaScript
        String nombrePlaylist = payload.get("nombre");

        // Creamos la nueva playlist
        Playlist nuevaPlaylist = new Playlist();
        nuevaPlaylist.setNombre(nombrePlaylist);

        // La guardamos en la base de datos y la devolvemos
        return playlistRepository.save(nuevaPlaylist);
    }

    @PostMapping("/api/playlist/agregarCancion")
    @ResponseBody
    public ResponseEntity<Map<String, String>> agregarCancionAPlaylist(@RequestBody Map<String, Long> payload) {

        Long cancionId = payload.get("cancionId");
        // Lee el playlistId que envía el frontend
        Long playlistId = payload.get("playlistId");

        if (playlistId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se proporcionó ID de playlist"));
        }

        // Busca la playlist y la canción en la BD
        Optional<Playlist> optPlaylist = playlistRepository.findById(playlistId);
        Optional<Cancion> optCancion = cancionRepository.findById(cancionId);

        if (optPlaylist.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La playlist no existe"));
        }
        if (optCancion.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "La canción no existe"));
        }

        Playlist playlist = optPlaylist.get();
        Cancion cancion = optCancion.get();

        // Crea la nueva "conexión" entre ambas
        PlaylistCancion nuevaConexion = new PlaylistCancion();
        nuevaConexion.setPlaylist(playlist);
        nuevaConexion.setCancion(cancion);

        // Guarda la conexión
        playlistCancionRepository.save(nuevaConexion);

        // Devuelve una respuesta exitosa
        Map<String, String> respuesta = Map.of(
                "mensaje", "Canción añadida con éxito",
                "playlistNombre", playlist.getNombre(),
                "cancionTitulo", cancion.getTitulo());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/api/playlists")
    @ResponseBody
    public List<Playlist> obtenerMisPlaylists() {
        //Esto devuelve TODAS las playlists
        return playlistRepository.findAll();
    }

}