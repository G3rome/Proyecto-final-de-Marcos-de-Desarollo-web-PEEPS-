package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.PlaylistCancion;

@Repository
public interface PlaylistCancionRepository extends JpaRepository<PlaylistCancion, Long> {
    @Query("SELECT pc FROM PlaylistCancion pc JOIN FETCH pc.cancion WHERE pc.playlist.id = :playlistId")
    List<PlaylistCancion> findByPlaylistIdWithCancion(@Param("playlistId") Long playlistId);
}