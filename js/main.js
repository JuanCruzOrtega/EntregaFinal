//OBTENER ELEMEBTOS POR SU ID
const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')
const botonVaciar = document.getElementById('vaciar-carrito')
const contadorCarrito = document.getElementById('contadorCarrito')
const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')

//ARRAY VACIO DE CARRITO
let carrito = []


document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

//BOTON VACIAR CARRITO
botonVaciar.addEventListener('click', () => {
    Swal.fire({
        title: '¿Está seguro que quiere vaciar el carrito?',
        showDenyButton: true,
        
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Su carrito fue vaciado. Gracias por visitarnos!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('No se ha registrado ningún cambio', '', 'info')
        }
      })

    localStorage.removeItem('carrito')  
    carrito.length = 0
    actualizarCarrito()
})

const productosContainer = document.getElementById('productos-container');

fetch('./stock.json')
  .then((resinicial) => resinicial.json())

  .then((res) => {
    const stockProductos = res;

    stockProductos.forEach((producto) => {
      const div = document.createElement('div');
      div.classList.add('producto');
      div.innerHTML = `
      <img src=${producto.imagen} alt="" class="img-fluid" width="250px">
      <h6>${producto.nombre}</h6>
      <p class="precioProducto">Precio:$ ${producto.precio}</p>
      <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
      
      `;

      contenedorProductos.appendChild(div);

      const boton = document.getElementById(`agregar${producto.id}`);

      boton.addEventListener('click', () => {
        agregarAlCarrito(producto.id);
      });
    });

    const agregarAlCarrito = (prodId) => {
      const existe = carrito.some((prod) => prod.id === prodId);

      if (existe) {
        const prod = carrito.map((prod) => {
          if (prod.id === prodId) {
            prod.cantidad++;
          }
        });
      } else {
        const item = stockProductos.find((prod) => prod.id === prodId);
        carrito.push(item);
      }
      actualizarCarrito();
    };
  })

  .catch((e) => {
    console.log(e);
  });


//ELIMINAR DEL CARRITO
const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item)

    carrito.splice(indice, 1) 
    actualizarCarrito() 
    console.log(carrito)
}

//BOTON COMPRAR

const comprarBoton = document.getElementById('comprar')

comprarBoton.addEventListener('click', () => {
  Swal.fire({
    icon: 'success',
    title: 'Su compra fue realizada! Muchas gracias!',
    showConfirmButton: false,
    timer: 1000
  }) 
  
  carrito.length = 0
  actualizarCarrito()
})

const actualizarCarrito = () => {

    contenedorCarrito.innerHTML = "" 
    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div)
        
        localStorage.setItem('carrito', JSON.stringify(carrito))

    })
    
    contadorCarrito.innerText = carrito.length
    console.log(carrito)
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
    

}

