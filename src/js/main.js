// แสดงรายการสินค้าในหน้า

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const filterBtn = document.getElementById("filter-price-btn");
  const clearFilterBtn = document.getElementById("clear-filter-btn");
  // อ้างอิง element ที่ใช้แสดงรูปภาพ
  const categoryImageDiv = document.getElementById("category-image");

  // ดึงประเภทสินค้าจาก URL (ถ้ามี)
  const params = new URLSearchParams(window.location.search);
  const selectedType = params.get("type");
  
  // แมปประเภทสินค้ากับรูปภาพที่เกี่ยวข้อง
  const categoryImages = {
    headphone: "/src/assets/headPage-headphone.png",
    computer: "/src/assets/headPage-notebook.png",
    keyboard: "/src/assets/headPage-keyboard.png"
  };

  // ตรวจสอบว่ามีประเภทสินค้าและแสดงภาพที่เหมาะสม
  categoryImageDiv.innerHTML = selectedType && categoryImages[selectedType] ?
    `<img src="${categoryImages[selectedType]}" alt="${selectedType}" class="w-full rounded-md shadow-lg"/>` :
    "";

  try {
    const response = await fetch("./data/mock-products.json");
    let products = await response.json();

    // ฟังก์ชันแสดงสินค้า
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

    // กรองสินค้าตามช่วงราคา
    filterBtn.addEventListener("click", () => {
      const minPrice = parseInt(minPriceInput.value) || 0;
      const maxPrice = parseInt(maxPriceInput.value) || Infinity;
      displayProducts(filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice));
    });

    // ฟังก์ชันเคลียร์ตัวกรอง
    clearFilterBtn.addEventListener("click", () => {
      minPriceInput.value = "";
      maxPriceInput.value = "";
      // โหลดสินค้าตามประเภทใหม่
      displayProducts(filteredProducts);
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
});


// function to open product details
function viewProduct(productId) {
  // เก็บ productId ลงใน query parameter ของ URL
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


// JavaScript for handling the carousel
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  const images = carousel.children;
  const totalImages = images.length;
  const intervalTime = 5000;
  let currentIndex = 0;
  let interval;

  const updateCarousel = () => {
    const offset = -currentIndex * 100; // Calculate the offset in percentage
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

// JavaScript for handling the login UI
// document.addEventListener("DOMContentLoaded", () => {
//   const login = document.getElementById("logined-profile");
//   const noLogin = document.getElementById("login-profile");
//   const logout = document.getElementById("logout");

//   noLogin.addEventListener("click", () => {
//     noLogin.classList.add("hidden");
//     login.classList.remove("hidden");
//   });

//   logout.addEventListener("click", () => {
//     login.classList.add("hidden");
//     noLogin.classList.remove("hidden");
//   });
// });

// check login and get data from local storage
document.addEventListener("DOMContentLoaded", () => {
  const login = document.getElementById("logined-profile");
  const noLogin = document.getElementById("login-profile");
  const logout = document.getElementById("logout");

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    login.classList.remove("hidden");
    noLogin.classList.add("hidden");
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

// search
document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  let products = [];
  try {
    const response = await fetch("./data/mock-products.json");
    products = await response.json();
  } catch (error) {
    console.error("Error loading products:", error);
    return;
  }

  function highlightMatch(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  }

  function displayResults(filteredProducts, searchTerm) {
    searchResults.innerHTML = filteredProducts.length
      ? filteredProducts.map(product => `
          <div class="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100" onclick="viewProduct(${product.id})">
            <div class="flex items-center">
              <img src="${product.src}" alt="${product.name}" class="w-10 h-10 rounded-md mr-4"/>
              <p class="font-medium">${highlightMatch(product.name, searchTerm)}</p>
            </div>
          </div>`).join("")
      : `<div class="p-4 text-gray-500">ไม่พบสินค้า</div>`;
    searchResults.classList.remove("hidden");
  }

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    searchResults.classList.toggle("hidden", !searchTerm);
    if (searchTerm) {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
      displayResults(filteredProducts, searchTerm);
    }
  });

  document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
      searchResults.classList.add("hidden");
    }
  });

  function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
  }
});



// ฟังก์ชันสำหรับอัปเดตจำนวนสินค้าในตะกร้า
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0); // รวมจำนวนสินค้า
  const cartIcon = document.getElementById("cart-count");
  if (cartIcon) {
    cartIcon.textContent = cartCount; // อัปเดตตัวเลขบนไอคอน
  }
}

// เรียกใช้งานฟังก์ชันเมื่อโหลดหน้าเว็บ
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});

