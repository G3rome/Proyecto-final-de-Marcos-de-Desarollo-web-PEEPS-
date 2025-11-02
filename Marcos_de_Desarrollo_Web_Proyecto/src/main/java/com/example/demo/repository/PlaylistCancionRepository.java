package com.example.demo.repository;

import com.example.demo.model.PlaylistCancion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistCancionRepository extends JpaRepository<PlaylistCancion, Long> {
    // Aquí podríamos añadir métodos para buscar o borrar canciones
}