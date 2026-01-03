let currentUser = null;

// Registrazione
async function registerUser() {
    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://127.0.0.1:5000/api/utenti/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cognome, email, password })
    });

    const data = await res.json();
    alert(data.msg);
}

// Login
async function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch("http://127.0.0.1:5000/api/utenti/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.msg);

    if (data.utente) {
        currentUser = data.utente;
        console.log("Utente loggato:", currentUser);
    }
}
