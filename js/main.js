document.addEventListener("DOMContentLoaded", function () {
  const carritoIcon = document.getElementById("carrito-icon");
  const carritoCantidad = document.getElementById("cantidad-carrito");
  const carritoContainer = document.querySelector(".carrito-container");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalElement = document.getElementById("total");
  const comprarBtn = document.getElementById("comprar-btn");
  const overlay = document.getElementById("overlay");
  const carritoProductosElement = document.getElementById("carrito-container");

  let carritoProductos = obtenerCarritoLocalStorage() || [];
  let formularioMostrado = false; // Variable para controlar si el formulario ya está mostrado

  fetch("productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      mostrarProductos();
      actualizarCarrito(); // Actualizar el carrito al cargar los productos
    })
    .catch((error) => console.error("Error al cargar los productos:", error));

  function mostrarProductos() {
    const productosContainer = document.getElementById("contenedor-productos");
    productos.forEach((producto) => {
      const article = document.createElement("article");
      article.classList.add("producto");
      article.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="info">
                <p>${producto.nombre}</p>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <button class="comprar-btn">Comprar</button>
            </div>
        `;
      const comprarBtn = article.querySelector(".comprar-btn");
      comprarBtn.addEventListener("click", () => {
        agregarProductoAlCarrito(producto);
      });
      productosContainer.appendChild(article);
    });
  }

  function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    totalElement.textContent = `$${calcularTotal().toFixed(2)}`;
    mostrarCantidadCarrito();
    guardarCarritoLocalStorage(); // Guardar el estado del carrito en localStorage

    carritoProductos.forEach((producto) => {
      const li = document.createElement("li");
      li.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <span>${producto.nombre}</span>
            <span>$${producto.precio.toFixed(2)}</span>
            <button class="eliminar-btn">Eliminar</button>
        `;
      li.querySelector(".eliminar-btn").addEventListener("click", () => {
        eliminarProductoDelCarrito(producto);
      });
      listaCarrito.appendChild(li);
    });
  }

  function agregarProductoAlCarrito(producto) {
    carritoProductos.push(producto);
    actualizarCarrito();
  }

  function eliminarProductoDelCarrito(producto) {
    const index = carritoProductos.findIndex((p) => p === producto);
    if (index !== -1) {
      carritoProductos.splice(index, 1); // Eliminar solo el elemento actual
    }
    actualizarCarrito();
  }

  function calcularTotal() {
    return carritoProductos.reduce(
      (total, producto) => total + producto.precio,
      0
    );
  }

  carritoIcon.addEventListener("click", () => {
    if (!formularioMostrado) {
      carritoContainer.classList.toggle("visible");
    }
  });

  carritoContainer.addEventListener("mouseleave", () => {
    if (!formularioMostrado) {
      carritoContainer.classList.remove("visible");
    }
  });

  comprarBtn.addEventListener("click", () => {
    if (!formularioMostrado && carritoProductos.length > 0) {
      // Verificar si el carrito tiene elementos
      mostrarFormularioCompra();
    }
  });

  function mostrarCantidadCarrito() {
    carritoCantidad.textContent = carritoProductos.length;
    if (carritoProductos.length > 0) {
      carritoCantidad.classList.add("visible");
    } else {
      carritoCantidad.classList.remove("visible");
    }
  }

  function mostrarFormularioCompra() {
    const formulario = document.createElement("form");
    formulario.id = "formulario-compra";
    formulario.innerHTML = `
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" required />
      <label for="apellido">Apellido:</label>
      <input type="text" id="apellido" required />
      <label for="forma-pago">Forma de Pago:</label>
      <select id="forma-pago" required>
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
      </select>
      <button type="submit">Confirmar</button>
      <button type="button" id="cancelar-btn">Cancelar</button>
    `;
    comprarBtn.after(formulario);
    formularioMostrado = true;

    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
      swal("Compra Confirmada", "Gracias por tu compra", "success").then(() => {
        formulario.remove();
        formularioMostrado = false;
        carritoProductos = []; // Vaciar el carrito al confirmar la compra
        actualizarCarrito();
      });
    });

    const cancelarBtn = formulario.querySelector("#cancelar-btn");
    cancelarBtn.addEventListener("click", () => {
      formulario.remove();
      formularioMostrado = false;
    });
  }

  function guardarCarritoLocalStorage() {
    localStorage.setItem("carritoProductos", JSON.stringify(carritoProductos));
  }

  function obtenerCarritoLocalStorage() {
    return JSON.parse(localStorage.getItem("carritoProductos"));
  }
});
