(() => {
  const App = (window.MaquilerApp = window.MaquilerApp || {});
  const {
    clearAdminSession,
    compressImageFile,
    getEmptyServiceMarkup,
    getEmptyTrustMarkup,
    getState,
    hashText,
    isLoggedIn,
    normalizePhotos,
    normalizeText,
    parseMoney,
    renderAdminLogin,
    renderAdminSection,
    setAdminSession,
    setFormFeedback,
    showToast,
    updateActiveMachine,
    updateState,
  } = App;

function initAdminLogin(app) {
  if (isLoggedIn()) {
    window.location.href = "./dashboard/";
    return;
  }

  const state = getState();
  app.innerHTML = renderAdminLogin(state);

  const form = document.getElementById("admin-login-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = form.querySelector("[data-form-feedback]");
    const formData = new FormData(form);
    const username = normalizeText(formData.get("username"));
    const password = normalizeText(formData.get("password"));

    if (!username || !password) {
      setFormFeedback(feedback, "Completá usuario y contraseña.", "error");
      return;
    }

    if (username !== state.admin.username || hashText(password) !== state.admin.passwordHash) {
      setFormFeedback(feedback, "Usuario o contraseña incorrectos.", "error");
      return;
    }

    setAdminSession(username);
    window.location.href = "./dashboard/";
  });
}

function initAdminSection(app, page, rerender) {
  if (!isLoggedIn()) {
    window.location.href = "../";
    return;
  }

  const state = getState();
  app.innerHTML = renderAdminSection(page, state);

  bindCommonAdminActions();
  switch (page) {
    case "photos":
      bindPhotosPage(rerender);
      break;
    case "pricing":
      bindPricingPage();
      break;
    case "texts":
      bindTextsPage();
      break;
    case "reservations":
      bindReservationsPage();
      break;
    case "settings":
      bindSettingsPage(rerender);
      break;
    default:
      break;
  }
}

function bindCommonAdminActions() {
  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      clearAdminSession();
      window.location.href = "../";
    });
  });
}

function bindPhotosPage(rerender) {
  const state = getState();
  const machine = state.machines.find((item) => item.id === state.activeMachineId) || state.machines[0];
  const uploadInput = document.getElementById("photo-upload-input");
  const statusElement = document.getElementById("photo-upload-status");

  if (uploadInput) {
    uploadInput.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
      if (!files.length) return;

      uploadInput.disabled = true;
      if (statusElement) statusElement.textContent = `Procesando ${files.length} foto(s)...`;

      try {
        const uploadedPhotos = [];
        for (const file of files) {
          const asset = await compressImageFile(file);
          uploadedPhotos.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            imageUrl: asset.dataUrl,
            width: asset.width,
            height: asset.height,
            isPrimary: false,
            isActive: true,
            sortOrder: machine.photos.length + uploadedPhotos.length + 1,
            createdAt: new Date().toISOString(),
          });
        }

        updateActiveMachine((draft) => {
          draft.photos = normalizePhotos([...(draft.photos || []), ...uploadedPhotos]);
        });

        showToast("Fotos cargadas correctamente.");
        rerender();
      } catch {
        showToast("No se pudieron guardar las fotos. Probá con menos imágenes o archivos más livianos.", "error");
      } finally {
        uploadInput.value = "";
        uploadInput.disabled = false;
        if (statusElement) statusElement.textContent = "";
      }
    });
  }

  document.querySelectorAll("[data-photo-order]").forEach((input) => {
    input.addEventListener("change", () => {
      updateActiveMachine((draft) => {
        const photo = draft.photos.find((item) => item.id === input.dataset.photoOrder);
        if (!photo) return;
        photo.sortOrder = Math.max(1, Number(input.value) || 1);
        draft.photos = normalizePhotos(draft.photos);
      });
      showToast("Orden actualizado.");
      rerender();
    });
  });

  document.querySelectorAll("[data-photo-up]").forEach((button) => {
    button.addEventListener("click", () => movePhoto(button.dataset.photoUp, -1, rerender));
  });
  document.querySelectorAll("[data-photo-down]").forEach((button) => {
    button.addEventListener("click", () => movePhoto(button.dataset.photoDown, 1, rerender));
  });
  document.querySelectorAll("[data-photo-primary]").forEach((button) => {
    button.addEventListener("click", () => {
      updateActiveMachine((draft) => {
        draft.photos = normalizePhotos(
          draft.photos.map((photo) => ({
            ...photo,
            isPrimary: photo.id === button.dataset.photoPrimary,
            isActive: photo.id === button.dataset.photoPrimary ? true : photo.isActive,
          }))
        );
      });
      showToast("Foto principal actualizada.");
      rerender();
    });
  });
  document.querySelectorAll("[data-photo-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      updateActiveMachine((draft) => {
        draft.photos = normalizePhotos(
          draft.photos.map((photo) => (photo.id === button.dataset.photoToggle ? { ...photo, isActive: !photo.isActive } : photo))
        );
      });
      showToast("Visibilidad de foto actualizada.");
      rerender();
    });
  });
  document.querySelectorAll("[data-photo-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      updateActiveMachine((draft) => {
        draft.photos = normalizePhotos(draft.photos.filter((photo) => photo.id !== button.dataset.photoDelete));
      });
      showToast("Foto eliminada.");
      rerender();
    });
  });
}

