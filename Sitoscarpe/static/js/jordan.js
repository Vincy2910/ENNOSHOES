const jordanProducts = [
  { name: "AIR JORDAN 1 MID", price: 170, img: "img/Jordan1.webp", desc: "Classico intramontabile Jordan", page: "acquista.html" },
  { name: "AIR JORDAN 4 RETRO", price: 220, img: "img/Jordan2.webp", desc: "Modello iconico da collezione", page: "acquista.html" },
  { name: "JORDAN DELTA", price: 150, img: "img/Jordan3.webp", desc: "Comoda e versatile per tutti i giorni", page: "acquista.html" }
];

const productContainer = document.getElementById("product-container");

function renderProducts(products) {
  productContainer.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">€${product.price.toFixed(2)}</p>
      <p class="desc">${product.desc}</p>
      <button class="btn-buy" onclick="addToCart('${product.name}', ${product.price}, '${product.img}')">Acquista</button>
    `;
    productContainer.appendChild(card);
  });
}

function addToCart(name, price, img) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price, img, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} aggiunto al carrello!`);
}

renderProducts(jordanProducts);
