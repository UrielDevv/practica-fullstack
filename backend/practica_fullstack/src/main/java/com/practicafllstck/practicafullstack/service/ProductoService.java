package com.practicafllstck.practicafullstack.service;


import com.practicafllstck.practicafullstack.model.Producto;
import com.practicafllstck.practicafullstack.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import static com.practicafllstck.practicafullstack.repository.specifications.ProductoSpecifications.*;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service // Anotación que marca esta clase como un componente de servicio de Spring
public class ProductoService {

    // Inyección de dependencias: Spring nos proporciona una instancia de ProductoRepository
    private ProductoRepository productoRepository;

    public Page<Producto> findAll(Integer id, String nombre, String marca,
                                  Double precio, Integer existencias,
                                  String razon, Boolean activo,
                                  String categoria, Pageable pageable) {
        Specification<Producto> spec = Specification.unrestricted();
                spec = spec.and(conId(id))
                .and(conNombre(nombre))
                .and(conMarca(marca))
                .and(conPrecio(precio))
                .and(conExistencias(existencias))
                .and(conRazon(razon))
                .and(estaActivo(activo))
                .and(conCategoria(categoria));
        return productoRepository.findAll(spec, pageable);
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

    public boolean existsById(Long id) {
        return productoRepository.findById(id).isPresent();
    }


    // Método para eliminar un producto por su ID
    public void deleteById(Long id) {
        // Lógica de negocio: Validar que el producto existe antes de intentar borrarlo
        if (!productoRepository.existsById(id)) {
            throw new IllegalStateException("No se encontró el producto con ID " + id);
        }
        productoRepository.deleteById(id);
    }

    //MEtodo de eliminar varios productos por sus IDs
    @Transactional //Transaccional porque es una operacion a la bd como una transaccion tradicional
    public void deleteAllByIds(List<Long> ids) {
        productoRepository.deleteAllByIdInBatch(ids);
    }

    //metodo para activar o desactivar varios productos por sus IDs
    @Transactional
    public void activarDesactivarProductos(List<Long> ids, boolean activar) {
        List<Producto> productos = productoRepository.findAllById(ids);
        for (Producto producto : productos) {
            producto.setActivo(activar);
        }
        productoRepository.saveAll(productos);
    }
}