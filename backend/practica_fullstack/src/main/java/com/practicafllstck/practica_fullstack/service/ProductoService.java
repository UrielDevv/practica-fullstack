package com.practicafllstck.practica_fullstack.service;


import com.practicafllstck.practica_fullstack.model.Producto;
import com.practicafllstck.practica_fullstack.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

//import java.util.List;
import java.util.Optional;

@Service // Anotación que marca esta clase como un componente de servicio de Spring
public class ProductoService {

    // Inyección de dependencias: Spring nos proporciona una instancia de ProductoRepository
    @Autowired
    private ProductoRepository productoRepository;

    /*  Método para obtener todos los productos
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }
    */

    public Page<Producto> findAll(Pageable pageable) {
        return productoRepository.findAll(pageable);
    }

    // Método para obtener un producto por su ID
    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    // Método para guardar un nuevo producto o actualizar uno existente
    public Producto save(Producto producto) {
        // Lógica de negocio: Validar que no exista otro producto con el mismo nombre
        // antes de guardarlo.
        if (producto.getId() == null) { // Si es un producto nuevo
            Optional<Producto> productoExistente = productoRepository.findByNombre(producto.getNombre());
            if (productoExistente.isPresent()) {
                // Lanzamos una excepción si el nombre ya está en uso
                throw new IllegalStateException("Ya existe un producto con el nombre '" + producto.getNombre() + "'");
            }
        }
        return productoRepository.save(producto);
    }

    // Método para eliminar un producto por su ID
    public void deleteById(Long id) {
        // Lógica de negocio: Validar que el producto existe antes de intentar borrarlo
        if (!productoRepository.existsById(id)) {
            throw new IllegalStateException("No se encontró el producto con ID " + id);
        }
        productoRepository.deleteById(id);
    }
}