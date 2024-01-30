document.addEventListener("DOMContentLoaded", function () {
  const carritoIcon = document.getElementById("carrito-icon");
  const carritoCantidad = document.getElementById("cantidad-carrito");
  const carritoContainer = document.querySelector(".carrito-container");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalElement = document.getElementById("total");

  let productos = obtenerProductosLocalStorage() || [];
  let carritoProductos = obtenerCarritoLocalStorage() || [];
  let idContador = productos.length;

  function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    carritoProductos.forEach((producto) => {
      const li = document.createElement("li");

      const img = document.createElement("img");
      img.src = producto.imagen;
      img.alt = producto.nombre;
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
    if (isNaN(precio)) {
      console.error("El precio no es un número válido.");
      return;
    }

    idContador++;

    const producto = {
      id: idContador,
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
    try {
      const carritoGuardado = localStorage.getItem("carrito");
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      console.error(
        "Error al obtener el carrito desde el almacenamiento local:",
        error
      );
      return [];
    }
  }

  function guardarProductosLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
  }

  function obtenerProductosLocalStorage() {
    try {
      const productosGuardados = localStorage.getItem("productos");
      return productosGuardados ? JSON.parse(productosGuardados) : [];
    } catch (error) {
      console.error(
        "Error al obtener los productos desde el almacenamiento local:",
        error
      );
      return [];
    }
  }

  function actualizarCantidadCarrito() {
    const cantidad = carritoProductos.length;
    carritoCantidad.textContent = cantidad;

    carritoCantidad.style.display = cantidad > 0 ? "inline-block" : "none";
  }

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
