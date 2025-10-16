package com.practicafllstck.practicafullstack.repository;

import com.practicafllstck.practicafullstack.model.Producto;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;



/**
 * Repositorio para la entidad Producto.
 * Proporciona métodos para acceder y manipular los datos de productos.
 */
@Repository // Anotación que le indica a Spring que esta es una interfaz de repositorio
public interface ProductoRepository
    extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {
  Optional<Producto> findByNombre(String nombre);
}