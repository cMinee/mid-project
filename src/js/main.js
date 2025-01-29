// show product list
// when DOM is loaded fetch products and display
document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const filterBtn = document.getElementById("filter-price-btn");
  const clearFilterBtn = document.getElementById("clear-filter-btn");
  const categoryImageDiv = document.getElementById("category-image");

  // use URLSearchParams to get query parameters from URL
  const params = new URLSearchParams(window.location.search);
  const selectedType = params.get("type");
  
  // show category image
  const categoryImages = {
    headphone: "/src/assets/headPage-headphone.png",
    computer: "/src/assets/headPage-notebook.png",
    keyboard: "/src/assets/headPage-keyboard.png"
  };
  // check if there is a product type and display the appropriate image
  categoryImageDiv.innerHTML = selectedType && categoryImages[selectedType] ?
    `<img src="${categoryImages[selectedType]}" alt="${selectedType}" class="w-full rounded-md shadow-lg"/>` : "";

  try {
    const response = await fetch("./data/products.json");
    let products = await response.json();

    // function to display products
    function displayProducts(filteredProducts) {
      productList.innerHTML = filteredProducts.map(product => `
        <a class="group cursor-pointer block w-full max-w-xs mx-auto" onclick="viewProduct(${product.id})">
          <div class="relative p-3 rounded-md shadow-md hover:shadow-xl bg-white">
            ${product.sale ? `<span class='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>${product.sale}% OFF</span>` : ""}
            <img src="${product.src}" alt="Product Img" class="aspect-square w-full rounded-lg bg-gray-200 object-cover xl:aspect-[7/8]"/>
            <h3 class="mt-4 text-sm text-gray-700 font-semibold text-left">${product.name}</h3>
            <p class="my-1 text-lg font-medium ${product.sale ? 'text-red-500' : 'text-gray-900'} text-left">Price: ${product.price} ฿</p>
          </div>
        </a>
      `).join("");
    }

    let filteredProducts = selectedType ? products.filter(product => product.type === selectedType) : products;
    displayProducts(filteredProducts);

    // filter products by price
    filterBtn.addEventListener("click", () => {
      const minPrice = parseInt(minPriceInput.value) || 0;
      const maxPrice = parseInt(maxPriceInput.value) || Infinity;
      displayProducts(filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice));
    });

    // clear filter
    clearFilterBtn.addEventListener("click", () => {
      minPriceInput.value = "";
      maxPriceInput.value = "";
      // reset filtered products to original list
      displayProducts(filteredProducts);
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
});

// function to open product details
function viewProduct(productId) {
  // select productId in query parameter ของ URL
  window.location.href = `product-detail.html?id=${productId}`;
}

// Dropdown menu handling
const toggleDropdown = (menuButtonId, dropdownId) => {
  const menuButton = document.getElementById(menuButtonId);
  const dropdown = document.getElementById(dropdownId);

  menuButton.addEventListener("click", () => dropdown.classList.toggle("hidden"));
  document.addEventListener("click", event => {
    if (!menuButton.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.add("hidden");
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  toggleDropdown("products-menu", "products-dropdown");
  toggleDropdown("profile-menu", "profile-dropdown");
});


// Carousel
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  const images = carousel.children;
  const totalImages = images.length;
  const intervalTime = 5000;
  let currentIndex = 0;
  let interval;

  const updateCarousel = () => {
    // Calculate the offset in percentage
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  };

  const startAutoSlide = () => {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalImages;
      updateCarousel();
    }, intervalTime);
  };

  const stopAutoSlide = () => clearInterval(interval);

  document.getElementById("prev").addEventListener("click", () => {
    stopAutoSlide();
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateCarousel();
    startAutoSlide();
  });

  document.getElementById("next").addEventListener("click", () => {
    stopAutoSlide();
    currentIndex = (currentIndex + 1) % totalImages;
    updateCarousel();
    startAutoSlide();
  });

  // Start the carousel auto-slide
  startAutoSlide();
});

// check login
document.addEventListener("DOMContentLoaded", () => {
  const login = document.getElementById("logined-profile");
  const noLogin = document.getElementById("login-profile");
  const logout = document.getElementById("logout");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // if logged in, show profile dropdown, else show login button
  if (isLoggedIn === "true") {
    login.classList.remove("hidden");
    noLogin.classList.add("hidden");
    // console.log("User is logged in!!!, isLoggedIn =", isLoggedIn);
  } else {
    login.classList.add("hidden");
    noLogin.classList.remove("hidden");
  }

  logout.addEventListener("click", () => {
    login.classList.add("hidden");
    noLogin.classList.remove("hidden");
    localStorage.setItem("isLoggedIn", "false");
  });
})

// search product
document.addEventListener("DOMContentLoaded", async () => {
  const searchInputs = document.querySelectorAll("#search-input");
  const searchResultsContainers = document.querySelectorAll("#search-results");

  let products = [];

  try {
    const response = await fetch("./data/products.json");
    products = await response.json();
  } catch (error) {
    console.error("Error loading products:", error);
    return;
  }

  function highlightMatch(text, term) {
    // use regex to highlight (สนใจตัวพิมพ์เล็ก-ใหญ่)
    const regex = new RegExp(`(${term})`, 'gi');
    // insert span tag with bg-yellow-200
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  }

  // function to display search results
  function displayResults(filteredProducts, resultContainer, searchTerm) {
    // clear previous results
    resultContainer.innerHTML = "";

    // if no products found display message ไม่พบสินค้า
    if (filteredProducts.length === 0) {
      resultContainer.innerHTML = `<div class="p-4 text-gray-500">ไม่พบสินค้า</div>`;
    } else {
      // loop with forEach to display products
      filteredProducts.forEach((product) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("p-4", "border-b", "border-gray-200", "cursor-pointer", "hover:bg-gray-100");
        resultItem.innerHTML = `
          <div class="flex items-center">
            <img src="${product.src}" alt="${product.name}" class="w-10 h-10 rounded-md mr-4"/>
            <div>
              <p class="font-medium">${highlightMatch(product.name, searchTerm)}</p>
            </div>
          </div>
        `;
        // if found product, redirect to product detail page with id
        resultItem.addEventListener("click", () => {
          window.location.href = `product-detail.html?id=${product.id}`;
        });
        resultContainer.appendChild(resultItem);
      });
    }
    resultContainer.classList.remove("hidden");
  }

  // add event listener for typing in search input
  searchInputs.forEach((input, index) => {
    input.addEventListener("input", (event) => {
      // convert to lowercase, easy to search
      const searchTerm = event.target.value.toLowerCase();
      if (searchTerm) {
        // filter products by name or description
        const filteredProducts = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        // call displayResults function
        displayResults(filteredProducts, searchResultsContainers[index], searchTerm);
      } else {
        // hide search results if no text in search input
        searchResultsContainers[index].classList.add("hidden");
      }
    });

    // hide search results when click outside of search input
    document.addEventListener("click", (event) => {
      if (!input.contains(event.target) && !searchResultsContainers[index].contains(event.target)) {
        searchResultsContainers[index].classList.add("hidden");
      }
    });
  });
});

// function to add product to cart and update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // calculate total quantity of products in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0); 
  const cartIcon = document.getElementById("cart-count");
  if (cartIcon) {
    // update cart count in icon
    cartIcon.textContent = cartCount; 
  }
}

// call updateCartCount when the page loads
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

// (navbar) Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuButton = document.getElementById('close-menu');

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.remove('-translate-x-full');
});

closeMenuButton.addEventListener('click', () => {
  mobileMenu.classList.add('-translate-x-full');
});