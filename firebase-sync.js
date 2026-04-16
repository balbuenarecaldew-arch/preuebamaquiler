/**
 * firebase-sync.js — Maquiler
 * NO guarda ninguna contraseña en el código.
 * Usa la contraseña que escribís en el formulario de login.
 *
 * Configuración necesaria (una sola vez en Firebase Console):
 *   1. Authentication → Sign-in method → Email/Password → Activar
 *   2. Authentication → Users → Add user
 *      Email: sewyllconstrucciones@gmail.com
 *      Contraseña: la misma que usás para entrar al admin
 *   3. Firestore → Rules:
 *      rules_version = '2';
 *      service cloud.firestore {
 *        match /databases/{database}/documents {
 *          match /state/main {
 *            allow read: if true;
 *            allow write: if request.auth != null;
 *          }
 *        }
 *      }
 */
(() => {
  const FIREBASE_CONFIG = {
    apiKey:            "AIzaSyCgkKYrnxCCyImkIc3lMin4acrLKzr4mlQ",
    authDomain:        "maquiler-b35dc.firebaseapp.com",
    projectId:         "maquiler-b35dc",
    storageBucket:     "maquiler-b35dc.firebasestorage.app",
    messagingSenderId: "506992586359",
    appId:             "1:506992586359:web:a395756d063cbf74042072",
  };

  // Email del admin en Firebase Auth — no es secreto
  // La CONTRASEÑA la escribe el usuario en el formulario, nunca se guarda aquí
  const FIREBASE_ADMIN_EMAIL = "sewyllconstrucciones@gmail.com";

  const CLOUDINARY_CLOUD  = "dxxyibglf";
  const CLOUDINARY_PRESET = "galeria_maquiler";

  const STORAGE_KEY  = "maquiler-site-v2";
  const SESSION_PASS = "_mq_fsp"; // sessionStorage — se borra al cerrar el tab

  let db = null, auth = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function loadFirebase() {
    const base = "https://www.gstatic.com/firebasejs/10.12.2";
    await loadScript(`${base}/firebase-app-compat.js`);
    await loadScript(`${base}/firebase-auth-compat.js`);
    await loadScript(`${base}/firebase-firestore-compat.js`);
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    auth = firebase.auth();
  }

  async function signInWithCapturedPassword() {
    if (auth.currentUser) return true;
    const pass = sessionStorage.getItem(SESSION_PASS);
    if (!pass) return false;
    sessionStorage.removeItem(SESSION_PASS);
    try {
      await auth.signInWithEmailAndPassword(FIREBASE_ADMIN_EMAIL, pass);
      console.log("[sync] Firebase Auth OK");
      return true;
    } catch (e) {
      console.info("[sync] Firebase Auth no disponible — modo localStorage");
      return false;
    }
  }

  async function loadFromFirestore() {
    try {
      const doc = await db.collection("state").doc("main").get();
      if (!doc.exists) return false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc.data()));
      console.log("[sync] Estado cargado desde Firestore");
      return true;
    } catch (e) {
      console.warn("[sync] Lectura fallida:", e.message);
      return false;
    }
  }

  async function saveToFirestore(state) {
    if (!auth?.currentUser) return;
    try { await db.collection("state").doc("main").set(state); }
    catch (e) { console.warn("[sync] Escritura fallida:", e.message); }
  }

  function triggerRerender() {
    window.dispatchEvent(new Event("storage"));
  }

  function patchUpdateState() {
    const App = window.MaquilerApp;
    if (!App?.updateState || App._syncPatched) return;
    App._syncPatched = true;
    const original = App.updateState;
    App.updateState = function(mutator) {
      const result = original(mutator);
      saveToFirestore(result);
      return result;
    };
  }

  function captureLoginPassword() {
    // Captura la contraseña ANTES que admin.js la procese (fase de captura)
    document.addEventListener("submit", (e) => {
      if (e.target.id !== "admin-login-form") return;
      const pass = e.target.querySelector('[name="password"]')?.value;
      if (pass) sessionStorage.setItem(SESSION_PASS, pass);
    }, true);
  }

  function patchCompressImageFile() {
    const tryPatch = () => {
      const App = window.MaquilerApp;
      if (!App?.compressImageFile) { setTimeout(tryPatch, 80); return; }
      if (App._cloudinaryPatched) return;
      App._cloudinaryPatched = true;
      const original = App.compressImageFile;
      App.compressImageFile = async function(file) {
        try {
          const form = new FormData();
          form.append("file", file);
          form.append("upload_preset", CLOUDINARY_PRESET);
          form.append("folder", "maquiler/galeria");
          const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: form });
          const data = await res.json();
          if (data.error) throw new Error(data.error.message);
          console.log("[sync] Foto subida a Cloudinary OK");
          return { dataUrl: data.secure_url, width: data.width, height: data.height };
        } catch (e) {
          console.warn("[sync] Cloudinary falló, usando base64:", e.message);
          return original(file);
        }
      };
    };
    tryPatch();
  }

  async function main() {
    try { await loadFirebase(); }
    catch (e) { console.warn("[sync] Firebase no cargó:", e.message); return; }

    const page = document.body?.dataset?.page || "";
    patchCompressImageFile();

    if (page === "public") {
      const loaded = await loadFromFirestore();
      if (loaded) triggerRerender();
      return;
    }

    if (page === "admin-login") {
      captureLoginPassword();
      return;
    }

    if (page === "admin-section") {
      const ok = await signInWithCapturedPassword();
      if (ok) patchUpdateState();
      const loaded = await loadFromFirestore();
      if (loaded) triggerRerender();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => main().catch(console.error));
  } else {
    main().catch(console.error);
  }
})();
