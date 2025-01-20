// แสดงรายการสินค้าในหน้า

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");

  const params = new URLSearchParams(window.location.search);
  const selectedType = params.get("type");

  // ดึงข้อมูลจากไฟล์ JSON
  try {
    const response = await fetch("./data/mock-products.json");
    const products = await response.json();

    // กรองสินค้าตามประเภทที่เลือก
    const filteredProducts = selectedType 
      ? products.filter(product => product.type === selectedType) 
      : products;

      filteredProducts.forEach((product) => {
      const productDiv = document.createElement("a");
      productDiv.classList.add("group", "cursor-pointer", "block", "w-full", "max-w-xs", "mx-auto");
      
      let saleTag = "";
      if (product.sale) {
        saleTag = `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                     ${product.sale}% OFF
                   </span>`;
      }
      productDiv.innerHTML = `
        <div class="relative p-3 rounded-md shadow-md hover:shadow-xl bg-white" onclick="viewProduct(${product.id})">
          ${saleTag}
          <img src="${product.src}" alt="Product Img" class="aspect-square w-full rounded-lg bg-gray-200 object-cover xl:aspect-[7/8]"/>
          <h3 class="mt-4 text-sm text-gray-700 font-semibold text-left">${product.name}</h3>
          <p class="my-1 text-lg font-medium text-left text-secondary-dark">Price: ${product.price} ฿</p>
        </div>
      `;
      // <div class="text-left mt-2">
      //   <a class="inline-block rounded-md bg-primary-dark px-4 py-2 text-white transition hover:bg-primary-light" onclick="viewProduct(${product.id})">
      //     View Details
      //   </a>
      // </div>
      productList.appendChild(productDiv);
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

// JavaScript for handling the dropdown
document.addEventListener("DOMContentLoaded", () => {
  const toggleDropdown = (menuButtonId, dropdownId) => {
    const menuButton = document.getElementById(menuButtonId);
    const dropdown = document.getElementById(dropdownId);

    menuButton.addEventListener("click", () => {
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if ( !menuButton.contains(event.target) && !dropdown.contains(event.target)
      ) {
        dropdown.classList.add("hidden");
      }
    });
  };

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
document.addEventListener("DOMContentLoaded", () => {
  const login = document.getElementById("logined-profile");
  const noLogin = document.getElementById("login-profile");
  const logout = document.getElementById("logout");

  // noLogin.addEventListener("click", () => {
  //   noLogin.classList.add("hidden");
  //   login.classList.remove("hidden");
  // });

  logout.addEventListener("click", () => {
    login.classList.add("hidden");
    noLogin.classList.remove("hidden");
  });
});

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
})

// search
document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  let products = [];

  // โหลดข้อมูลจาก mock-products.json
  try {
    const response = await fetch("./data/mock-products.json");
    products = await response.json();
  } catch (error) {
    console.error("Error loading products:", error);
    return;
  }

  // ฟังก์ชันสำหรับแสดงผลลัพธ์การค้นหา
  function displayResults(filteredProducts) {
    searchResults.innerHTML = ""; // ล้างผลลัพธ์เก่า
    if (filteredProducts.length === 0) {
      searchResults.innerHTML = `<div class="p-4 text-gray-500">ไม่พบสินค้า</div>`;
    } else {
      filteredProducts.forEach((product) => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("p-4", "border-b", "border-gray-200", "cursor-pointer", "hover:bg-gray-100");
        resultItem.innerHTML = `
          <div class="flex items-center">
            <img src="${product.src}" alt="${product.name}" class="w-10 h-10 rounded-md mr-4"/>
            <div>
              <p class="font-medium">${product.name}</p>
            </div>
          </div>
        `;
        resultItem.addEventListener("click", () => {
          // ทำสิ่งที่ต้องการเมื่อเลือกสินค้า เช่น เปิดหน้ารายละเอียดสินค้า
          window.location.href = `product-detail.html?id=${product.id}`;
        });
        searchResults.appendChild(resultItem);
      });
    }
    searchResults.classList.remove("hidden"); // แสดงผลลัพธ์
  }

  // ตรวจจับการพิมพ์ในช่องค้นหา
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      const filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
      displayResults(filteredProducts);
    } else {
      searchResults.classList.add("hidden"); // ซ่อนผลลัพธ์เมื่อไม่มีการพิมพ์
    }
  });

  // ซ่อนผลลัพธ์เมื่อคลิกนอกช่องค้นหา
  document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
      searchResults.classList.add("hidden");
    }
  });
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

