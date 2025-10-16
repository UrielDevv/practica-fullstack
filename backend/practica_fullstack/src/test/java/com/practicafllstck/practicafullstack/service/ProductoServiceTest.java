package com.practicafllstck.practicafullstack.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.practicafllstck.practicafullstack.model.Producto;
import com.practicafllstck.practicafullstack.repository.ProductoRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;


@ExtendWith(MockitoExtension.class) // Habilita las anotaciones de Mockito
class ProductoServiceTest {

  @Mock // 1. Crea un mock (simulacro) del repositorio
    private ProductoRepository productoRepository;

  @InjectMocks // 2. Crea una instancia real del servicio e inyecta el mock de arriba
  private ProductoService productoService;

  private Producto producto;

  @BeforeEach
    void setUp() {
    // Objeto base reutilizable para las pruebas
    producto = new Producto(1L, "Laptop Gamer", "Asus", "Computo", 25000.0, 5, true, null);
  }

  @Test
    void findAll_debeLlamarAlRepositorio() {
    // Arrange: Preparamos el escenario
    Page<Producto> paginaEsperada = new PageImpl<>(List.of(producto));
    // Cuando el repositorio llame a findAll con cualquier especificación, devuelve nuestra página
    when(productoRepository.findAll(any(Specification.class), 
    any(Pageable.class))).thenReturn(paginaEsperada);

    // Act: Ejecutamos el método a probar
    Page<Producto> resultado = productoService.findAll(null, null, null, 
        null, null, null, null, null, Pageable.unpaged());

    // Assert: Verificamos el resultado
    assertNotNull(resultado);
    assertEquals(1, resultado.getTotalElements());
    verify(productoRepository, times(1)).findAll(any(Specification.class), 
        any(Pageable.class)); // Verificamos que se llamó al método del repo
  }

  @Test
    void save_cuandoEsProductoNuevo_debeGuardarlo() {
    // Arrange
    Producto productoNuevo = new Producto(null, "Teclado Mecanico", "Razer", 
        "Perifericos", 1200.0, 15, true, null);
    when(productoRepository.findByNombre("Teclado Mecanico")).thenReturn(
        Optional.empty()); // Simulamos que el nombre no existe
    when(productoRepository.save(productoNuevo)).thenReturn(productoNuevo);

    // Act
    Producto resultado = productoService.save(productoNuevo);

    // Assert
    assertNotNull(resultado);
    assertEquals("Teclado Mecanico", resultado.getNombre());
  }

  @Test
    void save_cuandoNombreYaExiste_debeLanzarExcepcion() {
    // Arrange
    Producto productoNuevo = new Producto(null, "Laptop Gamer", "Asus", "Computo", 
        25000.0, 5, true, null);
    // Simulamos que el nombre SÍ existe
    when(productoRepository.findByNombre("Laptop Gamer")).thenReturn(Optional.of(producto));

    // Act & Assert
    // Verificamos que se lanza la excepción esperada
    IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
      productoService.save(productoNuevo);
    });
    assertEquals("Ya existe un producto con el nombre 'Laptop Gamer'", exception.getMessage());
  }

  @Test
    void save_cuandoEsActualizacion_debeGuardarSinVerificarNombre() {
    // Arrange
    when(productoRepository.save(producto)).thenReturn(producto);

    // Act
    // Modificamos el producto
    producto.setPrecio(26000.0);
    Producto resultado = productoService.save(producto);

    // Assert
    assertNotNull(resultado);
    assertEquals(26000.0, resultado.getPrecio());
    // Verificamos que NUNCA se llamó a findByNombre
    verify(productoRepository, never()).findByNombre(anyString());
  }

  @Test
    void existsById_cuandoExiste_debeRetornarTrue() {
    // Arrange
    when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
    // Act
    boolean resultado = productoService.existsById(1L);
    // Assert
    assertTrue(resultado);
  }
    
  @Test
    void deleteById_cuandoProductoExiste_debeEliminarlo() {
    // Arrange
    when(productoRepository.existsById(1L)).thenReturn(true);
    // No hagas nada cuando se llame a deleteById
    doNothing().when(productoRepository).deleteById(1L);

    // Act
    productoService.deleteById(1L);

    // Assert
    // Verificamos que el método de borrado fue llamado
    verify(productoRepository, times(1)).deleteById(1L);
  }

  @Test
    void deleteById_cuandoProductoNoExiste_debeLanzarExcepcion() {
    // Arrange
    when(productoRepository.existsById(99L)).thenReturn(false);

    // Act & Assert
    assertThrows(IllegalStateException.class, () -> {
      productoService.deleteById(99L);
    });
  }
    
  @Test
    void deleteAllByIds_debeLlamarAlRepositorio() {
    // Arrange
    List<Long> ids = List.of(1L, 2L);
    doNothing().when(productoRepository).deleteAllByIdInBatch(ids);

    // Act
    productoService.deleteAllByIds(ids);

    // Assert
    verify(productoRepository, times(1)).deleteAllByIdInBatch(ids);
  }

  @Test
    void activarDesactivarProductos_debeCambiarEstadoYGuardar() {
    // Arrange
    Producto producto2 = new Producto(2L, "Mouse", "Logitech", "Perifericos", 
        800.0, 20, true, null);
    List<Producto> listaProductos = new ArrayList<>(List.of(producto, producto2));
    List<Long> ids = List.of(1L, 2L);

    when(productoRepository.findAllById(ids)).thenReturn(listaProductos);

    // Act
    productoService.activarDesactivarProductos(ids, false);  // Los desactivamos

    // Assert
    // Verificamos que el estado cambió en los objetos
    assertFalse(producto.isActivo()); 
    assertFalse(producto2.isActivo());
    // Verificamos que se llamó a guardar la lista modificada
    verify(productoRepository, times(1)).saveAll(listaProductos); 
  }
}