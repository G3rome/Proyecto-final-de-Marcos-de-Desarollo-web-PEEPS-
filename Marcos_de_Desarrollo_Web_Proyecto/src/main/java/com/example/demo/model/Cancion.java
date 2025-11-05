package com.example.demo.model; 

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // Le dice a JPA: Esta clase es una tabla de base de datos
@Table(name = "canciones") // Le dice a JPA: El nombre de la tabla será 'canciones'
public class Cancion {

    @Id // Le dice a JPA: Este campo es la Llave Primaria (ID)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Le dice a JPA: "Este ID debe ser autoincremental"
    private Long id;

    private String titulo;
    private String artista;
    private String cover; // Ruta a la imagen (ej. /images/Bohemian Rhapsody.jpg)
    private String src;   // Ruta al audio (ej. /audio/Bohemian Rhapsody.mp3)
    private Boolean liked = false;


    public Cancion() {
    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getArtista() {
        return artista;
    }

    public void setArtista(String artista) {
        this.artista = artista;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public boolean isLiked() {
    if (this.liked == null) {
        return false;
    }
    return this.liked;
    }

    public void setLiked(Boolean liked) {
        this.liked = liked;
    }
}