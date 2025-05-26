

// Slider Automático Pequeño
document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    const slideWidth = slides[0].clientWidth;

    // Clona el primer slide para efecto infinito
    sliderTrack.appendChild(slides[0].cloneNode(true));

    // Función para avanzar
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    // Botones
    nextBtn.addEventListener('click', nextSlide);

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    });

    // Cambio automático cada 3 segundos
    setInterval(nextSlide, 3000);
});

document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    const slideWidth = slides[0].clientWidth;

    // Clonar primera imagen para efecto infinito
    sliderTrack.appendChild(slides[0].cloneNode(true));

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        sliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    });

    nextBtn.addEventListener('click', nextSlide);

    setInterval(nextSlide, 4000);
});


// Mostrar productos en el checkout
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('checkout-items');
    const cartTotalElement = document.getElementById('checkout-total');
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${item.name} x ${item.quantity}</p>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', displayCartItems);


// Función para añadir productos al carrito
function addToCart(button) {
    const product = {
        name: button.getAttribute('data-name'),
        price: parseFloat(button.getAttribute('data-price')),
        quantity: 1
    };
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} añadido al carrito!`);
    updateCartCounter();
}

// Actualizar contador del carrito
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.count-products').textContent = count;
}

// Cargar carrito al iniciar la página
document.addEventListener('DOMContentLoaded', updateCartCounter);

// ... (tu código existente para el carrito)

// Función para mostrar el resumen del carrito en el modal
function mostrarResumenCarrito() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const resumenContainer = document.getElementById('resumen-carrito');
  const totalContainer = document.getElementById('total-carrito');
  
  resumenContainer.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    resumenContainer.appendChild(itemElement);
    total += item.price * item.quantity;
  });
  
  totalContainer.textContent = `$${total.toFixed(2)}`;
  return total;
}

// Configuración del modal y PayPal
document.addEventListener('DOMContentLoaded', function() {
  const btnPagar = document.getElementById('btn-pagar');
  const modal = document.getElementById('modal-pago');
  const cerrarModal = document.querySelector('.cerrar-modal');
  
  // Abrir modal
  btnPagar.addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    mostrarResumenCarrito();
    modal.style.display = 'block';
    
    // Cargar el botón de PayPal solo cuando se abre el modal
    if (!document.querySelector('script[src*="paypal.com"]')) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AWs2iLRZLlyMjBi3U2EFfvq4pYwlBNZd3OgypKAKMgPCAA7GTlb2hXyKh7c-qA0e-veOYq6IGwoxyycJ&currency=MXN`;
      script.onload = function() {
        configurarPayPal();
      };
      document.head.appendChild(script);
    } else if (window.paypal) {
      configurarPayPal();
    }
  });
  
  // Cerrar modal
  cerrarModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Cerrar al hacer clic fuera del modal
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

function configurarPayPal() {
  const total = mostrarResumenCarrito();
  
  // Limpiar contenedor previo
  document.getElementById('paypal-button-container').innerHTML = '';
  
  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal'
    },
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: total.toFixed(2)
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert('¡Pago completado! ID: ' + details.id);
        localStorage.removeItem('cart');
        document.querySelector('.count-products').textContent = '0';
        document.getElementById('modal-pago').style.display = 'none';
        // Puedes redirigir a una página de agradecimiento aquí
      });
    },
    onError: function(err) {
      console.error(err);
      alert('Ocurrió un error al procesar el pago');
    }
  }).render('#paypal-button-container');
}

