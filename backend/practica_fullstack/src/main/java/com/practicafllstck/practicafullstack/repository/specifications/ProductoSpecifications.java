package com.practicafllstck.practicafullstack.repository.specifications;
import com.practicafllstck.practicafullstack.model.Producto;
import org.springframework.data.jpa.domain.Specification;
public final class ProductoSpecifications {
    private ProductoSpecifications() {
    }
    public static Specification<Producto> conId(Integer id) {
        return (root, query, cb) -> id == null || id <= 0 ? cb.conjunction() : cb.equal(root.get("id"), id);
    }
    public static Specification<Producto> conNombre(String nombre) {
        return (root, query, cb) -> nombre == null || nombre.trim().isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%");
    }
    public static Specification<Producto> conMarca(String marca) {
        return (root, query, cb) -> marca == null || marca.trim().isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("marca")), "%" + marca.toLowerCase() + "%");
    }
    public static Specification<Producto> conPrecio(Double precio) {
        return (root, query, cb) -> precio == null || precio <= 0 ? cb.conjunction() : cb.equal(root.get("precio"), precio);
    }
    public static Specification<Producto> conExistencias(Integer existencias) {
        return (root, query, cb) -> existencias == null || existencias < 0 ? cb.conjunction() : cb.equal(root.get("existencias"), existencias);
    }
    public static Specification<Producto> conRazon(String razon) {
        return (root, query, cb) -> razon == null || razon.trim().isEmpty() ? cb.conjunction() : cb.like(cb.lower(root.get("razon")), "%" + razon.toLowerCase() + "%");
    }
    public static Specification<Producto> estaActivo(Boolean activo) {
        // Tu lógica original era solo para `isTrue`. Esta es más flexible.
        return (root, query, cb) -> activo == null ? cb.conjunction() : cb.equal(root.get("activo"), activo);
    }
    public static Specification<Producto> conCategoria(String categoria) {
        return (root, query, cb) -> categoria == null || categoria.trim().isEmpty() ? cb.conjunction() : cb.equal(root.get("categoria"), categoria);
    }
}