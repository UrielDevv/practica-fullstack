package com.practicafllstck.practicafullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity                 // Indica que esta clase es una entidad JPA y se mapeará a una tabla
@Table(name = "productos") // Especifica el nombre de la tabla en la base de datos
@Data                   // Anotación de Lombok: genera getters, setters, toString, etc.
@NoArgsConstructor      // Anotación de Lombok: genera un constructor sin argumentos
@AllArgsConstructor     // Anotación de Lombok: genera un constructor con todos los argumentos
public class Producto {

    @Id // Marca este campo como la clave primaria (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Le dice a MySQL que genere el ID automáticamente (autoincremental)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio") // Validación: No puede ser nulo ni estar vacío
    @Column(unique = true, nullable = false) // Restricción a nivel de BD: único y no nulo
    private String nombre;

    @Column // Campo estándar
    private String marca;

    @Column // Campo estándar
    private String categoria;

    @NotNull(message = "El precio es obligatorio") // Validación: No puede ser nulo
    @Positive(message = "El precio debe ser mayor que cero") // Validación: Debe ser > 0
    @Column(nullable = false) // Restricción a nivel de BD: no nulo
    private Double precio;

    @NotNull(message = "Las existencias son obligatorias") // Validación: No puede ser nulo
    @PositiveOrZero(message = "Las existencias no pueden ser negativas") // Validación: Debe ser >= 0
    @Column(nullable = false) // Restricción a nivel de BD: no nulo
    private Integer existencias;

    @Column // Campo estándar
    private boolean activo = true; // Por defecto, el producto está activo

    @Column
    private String razon;
}