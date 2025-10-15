package com.practicafllstck.practicafullstack.repository;

import com.practicafllstck.practicafullstack.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

@Repository // Anotación que le indica a Spring que esta es una interfaz de repositorio
public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {
    
    Optional<Producto> findByNombre(String nombre);
}