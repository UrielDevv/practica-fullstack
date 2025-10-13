package com.practicafllstck.practica_fullstack.controller;

import com.practicafllstck.practica_fullstack.model.Producto;
import com.practicafllstck.practica_fullstack.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController // Combina @Controller y @ResponseBody. Marca la clase como un controlador REST.
@RequestMapping("/productos") // Mapea todas las peticiones que empiecen con /productos a este controlador.
@CrossOrigin(origins = "http://localhost:4200") // Permite solicitudes CORS desde el frontend

public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // 1. GET /productos – Listar con paginación
    @GetMapping
    public ResponseEntity<Page<Producto>> listarProductos(
        Integer id, String nombre, String marca, Double precio, Integer existencias, String razon, Boolean activo,
        String categoria, Pageable pageable) {
        Page<Producto> productos = productoService.findAll(id,nombre, marca, precio, existencias, razon, activo, categoria, pageable);
        return ResponseEntity.ok(productos);
    }

    // 2. POST /productos – Crear un nuevo producto
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {
        Producto nuevoProducto = productoService.save(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    // 3. GET /productos/{id} – Obtener detalle de un producto
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        return productoService.findById(id)
                .map(ResponseEntity::ok) // Si lo encuentra, devuelve 200 OK con el producto
                .orElse(ResponseEntity.notFound().build()); // Si no, devuelve 404 Not Found
    }

    // 4. PUT /productos/{id} – Actualizar un producto completo
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @Valid @RequestBody Producto productoDetalles) {
        return productoService.findById(id)
                .map(productoExistente -> {
                    productoExistente.setNombre(productoDetalles.getNombre());
                    productoExistente.setMarca(productoDetalles.getMarca());
                    productoExistente.setCategoria(productoDetalles.getCategoria());
                    productoExistente.setPrecio(productoDetalles.getPrecio());
                    productoExistente.setExistencias(productoDetalles.getExistencias());
                    productoExistente.setActivo(productoDetalles.isActivo());
                    Producto actualizado = productoService.save(productoExistente);
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. PATCH /productos/{id}/activar – Activar/Desactivar producto
    @PatchMapping("/{id}/activar")
    public ResponseEntity<Producto> activarDesactivarProducto(@PathVariable Long id, @RequestParam boolean activar) {
        return productoService.findById(id)
                .map(producto -> {
                    producto.setActivo(activar);
                    Producto actualizado = productoService.save(producto);
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    public static class AjusteRequest {
        public int cantidad;
        public String razon;
    }

    // 6. POST /productos/{id}/ajustar – Ajuste de inventario
     
    @PostMapping("/{id}/ajustar")
    public ResponseEntity<Producto> ajustarInventario(@PathVariable Long id, @RequestBody AjusteRequest ajuste) {
        // a. Validar la razón del ajuste
        if (ajuste.razon == null || ajuste.razon.isBlank()) {
            return ResponseEntity.badRequest().build(); // Devuelve 400 Bad Request
        }

        // b. Buscar el producto
        Optional<Producto> productoOptional = productoService.findById(id);
        if (productoOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // Devuelve 404 Not Found si no existe
        }

        // c. Si el producto existe, aplicar la lógica
        Producto producto = productoOptional.get();
        int nuevasExistencias = producto.getExistencias() + ajuste.cantidad;

        // d. Validar que el stock no sea negativo
        if (nuevasExistencias < 0) {
            return ResponseEntity.badRequest().build(); // Devuelve 400 Bad Request
        }

        // e. Guardar y devolver el producto actualizado
        producto.setExistencias(nuevasExistencias);
        Producto actualizado = productoService.save(producto);

        System.out.println("Ajustando inventario para producto " + id + ". Cantidad: " + ajuste.cantidad + ", Razón: " + ajuste.razon);

        return ResponseEntity.ok(actualizado); // Devuelve 200 OK con el producto
    }
    
    // 7. DELETE /productos/{id} – Eliminar un producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        if (!productoService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    //8 DELETE /productos – Eliminar varios productos por IDs
    @DeleteMapping("/batch-delete")
    public ResponseEntity<Void> eliminarVariosProductos(@RequestParam List<Long> ids) {
        productoService.deleteAllByIds(ids);
        return ResponseEntity.noContent().build();
    }

    // 9 Post /productos/activar – Activar o desactivar varios productos por IDs
    @PostMapping("/batch-activar")
    public ResponseEntity<Void> activarDesactivarVariosProductos(@RequestParam List<Long> ids, @RequestParam boolean activar) {
        productoService.activarDesactivarProductos(ids, activar);
        return ResponseEntity.noContent().build();
    }
}