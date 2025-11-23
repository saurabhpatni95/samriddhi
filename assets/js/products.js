function loadProducts(category, containerId) {
    fetch('data/products.json')
        .then(res => res.json())
        .then(data => {
            let html = '';
            data[category].forEach(item => {
                html += `
                <div class="col mb-5">
                    <div class="card h-100">
                        <img class="card-img-top" src="${item.image}" alt="">
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${item.name}</h5>
                                ₹${item.price}
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            document.getElementById(containerId).innerHTML = html;
        });
}
