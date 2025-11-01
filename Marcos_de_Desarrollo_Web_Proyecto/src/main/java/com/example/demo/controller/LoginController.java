package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Usuario;

import org.springframework.http.ResponseEntity;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.repository.UsuarioRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    // Experimentacion:
    @Autowired
    private UsuarioRepository usuarioRepository;

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

    // Codfificacion original:
    // NOTA: Borrar si hay fallos con codigo inferior
    // @GetMapping("/usuarios")
    // public ResponseEntity<List<Map<String, Object>>> obtenerUsuarios() {
    // return ResponseEntity.ok(usuarios);
    // }
    // Experimetacion:
    // Inicio:
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> obtenerUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }
    // Fin

    // Expermimentacion-03:
    // Inicio:
    @PostMapping("/usuarios/registro")
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody Usuario datos) {
        Map<String, Object> respuesta = new HashMap<>();

        if (datos.getNombreCompleto() == null || datos.getEmail() == null || datos.getContrasena() == null) {
            respuesta.put("error", "Faltan datos requeridos");
            return ResponseEntity.badRequest().body(respuesta);
        }

        // Validar si ya existe
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
    // Fin

    @PostMapping("/usuarios/login")
    public ResponseEntity<Map<String, Object>> iniciarSesion(@RequestBody Map<String, String> datos) {
        Map<String, Object> respuesta = new HashMap<>();

        String email = datos.get("email");
        String contrasena = datos.get("contrasena");

        // Experimetacion-01:
        // Inicio:
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        // Fin

        // Exprimentacion-02 (Presenta fallos):
        // Inicio:
        if (usuarioOpt.isPresent() && usuarioOpt.get().getContrasena().equals(contrasena)) {
            respuesta.put("mensaje", "Login exitoso");
            respuesta.put("usuario", usuarioOpt.get());
            return ResponseEntity.ok(respuesta);
        }
        // Fin

        // Codigo original:
        // for (Map<String, Object> usuario : usuarios) {
        // if (usuario.get("email").equals(email) &&
        // usuario.get("password").equals(password)) {
        // respuesta.put("mensaje", "Login exitoso");
        // respuesta.put("usuario", usuario);
        // return ResponseEntity.ok(respuesta);
        // }
        // }

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
