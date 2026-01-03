document.addEventListener("DOMContentLoaded", function () {
    const roleSelect = document.getElementById("role-select");
    const secretCodeInput = document.getElementById("secret-code");

    // Mostra/nascondi campo codice segreto
    roleSelect.addEventListener("change", function () {
        if (roleSelect.value === "lavoratore" || roleSelect.value === "admin") {
            secretCodeInput.style.display = "block";
            secretCodeInput.placeholder = roleSelect.value === "lavoratore"
                ? "Inserisci codice lavoratore"
                : "Inserisci codice admin";
            secretCodeInput.required = true;
        } else {
            secretCodeInput.style.display = "none";
            secretCodeInput.value = "";
            secretCodeInput.required = false;
        }
    });
});
