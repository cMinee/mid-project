// ดึง query parameter จาก URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id'), 10); // แปลง id เป็นตัวเลข

// ดึงข้อมูลสินค้า (mock data) จากไฟล์ mock-products.json
async function fetchProductData() {
  try {
    const response = await fetch('./data/mock-products.json'); // ตรวจสอบเส้นทางของไฟล์
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();

    // ค้นหาสินค้าที่ตรงกับ id
    const product = products.find(p => p.id === productId);

    // แสดงข้อมูลสินค้าหากพบ
    if (product) {
      const productDetail = document.getElementById('product-detail');
      productDetail.innerHTML = `
        <h2 class="text-2xl font-semibold mb-5">${product.name}</h2>
        <p class="text-xl font-semibold text-orange-500 mb-5">Price: ${product.price} ฿</p>
        <p class="text-xl mb-5">${product.description}</p>
        <p class="text-md mb-5">Color: ${product.color}</p>
      `;

      const productImg = document.getElementById('product-image');
      productImg.innerHTML = `
        <img src="${product.src}" class="rounded object-cover p-4" alt="Product Img"/>
      `;
    } else {
      // หากไม่พบสินค้า
      document.getElementById('product-detail').textContent = 'Product not found!';
    }
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById('product-detail').textContent = 'Error loading product data.';
  }
}
// เรียกใช้งานฟังก์ชัน
fetchProductData();

// ฟังก์ชันสำหรับเพิ่มสินค้าเข้าตะกร้า
function addToCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // ตรวจสอบว่าสินค้าอยู่ในตะกร้าแล้วหรือไม่
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += quantity; // เพิ่มจำนวนสินค้า
  } else {
    cart.push({ ...product, quantity: quantity }); // เพิ่มสินค้าใหม่
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // บันทึกลง Local Storage
  updateCartCount(); // อัปเดตจำนวนสินค้าในตะกร้า
}

// ฟังก์ชันสำหรับอัปเดตจำนวนสินค้าในตะกร้า
// ใส่แค่ใน main.js ก็สามาถทำงานได้ ลบทิ้งได้
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0); // รวมจำนวนสินค้า
  const cartIcon = document.getElementById("cart-count");
  cartIcon.textContent = cartCount; // อัปเดตตัวเลขบนไอคอน
}

// ดึงข้อมูลสินค้าและเพิ่มปุ่ม Add to Cart
async function fetchAddProductData() {
  try {
    const response = await fetch('./data/mock-products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();
    const product = products.find(p => p.id === productId);

    if (product) {
      const addToCartButton = document.querySelector(".add-cart-button");
      addToCartButton.addEventListener("click", () => {
        const quantityInput = document.getElementById("quantity");
        const quantity = parseInt(quantityInput.value, 10);

        // ตรวจสอบว่าจำนวนสินค้าถูกต้องหรือไม่
        if (quantity > 0) {
          addToCart(product, quantity); // เพิ่มสินค้าเข้าตะกร้าพร้อมจำนวน
        } else {
          alert("Please enter a valid quantity.");
        }
      });

      updateCartCount(); // อัปเดตจำนวนสินค้าเมื่อโหลดหน้า
    } else {
      document.getElementById("product-detail").textContent = "Product not found!";
    }
  } catch (error) {
    console.error("Error loading product data:", error);
  }
}

fetchAddProductData();


function buyNow(product, quantity) {
  if (quantity > 0) {
    const order = { ...product, quantity, total: product.price * quantity };
    sessionStorage.setItem("currentOrder", JSON.stringify(order)); // เก็บข้อมูลสินค้า
    window.location.href = "./checkout.html"; // เปลี่ยนไปหน้าสรุปคำสั่งซื้อ
  } else {
    alert("Please enter a valid quantity.");
  }
}

// ดึงข้อมูลสินค้าและเพิ่มปุ่ม Buy Now
async function checkoutProducts() {
  try {
    const response = await fetch("./data/mock-products.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();
    const product = products.find((p) => p.id === productId);

    if (product) {
      const buyNowButton = document.querySelector(".buy-now-button");
      buyNowButton.addEventListener("click", () => {
        const quantityInput = document.getElementById("quantity");
        const quantity = parseInt(quantityInput.value, 10);
        buyNow(product, quantity);
      });
    }
  } catch (error) {
    console.error("Error loading product data:", error);
  }
}

checkoutProducts();