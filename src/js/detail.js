// get product id from the URL parameter
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'), 10);

// fetch product data and display product details
async function fetchProductData() {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);

    // if product found, display product images and details
    if (product) {
      displayProductImages(product);
      displayProductDetails(product);
    } else {
      displayError('Product not found!');
    }
  } catch (error) {
    console.error('Error loading products:', error);
    displayError('Error loading product data.');
  }
}

// get products data from json file
async function getProducts() {
  const response = await fetch('./data/products.json');
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return await response.json();
}

// show product images
function displayProductImages(product) {
  const productImg = document.getElementById('product-image');
  productImg.innerHTML = `
    <div class="flex flex-col items-center bg-white rounded-lg p-4">
      <img id="main-product-img" src="${product.src}" class="rounded object-cover px-4 w-full max-w-3xl" alt="Product Image"/>
      <div class="flex justify-center space-x-4 m-0">
        ${generateThumbnailImages(product)}
      </div>  
    </div>
  `;
  setupThumbnailEvents();
}

// generate thumbnail images for product
function generateThumbnailImages(product) {
  return [product.src, product.src2, product.src3]
    .filter(src => src)
    .map(src => `
      <img src="${src}" class="thumbnail p-0 rounded-lg shadow-md object-cover w-28 h-28 cursor-pointer border-2 border-transparent hover:border-blue-500" alt="Product Thumbnail"/>
    `).join('');
}

function setupThumbnailEvents() {
  const mainImage = document.getElementById('main-product-img');
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      mainImage.src = thumbnail.src;
      thumbnails.forEach(img => img.classList.remove('border-blue-500'));
      thumbnail.classList.add('border-blue-500');
    });
  });
}

// detail product
function displayProductDetails(product) {
  const productDetail = document.getElementById('product-detail');
  productDetail.innerHTML = `
    <h2 class="text-2xl font-semibold mb-5">${product.name}</h2>
    <p class="text-xl font-semibold text-red-700 mb-5">Price: ${product.price} ฿</p>
    ${product.sale ? `<p class="sale-price text-md font-semibold mb-5 bg-red-500 text-white px-2 py-1">Sale: ${product.sale}%</p>` : ''}
    <p class="text-xl mb-5">${product.description}</p>
    <p class="text-md mb-5">Color: ${product.color}</p>
  `;
}

// error message
function displayError(message) {
  document.getElementById('product-detail').textContent = message;
}

fetchProductData();

// function to add product to cart
function addToCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    // update quantity
    existingProduct.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// uodate cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

// get product data and setup add to cart button
async function setupAddToCartButton() {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
      document.querySelector(".add-cart-button").addEventListener("click", () => {
        const quantity = parseInt(document.getElementById("quantity").value, 10);
        if (quantity > 0) {
          addToCart(product, quantity);
        } else {
          alert("Please enter a valid quantity.");
        }
      });
      updateCartCount();
    }
  } catch (error) {
    console.error("Error loading product data:", error);
  }
}

setupAddToCartButton();

// function to buy now
function buyNow(product, quantity) {
  if (quantity > 0) {
    sessionStorage.setItem("currentOrder", JSON.stringify({ ...product, quantity, total: product.price * quantity }));
    window.location.href = "./checkOut.html";
  } else {
    alert("Please enter a valid quantity.");
  }
}

async function setupBuyNowButton() {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === productId);

    if (product) {
      // setup buy now button
      document.querySelector(".buy-now-button").addEventListener("click", () => {
        // get quantity from input
        const quantity = parseInt(document.getElementById("quantity").value, 10);
        // call buyNow function with product and quantity
        buyNow(product, quantity);
      });
    }
  } catch (error) {
    console.error("Error loading product data:", error);
  }
}

setupBuyNowButton();
