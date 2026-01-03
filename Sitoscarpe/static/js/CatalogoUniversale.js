// CatalogoUniversale.js

const brands = {
  uomo: [
    { name: "Nike", img: "img/nike-logo.png", page: "nikeuomo.html" },
    { name: "Jordan", img: "EnnoShoes/logonike.jpg", page: "jordanuomo.html" },
    { name: "Adidas", img: "img/adidas-logo.png", page: "adidasuomo.html" }
  ],
  donna: [
    { name: "Nike", img: "img/nike-logo.png", page: "nikedonna.html" },
    { name: "Jordan", img: "img/jordan-logo.png", page: "jordandonna.html" },
    { name: "Adidas", img: "img/adidas-logo.png", page: "adidasdonna.html" }
  ]
};

const brandsContainer = document.getElementById("brands-container");

function renderBrands(gender) {
  brandsContainer.innerHTML = `<h2>Marchi ${gender.charAt(0).toUpperCase() + gender.slice(1)}</h2>`;
  const divContainer = document.createElement("div");
  divContainer.classList.add("brands-container");

  brands[gender].forEach(brand => {
    const brandCard = document.createElement("a");
    brandCard.classList.add("brand-card");
    brandCard.href = brand.page;
    brandCard.innerHTML = `
      <img src="${brand.img}" alt="${brand.name} Logo">
      <span>${brand.name}</span>
    `;
    divContainer.appendChild(brandCard);
  });

  brandsContainer.appendChild(divContainer);
}

// Event listener sui bottoni
document.querySelectorAll(".gender-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const gender = btn.getAttribute("data-gender");
    renderBrands(gender);
  });
});

// Default: mostra uomo
renderBrands("uomo");
