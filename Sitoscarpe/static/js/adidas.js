const adidasProducts = [
  { name: "ADIDAS ULTRABOOST 22", price: 180, img: "img/Adidas1.webp", desc: "Comfort e performance per ogni giorno", page: "acquista.html" },
  { name: "ADIDAS NMD_R1", price: 150, img: "img/Adidas2.webp", desc: "Modello iconico da lifestyle", page: "acquista.html" },
  { name: "ADIDAS FORUM LOW", price: 120, img: "img/Adidas3.webp", desc: "Sneaker versatile e casual", page: "acquista.html" }
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

renderProducts(adidasProducts);
