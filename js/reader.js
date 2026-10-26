/**
 * Biblia Comentada - BAC
 * Motor y UI del Modo Lectura (reader.js)
 */

(function () {
  'use strict';

  // Configuración y preferencias del usuario
  const prefs = {
    theme: localStorage.getItem('biblia_theme') || 'light',
    size: localStorage.getItem('biblia_font_size') || 'md',
    font: localStorage.getItem('biblia_font_family') || 'serif',
    width: localStorage.getItem('biblia_reading_width') || 'normal'
  };

  // Identificar el archivo y libro actual
  const currentFilename = window.location.pathname.split('/').pop() || '';
  let currentBook = null;
  let currentBookIndex = -1;
  const availableBooks = (typeof BIBLIA_CATALOG !== 'undefined') ? BIBLIA_CATALOG.filter(b => b.available) : [];

  if (typeof BIBLIA_CATALOG !== 'undefined') {
    currentBookIndex = availableBooks.findIndex(b => b.file.toLowerCase() === currentFilename.toLowerCase());
    if (currentBookIndex !== -1) {
      currentBook = availableBooks[currentBookIndex];
    }
  }

  const prevBook = (currentBookIndex > 0) ? availableBooks[currentBookIndex - 1] : null;
  const nextBook = (currentBookIndex !== -1 && currentBookIndex < availableBooks.length - 1) ? availableBooks[currentBookIndex + 1] : null;

  // Aplicar preferencias al DOM
  function applyPreferences() {
    document.documentElement.setAttribute('data-theme', prefs.theme);
    document.documentElement.setAttribute('data-reading-size', prefs.size);
    document.documentElement.setAttribute('data-reading-font', prefs.font);
    document.documentElement.setAttribute('data-reading-width', prefs.width);

    localStorage.setItem('biblia_theme', prefs.theme);
    localStorage.setItem('biblia_font_size', prefs.size);
    localStorage.setItem('biblia_font_family', prefs.font);
    localStorage.setItem('biblia_reading_width', prefs.width);
  }

  // Crear e inyectar la barra de progreso de lectura
  function injectProgressBar() {
    if (document.getElementById('reading-progress-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'reading-progress-bar';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // Toast / Notificación flotante
  function showToast(message) {
    let toast = document.getElementById('reader-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'reader-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--bg-surface-elevated);
        color: var(--text-main);
        border: 1px solid var(--accent-primary);
        padding: 12px 24px;
        border-radius: var(--radius-full);
        box-shadow: var(--shadow-lg);
        font-family: var(--font-ui);
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 2000;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        text-align: center;
        max-width: 90vw;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.pointerEvents = 'auto';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.pointerEvents = 'none';
    }, 4000);
  }

  // Interceptar enlaces a archivos que no existen para no dar 404
  function interceptMissingLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      // Verificar si es un enlace a otra página
      const targetFile = href.split('/').pop().split('#')[0];
      if (typeof BIBLIA_CATALOG !== 'undefined') {
        const matched = BIBLIA_CATALOG.find(b => b.file.toLowerCase() === targetFile.toLowerCase());
        if (matched && !matched.available) {
          e.preventDefault();
          showToast(`⚠️ <strong>${matched.title}</strong> aún no se encuentra digitalizado en este volumen. Puedes leer el texto sagrado en el <a href="https://www.vatican.va/archive/ESL0506/_INDEX.HTM" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); text-decoration: underline; font-weight: bold;">Vaticano (Vatican.va) ↗</a>`);
        }
      }
    });
  }

  // Crear e inyectar la barra superior del lector
  function injectTopBar() {
    if (document.querySelector('.reader-topbar')) return;

    const bookTitle = currentBook ? currentBook.title : document.title;
    const tomoText = currentBook ? `${currentBook.tomoLabel} · ${currentBook.categoryLabel}` : 'Biblia Comentada';

    const prevHref = prevBook ? `./${prevBook.file}` : '#';
    const nextHref = nextBook ? `./${nextBook.file}` : '#';

    const topbar = document.createElement('header');
    topbar.className = 'reader-topbar';
    topbar.innerHTML = `
      <div class="reader-topbar-inner">
        <div class="reader-nav-left">
          <a href="../index.html" class="btn-back-portal" title="Regresar al catálogo principal">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
            </svg>
            <span>Índice General</span>
          </a>
          <div class="reader-book-identity">
            <span class="reader-book-meta">${tomoText}</span>
            <span class="reader-book-title">${bookTitle}</span>
          </div>
        </div>

        <nav class="reader-book-nav" aria-label="Navegación entre libros">
          <a href="${prevHref}" class="btn-book-nav ${!prevBook ? 'disabled' : ''}" title="${prevBook ? 'Libro anterior: ' + prevBook.title : 'No hay libro anterior'}">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            <span>Anterior</span>
          </a>
          <a href="${nextHref}" class="btn-book-nav ${!nextBook ? 'disabled' : ''}" title="${nextBook ? 'Siguiente libro: ' + nextBook.title : 'No hay libro posterior'}">
            <span>Siguiente</span>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          </a>
        </nav>

        <div class="reader-controls-right">
          <!-- Enlace a la Biblia Oficial del Vaticano (Solo texto sin comentarios) -->
          <a href="https://www.vatican.va/archive/ESL0506/_INDEX.HTM" target="_blank" rel="noopener noreferrer" class="reader-tool-btn btn-vatican-reader" title="Leer únicamente el texto bíblico oficial sin comentarios en el Vaticano (El Libro del Pueblo de Dios)">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4H8v-2h3V7h2v3h3v2h-3v4z"/>
            </svg>
            <span>Biblia Vaticano</span>
          </a>

          <button id="btn-toggle-toc" class="reader-tool-btn" title="Ver índice de secciones y capítulos">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>Índice</span>
          </button>

          <button id="btn-toggle-settings" class="reader-tool-btn" title="Ajustes de visualización y tema">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            </svg>
            <span>Ajustes</span>
          </button>

          <div id="reader-settings-menu" class="reader-settings-panel">
            <div>
              <div class="settings-group-title">Tema de Lectura</div>
              <div class="settings-btn-row">
                <button class="setting-pill-btn ${prefs.theme === 'light' ? 'active' : ''}" data-pref-type="theme" data-pref-val="light">☀️ Claro</button>
                <button class="setting-pill-btn ${prefs.theme === 'sepia' ? 'active' : ''}" data-pref-type="theme" data-pref-val="sepia">📜 Sepia</button>
                <button class="setting-pill-btn ${prefs.theme === 'dark' ? 'active' : ''}" data-pref-type="theme" data-pref-val="dark">🌙 Oscuro</button>
              </div>
            </div>

            <div>
              <div class="settings-group-title">Tamaño de Letra</div>
              <div class="settings-btn-row">
                <button class="setting-pill-btn ${prefs.size === 'sm' ? 'active' : ''}" data-pref-type="size" data-pref-val="sm">A-</button>
                <button class="setting-pill-btn ${prefs.size === 'md' ? 'active' : ''}" data-pref-type="size" data-pref-val="md">A</button>
                <button class="setting-pill-btn ${prefs.size === 'lg' ? 'active' : ''}" data-pref-type="size" data-pref-val="lg">A+</button>
                <button class="setting-pill-btn ${prefs.size === 'xl' ? 'active' : ''}" data-pref-type="size" data-pref-val="xl">A++</button>
              </div>
            </div>

            <div>
              <div class="settings-group-title">Tipografía</div>
              <div class="settings-btn-row">
                <button class="setting-pill-btn ${prefs.font === 'serif' ? 'active' : ''}" data-pref-type="font" data-pref-val="serif">Serif (Clásica)</button>
                <button class="setting-pill-btn ${prefs.font === 'sans' ? 'active' : ''}" data-pref-type="font" data-pref-val="sans">Sans (Moderna)</button>
              </div>
            </div>

            <div>
              <div class="settings-group-title">Ancho de Columna</div>
              <div class="settings-btn-row">
                <button class="setting-pill-btn ${prefs.width === 'normal' ? 'active' : ''}" data-pref-type="width" data-pref-val="normal">Estándar</button>
                <button class="setting-pill-btn ${prefs.width === 'wide' ? 'active' : ''}" data-pref-type="width" data-pref-val="wide">Amplio</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.prepend(topbar);

    // Conectar eventos del panel de ajustes
    const settingsBtn = document.getElementById('btn-toggle-settings');
    const settingsMenu = document.getElementById('reader-settings-menu');

    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!settingsMenu.contains(e.target) && e.target !== settingsBtn) {
        settingsMenu.classList.remove('active');
      }
    });

    settingsMenu.querySelectorAll('.setting-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.prefType;
        const val = btn.dataset.prefVal;
        prefs[type] = val;
        applyPreferences();

        // Actualizar estados activos dentro del grupo
        btn.parentElement.querySelectorAll('.setting-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // Generar el cajón de Índice de Secciones (TOC Drawer)
  function injectTocDrawer() {
    if (document.getElementById('toc-drawer-overlay')) return;

    // Escanear anclas y títulos existentes
    const anchors = [];
    const elements = document.querySelectorAll('.biblia-content a[name], .biblia-content font[color="#800000"] p, .biblia-content font[color="#0000ff"] p');

    elements.forEach((el, idx) => {
      let name = el.getAttribute('name') || el.textContent.trim();
      name = name.replace(/[_\.]/g, ' ').trim();
      if (name.length > 2 && !name.startsWith('Toc') && !anchors.some(a => a.name === name)) {
        if (!el.id) {
          el.id = 'sec-' + idx;
        }
        anchors.push({
          id: el.getAttribute('name') ? el.getAttribute('name') : el.id,
          name: name
        });
      }
    });

    const overlay = document.createElement('div');
    overlay.id = 'toc-drawer-overlay';
    overlay.className = 'toc-drawer-overlay';

    const itemsHtml = anchors.length > 0
      ? anchors.map(a => `<a href="#${encodeURIComponent(a.id)}" class="toc-item-link">${a.name}</a>`).join('')
      : '<div style="padding: 1rem; color: var(--text-muted);">Este libro no contiene subdivisiones adicionales con anclajes.</div>';

    overlay.innerHTML = `
      <aside class="toc-drawer" aria-label="Índice de Secciones">
        <div class="toc-drawer-header">
          <h3 class="toc-drawer-title">Índice del Libro</h3>
          <button id="btn-close-toc" class="toc-close-btn" aria-label="Cerrar índice">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
        <div class="toc-search-box">
          <input type="text" id="toc-filter-input" class="toc-search-input" placeholder="Filtrar secciones..." />
        </div>
        <div class="toc-drawer-content" id="toc-list-content">
          ${itemsHtml}
        </div>
      </aside>
    `;

    document.body.appendChild(overlay);

    const toggleBtn = document.getElementById('btn-toggle-toc');
    const closeBtn = document.getElementById('btn-close-toc');
    const filterInput = document.getElementById('toc-filter-input');
    const listContent = document.getElementById('toc-list-content');

    function openToc() {
      overlay.classList.add('active');
      if (filterInput) filterInput.focus();
    }

    function closeToc() {
      overlay.classList.remove('active');
    }

    toggleBtn.addEventListener('click', openToc);
    closeBtn.addEventListener('click', closeToc);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeToc();
    });

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeToc();
    });

    // Cerrar al hacer clic en un link del TOC
    listContent.querySelectorAll('.toc-item-link').forEach(link => {
      link.addEventListener('click', () => {
        closeToc();
      });
    });

    // Filtro instantáneo dentro del TOC
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        listContent.querySelectorAll('.toc-item-link').forEach(link => {
          const text = link.textContent.toLowerCase();
          link.style.display = text.includes(query) ? 'block' : 'none';
        });
      });
    }
  }

  // Inyectar tarjeta inferior de navegación al final de la lectura
  function injectBottomNav() {
    if (document.querySelector('.reader-bottom-nav-card')) return;

    const bookTitle = currentBook ? currentBook.title : document.title;
    const prevHref = prevBook ? `./${prevBook.file}` : '#';
    const nextHref = nextBook ? `./${nextBook.file}` : '#';

    const card = document.createElement('div');
    card.className = 'reader-bottom-nav-card';
    card.innerHTML = `
      <h3 class="reader-bottom-nav-title">Fin del Comentario de ${bookTitle}</h3>
      <p class="reader-bottom-nav-sub">Continúa la lectura teológica navegando al siguiente libro o regresa al catálogo general.</p>
      <div class="reader-bottom-nav-actions">
        ${prevBook ? `<a href="${prevHref}" class="btn-book-nav">← Anterior: ${prevBook.shortTitle}</a>` : ''}
        <a href="../index.html" class="btn-back-portal">Catálogo General</a>
        ${nextBook ? `<a href="${nextHref}" class="card-action-btn">Siguiente: ${nextBook.shortTitle} →</a>` : ''}
      </div>
      <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); display: flex; flex-direction: column; align-items: center; gap: 0.65rem;">
        <div style="font-size: 0.88rem; color: var(--text-secondary); text-align: center;">
          🏛️ <strong>¿Prefieres leer solo el texto bíblico sin comentarios?</strong> Visita la versión oficial de la Santa Sede:
          <a href="https://www.vatican.va/archive/ESL0506/_INDEX.HTM" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); font-weight: 700; text-decoration: underline;">
            El Libro del Pueblo de Dios (Vatican.va) ↗
          </a>
        </div>
        <div style="font-size: 0.88rem; color: var(--text-secondary);">
          📖 <strong>Lectura Diaria de la Biblia Católica:</strong> Únete al grupo de Telegram en <a href="https://t.me/labiblia365" target="_blank" rel="noopener noreferrer" style="color: #229ED9; font-weight: 700; text-decoration: underline;">t.me/labiblia365</a>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          Desarrollado y adaptado por <strong>Alejandro Garcia Garay (c) 2026</strong> · <a href="mailto:agarciagaray.dev@gmail.com" style="color: var(--text-secondary); text-decoration: underline;">agarciagaray.dev@gmail.com</a>
        </div>
      </div>
    `;

    const contentContainer = document.querySelector('.biblia-content') || document.body;
    contentContainer.appendChild(card);
  }

  // Inyectar botón flotante Volver Arriba
  function injectFloatingTopButton() {
    if (document.getElementById('btn-floating-top')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-floating-top';
    btn.className = 'btn-floating-top';
    btn.setAttribute('aria-label', 'Subir al inicio');
    btn.setAttribute('title', 'Subir al inicio');
    btn.innerHTML = `
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/>
      </svg>
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Atajos de teclado para navegación entre libros (Alt + Flecha Izquierda / Derecha)
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'ArrowLeft' && prevBook) {
        window.location.href = `./${prevBook.file}`;
      } else if (e.altKey && e.key === 'ArrowRight' && nextBook) {
        window.location.href = `./${nextBook.file}`;
      }
    });
  }

  // Sanitizar artefactos de etiquetas FrontPage antiguas (sup huérfanos que envuelven párrafos o bloques)
  function sanitizeMalformedElements() {
    const content = document.querySelector('.biblia-content');
    if (!content) return;

    // Desempaquetar cualquier <sup> que contenga elementos de bloque (p, dir, div, table)
    const sups = content.querySelectorAll('sup');
    sups.forEach(sup => {
      if (sup.querySelector('p, dir, div, table, blockquote, ul, ol')) {
        const parent = sup.parentNode;
        if (parent) {
          while (sup.firstChild) {
            parent.insertBefore(sup.firstChild, sup);
          }
          parent.removeChild(sup);
        }
      }
    });
  }

  // Inicializar componentes cuando el DOM esté listo
  function init() {
    sanitizeMalformedElements();
    applyPreferences();
    injectProgressBar();
    injectTopBar();
    injectTocDrawer();
    injectBottomNav();
    injectFloatingTopButton();
    setupKeyboardShortcuts();
    interceptMissingLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
