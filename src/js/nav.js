async function loadNavbar() {
  const navbarContainer = document.getElementById("navbar");
  try {
    const response = await fetch("nav.html");
    if (response.ok) {
      const html = await response.text();
      navbarContainer.innerHTML = html;

      // Attach dropdown functionality only after the HTML is injected
      initializeDropdowns();
    } else {
      console.error("Failed to load navbar: ", response.statusText);
    }
  } catch (error) {
    console.error("Error loading navbar: ", error);
  }
}

// ฟังก์ชันสำหรับจัดการ dropdown
function initializeDropdowns() {
  const toggleDropdown = (menuButtonId, dropdownId) => {
    const menuButton = document.getElementById(menuButtonId);
    const dropdown = document.getElementById(dropdownId);

    if (menuButton && dropdown) {
      menuButton.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
      });

      document.addEventListener("click", (event) => {
        if (
          !menuButton.contains(event.target) &&
          !dropdown.contains(event.target)
        ) {
          dropdown.classList.add("hidden");
        }
      });
    } else {
      console.warn(
        `Elements with IDs ${menuButtonId} or ${dropdownId} not found`
      );
    }
  };

  // Initialize dropdowns
  toggleDropdown("products-menu", "products-dropdown");
  toggleDropdown("profile-menu", "profile-dropdown");
}

// เรียกโหลด Navbar
loadNavbar();