function movePhoto(photoId, direction, rerender) {
  updateActiveMachine((draft) => {
    const photos = [...draft.photos].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = photos.findIndex((photo) => photo.id === photoId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= photos.length) return;
    const swap = photos[targetIndex].sortOrder;
    photos[targetIndex].sortOrder = photos[index].sortOrder;
    photos[index].sortOrder = swap;
    draft.photos = normalizePhotos(photos);
  });
  rerender();
}

function bindPricingPage() {
  const form = document.getElementById("pricing-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = form.querySelector("[data-form-feedback]");
    const formData = new FormData(form);

    updateActiveMachine((draft) => {
      draft.pricing.hourlyPrice = parseMoney(formData.get("hourlyPrice"));
      draft.pricing.halfDayPrice = parseMoney(formData.get("halfDayPrice"));
      draft.pricing.fullDayPrice = parseMoney(formData.get("fullDayPrice"));
      draft.pricing.transportPrice = parseMoney(formData.get("transportPrice"));
      draft.pricing.fromPrice = parseMoney(formData.get("fromPrice"));
      draft.pricing.operatorIncluded = Boolean(formData.get("operatorIncluded"));
      draft.pricing.promoText = normalizeText(formData.get("promoText"));
    });

    setFormFeedback(feedback, "Precios guardados correctamente.", "success");
    showToast("Precios actualizados.");
  });
}

