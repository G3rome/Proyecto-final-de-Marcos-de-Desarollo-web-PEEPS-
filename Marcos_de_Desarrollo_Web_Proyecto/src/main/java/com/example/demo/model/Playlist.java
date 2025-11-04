package com.example.demo.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion = new Date();

    // --- Relaciones ---

    // (Opcional, pero recomendado) 
    // Para saber qué usuario creó esta playlist
    @ManyToOne
    @JoinColumn(name = "usuario_id") 
    private Usuario usuario;

    // (Importante)
    // Una playlist tiene muchas "entradas" (canciones)
    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<PlaylistCancion> canciones = new HashSet<>();

    // --- Getters y Setters ---
    // (omito todos los getters/setters por brevedad, pero debes generarlos)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Date getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Date fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Set<PlaylistCancion> getCanciones() { return canciones; }
    public void setCanciones(Set<PlaylistCancion> canciones) { this.canciones = canciones; }
}