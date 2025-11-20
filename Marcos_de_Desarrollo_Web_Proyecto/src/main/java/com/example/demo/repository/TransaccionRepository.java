package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Transaccion;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    // Metodos de manejo de operaciones aqui
}
