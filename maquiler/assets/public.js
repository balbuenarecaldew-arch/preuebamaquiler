(() => {
  const App = (window.MaquilerApp = window.MaquilerApp || {});
  const {
    buildStructuredData,
    buildWhatsAppUrl,
    composeReservationMessage,
    escapeHtml,
    formatCurrency,
    formatDisplayPhone,
    getActiveMachine,
    getAvailabilityMeta,
    getSeoData,
    getState,
    getTodayIsoDate,
    getVisiblePhotos,
    iconMarkup,
    normalizeText,
    resolveMediaUrl,
    revealOnScroll,
    sectionHeaderMarkup,
    setFormFeedback,
    updateActiveMachine,
    validateReservation,
  } = App;

  function getPhotoDimensionAttrs(photo, fallbackWidth = 1200, fallbackHeight = 900) {
    const width = Number(photo?.width) > 0 ? Number(photo.width) : fallbackWidth;
    const height = Number(photo?.height) > 0 ? Number(photo.height) : fallbackHeight;
    return ` width="${width}" height="${height}"`;
  }

  function initPublicPage(app) {
    const state = getState();
    const machine = getActiveMachine(state);
    const { config, pricing, texts } = machine;
    const visiblePhotos = getVisiblePhotos(machine);
    const heroPhoto = visiblePhotos[0] || null;
    const availability = getAvailabilityMeta(config.availabilityStatus);
    const seo = getSeoData(machine);
    const heroAltText = heroPhoto?.altText || `${config.machineName} para alquiler`;
    const heroFromPrice = config.showPrices && Number(pricing.fromPrice) > 0 ? formatCurrency(pricing.fromPrice) : "Cotización rápida";
    const heroWhatsAppUrl = buildWhatsAppUrl(config.whatsappNumber, config.whatsappMessageTemplate);
    const quickHighlights = [
      { icon: "coverage", title: "Cobertura", text: config.coverageArea },
      { icon: "operator", title: "Operador", text: pricing.operatorIncluded ? "Incluido en la tarifa" : "Se coordina según el trabajo" },
      { icon: "whatsapp", title: "Reserva", text: "Confirmación directa por WhatsApp" },
    ];

    app.innerHTML = `
      <div class="site-shell">
        <header class="site-header" id="top">
          <div class="topbar">
            <div class="container topbar-inner">
              <span class="status-pill status-pill--${availability.tone}">${escapeHtml(availability.label)}</span>
              <span class="topbar-text">${escapeHtml(config.coverageArea)}</span>
            </div>
          </div>
          <nav class="site-nav container" aria-label="Navegacion principal">
            <a class="brand" href="#top">
              <span class="brand-mark">${iconMarkup("star")}</span>
              <span class="brand-copy">
                <strong>${escapeHtml(config.businessName)}</strong>
                <span>${escapeHtml(config.machineName)}</span>
              </span>
            </a>
            <div class="site-nav-links">
              <a href="#galeria">Galería</a>
              <a href="#precios">Precios</a>
              <a href="#servicios">Servicios</a>
              <a href="#reservar">Reservar</a>
            </div>
            <a class="button button-primary button-nav" href="${escapeHtml(heroWhatsAppUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.reserveButtonText)}</a>
          </nav>
          <section class="hero-section container" aria-labelledby="hero-title">
            <div class="hero-copy" data-reveal>
              <span class="section-eyebrow">${escapeHtml(texts.heroBadge)}</span>
              <h1 class="hero-title" id="hero-title">${escapeHtml(texts.heroTitle)}</h1>
              <p class="hero-subtitle">${escapeHtml(texts.heroSubtitle)}</p>
              <p class="hero-description">${escapeHtml(texts.commercialDescription)}</p>
              <div class="hero-facts">
                <article class="hero-fact-card"><span class="hero-fact-label">Desde</span><strong>${escapeHtml(heroFromPrice)}</strong></article>
                <article class="hero-fact-card"><span class="hero-fact-label">Operador</span><strong>${pricing.operatorIncluded ? "Incluido" : "A convenir"}</strong></article>
                <article class="hero-fact-card"><span class="hero-fact-label">Agenda</span><strong>${escapeHtml(availability.shortLabel)}</strong></article>
              </div>
              <div class="hero-actions">
                <a class="button button-primary" href="${escapeHtml(heroWhatsAppUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.reserveButtonText)}</a>
                <a class="button button-secondary" href="#precios">${escapeHtml(texts.priceButtonText)}</a>
              </div>
            </div>
            <div class="hero-visual" data-reveal>
              <div class="hero-frame">
                ${
                  heroPhoto
                    ? `<img class="hero-main-image" data-hero-image src="${escapeHtml(resolveMediaUrl(heroPhoto.imageUrl))}" alt="${escapeHtml(heroAltText)}"${getPhotoDimensionAttrs(heroPhoto, 1080, 1085)} fetchpriority="high" decoding="async" />`
                    : `<div class="media-placeholder hero-placeholder"><div class="media-placeholder-icon">${iconMarkup("photo")}</div><strong>Fotos en actualización</strong><p>${escapeHtml(texts.galleryIntro)}</p></div>`
                }
                <div class="hero-overlay-card">
                  <span class="status-pill status-pill--${availability.tone}">${escapeHtml(availability.label)}</span>
                  <strong>${escapeHtml(config.machineName)}</strong>
                  <p>${escapeHtml(config.availabilityNote || availability.detail)}</p>
                </div>
              </div>
              <div class="hero-thumbs" aria-label="Vistas de la mini cargadora">
                ${
                  visiblePhotos.length
                    ? visiblePhotos
                        .slice(0, 5)
                        .map(
                          (photo, index) => `
                            <button type="button" class="hero-thumb ${index === 0 ? "is-active" : ""}" data-thumb data-photo-url="${escapeHtml(resolveMediaUrl(photo.imageUrl))}" data-photo-alt="${escapeHtml(photo.altText || config.machineName)}" aria-label="${escapeHtml(photo.caption || `Ver foto ${index + 1}`)}">
                              <img src="${escapeHtml(resolveMediaUrl(photo.imageUrl))}" alt="${escapeHtml(photo.altText || config.machineName)}"${getPhotoDimensionAttrs(photo, 360, 360)} loading="${index === 0 ? "eager" : "lazy"}" decoding="async" />
                            </button>
                          `
                        )
                        .join("")
                    : `<div class="hero-thumb hero-thumb--empty">Sin fotos activas</div>`
                }
              </div>
            </div>
          </section>
        </header>

        <main id="contenido">
          <section class="trust-strip" aria-label="Puntos clave del servicio">
            <div class="container trust-strip-grid">
              ${quickHighlights
                .map(
                  (item) => `
                    <article class="mini-feature-card" data-reveal>
                      <span class="mini-feature-icon">${iconMarkup(item.icon)}</span>
                      <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>
          <section class="section" id="galeria" aria-labelledby="galeria-title"><div class="container">${sectionHeaderMarkup(texts.galleryLabel, texts.galleryTitle, texts.galleryIntro, false, "galeria-title")}${renderGallery(machine, heroPhoto)}</div></section>
          <section class="section section-dark" id="precios" aria-labelledby="precios-title"><div class="container">${sectionHeaderMarkup(texts.priceLabel, texts.priceTitle, texts.priceIntro, false, "precios-title")}${renderPricing(machine)}</div></section>
          <section class="section" id="servicios" aria-labelledby="servicios-title"><div class="container">${sectionHeaderMarkup(texts.servicesLabel, texts.servicesTitle, texts.servicesIntro, false, "servicios-title")}${renderServices(machine)}</div></section>

          <section class="section section-contrast" id="reservar" aria-labelledby="reservar-title">
            <div class="container booking-layout">
              <div class="booking-copy" data-reveal>
                ${sectionHeaderMarkup(texts.bookingLabel, texts.bookingTitle, texts.bookingIntro, true, "reservar-title")}
                <div class="booking-info-stack">
                  <article class="support-card"><span class="support-card-icon">${iconMarkup("whatsapp")}</span><div><strong>${escapeHtml(texts.contactCardTitle)}</strong><p>${escapeHtml(texts.contactCardText)}</p></div></article>
                  <article class="support-card"><span class="support-card-icon">${iconMarkup("coverage")}</span><div><strong>Zona de cobertura</strong><p>${escapeHtml(config.coverageArea)}</p></div></article>
                  <article class="support-card"><span class="support-card-icon">${iconMarkup("speed")}</span><div><strong>${escapeHtml(availability.label)}</strong><p>${escapeHtml(config.availabilityNote || availability.detail)}</p></div></article>
                </div>
              </div>
              <form class="booking-form" id="booking-form" data-reveal>
                <div class="form-grid form-grid-two">
                  <label class="field"><span>Nombre</span><input type="text" name="customerName" placeholder="Tu nombre" autocomplete="name" required /></label>
                  <label class="field"><span>Teléfono</span><input type="tel" name="phone" placeholder="+595 9XX XXX XXX" autocomplete="tel" inputmode="tel" required /></label>
                </div>
                <div class="form-grid"><label class="field"><span>Ubicación</span><input type="text" name="location" placeholder="Barrio, ciudad o referencia" autocomplete="street-address" required /></label></div>
                <div class="form-grid form-grid-two">
                  <label class="field"><span>Fecha deseada</span><input type="date" name="desiredDate" required /></label>
                  <label class="field"><span>Horas estimadas</span><input type="number" name="estimatedHours" min="1" step="1" placeholder="Ej. 4" inputmode="numeric" required /></label>
                </div>
                <div class="form-grid">
                  <label class="field">
                    <span>Tipo de trabajo</span>
                    <select name="jobType" required>
                      <option value="">Seleccioná el trabajo</option>
                      ${machine.services.map((service) => `<option value="${escapeHtml(service.title)}">${escapeHtml(service.title)}</option>`).join("")}
                      <option value="Otro">Otro</option>
                    </select>
                  </label>
                </div>
                <div class="form-grid"><label class="field"><span>Mensaje adicional</span><textarea name="message" rows="4" placeholder="Contanos si hay acceso complicado, retiro de escombros, tipo de material o algo importante para cotizar."></textarea></label></div>
                <button class="button button-primary button-block" type="submit">${escapeHtml(texts.reserveButtonText)}</button>
                <p class="form-helper">Al enviar guardamos la reserva en el panel admin y abrimos WhatsApp con el mensaje ya armado.</p>
                <div class="form-feedback" data-form-feedback aria-live="polite"></div>
              </form>
            </div>
          </section>

          <section class="section" id="confianza" aria-labelledby="confianza-title"><div class="container">${sectionHeaderMarkup(texts.trustLabel, texts.trustTitle, texts.trustIntro, false, "confianza-title")}<div class="trust-grid">${renderTrust(machine)}</div></div></section>
          <section class="section section-dark" aria-labelledby="cta-title"><div class="container"><div class="cta-banner" data-reveal><div><span class="section-eyebrow">Reserva directa</span><h2 id="cta-title">${escapeHtml(texts.ctaBannerTitle)}</h2><p>${escapeHtml(texts.ctaBannerText)}</p></div><div class="cta-banner-actions"><a class="button button-primary" href="${escapeHtml(heroWhatsAppUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(texts.reserveButtonText)}</a><a class="button button-secondary" href="#reservar">Completar formulario</a></div></div></div></section>
        </main>

        <footer class="site-footer">
          <div class="container footer-grid">
            <div><strong>${escapeHtml(config.businessName)}</strong><p>${escapeHtml(texts.footerMessage)}</p></div>
            <div><span class="footer-label">WhatsApp</span><a href="${escapeHtml(heroWhatsAppUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(formatDisplayPhone(config.whatsappNumber))}</a></div>
            <div><span class="footer-label">Zona</span><p>${escapeHtml(config.coverageArea)}</p></div>
            <div><span class="footer-label">Mensaje</span><p>${escapeHtml(texts.footerLegal)}</p><a class="footer-admin-link" href="admin/">Acceso admin</a></div>
          </div>
        </footer>
        <a class="floating-whatsapp" href="${escapeHtml(heroWhatsAppUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp">${iconMarkup("whatsapp")}</a>
      </div>
    `;

    bindPublicEvents(machine);
    applySeoMetadata(machine, seo);
    revealOnScroll();
  }

  function renderGallery(machine, heroPhoto) {
    const photos = getVisiblePhotos(machine);
    if (!photos.length) {
      return `<div class="empty-state" data-reveal><div class="empty-state-icon">${iconMarkup("photo")}</div><h3>Galería en preparación</h3><p>Subí fotos desde el panel admin para mostrar la máquina con una presentación más visual.</p></div>`;
    }
    return `
      <div class="gallery-layout">
        <article class="gallery-spotlight" data-reveal>
          <img src="${escapeHtml(resolveMediaUrl(heroPhoto.imageUrl))}" alt="${escapeHtml(heroPhoto.altText || machine.config.machineName)}"${getPhotoDimensionAttrs(heroPhoto, 1080, 1085)} loading="lazy" decoding="async" />
          <div class="gallery-spotlight-copy"><span>Foto principal</span><strong>${escapeHtml(machine.config.machineName)}</strong><p>${escapeHtml(heroPhoto.caption || machine.config.coverageArea)}</p></div>
        </article>
        <div class="gallery-grid">
          ${photos
            .slice(1)
            .map(
              (photo, index) => `
                <button type="button" class="gallery-card" data-thumb data-photo-url="${escapeHtml(resolveMediaUrl(photo.imageUrl))}" data-photo-alt="${escapeHtml(photo.altText || machine.config.machineName)}" aria-label="${escapeHtml(photo.caption || `Ver foto ${index + 2}`)}">
                  <img src="${escapeHtml(resolveMediaUrl(photo.imageUrl))}" alt="${escapeHtml(photo.altText || machine.config.machineName)}"${getPhotoDimensionAttrs(photo, 480, 480)} loading="lazy" decoding="async" />
                  <span>${escapeHtml(photo.caption || `Vista ${index + 2}`)}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderPricing(machine) {
    const { config, pricing, texts } = machine;
    const hasPrice = config.showPrices && [pricing.hourlyPrice, pricing.halfDayPrice, pricing.fullDayPrice, pricing.transportPrice, pricing.fromPrice].some((value) => Number(value) > 0);
    if (!hasPrice) {
      return `<div class="empty-state" data-reveal><div class="empty-state-icon">${iconMarkup("pricing")}</div><h3>Precio a medida</h3><p>${escapeHtml(texts.emptyPricesMessage)}</p></div>`;
    }
    const cards = [
      { label: "Precio por hora", value: pricing.hourlyPrice, note: "Ideal para trabajos puntuales o apoyo en obra." },
      { label: "Media jornada", value: pricing.halfDayPrice, note: "Pensado para turnos de 4 horas efectivas." },
      { label: "Jornada completa", value: pricing.fullDayPrice, note: "La opción más conveniente para jornadas largas.", featured: true },
      { label: "Traslado", value: pricing.transportPrice, note: "Se ajusta según la zona y el acceso a la obra." },
    ];
    return `
      <div class="price-grid">
        ${cards
          .map(
            (card) => `
              <article class="price-card ${card.featured ? "price-card--featured" : ""}" data-reveal>
                <span class="price-card-label">${escapeHtml(card.label)}</span>
                <strong class="price-card-value">${escapeHtml(formatCurrency(card.value))}</strong>
                <p class="price-card-note">${escapeHtml(card.note)}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="price-support-grid">
        <article class="support-card" data-reveal><span class="support-card-icon">${iconMarkup("operator")}</span><div><strong>Operador ${pricing.operatorIncluded ? "incluido" : "a coordinar"}</strong><p>${pricing.operatorIncluded ? "La tarifa ya contempla el operador de la máquina." : "Podés indicar en admin si el operador está incluido o no."}</p></div></article>
        ${
          config.showPromo && pricing.promoText
            ? `<article class="support-card support-card--accent" data-reveal><span class="support-card-icon">${iconMarkup("star")}</span><div><strong>Promo activa</strong><p>${escapeHtml(pricing.promoText)}</p></div></article>`
            : ""
        }
      </div>
    `;
  }

  function renderServices(machine) {
    if (!machine.services.length) {
      return `<div class="empty-state" data-reveal><div class="empty-state-icon">${iconMarkup("text")}</div><h3>Servicios en actualización</h3><p>Podés cargar o editar los textos de servicios desde el panel administrativo.</p></div>`;
    }
    return `<div class="service-grid">${machine.services
      .map(
        (service) => `
          <article class="service-card" data-reveal>
            <span class="service-icon">${iconMarkup(service.icon)}</span>
            <h3>${escapeHtml(service.title)}</h3>
            <p>${escapeHtml(service.description)}</p>
          </article>
        `
      )
      .join("")}</div>`;
  }

  function renderTrust(machine) {
    const availability = getAvailabilityMeta(machine.config.availabilityStatus);
    const iconCycle = ["coverage", "whatsapp", "shield", "photo"];
    const items = machine.trustHighlights.length
      ? machine.trustHighlights
      : [{ id: "fallback", title: "Información actualizada", description: "Configurá los mensajes desde el panel para reforzar la confianza del cliente." }];
    return [
      ...items.map(
        (item, index) => `
          <article class="trust-card" data-reveal>
            <span class="trust-card-icon">${iconMarkup(iconCycle[index % iconCycle.length])}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `
      ),
      `<article class="trust-card trust-card--availability" data-reveal><span class="trust-card-icon">${iconMarkup("speed")}</span><h3>${escapeHtml(availability.label)}</h3><p>${escapeHtml(machine.config.availabilityNote || availability.detail)}</p></article>`,
    ].join("");
  }

  function bindPublicEvents(machine) {
    const heroImage = document.querySelector("[data-hero-image]");
    document.querySelectorAll("[data-thumb]").forEach((button) => {
      button.addEventListener("click", () => {
        if (heroImage && button.dataset.photoUrl) {
          heroImage.src = button.dataset.photoUrl;
          heroImage.alt = button.dataset.photoAlt || machine.config.machineName;
        }
        document.querySelectorAll("[data-thumb]").forEach((thumb) => thumb.classList.remove("is-active"));
        button.classList.add("is-active");
      });
    });

    const form = document.getElementById("booking-form");
    if (!form) return;
    const dateInput = form.querySelector('[name="desiredDate"]');
    if (dateInput) dateInput.min = getTodayIsoDate();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector("[data-form-feedback]");
      const formData = new FormData(form);
      const payload = {
        id: `reservation-${Date.now()}`,
        customerName: normalizeText(formData.get("customerName")),
        phone: normalizeText(formData.get("phone")),
        location: normalizeText(formData.get("location")),
        desiredDate: normalizeText(formData.get("desiredDate")),
        jobType: normalizeText(formData.get("jobType")),
        estimatedHours: normalizeText(formData.get("estimatedHours")),
        message: normalizeText(formData.get("message")),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const errors = validateReservation(payload);
      if (errors.length) {
        setFormFeedback(feedback, errors[0], "error");
        return;
      }

      try {
        updateActiveMachine((draft) => {
          draft.reservations.unshift(payload);
        });
      } catch {
        setFormFeedback(feedback, "No se pudo guardar la reserva en este navegador.", "error");
        return;
      }

      const message = composeReservationMessage(machine.config, payload);
      const url = buildWhatsAppUrl(machine.config.whatsappNumber, message);
      setFormFeedback(feedback, machine.texts.reserveSuccessMessage, "success");
      form.reset();
      if (dateInput) dateInput.min = getTodayIsoDate();
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  function applySeoMetadata(machine, seo) {
    document.title = seo.title;
    updateMetaTag("meta-description", "content", seo.description);
    updateMetaTag("canonical-link", "href", seo.pageUrl);
    updateMetaTag("og-url", "content", seo.pageUrl);
    updateMetaTag("og-title", "content", seo.socialTitle);
    updateMetaTag("og-description", "content", seo.socialDescription);
    updateMetaTag("og-image", "content", seo.socialImage);
    updateMetaTag("og-image-type", "content", seo.socialImageType);
    updateMetaTag("og-image-width", "content", seo.socialImageWidth);
    updateMetaTag("og-image-height", "content", seo.socialImageHeight);
    updateMetaTag("og-site-name", "content", seo.siteName);
    updateMetaTag("og-image-alt", "content", seo.socialImageAlt);
    updateMetaTag("alternate-link", "href", seo.pageUrl);
    updateMetaTag("twitter-title", "content", seo.socialTitle);
    updateMetaTag("twitter-description", "content", seo.socialDescription);
    updateMetaTag("twitter-image", "content", seo.socialImage);
    updateMetaTag("twitter-image-alt", "content", seo.socialImageAlt);

    const schemaNode = document.getElementById("structured-data");
    if (schemaNode) {
      schemaNode.textContent = JSON.stringify(buildStructuredData(machine));
    }
  }

  function updateMetaTag(id, attribute, value) {
    const node = document.getElementById(id);
    if (node && value) {
      node.setAttribute(attribute, value);
    }
  }

  App.initPublicPage = initPublicPage;
})();
