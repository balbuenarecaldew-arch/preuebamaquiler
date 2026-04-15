(() => {
  const App = (window.MaquilerApp = window.MaquilerApp || {});
  const {
    DEFAULT_PASSWORD,
    RESERVATION_STATUSES,
    adminTextField,
    buildWhatsAppUrl,
    composeReservationMessage,
    createEmptyService,
    createEmptyTrust,
    escapeHtml,
    formatCurrency,
    formatDate,
    formatDateTime,
    formatDisplayPhone,
    getActiveMachine,
    getAvailabilityMeta,
    getSortedPhotos,
    getStatusLabel,
    hashText,
    iconMarkup,
    renderAdminEmptyState,
    resolveMediaUrl,
  } = App;

function renderAdminLogin(state) {
  const machine = getActiveMachine(state);
  const currentUsesDefault = state.admin.passwordHash === hashText(DEFAULT_PASSWORD);

  return `
    <div class="admin-login-shell">
      <div class="admin-login-visual">
        <img src="${escapeHtml(resolveMediaUrl("preview.jpg"))}" alt="${escapeHtml(machine.config.machineName)}" />
        <div class="admin-login-overlay">
          <span class="section-eyebrow">Panel privado</span>
          <h1>Administrá la landing y las reservas</h1>
          <p>Desde aquí podés cargar fotos, cambiar precios, editar textos visibles y actualizar la disponibilidad sin tocar el código.</p>
          <div class="login-feature-list">
            <span>${iconMarkup("photo")} Gestión de fotos</span>
            <span>${iconMarkup("pricing")} Cambio de precios</span>
            <span>${iconMarkup("booking")} Reservas guardadas</span>
          </div>
        </div>
      </div>
      <div class="admin-login-panel">
        <form class="admin-auth-card" id="admin-login-form">
          <span class="section-eyebrow">Acceso administrador</span>
          <h2>Iniciar sesión</h2>
          <p>Usá este acceso para gestionar el contenido comercial de la web.</p>
          <label class="field">
            <span>Usuario</span>
            <input type="text" name="username" value="${escapeHtml(state.admin.username)}" required />
          </label>
          <label class="field">
            <span>Contraseña</span>
            <input type="password" name="password" placeholder="Ingresá tu contraseña" required />
          </label>
          <button class="button button-primary button-block" type="submit">Entrar al panel</button>
          <div class="form-feedback" data-form-feedback></div>
          <div class="admin-login-note">
            <strong>Usuario actual:</strong> ${escapeHtml(state.admin.username)}
            <br />
            <strong>${currentUsesDefault ? "Clave inicial:" : "Clave:"}</strong> ${currentUsesDefault ? "admin123" : "la configurada desde el panel"}
          </div>
          <a class="back-link" href="../">Volver a la web pública</a>
        </form>
      </div>
    </div>
  `;
}

function renderAdminSection(page, state) {
  const machine = getActiveMachine(state);
  const meta = getPageMeta(page, machine);
  const content = renderPageContent(page, state, machine);
  const availability = getAvailabilityMeta(machine.config.availabilityStatus);

  return `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <a class="admin-brand" href="../dashboard/">
          <span class="brand-mark">${iconMarkup("star")}</span>
          <span class="brand-copy">
            <strong>${escapeHtml(machine.config.businessName)}</strong>
            <span>Panel admin</span>
          </span>
        </a>
        <p class="admin-sidebar-copy">Controlá la experiencia pública, la disponibilidad y las reservas desde un solo lugar.</p>
        <nav class="admin-nav">
          ${renderAdminNav(page, machine)}
        </nav>
        <div class="admin-sidebar-footer">
          <span class="status-pill status-pill--${availability.tone}">${escapeHtml(availability.label)}</span>
          <a class="button button-secondary button-block" href="../../" target="_blank" rel="noopener noreferrer">Ver sitio público</a>
        </div>
      </aside>
      <div class="admin-main">
        <header class="admin-topbar">
          <div>
            <span class="section-eyebrow">Panel administrativo</span>
            <h1>${escapeHtml(meta.title)}</h1>
            <p>${escapeHtml(meta.description)}</p>
          </div>
          <div class="admin-topbar-actions">
            <a class="button button-secondary" href="../../" target="_blank" rel="noopener noreferrer">Abrir sitio</a>
            <button class="button button-primary" type="button" data-logout>Salir</button>
          </div>
        </header>
        <main class="admin-content">
          ${content}
        </main>
      </div>
    </div>
  `;
}

function getPageMeta(page, machine) {
  const metas = {
    dashboard: {
      title: "Dashboard",
      description: `Resumen rápido de ${machine.config.machineName}, disponibilidad actual y accesos directos para administrar la web.`,
    },
    photos: {
      title: "Gestión de fotos",
      description: "Subí imágenes, elegí la portada, activá o desactivá fotos y ordená cómo se muestran en la landing.",
    },
    pricing: {
      title: "Gestión de precios",
      description: "Actualizá los precios visibles, el valor desde, el traslado y la promo activa sin tocar el código.",
    },
    texts: {
      title: "Gestión de textos",
      description: "Editá títulos, subtítulos, descripciones, servicios y mensajes de confianza que aparecen en la vista cliente.",
    },
    reservations: {
      title: "Reservas",
      description: "Revisá todas las reservas guardadas desde la landing y cambiá el estado de cada una fácilmente.",
    },
    settings: {
      title: "Configuración general",
      description: "Configurá WhatsApp, disponibilidad, zonas de cobertura, visibilidad de precios y acceso administrativo.",
    },
  };
  return metas[page] || metas.dashboard;
}

function renderAdminNav(page, machine) {
  const pendingCount = machine.reservations.filter((reservation) => reservation.status === "pending").length;
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "../dashboard/" },
    { key: "photos", label: "Fotos", icon: "photo", href: "../fotos/" },
    { key: "pricing", label: "Precios", icon: "pricing", href: "../precios/" },
    { key: "texts", label: "Textos", icon: "text", href: "../textos/" },
    { key: "reservations", label: "Reservas", icon: "booking", href: "../reservas/", badge: pendingCount ? String(pendingCount) : "" },
    { key: "settings", label: "Configuración", icon: "settings", href: "../configuracion/" },
  ];

  return navItems
    .map(
      (item) => `
        <a class="admin-nav-link ${page === item.key ? "is-active" : ""}" href="${item.href}">
          <span class="admin-nav-icon">${iconMarkup(item.icon)}</span>
          <span>${escapeHtml(item.label)}</span>
          ${item.badge ? `<span class="admin-nav-badge">${escapeHtml(item.badge)}</span>` : ""}
        </a>
      `
    )
    .join("");
}

