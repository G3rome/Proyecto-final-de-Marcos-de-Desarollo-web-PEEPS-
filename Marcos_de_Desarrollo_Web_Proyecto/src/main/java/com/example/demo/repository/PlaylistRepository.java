package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Playlist;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    // Aquí podríamos añadir métodos como:
    // List<Playlist> findByUsuarioId(Long usuarioId);

}
