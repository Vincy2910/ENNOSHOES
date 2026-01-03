document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form[action='/login']");

    loginForm.addEventListener("submit", function (e) {
        const role = loginForm.querySelector("select[name='role']").value;
        if (!role) {
            e.preventDefault();
            alert("Seleziona un ruolo prima di effettuare il login!");
        }
    });
});
