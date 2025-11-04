package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "playlist_canciones")
public class PlaylistCancion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Relaciones ---

    // (Qué playlist es)
    @ManyToOne
    @JoinColumn(name = "playlist_id")
    @JsonIgnoreProperties("playlistCanciones")
    private Playlist playlist;

    // (Qué canción es)
    @ManyToOne
    @JoinColumn(name = "cancion_id")
    private Cancion cancion;

    // --- Getters y Setters ---
    // (Debes generarlos)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Playlist getPlaylist() { return playlist; }
    public void setPlaylist(Playlist playlist) { this.playlist = playlist; }
    public Cancion getCancion() { return cancion; }
    public void setCancion(Cancion cancion) { this.cancion = cancion; }
}