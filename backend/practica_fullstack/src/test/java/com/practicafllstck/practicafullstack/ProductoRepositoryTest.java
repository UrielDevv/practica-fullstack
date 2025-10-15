package com.practicafllstck.practicafullstack; // Asegúrate que el paquete coincida con el tuyo

import com.practicafllstck.practicafullstack.model.Producto;
import com.practicafllstck.practicafullstack.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest // Anotación clave: configura un entorno de prueba solo para la capa de persistencia (JPA)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

public class ProductoRepositoryTest {

    @Autowired // Spring inyectará una instancia de tu repositorio para que la uses en la prueba
    private ProductoRepository productoRepository;

    @Test // Marca este método como un caso de prueba ejecutable
    public void cuandoGuardoUnProducto_entoncesDeberiaEncontrarlo() {
        // 1. Preparación: Creamos un nuevo producto
        Producto nuevoProducto = new Producto();
        nuevoProducto.setNombre("Laptop Gamer X");
        nuevoProducto.setMarca("TechPro");
        nuevoProducto.setCategoria("Electrónicos");
        nuevoProducto.setPrecio(1500.00);
        nuevoProducto.setExistencias(10);
        nuevoProducto.setActivo(true);

        // 2. Acción: Guardamos el producto en la base de datos
        Producto productoGuardado = productoRepository.save(nuevoProducto);

        // 3. Verificación: Usamos aserciones para comprobar que todo funcionó
        assertThat(productoGuardado).isNotNull(); // El producto guardado no debería ser nulo
        assertThat(productoGuardado.getId()).isGreaterThan(0); // Debería tener un ID asignado por la BD
        assertThat(productoGuardado.getNombre()).isEqualTo("Laptop Gamer X"); // El nombre debe ser el que establecimos
    }
}