(() => {
  const App = (window.MaquilerApp = window.MaquilerApp || {});

  const SVG_ICONS = {
    dashboard:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    photo:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h4l2-2h4l2 2h4v12H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    pricing:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12l-1 6H7zM7 10h10l1 10H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 14h4M10 18h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    text:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    booking:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v3M17 4v3M5 8h14v11H5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 12.5h2.5v2.5H8.5zM13 12.5h2.5v2.5H13z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 2.5 3-.2.8 2.9 2.7 1.3-1 2.8 1 2.8-2.7 1.3-.8 2.9-3-.2L12 21l-1.8-2.5-3 .2-.8-2.9-2.7-1.3 1-2.8-1-2.8 2.7-1.3.8-2.9 3 .2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    terrain:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18M6 18v-4l4-3 3 2 5-5 2 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grading:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17h16M6 17l4-8h4l4 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9V5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    cleanup:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15h11l3-6H8zM8 9l-3 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="18" r="1.3" fill="currentColor"/><circle cx="16" cy="18" r="1.3" fill="currentColor"/></svg>',
    debris:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16M7 18l2-7h6l2 7M10 11V6h4v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    loading:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16h10l2-5h6v5h-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="18" r="1.8" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="18" r="1.8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    coverage:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-4.8 6-10a6 6 0 10-12 0c0 5.2 6 10 6 10z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5A8.5 8.5 0 005.7 5.4 8.4 8.4 0 004 16.7L3 21l4.5-1.2A8.5 8.5 0 1020 11.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.4 9.6c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .6.4.2.5.7 1.6.8 1.7.1.2.1.3 0 .5l-.3.4c-.1.1-.2.2-.1.4.1.2.5.8 1.2 1.3.8.7 1.5.9 1.7 1 .2.1.3 0 .4-.1l.5-.6c.1-.1.2-.2.5-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.3 0 .2-.1.9-.6 1.3-.3.2-.6.3-1 .3-.5 0-1.2-.1-2.2-.5-.6-.3-1.4-.8-2.3-1.6-1.1-.9-1.8-2-2.1-2.6-.3-.7-.4-1.3-.4-1.7 0-.4.2-.8.5-1.1z" fill="currentColor" stroke="none"/></svg>',
    operator:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.5" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M6 20a6 6 0 0112 0M16.5 13.5l1.2 1.2 2.8-2.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    speed:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17a7 7 0 1114 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 12l4-2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 17h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-2.6 7.8-7 10-4.4-2.2-7-5.5-7-10V6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.5 12.5l1.7 1.7 3.8-4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    star:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.3 7.2 18.6l.9-5.3-3.8-3.7 5.3-.8z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  };

  App.SVG_ICONS = SVG_ICONS;
  App.iconMarkup = function iconMarkup(icon) {
    return SVG_ICONS[icon] || SVG_ICONS.star;
  };
})();
