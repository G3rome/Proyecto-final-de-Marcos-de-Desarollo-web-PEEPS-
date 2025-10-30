package com.example.demo.repository;

import com.example.demo.model.Cancion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CancionRepository extends JpaRepository<Cancion, Long> {


    List<Cancion> findByTituloContainingIgnoreCaseOrArtistaContainingIgnoreCase(String titulo, String artista);
}