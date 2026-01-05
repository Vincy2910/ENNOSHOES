// Carrello.js - gestione completa del carrello

// ------------------------
// SELEZIONE ELEMENTI HTML
// ------------------------
const cartItemsContainer = document.querySelector(".cart-items");
const cartSummary = document.querySelector(".cart-summary");
const checkoutMsg = document.getElementById("checkout-msg");

// ------------------------
// CARICAMENTO CARRELLO
// ------------------------
// Legge il carrello dal localStorage, se non esiste crea un array vuoto
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ------------------------
// SALVA CARRELLO
// ------------------------
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart)); // salva su localStorage
    renderCart(); // aggiorna visualizzazione
}

// ------------------------
// RENDER CARRELLO
// ------------------------
function renderCart() {
    cartItemsContainer.innerHTML = "";
    cartSummary.innerHTML = "";
    checkoutMsg.innerHTML = "";

    if (cart.length === 0) {
        // Carrello vuoto
        cartItemsContainer.innerHTML = "<p>Il tuo carrello è vuoto.</p>";
        cartSummary.innerHTML = "<p>Totale prodotti: 0</p><p>Totale: €0,00</p>";
        return;
    }

    let totalQty = 0;
    let totalPrice = 0;

    // Cicla su tutti gli articoli
    cart.forEach((item, index) => {
        totalQty += item.quantity;
        totalPrice += item.prezzo * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <div class="item-info">
                <h3>${item.nome}</h3>
                <p>Taglia: ${item.size || "-"}</p>
                <p>Prezzo: €${item.prezzo.toFixed(2)}</p>
                <p>Quantità: 
                    <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
                </p>
                <p>Totale: €${(item.prezzo * item.quantity).toFixed(2)}</p>
                <button class="btn-remove" data-index="${index}">Rimuovi</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Aggiorna riepilogo
    cartSummary.innerHTML = `
        <p>Totale prodotti: ${totalQty}</p>
        <p>Totale: €${totalPrice.toFixed(2)}</p>
        <button class="btn-checkout">Procedi all'acquisto</button>
    `;

    // ------------------------
    // EVENT LISTENER: RIMUOVI
    // ------------------------
    document.querySelectorAll(".btn-remove").forEach(button => {
        button.addEventListener("click", function() {
            const index = parseInt(this.getAttribute("data-index"));
            cart.splice(index, 1);
            saveCart();
        });
    });

    // ------------------------
    // EVENT LISTENER: MODIFICA QUANTITÀ
    // ------------------------
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", () => {
            const idx = parseInt(input.dataset.index);
            let val = parseInt(input.value);
            if (val < 1) val = 1;
            cart[idx].quantity = val;
            saveCart();
        });
    });

    // ------------------------
    // EVENT LISTENER: CHECKOUT
    // ------------------------
    const checkoutBtn = document.querySelector(".btn-checkout");
    checkoutBtn.addEventListener("click", async () => {
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
                cart = [];       // svuota carrello
                saveCart();      // aggiorna visualizzazione
            } else {
                alert("❌ Errore: " + (result.error || result.message));
            }
        } catch(err){
            alert("❌ Errore durante l'acquisto: " + err);
            console.error(err);
        }
    });
}

// ------------------------
// RENDER INIZIALE
// ------------------------
renderCart();


