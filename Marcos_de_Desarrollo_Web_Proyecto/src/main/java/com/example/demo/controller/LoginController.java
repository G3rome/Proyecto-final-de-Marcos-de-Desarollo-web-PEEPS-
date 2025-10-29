package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {
    

    private List<Map<String, Object>> usuarios = new ArrayList<>();
    private Long nextId = 1L;
    
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> inicio() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "¡Bienvenido a Peeps!");
        respuesta.put("estado", "OK");
        respuesta.put("version", "1.0.0");
        return ResponseEntity.ok(respuesta);
    }
    
    @GetMapping("/usuarios")
    public ResponseEntity<List<Map<String, Object>>> obtenerUsuarios() {
        return ResponseEntity.ok(usuarios);
    }
    
    @PostMapping("/usuarios/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody Map<String, String> datos) {
        Map<String, Object> respuesta = new HashMap<>();
        

        if (datos.get("nombre") == null || datos.get("email") == null || datos.get("password") == null) {
            respuesta.put("error", "Faltan datos requeridos");
            return ResponseEntity.badRequest().body(respuesta);
        }

        Map<String, Object> usuario = new HashMap<>();
        usuario.put("id", nextId++);
        usuario.put("nombre", datos.get("nombre"));
        usuario.put("email", datos.get("email"));
        usuario.put("password", datos.get("password"));
        usuario.put("fechaRegistro", new Date());
        
        usuarios.add(usuario);
        
        respuesta.put("mensaje", "Usuario registrado exitosamente");
        respuesta.put("usuario", usuario);
        return ResponseEntity.ok(respuesta);
    }
    

    @PostMapping("/usuarios/login")
    public ResponseEntity<Map<String, Object>> iniciarSesion(@RequestBody Map<String, String> datos) {
        Map<String, Object> respuesta = new HashMap<>();
        
        String email = datos.get("email");
        String password = datos.get("password");

        for (Map<String, Object> usuario : usuarios) {
            if (usuario.get("email").equals(email) && usuario.get("password").equals(password)) {
                respuesta.put("mensaje", "Login exitoso");
                respuesta.put("usuario", usuario);
                return ResponseEntity.ok(respuesta);
            }
        }
        
        respuesta.put("error", "Email o contraseña incorrectos");
        return ResponseEntity.badRequest().body(respuesta);
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Sirve tu conexion ");
        respuesta.put("estado", "OK");
        respuesta.put("usuariosRegistrados", usuarios.size());
        respuesta.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(respuesta);
    }
}