function renderPageContent(page, state, machine) {
  switch (page) {
    case "photos":
      return renderPhotosPage(machine);
    case "pricing":
      return renderPricingPage(machine);
    case "texts":
      return renderTextsPage(machine);
    case "reservations":
      return renderReservationsPage(machine);
    case "settings":
      return renderSettingsPage(state, machine);
    case "dashboard":
    default:
      return renderDashboardPage(machine);
  }
}

function renderDashboardPage(machine) {
  const activePhotos = machine.photos.filter((photo) => photo.isActive).length;
  const reservations = [...machine.reservations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pending = reservations.filter((reservation) => reservation.status === "pending").length;
  const confirmed = reservations.filter((reservation) => reservation.status === "confirmed").length;
  const availability = getAvailabilityMeta(machine.config.availabilityStatus);

  return `
    <section class="admin-stat-grid">
      <article class="admin-stat-card admin-stat-card--accent">
        <span class="admin-stat-label">Disponibilidad</span>
        <strong>${escapeHtml(availability.label)}</strong>
        <p>${escapeHtml(machine.config.availabilityNote || availability.detail)}</p>
      </article>
      <article class="admin-stat-card">
        <span class="admin-stat-label">Reservas totales</span>
        <strong>${escapeHtml(String(reservations.length))}</strong>
        <p>${pending} pendientes y ${confirmed} confirmadas.</p>
      </article>
      <article class="admin-stat-card">
        <span class="admin-stat-label">Fotos activas</span>
        <strong>${escapeHtml(String(activePhotos))}</strong>
        <p>La primera foto marcada como principal se usa como portada.</p>
      </article>
      <article class="admin-stat-card">
        <span class="admin-stat-label">Precio desde</span>
        <strong>${escapeHtml(formatCurrency(machine.pricing.fromPrice))}</strong>
        <p>Valor destacado que aparece en la portada pública.</p>
      </article>
    </section>

    <section class="admin-panel-grid">
      <article class="admin-panel admin-panel--span-2">
        <div class="panel-head">
          <div>
            <h2>Accesos rápidos</h2>
            <p>Entrá directo a la parte que necesitás actualizar.</p>
          </div>
        </div>
        <div class="shortcut-grid">
          ${shortcut("../fotos/", "Fotos", "Cargá y ordená la galería", "photo")}
          ${shortcut("../precios/", "Precios", "Modificá tarifas y promo", "pricing")}
          ${shortcut("../textos/", "Textos", "Editá mensajes y servicios", "text")}
          ${shortcut("../reservas/", "Reservas", "Controlá estados de clientes", "booking")}
          ${shortcut("../configuracion/", "Configuración", "WhatsApp, agenda y visibilidad", "settings")}
        </div>
      </article>
      <article class="admin-panel">
        <div class="panel-head">
          <div>
            <h2>Vista pública</h2>
            <p>Chequeo rápido de la información comercial.</p>
          </div>
        </div>
        <div class="admin-check-list">
          <div><span>${iconMarkup("coverage")}</span><p>${escapeHtml(machine.config.coverageArea)}</p></div>
          <div><span>${iconMarkup("whatsapp")}</span><p>${escapeHtml(formatDisplayPhone(machine.config.whatsappNumber))}</p></div>
          <div><span>${iconMarkup("operator")}</span><p>${machine.pricing.operatorIncluded ? "Operador incluido" : "Operador a coordinar"}</p></div>
        </div>
      </article>
    </section>

    <section class="admin-panel">
      <div class="panel-head">
        <div>
          <h2>Reservas recientes</h2>
          <p>Las últimas consultas que entraron desde la landing pública.</p>
        </div>
      </div>
      ${
        reservations.length
          ? `
            <div class="recent-reservations">
              ${reservations
                .slice(0, 4)
                .map(
                  (reservation) => `
                    <article class="recent-reservation-card">
                      <div class="recent-reservation-head">
                        <strong>${escapeHtml(reservation.customerName)}</strong>
                        <span class="tag">${escapeHtml(getStatusLabel(reservation.status))}</span>
                      </div>
                      <p>${escapeHtml(reservation.location || "Sin ubicación")} · ${escapeHtml(formatDate(reservation.desiredDate))}</p>
                      <small>Creada ${escapeHtml(formatDateTime(reservation.createdAt))}</small>
                    </article>
                  `
                )
                .join("")}
            </div>
          `
          : renderAdminEmptyState("Todavía no hay reservas", "Cuando un cliente complete el formulario público, aparecerá aquí y también en la sección completa de reservas.", iconMarkup("booking"))
      }
    </section>
  `;
}

function shortcut(href, title, description, icon) {
  return `
    <a class="shortcut-card" href="${href}">
      <span class="shortcut-card-icon">${iconMarkup(icon)}</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(description)}</p>
    </a>
  `;
}

function renderPhotosPage(machine) {
  const photos = getSortedPhotos(machine.photos);
  return `
    <section class="admin-panel">
      <div class="panel-head panel-head--split">
        <div>
          <h2>Subir nuevas fotos</h2>
          <p>Las imágenes nuevas se comprimen para que la web siga liviana y rápida en celular.</p>
        </div>
        <label class="upload-button">
          <input id="photo-upload-input" type="file" accept="image/*" multiple hidden />
          Subir fotos
        </label>
      </div>
      <div class="inline-note">
        <span>${iconMarkup("photo")}</span>
        <p>${photos.filter((photo) => photo.isActive).length} fotos activas en la vista pública.</p>
        <small id="photo-upload-status"></small>
      </div>
    </section>
    ${
      photos.length
        ? `
          <section class="photo-manager-grid">
            ${photos
              .map(
                (photo) => `
                  <article class="photo-manager-card">
                    <div class="photo-manager-preview">
                      <img src="${escapeHtml(resolveMediaUrl(photo.imageUrl))}" alt="Foto cargada" />
                    </div>
                    <div class="photo-manager-body">
                      <div class="tag-row">
                        ${photo.isPrimary ? '<span class="tag tag--accent">Principal</span>' : ""}
                        <span class="tag ${photo.isActive ? "" : "tag--muted"}">${photo.isActive ? "Visible" : "Oculta"}</span>
                      </div>
                      <label class="field field-compact">
                        <span>Orden</span>
                        <input type="number" min="1" value="${escapeHtml(String(photo.sortOrder))}" data-photo-order="${escapeHtml(photo.id)}" />
                      </label>
                      <small>Cargada ${escapeHtml(formatDateTime(photo.createdAt))}</small>
                      <div class="photo-manager-actions">
                        <button type="button" class="button button-small button-secondary" data-photo-up="${escapeHtml(photo.id)}">Subir</button>
                        <button type="button" class="button button-small button-secondary" data-photo-down="${escapeHtml(photo.id)}">Bajar</button>
                        <button type="button" class="button button-small button-secondary" data-photo-primary="${escapeHtml(photo.id)}">Hacer principal</button>
                        <button type="button" class="button button-small button-secondary" data-photo-toggle="${escapeHtml(photo.id)}">${photo.isActive ? "Ocultar" : "Mostrar"}</button>
                        <button type="button" class="button button-small button-danger" data-photo-delete="${escapeHtml(photo.id)}">Eliminar</button>
                      </div>
                    </div>
                  </article>
                `
              )
              .join("")}
          </section>
        `
        : renderAdminEmptyState("No hay fotos cargadas", "Usá el botón superior para subir imágenes. La primera foto activa será la principal si todavía no definiste una.", iconMarkup("photo"))
    }
  `;
}

function renderPricingPage(machine) {
  return `
    <form class="admin-panel stack-form" id="pricing-form">
      <div class="panel-head">
        <div>
          <h2>Editar precios</h2>
          <p>Todos estos valores impactan directamente en la sección de precios de la landing.</p>
        </div>
      </div>
      <div class="form-grid form-grid-two">
        ${adminTextField("Precio por hora", "hourlyPrice", machine.pricing.hourlyPrice, "Ej. 220000")}
        ${adminTextField("Media jornada", "halfDayPrice", machine.pricing.halfDayPrice, "Ej. 840000")}
        ${adminTextField("Jornada completa", "fullDayPrice", machine.pricing.fullDayPrice, "Ej. 1540000")}
        ${adminTextField("Traslado", "transportPrice", machine.pricing.transportPrice, "Ej. 180000")}
        ${adminTextField("Precio desde", "fromPrice", machine.pricing.fromPrice, "Valor destacado en portada")}
        <label class="field checkbox-field">
          <span>Operador incluido</span>
          <input type="checkbox" name="operatorIncluded" ${machine.pricing.operatorIncluded ? "checked" : ""} />
        </label>
      </div>
      ${textArea("Texto promocional", "promoText", machine.pricing.promoText || "", 4)}
      <div class="form-actions">
        <button class="button button-primary" type="submit">Guardar precios</button>
        <div class="form-feedback" data-form-feedback></div>
      </div>
    </form>
  `;
}

function renderTextsPage(machine) {
  return `
    <form class="stack-form" id="texts-form">
      <section class="admin-panel">
        <div class="panel-head">
          <div>
            <h2>Textos principales</h2>
            <p>Estos campos alimentan los títulos, subtítulos y mensajes comerciales de la vista pública.</p>
          </div>
        </div>
        <div class="form-grid form-grid-two">
          ${adminTextField("Badge superior", "heroBadge", machine.texts.heroBadge)}
          ${adminTextField("Título principal", "heroTitle", machine.texts.heroTitle)}
        </div>
        ${textArea("Subtítulo principal", "heroSubtitle", machine.texts.heroSubtitle, 3)}
        ${textArea("Descripción comercial", "commercialDescription", machine.texts.commercialDescription, 4)}
        <div class="form-grid form-grid-two">
          ${adminTextField("Texto botón principal", "reserveButtonText", machine.texts.reserveButtonText)}
          ${adminTextField("Texto botón secundario", "priceButtonText", machine.texts.priceButtonText)}
        </div>
      </section>

      <section class="admin-panel">
        <div class="panel-head">
          <div>
            <h2>Secciones públicas</h2>
            <p>Etiquetas, títulos e introducciones para galería, precios, reserva y confianza.</p>
          </div>
        </div>
        <div class="form-grid form-grid-two">
          ${adminTextField("Label galería", "galleryLabel", machine.texts.galleryLabel)}
          ${adminTextField("Título galería", "galleryTitle", machine.texts.galleryTitle)}
          ${adminTextField("Label precios", "priceLabel", machine.texts.priceLabel)}
          ${adminTextField("Título precios", "priceTitle", machine.texts.priceTitle)}
          ${adminTextField("Label servicios", "servicesLabel", machine.texts.servicesLabel)}
          ${adminTextField("Título servicios", "servicesTitle", machine.texts.servicesTitle)}
          ${adminTextField("Label reserva", "bookingLabel", machine.texts.bookingLabel)}
          ${adminTextField("Título reserva", "bookingTitle", machine.texts.bookingTitle)}
          ${adminTextField("Label confianza", "trustLabel", machine.texts.trustLabel)}
          ${adminTextField("Título confianza", "trustTitle", machine.texts.trustTitle)}
        </div>
        ${textArea("Intro galería", "galleryIntro", machine.texts.galleryIntro, 3)}
        ${textArea("Intro precios", "priceIntro", machine.texts.priceIntro, 3)}
        ${textArea("Intro servicios", "servicesIntro", machine.texts.servicesIntro, 3)}
        ${textArea("Intro reserva", "bookingIntro", machine.texts.bookingIntro, 3)}
        ${textArea("Intro confianza", "trustIntro", machine.texts.trustIntro, 3)}
        ${textArea("Mensaje cuando no hay precios", "emptyPricesMessage", machine.texts.emptyPricesMessage, 3)}
        ${textArea("Título de CTA final", "ctaBannerTitle", machine.texts.ctaBannerTitle, 2)}
        ${textArea("Texto de CTA final", "ctaBannerText", machine.texts.ctaBannerText, 3)}
        <div class="form-grid form-grid-two">
          ${adminTextField("Título de tarjeta de contacto", "contactCardTitle", machine.texts.contactCardTitle)}
          ${adminTextField("Mensaje footer", "footerMessage", machine.texts.footerMessage)}
        </div>
        ${textArea("Texto de tarjeta de contacto", "contactCardText", machine.texts.contactCardText, 3)}
        ${textArea("Mensaje de éxito de reserva", "reserveSuccessMessage", machine.texts.reserveSuccessMessage, 3)}
        ${textArea("Texto legal footer", "footerLegal", machine.texts.footerLegal, 3)}
      </section>

      <section class="admin-panel">
        <div class="panel-head panel-head--split">
          <div>
            <h2>Servicios visibles</h2>
            <p>Estos bloques aparecen como tarjetas en la landing pública.</p>
          </div>
          <button class="button button-secondary" type="button" data-add-service>Agregar servicio</button>
        </div>
        <div class="repeater-list" id="services-editor">
          ${machine.services.map((service, index) => serviceEditorMarkup(service, index)).join("")}
        </div>
      </section>

      <section class="admin-panel">
        <div class="panel-head panel-head--split">
          <div>
            <h2>Textos de confianza</h2>
            <p>Destacá cobertura, disponibilidad, rapidez y confianza con mensajes editables.</p>
          </div>
          <button class="button button-secondary" type="button" data-add-trust>Agregar texto</button>
        </div>
        <div class="repeater-list" id="trust-editor">
          ${machine.trustHighlights.map((item, index) => trustEditorMarkup(item, index)).join("")}
        </div>
      </section>

      <div class="form-actions">
        <button class="button button-primary" type="submit">Guardar textos</button>
        <div class="form-feedback" data-form-feedback></div>
      </div>
    </form>
  `;
}

function renderReservationsPage(machine) {
  const reservations = [...machine.reservations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const counts = RESERVATION_STATUSES.map((status) => ({
    label: status.label,
    count: reservations.filter((reservation) => reservation.status === status.value).length,
  }));

  return `
    <section class="admin-panel">
      <div class="panel-head">
        <div>
          <h2>Estados de reservas</h2>
          <p>Revisá los datos capturados desde el formulario público y actualizá su seguimiento.</p>
        </div>
      </div>
      <div class="reservation-stats">
        ${counts
          .map(
            (item) => `
              <article class="reservation-stat-card">
                <strong>${escapeHtml(String(item.count))}</strong>
                <span>${escapeHtml(item.label)}</span>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    ${
      reservations.length
        ? `
          <section class="reservation-list">
            ${reservations
              .map(
                (reservation) => `
                  <article class="reservation-card">
                    <div class="reservation-card-head">
                      <div>
                        <h3>${escapeHtml(reservation.customerName)}</h3>
                        <p>${escapeHtml(reservation.phone || "Sin teléfono")} · ${escapeHtml(reservation.location || "Sin ubicación")}</p>
                      </div>
                      <label class="field field-compact">
                        <span>Estado</span>
                        <select data-reservation-status="${escapeHtml(reservation.id)}">
                          ${RESERVATION_STATUSES.map(
                            (status) =>
                              `<option value="${status.value}" ${reservation.status === status.value ? "selected" : ""}>${escapeHtml(status.label)}</option>`
                          ).join("")}
                        </select>
                      </label>
                    </div>
                    <div class="reservation-meta-grid">
                      <div><span>Fecha deseada</span><strong>${escapeHtml(formatDate(reservation.desiredDate))}</strong></div>
                      <div><span>Trabajo</span><strong>${escapeHtml(reservation.jobType || "No definido")}</strong></div>
                      <div><span>Horas estimadas</span><strong>${escapeHtml(reservation.estimatedHours || "-")}</strong></div>
                      <div><span>Creada</span><strong>${escapeHtml(formatDateTime(reservation.createdAt))}</strong></div>
                    </div>
                    <p class="reservation-message">${escapeHtml(reservation.message || "Sin mensaje adicional.")}</p>
                    <div class="reservation-actions">
                      <a class="button button-secondary button-small" href="${escapeHtml(buildWhatsAppUrl(machine.config.whatsappNumber, composeReservationMessage(machine.config, reservation)))}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>
                    </div>
                  </article>
                `
              )
              .join("")}
          </section>
        `
        : renderAdminEmptyState("No hay reservas todavía", "Cuando un cliente complete el formulario público, aparecerá un registro con sus datos y podrás cambiar el estado desde aquí.", iconMarkup("booking"))
    }
  `;
}

function renderSettingsPage(state, machine) {
  return `
    <form class="stack-form" id="settings-form">
      <section class="admin-panel">
        <div class="panel-head">
          <div>
            <h2>Información general</h2>
            <p>Controlá el nombre del servicio, el WhatsApp, la disponibilidad y qué bloques se muestran en la landing.</p>
          </div>
        </div>
        <div class="form-grid form-grid-two">
          ${adminTextField("Nombre del negocio", "businessName", machine.config.businessName)}
          ${adminTextField("Nombre de la máquina", "machineName", machine.config.machineName)}
          ${adminTextField("Número de WhatsApp", "whatsappNumber", machine.config.whatsappNumber, "Solo números o con +")}
          <label class="field">
            <span>Disponibilidad</span>
            <select name="availabilityStatus">
              <option value="available" ${machine.config.availabilityStatus === "available" ? "selected" : ""}>Disponible</option>
              <option value="limited" ${machine.config.availabilityStatus === "limited" ? "selected" : ""}>Pocas fechas disponibles</option>
              <option value="full" ${machine.config.availabilityStatus === "full" ? "selected" : ""}>Agenda llena</option>
            </select>
          </label>
        </div>
        ${textArea("Mensaje base de WhatsApp", "whatsappMessageTemplate", machine.config.whatsappMessageTemplate, 3)}
        ${textArea("Zona de cobertura", "coverageArea", machine.config.coverageArea, 3)}
        ${textArea("Detalle de disponibilidad", "availabilityNote", machine.config.availabilityNote || "", 3)}
        <div class="form-grid form-grid-two">
          <label class="field checkbox-field">
            <span>Mostrar sección de precios</span>
            <input type="checkbox" name="showPrices" ${machine.config.showPrices ? "checked" : ""} />
          </label>
          <label class="field checkbox-field">
            <span>Mostrar promo activa</span>
            <input type="checkbox" name="showPromo" ${machine.config.showPromo ? "checked" : ""} />
          </label>
        </div>
      </section>

      <section class="admin-panel">
        <div class="panel-head">
          <div>
            <h2>SEO y vista previa social</h2>
            <p>Defini la URL publica, el titulo SEO, la descripcion, y la imagen que se usa al compartir en WhatsApp, Facebook y buscadores.</p>
          </div>
        </div>
        <div class="form-grid form-grid-two">
          ${adminTextField("URL publica del sitio", "siteUrl", machine.config.siteUrl, "Ej. https://balbuenarecaldew-arch.github.io/MAQUILER")}
          ${adminTextField("Nombre del sitio", "siteName", machine.config.siteName || machine.config.businessName, "Ej. Maquiler")}
          ${adminTextField("Titulo SEO", "seoTitle", machine.config.seoTitle, "Ej. Alquiler de Mini Cargadora | Maquiler Asuncion")}
          ${adminTextField("Titulo para redes", "socialTitle", machine.config.socialTitle, "Ej. Alquiler de Mini Cargadora")}
          ${adminTextField("Imagen de preview", "socialImage", machine.config.socialImage, "URL publica o archivo como preview.jpg")}
          ${adminTextField("Ancho imagen preview", "socialImageWidth", machine.config.socialImageWidth, "1080")}
          ${adminTextField("Alto imagen preview", "socialImageHeight", machine.config.socialImageHeight, "1085")}
        </div>
        ${textArea("Meta description SEO", "seoDescription", machine.config.seoDescription, 3)}
        ${textArea("Descripcion corta para redes", "socialDescription", machine.config.socialDescription, 2)}
      </section>

      <section class="admin-panel">
        <div class="panel-head">
          <div>
            <h2>Acceso admin</h2>
            <p>Podés cambiar el usuario y definir una nueva contraseña básica para este navegador.</p>
          </div>
        </div>
        <div class="form-grid form-grid-two">
          ${adminTextField("Usuario admin", "adminUsername", state.admin.username)}
          <label class="field">
            <span>Nueva contraseña</span>
            <input type="password" name="newPassword" placeholder="Dejar vacío para mantener" />
          </label>
        </div>
        <label class="field">
          <span>Confirmar nueva contraseña</span>
          <input type="password" name="confirmPassword" placeholder="Repetí la nueva contraseña" />
        </label>
      </section>

      <div class="form-actions">
        <button class="button button-primary" type="submit">Guardar configuración</button>
        <div class="form-feedback" data-form-feedback></div>
      </div>
    </form>
  `;
}

function serviceEditorMarkup(service, index) {
  return `
    <article class="repeater-card service-editor" data-id="${escapeHtml(service.id)}">
      <div class="repeater-card-head">
        <strong data-card-title>Servicio ${index + 1}</strong>
        <button class="button button-small button-danger" type="button" data-remove-service>Eliminar</button>
      </div>
      <div class="form-grid form-grid-two">
        <label class="field">
          <span>Título</span>
          <input type="text" data-field="title" value="${escapeHtml(service.title)}" />
        </label>
        <label class="field">
          <span>Ícono</span>
          <select data-field="icon">
            ${iconOptions(service.icon)}
          </select>
        </label>
      </div>
      <label class="field">
        <span>Descripción</span>
        <textarea data-field="description" rows="3">${escapeHtml(service.description)}</textarea>
      </label>
    </article>
  `;
}

function trustEditorMarkup(item, index) {
  return `
    <article class="repeater-card trust-editor" data-id="${escapeHtml(item.id)}">
      <div class="repeater-card-head">
        <strong data-card-title>Texto ${index + 1}</strong>
        <button class="button button-small button-danger" type="button" data-remove-trust>Eliminar</button>
      </div>
      <label class="field">
        <span>Título</span>
        <input type="text" data-field="title" value="${escapeHtml(item.title)}" />
      </label>
      <label class="field">
        <span>Descripción</span>
        <textarea data-field="description" rows="3">${escapeHtml(item.description)}</textarea>
      </label>
    </article>
  `;
}

function iconOptions(selectedIcon) {
  const options = [
    { value: "terrain", label: "Movimiento de tierra" },
    { value: "grading", label: "Nivelación" },
    { value: "cleanup", label: "Limpieza" },
    { value: "debris", label: "Escombros" },
    { value: "loading", label: "Carga" },
  ];
  return options
    .map((option) => `<option value="${option.value}" ${selectedIcon === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`)
    .join("");
}

function textArea(label, name, value, rows) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <textarea name="${escapeHtml(name)}" rows="${rows}">${escapeHtml(value || "")}</textarea>
    </label>
  `;
}

function getEmptyServiceMarkup(index = 0) {
  return serviceEditorMarkup(createEmptyService(), index);
}

function getEmptyTrustMarkup(index = 0) {
  return trustEditorMarkup(createEmptyTrust(), index);
}
  Object.assign(App, {
    getEmptyServiceMarkup,
    getEmptyTrustMarkup,
    renderAdminLogin,
    renderAdminSection,
  });
})();
