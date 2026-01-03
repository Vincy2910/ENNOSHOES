from flask import Flask, request, redirect, session, render_template, jsonify
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, ServerSelectionTimeoutError
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersegreto")

# -------------------------------
# Connessione MongoDB
# -------------------------------
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DB = os.getenv("MONGODB_DB", "ennoshoes_db")
SECRET_CODE = os.getenv("SECRET_CODE", "12345")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)

try:
    client.admin.command("ping")
    print("✅ Connesso a MongoDB!")
except ServerSelectionTimeoutError as e:
    print("❌ MongoDB NON raggiungibile:", e)
    raise

db = client[MONGODB_DB]
users = db["utenti"]
accessi = db["accessi"]
acquisti = db["acquisti"]
contatti = db["contatti"]

# Assicuro indice unico su email
try:
    users.create_index("email", unique=True)
except Exception:
    pass

# -------------------------------
# Pagine HTML (template)
# -------------------------------
@app.route('/')
def home_page():
    return render_template("Home.html")  # Deve essere in templates/

@app.route('/login_page')
def login_page():
    return render_template("Login.html")  # Deve essere in templates/

@app.route('/register_page')
def register_page():
    return render_template("Registrazione.html")  # Deve essere in templates/

@app.route('/dashboard_page')
def dashboard_page():
    if "email" in session:
        return render_template("Dashboard.html")
    return redirect("/login_page")

@app.route("/p/<path:filename>")
def serve_page(filename):
    # Per eventuali pagine extra dentro templates/
    return render_template(filename)

# -------------------------------
# Registrazione
# -------------------------------
@app.route("/register", methods=["POST"])
def register():
    nome = (request.form.get("nome") or "").strip()
    cognome = (request.form.get("cognome") or "").strip()
    email = (request.form.get("email") or "").strip().lower()
    password = request.form.get("password") or ""
    confirm_password = request.form.get("confirm_password") or ""
    role = (request.form.get("role") or "").strip()
    secret_code = (request.form.get("secret_code") or "").strip()

    if not all([nome, cognome, email, password, confirm_password, role]):
        return "❌ Tutti i campi sono obbligatori!", 400
    if password != confirm_password:
        return "❌ Le password non coincidono!", 400
    if role in ["lavoratore", "admin"] and secret_code != SECRET_CODE:
        return "❌ Codice segreto non valido per questo ruolo!", 403

    hashed_password = generate_password_hash(password)
    now = datetime.utcnow()

    try:
        users.insert_one({
            "nome": nome,
            "cognome": cognome,
            "email": email,
            "password": hashed_password,
            "role": role,
            "created_at": now,
            "is_online": False
        })
        print(f"✅ Utente registrato: {email}")
    except DuplicateKeyError:
        return "❌ Utente già registrato!", 409

    return redirect("/login_page")

# -------------------------------
# Login
# -------------------------------
@app.route("/login", methods=["POST"])
def login():
    email = (request.form.get("email") or "").strip().lower()
    password = (request.form.get("password") or "")
    role = (request.form.get("role") or "").strip()

    if not all([email, password, role]):
        return "❌ Tutti i campi sono obbligatori!", 400

    user = users.find_one({"email": email, "role": role})
    if user and check_password_hash(user["password"], password):
        session["email"] = email
        session["nome"] = user.get("nome", "")
        session["cognome"] = user.get("cognome", "")
        session["role"] = user.get("role", "")

        now = datetime.utcnow()
        accessi.insert_one({"email": email, "azione": "login", "ruolo": role, "timestamp": now})
        users.update_one({"_id": user["_id"]}, {"$set": {"last_login": now, "is_online": True}})

        print(f"✅ Login effettuato: {email}")
        return redirect("/dashboard_page")

    accessi.insert_one({"email": email, "azione": "login_failed", "ruolo": role, "timestamp": datetime.utcnow()})
    print(f"❌ Login fallito: {email}")
    return "❌ Email, password o ruolo non validi!", 401

# -------------------------------
# Logout
# -------------------------------
@app.route("/logout")
def logout():
    if "email" in session:
        email = session["email"]
        now = datetime.utcnow()
        accessi.insert_one({"email": email, "azione": "logout", "timestamp": now})
        users.update_one({"email": email}, {"$set": {"last_logout": now, "is_online": False}})
        print(f"✅ Logout: {email}")
    session.clear()
    return redirect("/")

# -------------------------------
# Acquisti (POST)
# -------------------------------
# -------------------------------
# Acquisti (POST) aggiornato
# -------------------------------
@app.route("/acquista", methods=["POST"])
def acquista():
    # Controllo se l'utente è loggato
    if "email" not in session:
        return jsonify({"error": "Non sei loggato"}), 403

    # Parsing JSON dal front-end
    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({"error": f"Errore parsing JSON: {e}"}), 400

    cart_items = data.get("cart")
    if not cart_items or not isinstance(cart_items, list):
        return jsonify({"error": "Carrello vuoto o dati non validi"}), 400

    now = datetime.utcnow()
    inserted = 0
    errors = []

    for idx, item in enumerate(cart_items):
        try:
            # Prendo i campi dal prodotto
            nome = item.get("nome")
            desc = item.get("desc", "")
            taglia = item.get("size", "")
            quantita = int(item.get("quantity", 1))
            prezzo_unitario = float(item.get("prezzo", 0))
            totale = round(prezzo_unitario * quantita, 2)

            # Validazione minima
            if not nome or prezzo_unitario <= 0 or quantita <= 0:
                errors.append(f"Prodotto {idx+1} ignorato: dati mancanti o non validi")
                continue

            # Inserimento in MongoDB
            acquisti.insert_one({
                "email": session["email"],
                "nome_prodotto": nome,
                "descrizione": desc,
                "taglia": taglia,
                "quantita": quantita,
                "prezzo_unitario": prezzo_unitario,
                "totale": totale,
                "timestamp": now
            })
            inserted += 1

        except Exception as e:
            errors.append(f"Errore prodotto {idx+1}: {e}")

    if inserted == 0:
        return jsonify({"error": "Nessun acquisto salvato", "details": errors}), 500

    print(f"✅ {inserted} acquisti salvati per {session['email']}")
    if errors:
        print("⚠️ Alcuni prodotti non sono stati salvati:", errors)

    return jsonify({
        "success": True,
        "message": f"{inserted} acquisti registrati!",
        "errors": errors
    })



# -------------------------------
# Contattaci (POST)
# -------------------------------
@app.route("/contattaci", methods=["POST"])
def contattaci():
    if "email" not in session:
        return jsonify({"error": "Devi essere loggato per inviare un messaggio"}), 403

    nome = (request.form.get("nome") or "").strip()
    email = (request.form.get("email") or "").strip().lower()
    telefono = (request.form.get("telefono") or "").strip()
    messaggio = (request.form.get("messaggio") or "").strip()

    if not all([nome, email, telefono, messaggio]):
        return jsonify({"error": "Tutti i campi sono obbligatori"}), 400

    now = datetime.utcnow()

    try:
        contatti.insert_one({
            "email_utente": session["email"],
            "nome": nome,
            "email_contatto": email,
            "telefono": telefono,
            "messaggio": messaggio,
            "timestamp": now
        })
        print(f"✅ Messaggio Contattaci salvato da {session['email']}")
        return jsonify({"success": True, "message": "Messaggio inviato con successo!"})
    except Exception as e:
        print(f"❌ Errore salvataggio Contattaci: {e}")
        return jsonify({"error": "Errore durante il salvataggio del messaggio"}), 500

# -------------------------------
# Avvio Flask
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
