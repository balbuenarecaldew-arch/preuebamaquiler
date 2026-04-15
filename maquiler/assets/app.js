(() => {
  const App = (window.MaquilerApp = window.MaquilerApp || {});
  let rerender = null;

  document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    if (!app) return;

    const page = document.body.dataset.page;

    if (page === "public") {
      rerender = () => App.initPublicPage(app);
      rerender();
      return;
    }

    if (page === "admin-login") {
      rerender = () => App.initAdminLogin(app);
      rerender();
      return;
    }

    if (page === "admin-section") {
      const adminPage = document.body.dataset.adminPage || "dashboard";
      rerender = () => App.initAdminSection(app, adminPage, rerender);
      rerender();
    }
  });

  window.addEventListener("storage", () => {
    if (typeof rerender === "function") {
      rerender();
    }
  });
})();
