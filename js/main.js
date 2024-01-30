document.addEventListener("DOMContentLoaded", function () {
  const carritoIcon = document.getElementById("carrito-icon");
  const carritoCantidad = document.getElementById("cantidad-carrito");
  const carritoContainer = document.querySelector(".carrito-container");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalElement = document.getElementById("total");

  let productos = obtenerProductosLocalStorage() || [];
  let carritoProductos = obtenerCarritoLocalStorage() || [];

  function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    carritoProductos.forEach((producto) => {
      const li = document.createElement("li");

      const img = document.createElement("img");
      img.src = producto.imagen;
      img.alt = producto.nombre;
      img.style.maxWidth = "50px";
      img.style.borderRadius = "5px";
      li.appendChild(img);

      const nombre = document.createElement("span");
      nombre.textContent = producto.nombre;

      const precio = document.createElement("span");
      precio.textContent = `$${producto.precio.toFixed(2)}`;

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", () =>
        eliminarProducto(producto.id)
      );

      li.appendChild(nombre);
      li.appendChild(precio);
      li.appendChild(btnEliminar);

      listaCarrito.appendChild(li);
    });

    totalElement.textContent = `$${calcularTotal().toFixed(2)}`;
    guardarCarritoLocalStorage();
    actualizarCantidadCarrito();
  }

  function calcularTotal() {
    return carritoProductos.reduce(
      (total, producto) => total + producto.precio,
      0
    );
  }

  function agregarProducto(nombre, precio, imagen) {
    const producto = {
      id: productos.length + 1,
      nombre,
      precio,
      imagen,
    };

    productos.push(producto);
    carritoProductos.push(producto);
    actualizarCarrito();
    guardarProductosLocalStorage();
  }

  function eliminarProducto(id) {
    carritoProductos = carritoProductos.filter(
      (producto) => producto.id !== id
    );
    actualizarCarrito();
  }

  function guardarCarritoLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carritoProductos));
  }

  function obtenerCarritoLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : null;
  }

  function guardarProductosLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
  }

  function obtenerProductosLocalStorage() {
    const productosGuardados = localStorage.getItem("productos");
    return productosGuardados ? JSON.parse(productosGuardados) : null;
  }

  function actualizarCantidadCarrito() {
    const cantidad = carritoProductos.length;
    carritoCantidad.textContent = cantidad;

    // Mostrar u ocultar el número según si hay elementos en el carrito
    carritoCantidad.style.display = cantidad > 0 ? "inline-block" : "none";
  }

  // Carga los productos del carrito al cargar la página
  actualizarCarrito();

  carritoIcon.addEventListener("click", () => {
    carritoContainer.classList.toggle("visible");
  });

  const botonesComprar = document.querySelectorAll(".comprar-btn");
  botonesComprar.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      const productoSeleccionado = event.target.closest(".producto");
      const nombre = productoSeleccionado.dataset.nombre;
      const precio = parseFloat(productoSeleccionado.dataset.precio);
      const imagen = productoSeleccionado.querySelector("img").src;

      agregarProducto(nombre, precio, imagen);
    });
  });
});
