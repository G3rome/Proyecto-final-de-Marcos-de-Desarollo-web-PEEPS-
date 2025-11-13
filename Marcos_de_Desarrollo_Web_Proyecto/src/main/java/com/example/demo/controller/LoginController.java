package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Usuario;

import org.springframework.http.ResponseEntity;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.repository.UsuarioRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> inicio() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "¡Bienvenido a Peeps!");
        respuesta.put("estado", "OK");
        respuesta.put("version", "1.0.0");
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> obtenerUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping("/usuarios/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody Usuario datos) {
        Map<String, Object> respuesta = new HashMap<>();

        if (datos.getNombreCompleto() == null || datos.getEmail() == null || datos.getContrasena() == null) {
            respuesta.put("error", "Faltan datos requeridos");
            return ResponseEntity.badRequest().body(respuesta);
        }

        if (usuarioRepository.findByEmail(datos.getEmail()).isPresent()) {
            respuesta.put("error", "El correo ya está registrado");
            return ResponseEntity.badRequest().body(respuesta);
        }

        datos.setFechaRegistro(new Date());
        Usuario usuarioGuardado = usuarioRepository.save(datos);

        respuesta.put("mensaje", "Usuario registrado exitosamente");
        respuesta.put("usuario", usuarioGuardado);
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping("/usuarios/login")
    public ResponseEntity<Map<String, Object>> iniciarSesion(@RequestBody Map<String, String> datos,
            HttpSession session) {

        Map<String, Object> respuesta = new HashMap<>();

        String email = datos.get("email");
        String contrasena = datos.get("contrasena");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent() && usuarioOpt.get().getContrasena().equals(contrasena)) {
            
            // Agregacion:
            session.setAttribute("usuarioLogueado", usuarioOpt.get());
            
            respuesta.put("mensaje", "Login exitoso");
            
            respuesta.put("usuario", usuarioOpt.get());
            
            return ResponseEntity.ok(respuesta);
        }

        respuesta.put("error", "Email o contraseña incorrectos");
        return ResponseEntity.badRequest().body(respuesta);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Sirve tu conexion ");
        respuesta.put("estado", "OK");
        respuesta.put("usuariosRegistrados", usuarioRepository.count());
        respuesta.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(respuesta);
    }
}
