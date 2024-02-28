document.addEventListener("DOMContentLoaded", function () {
  const carritoIcon = document.getElementById("carrito-icon");
  const cantidadCarrito = document.getElementById("cantidad-carrito");
  const carritoContainer = document.querySelector(".carrito-container");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalElement = document.getElementById("total");
  const productosContainer = document.getElementById("productos-container");

  let carrito = [];
  let productos = [];

  // Cargar productos desde el archivo JSON
  fetch("productos.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      mostrarProductos();
    })
    .catch((error) => console.error("Error al cargar productos:", error));

  // Mostrar los productos en la página
  function mostrarProductos() {
    productos.forEach((producto, index) => {
      const productoHTML = `
        <article class="producto" data-index="${index}">
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <div class="info">
            <p>${producto.nombre}</p>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <button class="comprar-btn">Comprar</button>
          </div>
        </article>
      `;
      productosContainer.insertAdjacentHTML("beforeend", productoHTML);
    });
  }

  // Manejar clic en el botón de comprar
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("comprar-btn")) {
      // Encontrar el producto asociado al botón de comprar
      const productoIndex = event.target.closest(".producto").dataset.index;
      const producto = productos[productoIndex];

      // Agregar el producto al carrito
      agregarAlCarrito(producto);
    }
  });

  // Función para agregar un producto al carrito
  function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
  }

  // Función para eliminar un producto del carrito
  function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
  }

  // Función para actualizar la visualización del carrito
  function actualizarCarrito() {
    // Limpiar el contenido actual del carrito
    listaCarrito.innerHTML = "";

    // Agregar cada producto al carrito
    carrito.forEach(function (producto, index) {
      const productoHTML = `
        <li>
          <img src="${producto.imagen}" alt="${producto.nombre}">
          ${producto.nombre} - $${producto.precio.toFixed(2)}
          <button class="eliminar-btn" data-index="${index}">Eliminar</button>
        </li>
      `;
      listaCarrito.innerHTML += productoHTML;
    });

    // Calcular y mostrar el total del carrito
    const total = carrito.reduce(function (total, producto) {
      return total + producto.precio;
    }, 0);
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Actualizar la cantidad de elementos en el carrito
    cantidadCarrito.textContent = carrito.length;

    // Mostrar u ocultar el número de elementos en el carrito
    cantidadCarrito.style.display =
      carrito.length > 0 ? "inline-block" : "none";
  }

  // Mostrar el carrito al hacer clic en el icono
  carritoIcon.addEventListener("click", function () {
    carritoContainer.classList.toggle("visible");
  });

  // Manejar clic en el botón de eliminar del carrito
  listaCarrito.addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar-btn")) {
      const index = event.target.dataset.index;
      eliminarDelCarrito(index);
    }
  });
});
