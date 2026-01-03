// PRENDO IL FORM
const form = document.querySelector(".contact-form form");

// EVENTO SUBMIT
form.addEventListener("submit", async function(e){
    e.preventDefault();

    // VERIFICA LOGIN TRAMITE SERVER
    let logged = false;
    let userEmail = "";
    try {
        const res = await fetch("/check_login");
        const data = await res.json();
        logged = data.logged;
        userEmail = data.email || "";
    } catch (err) {
        console.error("Errore controllo login:", err);
    }

    if(!logged){
        alert("❌ Devi essere loggato per inviare un messaggio.");
        return;
    }

    // RECUPERO DATI DAL FORM
    const nomeCognome = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const telefono = form.querySelector('input[type="tel"]').value.trim();
    const messaggio = form.querySelector('textarea').value.trim();

    if(!nomeCognome || !email || !telefono || !messaggio){
        alert("❌ Compila tutti i campi.");
        return;
    }

    // CREO OGGETTO DA INVIARE AL SERVER
    const payload = {
        nomeCognome,
        email,
        telefono,
        messaggio
    };

    try {
        const response = await fetch("/contattaci", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if(result.success){
            alert("✔ Messaggio inviato con successo!");
            form.reset();
        } else {
            alert("❌ Errore: " + (result.error || "Messaggio non inviato"));
        }

    } catch (err) {
        console.error("Errore invio messaggio:", err);
        alert("❌ Errore invio messaggio.");
    }
});