function bindTextsPage() {
  const form = document.getElementById("texts-form");
  const servicesEditor = document.getElementById("services-editor");
  const trustEditor = document.getElementById("trust-editor");
  if (!form || !servicesEditor || !trustEditor) return;

  const reindex = () => {
    servicesEditor.querySelectorAll(".repeater-card").forEach((card, index) => {
      const title = card.querySelector("[data-card-title]");
      if (title) title.textContent = `Servicio ${index + 1}`;
    });
    trustEditor.querySelectorAll(".repeater-card").forEach((card, index) => {
      const title = card.querySelector("[data-card-title]");
      if (title) title.textContent = `Texto ${index + 1}`;
    });
  };

  document.querySelector("[data-add-service]")?.addEventListener("click", () => {
    servicesEditor.insertAdjacentHTML("beforeend", getEmptyServiceMarkup(servicesEditor.children.length));
    reindex();
  });
  document.querySelector("[data-add-trust]")?.addEventListener("click", () => {
    trustEditor.insertAdjacentHTML("beforeend", getEmptyTrustMarkup(trustEditor.children.length));
    reindex();
  });

  form.addEventListener("click", (event) => {
    const removeService = event.target.closest("[data-remove-service]");
    if (removeService) {
      removeService.closest(".repeater-card")?.remove();
      reindex();
    }
    const removeTrust = event.target.closest("[data-remove-trust]");
    if (removeTrust) {
      removeTrust.closest(".repeater-card")?.remove();
      reindex();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = form.querySelector("[data-form-feedback]");
    const formData = new FormData(form);

    const services = Array.from(servicesEditor.querySelectorAll(".service-editor"))
      .map((card) => ({
        id: card.dataset.id || `service-${Date.now()}`,
        title: normalizeText(card.querySelector('[data-field="title"]')?.value),
        description: normalizeText(card.querySelector('[data-field="description"]')?.value),
        icon: normalizeText(card.querySelector('[data-field="icon"]')?.value) || "terrain",
      }))
      .filter((service) => service.title || service.description);

    const trustHighlights = Array.from(trustEditor.querySelectorAll(".trust-editor"))
      .map((card) => ({
        id: card.dataset.id || `trust-${Date.now()}`,
        title: normalizeText(card.querySelector('[data-field="title"]')?.value),
        description: normalizeText(card.querySelector('[data-field="description"]')?.value),
      }))
      .filter((item) => item.title || item.description);

    updateActiveMachine((draft) => {
      Object.keys(draft.texts).forEach((key) => {
        draft.texts[key] = normalizeText(formData.get(key));
      });
      draft.services = services;
      draft.trustHighlights = trustHighlights;
    });

    setFormFeedback(feedback, "Textos guardados correctamente.", "success");
    showToast("Contenido actualizado.");
  });
}

function bindReservationsPage() {
  document.querySelectorAll("[data-reservation-status]").forEach((select) => {
    select.addEventListener("change", () => {
      updateActiveMachine((draft) => {
        draft.reservations = draft.reservations.map((reservation) =>
          reservation.id === select.dataset.reservationStatus ? { ...reservation, status: select.value } : reservation
        );
      });
      showToast("Estado de reserva actualizado.");
    });
  });
}

function bindSettingsPage(rerender) {
  const form = document.getElementById("settings-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = form.querySelector("[data-form-feedback]");
    const formData = new FormData(form);
    const newPassword = normalizeText(formData.get("newPassword"));
    const confirmPassword = normalizeText(formData.get("confirmPassword"));

    if (newPassword && newPassword !== confirmPassword) {
      setFormFeedback(feedback, "La nueva contraseña y su confirmación no coinciden.", "error");
      return;
    }

    const nextUsername = normalizeText(formData.get("adminUsername")) || getState().admin.username;

    updateState((draft) => {
      const machine = draft.machines.find((item) => item.id === draft.activeMachineId) || draft.machines[0];
      machine.config.businessName = normalizeText(formData.get("businessName"));
      machine.config.machineName = normalizeText(formData.get("machineName"));
      machine.config.whatsappNumber = normalizeText(formData.get("whatsappNumber"));
      machine.config.whatsappMessageTemplate = normalizeText(formData.get("whatsappMessageTemplate"));
      machine.config.coverageArea = normalizeText(formData.get("coverageArea"));
      machine.config.availabilityStatus = normalizeText(formData.get("availabilityStatus")) || "available";
      machine.config.availabilityNote = normalizeText(formData.get("availabilityNote"));
      machine.config.showPrices = Boolean(formData.get("showPrices"));
      machine.config.showPromo = Boolean(formData.get("showPromo"));
      machine.config.siteUrl = normalizeText(formData.get("siteUrl"));
      machine.config.siteName = normalizeText(formData.get("siteName"));
      machine.config.seoTitle = normalizeText(formData.get("seoTitle"));
      machine.config.seoDescription = normalizeText(formData.get("seoDescription"));
      machine.config.socialTitle = normalizeText(formData.get("socialTitle"));
      machine.config.socialDescription = normalizeText(formData.get("socialDescription"));
      machine.config.socialImage = normalizeText(formData.get("socialImage"));
      machine.config.socialImageWidth = Number(normalizeText(formData.get("socialImageWidth"))) || 1080;
      machine.config.socialImageHeight = Number(normalizeText(formData.get("socialImageHeight"))) || 1085;
      draft.admin.username = nextUsername;
      if (newPassword) {
        draft.admin.passwordHash = hashText(newPassword);
      }
    });

    setAdminSession(nextUsername);
    setFormFeedback(feedback, "Configuración guardada correctamente.", "success");
    showToast("Configuración actualizada.");
    rerender();
  });
}
  Object.assign(App, {
    initAdminLogin,
    initAdminSection,
  });
})();
