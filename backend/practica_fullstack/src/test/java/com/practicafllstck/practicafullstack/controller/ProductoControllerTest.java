package com.practicafllstck.practicafullstack.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.practicafllstck.practicafullstack.model.Producto;
import com.practicafllstck.practicafullstack.service.ProductoService;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;


@ExtendWith(MockitoExtension.class)
class ProductoControllerTest {

  private MockMvc mockMvc;

  @Mock
    private ProductoService productoService;

  @InjectMocks
    private ProductoController productoController;

  private final ObjectMapper objectMapper = new ObjectMapper();
  private Producto producto;

  @BeforeEach
    void setUp() {
    // Construimos MockMvc manualmente para una prueba más ligera y rápida
    mockMvc = MockMvcBuilders.standaloneSetup(productoController).setCustomArgumentResolvers(
                new PageableHandlerMethodArgumentResolver()).build();
    // Objeto base para usar en las pruebas
    producto = new Producto(1L, "Iphone", "Apple", "Celulares", 15000.0, 10, true, "Primer Stock");

  }

  @Test
    void listarProductos_debeRetornarPaginaDeProductos() throws Exception {
    List<Producto> contenidoDeLaPagina = new ArrayList<>(List.of(producto));
    Pageable pageable = PageRequest.of(0, 10);
    Page<Producto> paginaDeProductos = new PageImpl<>(contenidoDeLaPagina, pageable, 
        contenidoDeLaPagina.size());
    when(productoService.findAll(any(), any(), any(), any(), any(), any(), any(), any(), 
    any(Pageable.class)))
                .thenReturn(paginaDeProductos);
    mockMvc.perform(get("/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nombre").value("Iphone"));
  }

  @Test
    void crearProducto_debeRetornarProductoCreado() throws Exception {
    when(productoService.save(any(Producto.class))).thenReturn(producto);

    mockMvc.perform(post("/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(producto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Iphone"));
  }

  @Test
    void obtenerProductoPorId_cuandoExiste_debeRetornarProducto() throws Exception {
    when(productoService.findById(1L)).thenReturn(Optional.of(producto));

    mockMvc.perform(get("/productos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
  }

  @Test
    void obtenerProductoPorId_cuandoNoExiste_debeRetornarNotFound() throws Exception {
    when(productoService.findById(anyLong())).thenReturn(Optional.empty());

    mockMvc.perform(get("/productos/99"))
                .andExpect(status().isNotFound());
  }

  @Test
    void actualizarProducto_cuandoExiste_debeRetornarProductoActualizado() throws Exception {
    when(productoService.findById(1L)).thenReturn(Optional.of(producto));
    when(productoService.save(any(Producto.class))).thenReturn(producto);

    mockMvc.perform(put("/productos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(producto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Iphone"));
  }

  @Test
  void actualizarProducto_cuandoNoExiste_debeRetornarNotFound() throws Exception {
    when(productoService.findById(anyLong())).thenReturn(Optional.empty());

    mockMvc.perform(put("/productos/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(producto)))
                .andExpect(status().isNotFound());
  }

  @Test
    void activarDesactivarProducto_cuandoExiste_debeRetornarProductoActualizado() throws Exception {
    when(productoService.findById(1L)).thenReturn(Optional.of(producto));
    when(productoService.save(any(Producto.class))).thenReturn(producto);

    mockMvc.perform(patch("/productos/1/activar?activar=false"))
                .andExpect(status().isOk());
  }

  @Test
  void activarDesactivarProducto_cuandoNoExiste_debeRetornarNotFound() throws Exception {
    when(productoService.findById(99L)).thenReturn(Optional.empty());

    mockMvc.perform(patch("/productos/99/activar?activar=true"))
                .andExpect(status().isNotFound());
  }

  @Test
  void ajustarInventario_cuandoEsExitoso_debeRetornarProductoActualizado() throws Exception {
    ProductoController.AjusteRequest ajuste = new ProductoController.AjusteRequest();
    ajuste.setCantidad(5);
    ajuste.setRazon("Compra a proveedor");

    when(productoService.findById(1L)).thenReturn(Optional.of(producto));
    when(productoService.save(any(Producto.class))).thenReturn(producto);

    mockMvc.perform(post("/productos/1/ajustar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ajuste)))
                .andExpect(status().isOk());
  }

  @Test
    void ajustarInventario_cuandoRazonEsNula_debeRetornarBadRequest() throws Exception {
    ProductoController.AjusteRequest ajuste = new ProductoController.AjusteRequest();
    ajuste.setRazon(null);

    mockMvc.perform(post("/productos/1/ajustar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ajuste)))
                .andExpect(status().isBadRequest());
  }

  @Test
    void ajustarInventario_cuandoProductoNoExiste_debeRetornarNotFound() throws Exception {
    ProductoController.AjusteRequest ajuste = new ProductoController.AjusteRequest();
    ajuste.setRazon("Compra");
    when(productoService.findById(anyLong())).thenReturn(Optional.empty());

    mockMvc.perform(post("/productos/99/ajustar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ajuste)))
                .andExpect(status().isNotFound());
  }

  @Test
    void ajustarInventario_cuandoStockResultaNegativo_debeRetornarBadRequest() throws Exception {
    ProductoController.AjusteRequest ajuste = new ProductoController.AjusteRequest();
    ajuste.setCantidad(-20); // Stock actual del mock es 10
    ajuste.setRazon("Devolución");
    when(productoService.findById(1L)).thenReturn(Optional.of(producto));

    mockMvc.perform(post("/productos/1/ajustar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ajuste)))
                .andExpect(status().isBadRequest());
  }

  @Test
    void eliminarProducto_cuandoExiste_debeRetornarNoContent() throws Exception {
    when(productoService.existsById(1L)).thenReturn(true);
    doNothing().when(productoService).deleteById(1L);

    mockMvc.perform(delete("/productos/1"))
                .andExpect(status().isNoContent());
  }

  @Test
    void eliminarProducto_cuandoNoExiste_debeRetornarNotFound() throws Exception {
    when(productoService.existsById(99L)).thenReturn(false);

    mockMvc.perform(delete("/productos/99"))
                .andExpect(status().isNotFound());
  }

  @Test
    void eliminarVariosProductos_debeRetornarNoContent() throws Exception {
    doNothing().when(productoService).deleteAllByIds(any());

    mockMvc.perform(delete("/productos/batch-delete?ids=1,2,3"))
                .andExpect(status().isNoContent());
  }

  @SuppressWarnings("unchecked")
  @Test
    void activarDesactivarVariosProductos_debeRetornarNoContent() throws Exception {
    doNothing().when(productoService).activarDesactivarProductos(
        any(List.class), any(Boolean.class));

    mockMvc.perform(post("/productos/batch-activar?ids=1,2&activar=true"))
                .andExpect(status().isNoContent());
  }
}