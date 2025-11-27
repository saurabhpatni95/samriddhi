function loadProducts(category, containerId, limit = null) {
    fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
            let items = data[category];
            if (limit) items = items.slice(0, limit);

            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

            const html = items.map(item => {
                // 🔹 uniqueId = type + id
                const uniqueId = `${item.type}-${item.id}`;
                const isAdded = wishlist.some(w => w.uniqueId === uniqueId);

                return `
                <div class="col-md-3 col-sm-6" data-aos="fade-up">
                    <div class="product-card animate-slide"
                         onclick="openProductDetails('${uniqueId}', '${category}')">

                        <img src="${item.image}" class="product-fixed-img">

                        <div class="p-3 text-center">
                            <h5 class="fw-bold">${item.name}</h5>
                            <p class="price">₹${item.price}</p>

                            <button class="btn btn-outline-danger wishlist-btn ${isAdded ? "btn-added" : ""}"
                                    data-uniqueid="${uniqueId}"
                                    data-id="${item.id}"
                                    data-type="${item.type}"
                                    data-name="${item.name}"
                                    data-img="${item.image}"
                                    data-price="${item.price}"
                                    onclick="event.stopPropagation(); toggleWishlist(this)">
                                ${isAdded ? "✔ Added" : "❤️ Wishlist"}
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join("");

            document.getElementById(containerId).innerHTML = html;

            // Ensure buttons update according to wishlist
            updateWishlistButtons();
        });
}

function openProductDetails(uniqueId, category) {
    window.location.href = `product-details.html?id=${uniqueId}&category=${category}`;
}
