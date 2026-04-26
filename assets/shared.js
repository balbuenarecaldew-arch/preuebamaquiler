(() => {
  const App = (window.MaquilerApp = window.MaquilerApp || {});
  const STORAGE_KEY = "maquiler-site-v2";
  const SESSION_KEY = "maquiler-admin-session";
  const DEFAULT_PASSWORD = "admin123";

  const RESERVATION_STATUSES = [
    { value: "pending", label: "Pendiente" },
    { value: "contacted", label: "Contactado" },
    { value: "confirmed", label: "Confirmado" },
    { value: "completed", label: "Realizado" },
    { value: "cancelled", label: "Cancelado" },
  ];

  const DEFAULT_MACHINE = {
    id: "mini-cargadora-1",
    slug: "mini-cargadora",
    config: {
      businessName: "Maquiler",
      siteName: "Maquiler",
      siteUrl: "https://balbuenarecaldew-arch.github.io/MAQUILER",
      machineName: "Mini Cargadora",
      whatsappNumber: "595972848607",
      whatsappMessageTemplate: "Hola, quiero reservar la mini cargadora.",
      coverageArea: "Asunción, Gran Asunción y zonas cercanas",
      availabilityStatus: "available",
      availabilityNote: "Agenda abierta para coordinar trabajos con respuesta rápida.",
      showPrices: true,
      showPromo: true,
      seoTitle: "Alquiler de Mini Cargadora | Maquiler Asuncion",
      seoDescription: "Alquiler de mini cargadora para movimiento de tierra, limpieza de terrenos, nivelacion y carga. Reservas rapidas por WhatsApp.",
      socialTitle: "Alquiler de Mini Cargadora",
      socialDescription: "Reservas rapidas por WhatsApp",
      socialImage: "social-preview.jpg",
      socialImageWidth: 1200,
      socialImageHeight: 630,
    },
    pricing: {
      hourlyPrice: 220000,
      halfDayPrice: 840000,
      fullDayPrice: 1540000,
      transportPrice: 180000,
      operatorIncluded: true,
      promoText: "Consultá por tarifas especiales para obras de varios días o jornadas consecutivas.",
      fromPrice: 220000,
    },
    texts: {
      heroBadge: "Disponible para obras urbanas y trabajos de apoyo",
      heroTitle: "Alquiler de Mini Cargadora",
      heroSubtitle: "Reservá rápida para movimiento de tierra, limpieza de terrenos y trabajos de carga.",
      commercialDescription: "Alquiler de mini cargadora con reserva rápida por WhatsApp, precios claros y atención ágil.",
      reserveButtonText: "Reservar por WhatsApp",
      priceButtonText: "Ver precios",
      galleryLabel: "Fotos reales",
      galleryTitle: "La máquina que llega a tu trabajo",
      galleryIntro: "Fotos reales del equipo y de los trabajos que podés resolver.",
      priceLabel: "Precios",
      priceTitle: "Tarifas claras para decidir rápido",
      priceIntro: "Tomá una referencia inmediata y coordiná la fecha por WhatsApp.",
      servicesLabel: "Usos frecuentes",
      servicesTitle: "Trabajos donde más rinde la mini cargadora",
      servicesIntro: "Desde movimiento de tierra hasta limpieza y carga de materiales.",
      bookingLabel: "Reserva rápida",
      bookingTitle: "Pedí la máquina en menos de un minuto",
      bookingIntro: "Completá el formulario y te abrimos WhatsApp con el pedido listo para enviar.",
      trustLabel: "Confianza",
      trustTitle: "Coordinación clara y respuesta rápida",
      trustIntro: "Disponibilidad visible, fotos reales y seguimiento directo para confirmar tu trabajo.",
      emptyPricesMessage: "Estamos cotizando cada trabajo según zona, traslado y duración. Escribinos por WhatsApp para recibir el precio actualizado.",
      footerMessage: "Servicio de alquiler de mini cargadora para movimiento de tierra, limpieza y carga.",
      footerLegal: "Coordinación simple, respuesta rápida y confirmación por WhatsApp.",
      ctaBannerTitle: "¿Ya sabés la fecha y el lugar del trabajo?",
      ctaBannerText: "Mandanos la ubicación, la fecha deseada y las horas estimadas para coordinar disponibilidad.",
      contactCardTitle: "Respuesta directa",
      contactCardText: "Confirmamos agenda, tipo de trabajo y traslado sin vueltas.",
      reserveSuccessMessage: "Reserva guardada. Abrimos WhatsApp para que sigas la coordinación.",
    },
    photos: [
      { id: "photo-1", imageUrl: "foto1.jpg", altText: "Mini cargadora lista para alquiler sobre plataforma de traslado", caption: "Lista para alquiler", width: 838, height: 1256, isPrimary: true, isActive: true, sortOrder: 1, createdAt: "2026-04-15T14:28:03.735Z" },
      { id: "photo-2", imageUrl: "foto2.jpg", altText: "Mini cargadora disponible para alquiler", caption: "Disponible", width: 1280, height: 960, isPrimary: false, isActive: true, sortOrder: 2, createdAt: "2026-04-15T14:20:22.872Z" },
      { id: "photo-3", imageUrl: "foto3.jpg", altText: "Mini cargadora sobre camion de traslado", caption: "Sobre camion", width: 700, height: 653, isPrimary: false, isActive: true, sortOrder: 3, createdAt: "2026-04-15T14:22:51.031Z" },
      { id: "photo-4", imageUrl: "foto4.jpg", altText: "Mini pala cargadora modelo CDM307", caption: "Modelo CDM307", width: 1080, height: 1085, isPrimary: false, isActive: true, sortOrder: 4, createdAt: "2026-04-14T21:31:00.000Z" },
      { id: "photo-5", imageUrl: "foto5.jpg", altText: "Mini cargadora trabajando en obra urbana", caption: "Trabajo en obra", width: 1280, height: 720, isPrimary: false, isActive: true, sortOrder: 5, createdAt: "2026-04-15T14:25:28.300Z" },
    ],
    services: [
      { id: "service-1", title: "Movimiento de tierra", description: "Preparación de terreno, rellenos, nivelaciones y carga para obras o accesos.", icon: "terrain" },
      { id: "service-2", title: "Nivelación", description: "Ajuste de superficies para pisos, patios, veredas, obras y espacios industriales.", icon: "grading" },
      { id: "service-3", title: "Limpieza de terrenos", description: "Retiro de material suelto, maleza, tierra removida y acondicionamiento de lotes.", icon: "cleanup" },
      { id: "service-4", title: "Retiro de escombros", description: "Carga rápida de restos de obra, residuos pesados y materiales para evacuación.", icon: "debris" },
      { id: "service-5", title: "Carga de materiales", description: "Movimiento de arena, cascajo, piedra, tierra y otros materiales a granel.", icon: "loading" },
    ],
    trustHighlights: [
      { id: "trust-1", title: "Zona de cobertura amplia", description: "Atendemos Asunción, Gran Asunción y coordinamos traslados a zonas cercanas." },
      { id: "trust-2", title: "Respuesta por WhatsApp", description: "La comunicación es directa para confirmar rápido el trabajo y la fecha." },
      { id: "trust-3", title: "Disponibilidad visible", description: "Mostramos si la agenda está abierta, limitada o completa antes de que el cliente consulte." },
      { id: "trust-4", title: "Fotos reales del equipo", description: "La landing usa fotos reales para dar confianza antes de reservar." },
    ],
    reservations: [],
  };

  const DEFAULT_STATE = {
    version: 2,
    activeMachineId: DEFAULT_MACHINE.id,
    admin: {
      username: "admin",
      passwordHash: hashText(DEFAULT_PASSWORD),
    },
    machines: [DEFAULT_MACHINE],
  };

  function getState() {
    return ensureState();
  }

  function updateState(mutator) {
    const draft = clone(getState());
    mutator(draft);
    const normalized = normalizeState(draft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function updateActiveMachine(mutator) {
    return updateState((draft) => {
      const machine = getActiveMachine(draft);
      mutator(machine);
    });
  }

  function getActiveMachine(state) {
    const active = state.machines.find((machine) => machine.id === state.activeMachineId);
    return active || state.machines[0];
  }

  function isLoggedIn() {
    const session = safeParse(localStorage.getItem(SESSION_KEY));
    return Boolean(session?.username);
  }

  function setAdminSession(username) {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        username,
        loggedAt: new Date().toISOString(),
      })
    );
  }

  function clearAdminSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function ensureState() {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));
    const normalized = normalizeState(stored || DEFAULT_STATE);
    if (!stored || JSON.stringify(stored) !== JSON.stringify(normalized)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  }

  function getAvailabilityMeta(status) {
    const map = {
      available: { label: "Disponible", shortLabel: "Agenda abierta", detail: "Hay espacio para coordinar trabajos en los próximos días.", tone: "available" },
      limited: { label: "Pocas fechas disponibles", shortLabel: "Cupos limitados", detail: "Quedan pocos espacios cercanos. Conviene reservar cuanto antes.", tone: "limited" },
      full: { label: "Agenda llena", shortLabel: "Próxima fecha", detail: "La agenda actual está completa. Podés consultar la próxima ventana disponible.", tone: "full" },
    };
    return map[status] || map.available;
  }

  function getStatusLabel(status) {
    return RESERVATION_STATUSES.find((item) => item.value === status)?.label || "Pendiente";
  }

  function getSortedPhotos(photos) {
    return [...(photos || [])].sort((a, b) => {
      const orderDiff = (a.sortOrder || 0) - (b.sortOrder || 0);
      if (orderDiff !== 0) return orderDiff;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  function getVisiblePhotos(machine) {
    return getSortedPhotos(machine.photos)
      .filter((photo) => photo.isActive)
      .sort((a, b) => {
        if (a.isPrimary === b.isPrimary) return a.sortOrder - b.sortOrder;
        return a.isPrimary ? -1 : 1;
      });
  }

  function normalizePhotos(photos) {
    const filtered = Array.isArray(photos)
      ? photos
          .map((photo, index) => ({
            id: photo.id || makeId("photo"),
            imageUrl: normalizeText(photo.imageUrl),
            altText: normalizeText(photo.altText) || `Mini cargadora en trabajo ${index + 1}`,
            caption: normalizeText(photo.caption) || `Vista ${index + 1}`,
            width: Math.max(0, toNumber(photo.width)),
            height: Math.max(0, toNumber(photo.height)),
            isPrimary: Boolean(photo.isPrimary),
            isActive: photo.isActive !== false,
            sortOrder: Math.max(1, toNumber(photo.sortOrder) || index + 1),
            createdAt: photo.createdAt || new Date().toISOString(),
          }))
          .filter((photo) => photo.imageUrl)
      : [];

    const sorted = getSortedPhotos(filtered).map((photo, index) => ({ ...photo, sortOrder: index + 1 }));
    if (!sorted.length) return [];
    const primaryId =
      sorted.find((photo) => photo.isPrimary && photo.isActive)?.id ||
      sorted.find((photo) => photo.isPrimary)?.id ||
      sorted.find((photo) => photo.isActive)?.id ||
      sorted[0].id;
    return sorted.map((photo) => ({ ...photo, isPrimary: photo.id === primaryId }));
  }

  function createEmptyService() {
    return { id: makeId("service"), title: "", description: "", icon: "terrain" };
  }

  function createEmptyTrust() {
    return { id: makeId("trust"), title: "", description: "" };
  }

  function validateReservation(payload) {
    const errors = [];
    if (payload.customerName.length < 2) errors.push("Ingresá un nombre válido.");
    if (payload.phone.length < 6) errors.push("Ingresá un teléfono válido.");
    if (payload.location.length < 3) errors.push("Indicá la ubicación del trabajo.");
    if (!payload.desiredDate) errors.push("Seleccioná la fecha deseada.");
    if (!payload.jobType) errors.push("Elegí el tipo de trabajo.");
    if (!payload.estimatedHours || toNumber(payload.estimatedHours) <= 0) errors.push("Indicá las horas estimadas.");
    return errors;
  }

  function composeReservationMessage(config, reservation) {
    const header = config.whatsappMessageTemplate || "Hola, quiero reservar la mini cargadora.";
    return [
      header,
      `Nombre: ${reservation.customerName || "-"}`,
      `Teléfono: ${reservation.phone || "-"}`,
      `Ubicación: ${reservation.location || "-"}`,
      `Fecha: ${reservation.desiredDate || "-"}`,
      `Tipo de trabajo: ${reservation.jobType || "-"}`,
      `Horas estimadas: ${reservation.estimatedHours || "-"}`,
      `Mensaje: ${reservation.message || "-"}`,
    ].join("\n");
  }

  function buildWhatsAppUrl(phone, message) {
    const cleanPhone = String(phone || "").replace(/[^\d]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message || "")}`;
  }

  function hashText(value) {
    let hash = 2166136261;
    const input = String(value || "");
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `h${(hash >>> 0).toString(16)}`;
  }

  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const maxSize = 1600;
          let { width, height } = image;
          const ratio = Math.min(1, maxSize / Math.max(width, height));
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("Canvas not available"));
            return;
          }
          context.drawImage(image, 0, 0, width, height);
          resolve({
            dataUrl: canvas.toDataURL("image/jpeg", 0.82),
            width,
            height,
          });
        };
        image.onerror = reject;
        image.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function formatCurrency(value) {
    const amount = toNumber(value);
    if (!amount) return "Consultar";
    return `Gs ${new Intl.NumberFormat("es-PY").format(amount)}`;
  }

  function formatDate(value) {
    if (!value) return "Sin fecha";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-PY", { dateStyle: "medium" }).format(date);
  }

  function formatDateTime(value) {
    if (!value) return "Sin fecha";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-PY", { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  function formatDisplayPhone(value) {
    const clean = String(value || "").replace(/[^\d]/g, "");
    if (!clean) return "Sin número";
    if (clean.startsWith("595") && clean.length >= 12) {
      return `+${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
    }
    return `+${clean}`;
  }

  function resolveMediaUrl(url) {
    if (!url) return "";
    if (/^(data:|https?:|blob:)/i.test(url)) return url;
    const clean = url.replace(/^\.?\//, "");
    const page = document.body.dataset.page;
    if (page === "public") return clean;
    if (page === "admin-login") return `../${clean}`;
    return `../../${clean}`;
  }

  function stripTrailingSlash(url) {
    return normalizeText(url).replace(/\/+$/, "");
  }

  function buildAbsoluteUrl(url, siteUrl) {
    const value = normalizeText(url);
    if (!value) return "";
    if (/^(data:|https?:|blob:)/i.test(value)) return value;
    const base = stripTrailingSlash(siteUrl || "");
    const clean = value.replace(/^\.?\//, "");
    return base ? `${base}/${clean}` : clean;
  }

  function getImageMimeType(url) {
    const value = normalizeText(url).toLowerCase();
    if (!value) return "";
    if (value.startsWith("data:image/")) {
      const match = value.match(/^data:(image\/[a-z0-9.+-]+);/);
      return match ? match[1] : "";
    }
    if (value.endsWith(".png")) return "image/png";
    if (value.endsWith(".webp")) return "image/webp";
    if (value.endsWith(".svg")) return "image/svg+xml";
    if (value.endsWith(".gif")) return "image/gif";
    if (value.endsWith(".jpg") || value.endsWith(".jpeg")) return "image/jpeg";
    return "";
  }

  function getPrimaryPhoto(machine) {
    const visible = getVisiblePhotos(machine);
    return visible[0] || getSortedPhotos(machine.photos)[0] || null;
  }

  function getSeoData(machine) {
    const config = machine?.config || {};
    const siteUrl = stripTrailingSlash(config.siteUrl || "https://balbuenarecaldew-arch.github.io/MAQUILER");
    const pageUrl = siteUrl ? `${siteUrl}/` : "/";
    const siteName = normalizeText(config.siteName || config.businessName || "Maquiler");
    const socialImageWidth = String(toNumber(config.socialImageWidth) || 1080);
    const socialImageHeight = String(toNumber(config.socialImageHeight) || 1085);
    const primaryPhoto = getPrimaryPhoto(machine);
    const socialImageSource = normalizeText(config.socialImage) || primaryPhoto?.imageUrl || "preview.jpg";
    const socialImage = buildAbsoluteUrl(socialImageSource, siteUrl);
    const socialImageAlt = primaryPhoto?.altText || `Servicio de alquiler de ${config.machineName || "mini cargadora"}`;

    return {
      siteName,
      siteUrl,
      pageUrl,
      title: normalizeText(config.seoTitle || `Alquiler de Mini Cargadora | ${siteName}`),
      description: normalizeText(
        config.seoDescription ||
          "Alquiler de mini cargadora para movimiento de tierra, limpieza de terrenos, nivelacion y carga. Reservas rapidas por WhatsApp."
      ),
      socialTitle: normalizeText(config.socialTitle || "Alquiler de Mini Cargadora"),
      socialDescription: normalizeText(config.socialDescription || "Reservas rapidas por WhatsApp"),
      socialImage,
      socialImageType: getImageMimeType(socialImageSource),
      socialImageAlt,
      socialImageWidth,
      socialImageHeight,
    };
  }

  function buildStructuredData(machine) {
    const seo = getSeoData(machine);
    const config = machine?.config || {};
    const cleanPhone = String(config.whatsappNumber || "").replace(/[^\d]/g, "");
    const phone = cleanPhone ? `+${cleanPhone}` : "";
    const services = Array.isArray(machine?.services) ? machine.services.map((service) => service.title).filter(Boolean) : [];
    const primaryPhoto = getPrimaryPhoto(machine);
    const primaryImage = primaryPhoto ? buildAbsoluteUrl(primaryPhoto.imageUrl, seo.siteUrl) : seo.socialImage;
    const serviceTypeList = services.length
      ? services
      : ["Alquiler de mini cargadora", "Movimiento de tierra", "Limpieza de terrenos", "Nivelacion", "Carga de materiales"];

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfessionalService",
          "@id": `${seo.pageUrl}#business`,
          name: seo.siteName,
          description: seo.description,
          url: seo.pageUrl,
          image: [seo.socialImage, primaryImage].filter(Boolean),
          logo: buildAbsoluteUrl("logo.png", seo.siteUrl),
          telephone: phone,
          areaServed: [
            {
              "@type": "Place",
              name: normalizeText(config.coverageArea || "Asuncion y Gran Asuncion"),
            },
          ],
          serviceType: serviceTypeList,
          contactPoint: phone
            ? [
                {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  telephone: phone,
                  availableLanguage: ["es"],
                  url: buildWhatsAppUrl(config.whatsappNumber, config.whatsappMessageTemplate || ""),
                },
              ]
            : undefined,
        },
        {
          "@type": "Service",
          "@id": `${seo.pageUrl}#service`,
          name: normalizeText(config.machineName || "Alquiler de Mini Cargadora"),
          description: seo.description,
          provider: {
            "@id": `${seo.pageUrl}#business`,
          },
          serviceType: "Alquiler de mini cargadora",
          areaServed: {
            "@type": "Place",
            name: normalizeText(config.coverageArea || "Asuncion y Gran Asuncion"),
          },
          url: seo.pageUrl,
        },
        {
          "@type": "WebSite",
          "@id": `${seo.pageUrl}#website`,
          url: seo.pageUrl,
          name: seo.siteName,
          inLanguage: "es",
        },
      ],
    };
  }

  function getTodayIsoDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function parseMoney(value) {
    const digits = String(value || "").replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
  }

  function normalizeText(value) {
    return String(value || "").trim();
  }

  function toNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeState(candidate) {
    const merged = deepMerge(DEFAULT_STATE, candidate || {});
    const machines = Array.isArray(merged.machines) && merged.machines.length ? merged.machines : [clone(DEFAULT_MACHINE)];
    return {
      version: merged.version || 2,
      activeMachineId: merged.activeMachineId || machines[0].id,
      admin: {
        username: merged.admin?.username || DEFAULT_STATE.admin.username,
        passwordHash: merged.admin?.passwordHash || DEFAULT_STATE.admin.passwordHash,
      },
      machines: machines.map((machine) => normalizeMachine(machine)),
    };
  }

  function normalizeMachine(machine) {
    const merged = deepMerge(DEFAULT_MACHINE, machine || {});
    return {
      ...merged,
      id: merged.id || DEFAULT_MACHINE.id,
      slug: merged.slug || DEFAULT_MACHINE.slug,
      config: { ...DEFAULT_MACHINE.config, ...merged.config },
      pricing: { ...DEFAULT_MACHINE.pricing, ...merged.pricing },
      texts: { ...DEFAULT_MACHINE.texts, ...merged.texts },
      photos: normalizePhotos(merged.photos),
      services: Array.isArray(merged.services)
      ? merged.services.map((service) => ({
          id: service.id || makeId("service"),
          title: normalizeText(service.title),
          description: normalizeText(service.description),
          icon: normalizeText(service.icon) || "terrain",
          }))
        : [],
      trustHighlights: Array.isArray(merged.trustHighlights)
        ? merged.trustHighlights.map((item) => ({
            id: item.id || makeId("trust"),
            title: normalizeText(item.title),
            description: normalizeText(item.description),
          }))
        : [],
      reservations: Array.isArray(merged.reservations)
        ? merged.reservations.map((reservation) => ({
            id: reservation.id || makeId("reservation"),
            customerName: normalizeText(reservation.customerName),
            phone: normalizeText(reservation.phone),
            location: normalizeText(reservation.location),
            desiredDate: normalizeText(reservation.desiredDate),
            jobType: normalizeText(reservation.jobType),
            estimatedHours: normalizeText(reservation.estimatedHours),
            message: normalizeText(reservation.message),
            status: RESERVATION_STATUSES.some((item) => item.value === reservation.status) ? reservation.status : "pending",
            createdAt: reservation.createdAt || new Date().toISOString(),
          }))
        : [],
    };
  }

  function deepMerge(base, override) {
    if (Array.isArray(base)) return Array.isArray(override) ? clone(override) : clone(base);
    if (base && typeof base === "object") {
      const result = {};
      const keys = new Set([...Object.keys(base), ...Object.keys(override || {})]);
      keys.forEach((key) => {
        const baseValue = base[key];
        const overrideValue = override ? override[key] : undefined;
        if (overrideValue === undefined) result[key] = clone(baseValue);
        else if (
          baseValue &&
          typeof baseValue === "object" &&
          !Array.isArray(baseValue) &&
          overrideValue &&
          typeof overrideValue === "object" &&
          !Array.isArray(overrideValue)
        ) result[key] = deepMerge(baseValue, overrideValue);
        else result[key] = clone(overrideValue);
      });
      return result;
    }
    return override !== undefined ? clone(override) : clone(base);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeParse(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function makeId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
  }

  Object.assign(App, {
    DEFAULT_PASSWORD,
    RESERVATION_STATUSES,
    buildAbsoluteUrl,
    buildWhatsAppUrl,
    buildStructuredData,
    clearAdminSession,
    composeReservationMessage,
    compressImageFile,
    createEmptyService,
    createEmptyTrust,
    ensureState,
    escapeHtml,
    formatCurrency,
    formatDate,
    formatDateTime,
    formatDisplayPhone,
    getActiveMachine,
    getAvailabilityMeta,
    getImageMimeType,
    getPrimaryPhoto,
    getSeoData,
    getSortedPhotos,
    getState,
    getStatusLabel,
    getTodayIsoDate,
    getVisiblePhotos,
    hashText,
    isLoggedIn,
    normalizePhotos,
    normalizeText,
    parseMoney,
    resolveMediaUrl,
    setAdminSession,
    stripTrailingSlash,
    toNumber,
    updateActiveMachine,
    updateState,
    validateReservation,
  });
})();
