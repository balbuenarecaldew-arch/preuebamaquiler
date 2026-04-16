/**
 * firebase-sync.js — Maquiler
 * Intercepta localStorage.setItem para capturar CUALQUIER cambio de estado
 * y sincronizarlo con Firestore + Cloudinary.
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

  const CLOUDINARY_CLOUD  = "dxxyibglf";
  const CLOUDINARY_PRESET = "galeria_maquiler";
  const STORAGE_KEY       = "maquiler-site-v2";

  let db = null;

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
    await loadScript(`${base}/firebase-firestore-compat.js`);
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
  }

  // ── Subir base64 a Cloudinary ─────────────────────────────
  async function uploadBase64(dataUrl) {
    const form = new FormData();
    form.append("file", dataUrl);
    form.append("upload_preset", CLOUDINARY_PRESET);
    form.append("folder", "maquiler/galeria");
    const res  = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  }

  // ── Convertir fotos base64 → URL de Cloudinary ────────────
  async function resolvePhotos(state) {
    const s = JSON.parse(JSON.stringify(state));
    let changed = false;
    for (const machine of (s.machines || [])) {
      for (const photo of (machine.photos || [])) {
        if (photo.imageUrl && photo.imageUrl.startsWith("data:")) {
          try {
            console.log("[sync] Convirtiendo foto a Cloudinary…");
            photo.imageUrl = await uploadBase64(photo.imageUrl);
            changed = true;
            console.log("[sync] Foto en Cloudinary ✓");
          } catch (e) {
            console.warn("[sync] Cloudinary falló:", e.message);
          }
        }
      }
    }
    if (changed) {
      // Actualizar localStorage con URLs limpias (sin base64)
      Storage.prototype._setItem.call(localStorage, STORAGE_KEY, JSON.stringify(s));
    }
    return s;
  }

  // ── Guardar en Firestore ──────────────────────────────────
  async function saveToFirestore(state) {
    if (!db) return;
    try {
      const clean = await resolvePhotos(state);
      await db.collection("state").doc("main").set(clean);
      console.log("[sync] Guardado en Firestore ✓");
    } catch (e) {
      console.warn("[sync] Escritura fallida:", e.message);
    }
  }

  // ── Leer desde Firestore ──────────────────────────────────
  async function loadFromFirestore() {
    try {
      const doc = await db.collection("state").doc("main").get();
      if (!doc.exists) return false;
      Storage.prototype._setItem.call(localStorage, STORAGE_KEY, JSON.stringify(doc.data()));
      console.log("[sync] Estado cargado desde Firestore ✓");
      return true;
    } catch (e) {
      console.warn("[sync] Lectura fallida:", e.message);
      return false;
    }
  }

  // ── CLAVE: interceptar localStorage.setItem ───────────────
  // Esto captura TODOS los cambios de estado sin importar qué función los hace
  function patchLocalStorage() {
    Storage.prototype._setItem = Storage.prototype.setItem;
    Storage.prototype.setItem  = function(key, value) {
      this._setItem(key, value);
      if (this === localStorage && key === STORAGE_KEY) {
        try {
          const state = JSON.parse(value);
          saveToFirestore(state);
        } catch (e) {}
      }
    };
    console.log("[sync] localStorage interceptado ✓");
  }

  function triggerRerender() {
    window.dispatchEvent(new Event("storage"));
  }

  async function main() {
    try { await loadFirebase(); }
    catch (e) { console.warn("[sync] Firebase no cargó:", e.message); return; }

    const page = document.body?.dataset?.page || "";

    if (page === "public") {
      const loaded = await loadFromFirestore();
      if (loaded) triggerRerender();
      return;
    }

    if (page === "admin-section") {
      patchLocalStorage();
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
