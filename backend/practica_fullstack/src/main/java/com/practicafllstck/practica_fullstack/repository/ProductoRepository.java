package com.practicafllstck.practica_fullstack.repository;

import com.practicafllstck.practica_fullstack.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Anotación que le indica a Spring que esta es una interfaz de repositorio
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // JpaRepository<[Clase de la Entidad], [Tipo de dato del ID]>

    // Spring Data JPA es tan potente que puede crear consultas a partir
    // del nombre del método. Este método buscará un producto por su nombre.
    // Lo usaremos en el servicio para validar si un producto ya existe.
    Optional<Producto> findByNombre(String nombre);
}