/**
 * firebase-sync.js — Maquiler
 * ─────────────────────────────────────────────────────────────
 * Agrega sincronización Firebase + Cloudinary al sistema existente
 * SIN modificar ningún otro archivo.
 *
 * Qué hace:
 *   1. Carga el estado desde Firestore al abrir el sitio (cualquier dispositivo)
 *   2. Guarda en Firestore cada vez que el admin hace un cambio
 *   3. Sube fotos a Cloudinary en vez de guardarlas como base64 en localStorage
 *
 * Configuración necesaria:
 *   A) FIREBASE_ADMIN_PASSWORD → creá un usuario en Firebase Console:
 *      Authentication → Users → Add user
 *      Usá el email que figura abajo y poné la contraseña que quieras
 *
 *   B) Reglas de Firestore → pegá esto en Firebase Console → Firestore → Rules:
 *      ─────────────────────────────────────────────────────────────
 *      rules_version = '2';
 *      service cloud.firestore {
 *        match /databases/{database}/documents {
 *          match /state/main {
 *            allow read: if true;
 *            allow write: if request.auth != null;
 *          }
 *        }
 *      }
 *      ─────────────────────────────────────────────────────────────
 */

(() => {
  // ══════════════════════════════════════════════════════════════
  // CONFIGURACIÓN — solo editá FIREBASE_ADMIN_PASSWORD
  // ══════════════════════════════════════════════════════════════
  const FIREBASE_CONFIG = {
    apiKey:            "AIzaSyCgkKYrnxCCyImkIc3lMin4acrLKzr4mlQ",
    authDomain:        "maquiler-b35dc.firebaseapp.com",
    projectId:         "maquiler-b35dc",
    storageBucket:     "maquiler-b35dc.firebasestorage.app",
    messagingSenderId: "506992586359",
    appId:             "1:506992586359:web:a395756d063cbf74042072",
  };

  // Email del usuario admin en Firebase Authentication
  const FIREBASE_ADMIN_EMAIL = "instrucciones@gmail.com";

  // Contraseña que creaste en Firebase Console → Authentication → Users
  // Dejá "PENDIENTE" si todavía no la creaste — el sistema sigue funcionando sin sincronización
  const FIREBASE_ADMIN_PASSWORD = "PENDIENTE";

  const CLOUDINARY_CLOUD  = "dxxyibglf";
  const CLOUDINARY_PRESET = "galeria_maquiler";
  // ══════════════════════════════════════════════════════════════

  const STORAGE_KEY = "maquiler-site-v2";
  const configured  = FIREBASE_ADMIN_PASSWORD !== "PENDIENTE";

  let db   = null;
  let auth = null;

  // ─── Carga dinámica de SDKs de Firebase ──────────────────────
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function loadFirebase() {
    const base = "https://www.gstatic.com/firebasejs/10.12.2";
    await loadScript(`${base}/firebase-app-compat.js`);
    await loadScript(`${base}/firebase-auth-compat.js`);
    await loadScript(`${base}/firebase-firestore-compat.js`);
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db   = firebase.firestore();
    auth = firebase.auth();
  }

  // ─── Autenticación Firebase ───────────────────────────────────
  async function signInFirebase() {
    if (!configured) return false;
    if (auth.currentUser) return true;
    try {
      await auth.signInWithEmailAndPassword(FIREBASE_ADMIN_EMAIL, FIREBASE_ADMIN_PASSWORD);
      return true;
    } catch (e) {
      console.warn("[firebase-sync] Auth fallida:", e.message);
      return false;
    }
  }

  // ─── Leer estado desde Firestore ─────────────────────────────
  async function loadFromFirestore() {
    try {
      const doc = await db.collection("state").doc("main").get();
      if (!doc.exists) return false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc.data()));
      console.log("[firebase-sync] Estado cargado desde Firestore ✓");
      return true;
    } catch (e) {
      console.warn("[firebase-sync] No se pudo leer de Firestore:", e.message);
      return false;
    }
  }

  // ─── Guardar estado en Firestore ─────────────────────────────
  async function saveToFirestore(state) {
    if (!auth?.currentUser) return;
    try {
      await db.collection("state").doc("main").set(state);
    } catch (e) {
      console.warn("[firebase-sync] No se pudo guardar:", e.message);
    }
  }

  // ─── Disparar re-render de la app ────────────────────────────
  function triggerRerender() {
    // app.js escucha el evento "storage" para re-renderizar
    window.dispatchEvent(new Event("storage"));
  }

  // ─── Parchear updateState para sincronizar ───────────────────
  function patchUpdateState() {
    const App = window.MaquilerApp;
    if (!App?.updateState || App._syncPatched) return;
    App._syncPatched = true;

    const original = App.updateState;
    App.updateState = function (mutator) {
      const result = original(mutator);
      saveToFirestore(result);
      return result;
    };
  }

  // ─── Parchear setAdminSession para auth Firebase en login ────
  function patchAdminLogin() {
    const App = window.MaquilerApp;
    if (!App?.setAdminSession || App._loginPatched) return;
    App._loginPatched = true;

    const original = App.setAdminSession;
    App.setAdminSession = async function (username) {
      original(username);
      const ok = await signInFirebase();
      if (ok) {
        patchUpdateState();
        const loaded = await loadFromFirestore();
        if (loaded) triggerRerender();
      }
    };
  }

  // ─── Parchear compressImageFile para usar Cloudinary ─────────
  function patchCompressImageFile() {
    const tryPatch = () => {
      const App = window.MaquilerApp;
      if (!App?.compressImageFile) { setTimeout(tryPatch, 80); return; }
      if (App._cloudinaryPatched) return;
      App._cloudinaryPatched = true;

      const original = App.compressImageFile;

      App.compressImageFile = async function (file) {
        try {
          const form = new FormData();
          form.append("file", file);
          form.append("upload_preset", CLOUDINARY_PRESET);
          form.append("folder", "maquiler/galeria");

          const res  = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
            { method: "POST", body: form }
          );
          const data = await res.json();
          if (data.error) throw new Error(data.error.message);

          console.log("[firebase-sync] Foto subida a Cloudinary ✓", data.secure_url);

          // Devuelve el mismo formato que el original, pero con URL de Cloudinary
          return {
            dataUrl: data.secure_url,
            width:   data.width,
            height:  data.height,
          };
        } catch (e) {
          console.warn("[firebase-sync] Cloudinary falló, usando base64:", e.message);
          return original(file);
        }
      };
    };

    tryPatch();
  }

  // ─── Inicialización principal ─────────────────────────────────
  async function main() {
    try {
      await loadFirebase();
    } catch (e) {
      console.warn("[firebase-sync] No se cargaron los SDKs de Firebase:", e.message);
      return;
    }

    const page = document.body?.dataset?.page || "";

    // Parchar foto upload en todas las páginas admin
    patchCompressImageFile();

    if (page === "public") {
      // Landing: cargar config actualizada desde Firestore (sin auth)
      const loaded = await loadFromFirestore();
      if (loaded) triggerRerender();
      return;
    }

    if (page === "admin-login") {
      // Parchar el login para que también haga auth Firebase
      patchAdminLogin();
      return;
    }

    if (page === "admin-section") {
      // Panel admin: autenticar y sincronizar
      const ok = await signInFirebase();
      if (ok) {
        patchUpdateState();
        const loaded = await loadFromFirestore();
        if (loaded) triggerRerender();
      } else if (!configured) {
        console.info("[firebase-sync] Sin contraseña Firebase configurada — modo solo localStorage");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => main().catch(console.error));
  } else {
    main().catch(console.error);
  }
})();
