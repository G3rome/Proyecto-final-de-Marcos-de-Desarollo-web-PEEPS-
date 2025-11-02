package com.example.demo.model;

import jakarta.persistence.*;

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