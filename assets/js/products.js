function loadProducts(category, containerId, limit = null) {
    fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
            let items = data[category];
            if (limit) items = items.slice(0, limit);

            let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

            let html = "";
            items.forEach(item => {

                let isAdded = wishlist.some(w => w.id == item.id); // FIXED

                html += `
                <div class="col-md-3" data-aos="fade-up">
                    <div class="product-card animate-slide"
                         onclick="openProductDetails(${item.id}, '${category}')">

                        <img src="${item.image}" class="product-fixed-img">

                        <div class="p-3 text-center">
                            <h5 class="fw-bold">${item.name}</h5>
                            <p class="price">₹${item.price}</p>

                            <button class="btn btn-outline-danger wishlist-btn ${isAdded ? "btn-added" : ""}"
                                    data-id="${item.id}"
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
            });

            document.getElementById(containerId).innerHTML = html;
        })
        .then(() => updateWishlistButtons());
}

function updateWishlistButtons() {
    let items = JSON.parse(localStorage.getItem("wishlist") || "[]");

    document.querySelectorAll(".wishlist-btn").forEach(btn => {
        let id = btn.dataset.id;
        let exists = items.some(i => i.id == id);

        if (exists) {
            btn.innerHTML = "✔ Added";
            btn.classList.add("btn-added");
        } else {
            btn.innerHTML = "❤️ Wishlist";
            btn.classList.remove("btn-added");
        }
    });
}

function openProductDetails(id, type) {
    window.location.href = `product-details.html?id=${id}&type=${type}`;
}
