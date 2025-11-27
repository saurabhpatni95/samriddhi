/* -------------------- TOGGLE WISHLIST -------------------- */
function toggleWishlist(btn) {
    const uniqueId = btn.dataset.uniqueid;   // type + id
    const id = btn.dataset.id;
    const type = btn.dataset.type;
    const name = btn.dataset.name;
    const img = btn.dataset.img;
    const price = parseInt(btn.dataset.price);

    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.some(item => item.uniqueId === uniqueId);

    if (exists) {
        wishlist = wishlist.filter(item => item.uniqueId !== uniqueId);
    } else {
        wishlist.push({ uniqueId, id, type, name, img, price });
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Update all buttons and wishlist count immediately
    updateWishlistButtons();
    updateWishlistCount();

    // Trigger global sync across other tabs/pages
    window.dispatchEvent(new Event("storage"));
}

/* -------------------- UPDATE WISHLIST BUTTONS -------------------- */
function updateWishlistButtons() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        const uniqueId = btn.dataset.uniqueid;
        const exists = wishlist.some(item => item.uniqueId === uniqueId);

        if (exists) {
            btn.innerHTML = "✔ Added";
            btn.classList.add("btn-added");
        } else {
            btn.innerHTML = "❤️ Wishlist";
            btn.classList.remove("btn-added");
        }
    });
}

/* -------------------- UPDATE WISHLIST COUNT -------------------- */
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const el = document.getElementById("wishlistCount");
    if (el) el.textContent = wishlist.length;
}

/* -------------------- LOAD WISHLIST PAGE -------------------- */
function loadWishlist() {
    const container = document.getElementById("wishlistContainer");
    let items = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!items.length) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4 class="text-muted">Your wishlist is empty</h4>
            </div>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="col-md-3">
            <div class="product-card animate-slide product-info" onclick="openProductDetails('${item.id}', '${item.type}')">
                <img src="${item.img}" class="product-fixed-img mb-3" />

                <div class="p-3 text-center">
                    <h5 class="fw-bold">${item.name}</h5>
                    <p class="price">₹${item.price}</p>

                    <button class="btn btn-outline-danger mt-2"
                            data-id="${item.id}"
                            data-type="${item.type}"
                            data-name="${item.name}"
                            data-img="${item.img}"
                            data-price="${item.price}"
                            data-uniqueid="${item.uniqueId}"
                            onclick="event.stopPropagation(); removeFromWishlist('${item.uniqueId}')">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

/* -------------------- REMOVE ITEM FROM WISHLIST -------------------- */
function removeFromWishlist(uniqueId) {
    let items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    items = items.filter(i => i.uniqueId !== uniqueId);
    localStorage.setItem("wishlist", JSON.stringify(items));

    // Reload wishlist page
    loadWishlist();

    // Trigger global sync for other pages
    window.dispatchEvent(new Event("storage"));
}

/* -------------------- OPEN PRODUCT DETAILS -------------------- */
function openProductDetails(id, type) {
    window.location.href = `product-details.html?id=${id}&type=${type}`;
}

/* -------------------- INITIAL LOAD -------------------- */
document.addEventListener("DOMContentLoaded", () => {
    loadWishlist();
    updateWishlistButtons();
    updateWishlistCount();
});
