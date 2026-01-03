ì// Dashboard.js
window.addEventListener("DOMContentLoaded", () => {
    // Prendi l'utente loggato
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));

    if (!activeUser) {
        // Se nessun utente loggato, torna al login
        window.location.href = "Login.html";
        return;
    }

    // Popola le informazioni dell'utente
    const userNameEl = document.getElementById("user-name");
    const userEmailEl = document.getElementById("user-email");
    const profilePicEl = document.getElementById("profile-pic");

    userNameEl.textContent = activeUser.nome + " " + activeUser.cognome;
    userEmailEl.textContent = activeUser.email;
    if (activeUser.avatar && activeUser.avatar !== "") {
        profilePicEl.src = activeUser.avatar;
    }

    // Contatori
    document.getElementById("orders-count").textContent = activeUser.ordini.length;
    document.getElementById("wishlist-count").textContent = activeUser.wishlist.length;
    document.getElementById("credits").textContent = activeUser.crediti;

    // Popola Ordini
    const orderListEl = document.getElementById("order-list");
    orderListEl.innerHTML = "";
    if (activeUser.ordini.length === 0) {
        orderListEl.innerHTML = '<li>Nessun ordine recente. <a href="CatalogoUniversale.html">Scopri prodotti</a></li>';
    } else {
        activeUser.ordini.forEach(ord => {
            const li = document.createElement("li");
            li.textContent = `Ordine #${ord.id} - ${ord.data}`;
            orderListEl.appendChild(li);
        });
    }

    // Popola Wishlist
    const wishlistGridEl = document.getElementById("wishlist-grid");
    wishlistGridEl.innerHTML = "";
    if (activeUser.wishlist.length === 0) {
        wishlistGridEl.innerHTML = '<div class="fav-empty">Nessun preferito. Aggiungi prodotti alla lista!</div>';
    } else {
        activeUser.wishlist.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${item.img}" alt="${item.nome}">
                <h4>${item.nome}</h4>
                <p class="price">€${item.prezzo}</p>
            `;
            wishlistGridEl.appendChild(card);
        });
    }

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("activeUser");
        window.location.href = "Login.html";
    });

    // Funzione per aggiornare i dati attuali dell'utente
    function updateDashboard() {
        localStorage.setItem("activeUser", JSON.stringify(activeUser));
        document.getElementById("orders-count").textContent = activeUser.ordini.length;
        document.getElementById("wishlist-count").textContent = activeUser.wishlist.length;
        document.getElementById("credits").textContent = activeUser.crediti;
    }

    // Esempio: se in futuro aggiungi ordini o wishlist, chiama updateDashboard()
});
