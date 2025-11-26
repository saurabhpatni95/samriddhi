function toggleWishlist(btn) {
    let id = btn.dataset.id;
    let name = btn.dataset.name;
    let img = btn.dataset.img;
    let price = parseInt(btn.dataset.price);

    let items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let exists = items.some(item => item.id == id);

    if (exists) {
        items = items.filter(i => i.id != id);
        btn.innerHTML = "❤️ Wishlist";
        btn.classList.remove("btn-added");
    } else {
        items.push({ id, name, img, price });
        btn.innerHTML = "✔ Added";
        btn.classList.add("btn-added");
    }

    localStorage.setItem("wishlist", JSON.stringify(items));
    updateWishlistCount();

    // Trigger global sync
    window.dispatchEvent(new Event("storage"));
}

function removeFromWishlist(id) {
    let items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    items = items.filter(item => item.id != id);

    localStorage.setItem("wishlist", JSON.stringify(items));
    loadWishlist();
    updateWishlistCount();
    window.dispatchEvent(new Event("storage"));
}

function updateWishlistCount() {
    const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const el = document.getElementById("wishlistCount");
    if (el) el.textContent = items.length;
}

function loadWishlist() {
    let items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const container = document.getElementById("wishlistContainer");

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4 class="text-muted">Your wishlist is empty</h4>
            </div>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="col-md-3">
            <div class="product-card animate-slide"
                 onclick="openProductDetails(${item.id}, 'wishlist')">

                <img src="${item.img}" class="product-fixed-img">

                <div class="p-3 text-center">
                    <h5 class="fw-bold">${item.name}</h5>
                    <p class="price">₹${item.price}</p>

                    <button class="btn btn-outline-danger mt-2"
                            onclick="event.stopPropagation(); removeFromWishlist(${item.id})">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}
