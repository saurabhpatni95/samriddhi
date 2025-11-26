// Load Navbar Component
fetch("components/navbar.html")
  .then(response => response.text())
  .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;

      // =====================================
      // DARK MODE INITIALIZATION
      // =====================================
      const darkToggle = document.getElementById("darkToggle");

      if (localStorage.getItem("theme") === "dark") {
          document.body.classList.add("dark-mode");
          darkToggle.textContent = "☀️";
          darkToggle.classList.add("rotated");
      }

      darkToggle.addEventListener("click", () => {
          document.body.classList.toggle("dark-mode");

          if (document.body.classList.contains("dark-mode")) {
              localStorage.setItem("theme", "dark");
              darkToggle.textContent = "☀️";
              darkToggle.classList.add("rotated");
          } else {
              localStorage.setItem("theme", "light");
              darkToggle.textContent = "🌙";
              darkToggle.classList.remove("rotated");
          }
      });

      // =====================================
      // GLOBAL WISHLIST BADGE UPDATE
      // =====================================
      const updateWishlistCount = () => {
          const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
          const badge = document.getElementById("wishlistCount");
          if (badge) badge.textContent = items.length;
      };
      updateWishlistCount();

      // =====================================
      // 🔍 SEARCH FUNCTIONALITY (FIXED)
      // =====================================
      const searchInput = document.getElementById("searchInput");

      if (searchInput) {
          searchInput.addEventListener("keyup", async (e) => {
              let query = e.target.value.toLowerCase().trim();
              if (query.length < 2) return; // avoid accidental single letter searches

              const res = await fetch("data/products.json");
              const data = await res.json();

              // Combine all categories
              let allProducts = [
                  ...data.sarees,
                  ...data.suits,
                  ...data.trending
              ];

              let found = allProducts.find(p =>
                  p.name.toLowerCase().includes(query)
              );

              if (found) {
                  window.location.href =
                      `product-details.html?id=${found.id}&type=${found.type ?? "sarees"}`;
              }
          });
      }
  })
  .catch(err => console.error("Navbar load error:", err));
