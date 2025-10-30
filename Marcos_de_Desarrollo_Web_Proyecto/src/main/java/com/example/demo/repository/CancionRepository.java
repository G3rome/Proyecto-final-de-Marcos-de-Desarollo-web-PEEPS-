package com.example.demo.repository; // Asegúrate que esté en el paquete 'repository'

import com.example.demo.model.Cancion; // Importa la Entidad que acabas de crear
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Le dice a Spring que esto es un Repositorio (un administrador de datos)
public interface CancionRepository extends JpaRepository<Cancion, Long> {
    // (1) Al extender JpaRepository, Spring nos regala métodos como:
    // - save() -> (Guardar una canción)
    // - findById() -> (Buscar una canción por su ID)
    // - findAll() -> (Obtener TODAS las canciones)
    // - deleteById() -> (Borrar una canción)

    // (2) Esta es una "Consulta Derivada" para tu buscador.
    // Al nombrar el método así, JPA entiende que debe crear una consulta SQL que haga:
    // "Buscar por Título O por Artista, ignorando mayúsculas y minúsculas"
    List<Cancion> findByTituloContainingIgnoreCaseOrArtistaContainingIgnoreCase(String titulo, String artista);
}