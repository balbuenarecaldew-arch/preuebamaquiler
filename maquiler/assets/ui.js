(() => {
  const App = (window.MaquilerApp = window.MaquilerApp || {});
  const { escapeHtml } = App;

  function sectionHeaderMarkup(label, title, description, compact = false, headingId = "") {
    const headingAttributes = headingId ? ` id="${escapeHtml(headingId)}"` : "";
    return `
      <div class="section-header ${compact ? "section-header--compact" : ""}" data-reveal>
        <span class="section-eyebrow">${escapeHtml(label)}</span>
        <h2${headingAttributes}>${escapeHtml(title)}</h2>
        <p>${escapeHtml(description)}</p>
      </div>
    `;
  }

  function setFormFeedback(element, message, type) {
    if (!element) return;
    element.textContent = message || "";
    element.className = `form-feedback is-${type}`;
  }

  function showToast(message, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast toast--${type} is-visible`;
    clearTimeout(showToast.timerId);
    showToast.timerId = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  function revealOnScroll() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    items.forEach((item) => observer.observe(item));
  }

  function adminTextField(label, name, value, placeholder = "") {
    return `
      <label class="field">
        <span>${escapeHtml(label)}</span>
        <input type="text" name="${escapeHtml(name)}" value="${escapeHtml(String(value ?? ""))}" placeholder="${escapeHtml(placeholder)}" />
      </label>
    `;
  }

  function renderAdminEmptyState(title, text, iconMarkup) {
    return `
      <div class="empty-state empty-state--admin">
        <div class="empty-state-icon">${iconMarkup}</div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(text)}</p>
      </div>
    `;
  }

  Object.assign(App, {
    adminTextField,
    renderAdminEmptyState,
    revealOnScroll,
    sectionHeaderMarkup,
    setFormFeedback,
    showToast,
  });
})();
