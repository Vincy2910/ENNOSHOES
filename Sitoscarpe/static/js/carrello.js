const cartItemsContainer = document.querySelector(".cart-items");
const cartSummary = document.querySelector(".cart-summary");

// Carico il carrello dal localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Salva carrello
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Render carrello
function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Il tuo carrello è vuoto.</p>";
        cartSummary.innerHTML = "<p>Totale prodotti: 0</p><p>Totale: €0,00</p>";
        return;
    }

    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalQty += item.quantity;
        totalPrice += item.prezzo * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <div class="item-info">
                <h3>${item.nome}</h3>
                <p>Taglia: ${item.size}</p>
                <p>Prezzo: €${item.prezzo.toFixed(2)}</p>
                <p>Quantità: ${item.quantity}</p>
            </div>
            <button class="btn-remove" data-index="${index}">Rimuovi</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartSummary.innerHTML = `
        <p>Totale prodotti: ${totalQty}</p>
        <p>Totale: €${totalPrice.toFixed(2)}</p>
        <button class="btn-checkout">Procedi all'acquisto</button>
    `;

    // Event listener rimuovi
    document.querySelectorAll(".btn-remove").forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);
            saveCart();
        });
    });

    // Event listener checkout
    document.querySelector(".btn-checkout").addEventListener("click", async () => {
        if(cart.length === 0){
            alert("Il carrello è vuoto!");
            return;
        }

        try {
            const response = await fetch("/acquista", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({cart})
            });

            const result = await response.json();
            console.log("Server response:", result);

            if(response.ok){
                alert("✔ Acquisto completato e salvato su MongoDB!");
                cart = [];
                saveCart();
            } else {
                alert("❌ Errore: " + result.error || result.message);
            }
        } catch(err){
            alert("❌ Errore durante l'acquisto: " + err);
        }
    });
}

// Render iniziale
renderCart();
