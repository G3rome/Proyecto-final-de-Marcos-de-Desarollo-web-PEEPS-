package com.example.demo.controller;


import com.example.demo.model.Cancion; 
import com.example.demo.repository.CancionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model; 
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller
public class HomeController {
    
    @Autowired
    private CancionRepository cancionRepository; 
    
    @GetMapping("/")
    public String index(Model model) {
        

        List<Cancion> canciones = cancionRepository.findAll();
        

        model.addAttribute("canciones", canciones); 
        
        return "index";
    }
}