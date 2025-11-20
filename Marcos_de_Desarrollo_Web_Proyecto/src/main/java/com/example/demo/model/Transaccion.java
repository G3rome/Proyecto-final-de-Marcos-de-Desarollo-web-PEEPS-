package com.example.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

// Usuario -Adquiere-> Plan premium
// Usuario -Cancela-> Plan premium (En evaluacion)
@Entity
public class Transaccion {

    // Creacio de atributos de la clase -> tabla
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario;

    private String planPremium;
    private LocalDateTime fechaTransaccion;

    // Constructor:
    public Transaccion() {

    }

    // Constructor parametrizado capturando los atributos y metodos de la
    // clase-entidad: Usuario
    public Transaccion(Usuario usuario, String planPremium, LocalDateTime fechaTransaccion) {
        this.usuario = usuario;
        this.planPremium = planPremium;
        this.fechaTransaccion = fechaTransaccion;
    }

    // Metodos Getters & Setters:
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getPlanPremium() {
        return planPremium;
    }

    public void setPlanPremium(String planPremium) {
        this.planPremium = planPremium;
    }

    public LocalDateTime getFechaTransaccion() {
        return fechaTransaccion;
    }

    public void setFechaTransaccion(LocalDateTime fechaTransaccion) {
        this.fechaTransaccion = fechaTransaccion;
    }
}
