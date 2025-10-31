package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.ui.Model;

@Controller
public class playlistController {

    // Mapeo de la ruta /playlist:
    @GetMapping("/playlist")
    public String playlist(
            @RequestHeader(value = "X-Requested-With", required = false) String requestedWith,
            Model model) {
        // Si es una petición AJAX (JS)
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "playlist-index :: playlistContent";
        }

        // Si NO es AJAX (acceso directo con /playlist)
        model.addAttribute("view", "playlist-index :: playlistContent");
        return "index";
    }
}
