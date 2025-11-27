/* -------------------- TOGGLE WISHLIST -------------------- */
function toggleWishlist(btn) {
    const uniqueId = btn.dataset.uniqueid;
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

    updateWishlistButtons();
    updateWishlistCount();
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
    const elMobile = document.getElementById("wishlistCountMobile");
    if (el) el.textContent = wishlist.length;
    if (elMobile) elMobile.textContent = wishlist.length;
}

/* -------------------- LOAD WISHLIST PAGE -------------------- */
function loadWishlist() {
    const container = document.getElementById("wishlistContainer");
    const items = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!items.length) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4 class="text-muted">Your wishlist is empty</h4>
            </div>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="col-md-3">
            <div class="product-card animate-slide product-info" data-id="${item.id}" data-type="${item.type}">
                <img src="${item.img}" class="product-fixed-img mb-3" />

                <div class="p-3 text-center card-body">
                    <h5 class="fw-bold">${item.name}</h5>
                    <p class="price">₹${item.price}</p>

                    <button class="btn btn-outline-danger mt-2 wishlist-btn"
                            data-id="${item.id}"
                            data-type="${item.type}"
                            data-name="${item.name}"
                            data-img="${item.img}"
                            data-price="${item.price}"
                            data-uniqueid="${item.uniqueId}">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    // Open product-details.html when card clicked
    container.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            const type = card.dataset.type;
            window.location.href = `product-details.html?id=${type}-${id}&category=${type}`;
        });
    });

    // Remove from wishlist
    container.querySelectorAll(".wishlist-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent opening product-details
            removeFromWishlist(btn.dataset.uniqueid);
        });
    });
}

/* -------------------- REMOVE ITEM FROM WISHLIST -------------------- */
function removeFromWishlist(uniqueId) {
    let items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    items = items.filter(i => i.uniqueId !== uniqueId);
    localStorage.setItem("wishlist", JSON.stringify(items));

    loadWishlist();
    window.dispatchEvent(new Event("storage"));
}

/* -------------------- INITIAL LOAD -------------------- */
document.addEventListener("DOMContentLoaded", () => {
    loadWishlist();
    updateWishlistButtons();
    updateWishlistCount();
});