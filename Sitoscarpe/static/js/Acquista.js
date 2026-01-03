// Funzione per leggere i parametri dalla query string
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        nome: params.get('nome'),
        desc: params.get('desc'),
        prezzo: parseFloat(params.get('prezzo')) || 0,
        img: params.get('img'),
        size: "38"  // default, verrà cambiato se l'utente seleziona una taglia
    };
}

// Funzione per aggiornare la pagina con i dati del prodotto
function mostraProdotto() {
    const prodotto = getQueryParams();
    if (!prodotto.nome) return;

    document.getElementById('product-name').textContent = prodotto.nome;
    document.getElementById('product-desc').textContent = prodotto.desc;
    document.getElementById('product-price').textContent = `€${prodotto.prezzo.toFixed(2)}`;
    document.querySelector('.product-image img').src = prodotto.img;
    document.querySelector('.product-image img').alt = prodotto.nome;
}

// Funzione per aggiungere un prodotto al carrello (localStorage)
function aggiungiAlCarrello(prodotto, quantita) {
    let carrello = JSON.parse(localStorage.getItem('cart')) || [];

    // Controlla se il prodotto con stessa taglia esiste già
    const index = carrello.findIndex(item => item.nome === prodotto.nome && item.size === prodotto.size);
    if (index >= 0) {
        carrello[index].quantity += quantita;
    } else {
        carrello.push({
            nome: prodotto.nome,
            desc: prodotto.desc,
            prezzo: prodotto.prezzo,
            img: prodotto.img,
            size: prodotto.size,
            quantity: quantita
        });
    }

    localStorage.setItem('cart', JSON.stringify(carrello));
}

// Gestione eventi DOM
document.addEventListener('DOMContentLoaded', () => {
    mostraProdotto();

    const sizeButtons = document.querySelectorAll('.size-options button');
    let selectedSize = "38";

    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.textContent;
        });
    });

    const btnAdd = document.getElementById('add-to-cart');
    btnAdd.addEventListener('click', (e) => {
        e.preventDefault();
        const prodotto = getQueryParams();
        prodotto.size = selectedSize;

        const qty = parseInt(document.querySelector('.qty-controls input').value) || 1;
        aggiungiAlCarrello(prodotto, qty);

        alert('Prodotto aggiunto al carrello!');
        window.location.href = "/p/carrello.html"; // porta alla pagina carrello
    });

    // Pulsanti + e - quantità
    const btnPlus = document.querySelector('.qty-plus');
    const btnMinus = document.querySelector('.qty-minus');
    const inputQty = document.querySelector('.qty-controls input');

    btnPlus.addEventListener('click', () => {
        inputQty.value = parseInt(inputQty.value) + 1;
    });

    btnMinus.addEventListener('click', () => {
        if (parseInt(inputQty.value) > 1) {
            inputQty.value = parseInt(inputQty.value) - 1;
        }
    });
});
