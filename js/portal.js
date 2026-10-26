/**
 * Biblia Comentada - BAC
 * Lógica del Portal Principal (portal.js)
 */

(function () {
  'use strict';

  // Función utilitaria para normalizar texto (ignorar mayúsculas, minúsculas y tildes/acentos)
  function normalizeText(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  // Estado global de la aplicación
  const state = {
    currentCategory: 'todos',
    query: '',
    currentView: 'grid', // 'grid' | 'tomos'
    theme: localStorage.getItem('biblia_theme') || 'light'
  };

  // Elementos DOM
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const categoryTabs = document.querySelectorAll('.tab-pill');
  const booksContainer = document.getElementById('books-container');
  const resultsCountEl = document.getElementById('results-count');
  const viewGridBtn = document.getElementById('view-grid-btn');
  const viewTomosBtn = document.getElementById('view-tomos-btn');
  const themeBtns = document.querySelectorAll('.theme-btn');
  const modalOverlay = document.getElementById('pending-modal');
  const modalTitle = document.getElementById('modal-book-title');
  const modalDesc = document.getElementById('modal-book-desc');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  // Inicializar tema guardado
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('biblia_theme', theme);

    themeBtns.forEach(btn => {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Filtrar libros según categoría y búsqueda
  function getFilteredBooks() {
    const qNorm = normalizeText(state.query);

    return BIBLIA_CATALOG.filter(book => {
      // Filtro por categoría / tomo
      let matchesCategory = true;
      if (state.currentCategory !== 'todos') {
        if (state.currentCategory.startsWith('tomo-')) {
          const tomoNum = parseInt(state.currentCategory.replace('tomo-', ''), 10);
          matchesCategory = book.tomo === tomoNum;
        } else {
          matchesCategory = book.category === state.currentCategory;
        }
      }

      // Filtro por búsqueda (insensible a acentos y mayúsculas)
      let matchesSearch = true;
      if (qNorm !== '') {
        const fullText = normalizeText(
          `${book.title} ${book.shortTitle} ${book.abbr} ${book.author} ${book.description} ${book.chapters} ${book.tomoTitle} ${book.categoryLabel}`
        );
        matchesSearch = fullText.includes(qNorm);
      }

      return matchesCategory && matchesSearch;
    });
  }

  // Renderizar vista en mosaico (Grid de Cards)
  function renderGridView(books) {
    if (books.length === 0) {
      booksContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div class="empty-title">No se encontraron libros</div>
          <div class="empty-text">Intenta con otro término de búsqueda o selecciona otra categoría.</div>
          <button class="card-action-btn" id="btn-reset-filters">Restablecer filtros</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.query = '';
          state.currentCategory = 'todos';
          if (searchInput) searchInput.value = '';
          if (searchClearBtn) searchClearBtn.style.display = 'none';
          updateTabPills();
          render();
        });
      }
      return;
    }

    const html = books.map(book => {
      const isAvail = book.available;
      const statusClass = isAvail ? 'available' : 'pending';
      const statusText = isAvail ? 'Disponible' : 'En preparación';
      const targetHref = isAvail ? `./pages/${book.file}` : '#';
      const actionBtnHtml = isAvail
        ? `<a href="${targetHref}" class="card-action-btn">Leer Comentario <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg></a>`
        : `<button class="card-action-btn secondary btn-pending-notice" data-book-id="${book.id}">Ver detalles</button>`;

      return `
        <article class="book-card ${isAvail ? 'is-available' : 'is-pending'}" data-book-id="${book.id}">
          <div>
            <div class="card-header-meta">
              <span class="tomo-pill">${book.tomoLabel}</span>
              <span class="abbr-pill">${book.abbr}</span>
            </div>
            <h3 class="book-card-title">${book.title}</h3>
            <div class="book-card-author">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              <span>${book.author}</span>
            </div>
            <p class="book-card-desc">${book.description}</p>
          </div>
          <div class="book-card-footer">
            <span class="status-indicator ${statusClass}">
              <span class="status-dot"></span>
              ${statusText}
            </span>
            ${actionBtnHtml}
          </div>
        </article>
      `;
    }).join('');

    booksContainer.innerHTML = `<div class="books-grid">${html}</div>`;
    attachCardListeners();
  }

  // Renderizar vista agrupada por Tomos
  function renderTomosView(books) {
    if (books.length === 0) {
      renderGridView(books);
      return;
    }

    // Agrupar libros por tomo
    const groups = {};
    books.forEach(b => {
      const key = b.tomo;
      if (!groups[key]) {
        groups[key] = {
          tomo: b.tomo,
          tomoLabel: b.tomoLabel,
          tomoTitle: b.tomoTitle,
          author: b.author,
          items: []
        };
      }
      groups[key].items.push(b);
    });

    const groupsHtml = Object.values(groups).map(g => {
      const itemsHtml = g.items.map(book => {
        const isAvail = book.available;
        const targetHref = isAvail ? `./pages/${book.file}` : '#';
        const clickAttr = isAvail ? `href="${targetHref}"` : `href="#" class="tomo-list-item is-pending btn-pending-notice" data-book-id="${book.id}"`;

        return `
          <a ${clickAttr} class="tomo-list-item ${isAvail ? '' : 'is-pending'}">
            <div class="item-left">
              <span class="item-title">${book.title}</span>
              <span class="item-sub">${book.chapters}</span>
            </div>
            <span class="status-indicator ${isAvail ? 'available' : 'pending'}">
              <span class="status-dot"></span>
              ${isAvail ? 'Disponible' : 'Pendiente'}
            </span>
          </a>
        `;
      }).join('');

      return `
        <div class="tomo-group-card">
          <div class="tomo-group-header">
            <div class="tomo-title-area">
              <h2>${g.tomoLabel}: ${g.tomoTitle}</h2>
              <div class="tomo-author-info">Comentario por ${g.author}</div>
            </div>
            <span class="tomo-pill">${g.items.length} obras</span>
          </div>
          <div class="tomo-items-list">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');

    booksContainer.innerHTML = `<div class="tomos-section-view">${groupsHtml}</div>`;
    attachCardListeners();
  }

  // Vincular eventos a botones de aviso de libros pendientes
  function attachCardListeners() {
    const pendingBtns = document.querySelectorAll('.btn-pending-notice');
    pendingBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = btn.dataset.bookId;
        const book = BIBLIA_CATALOG.find(b => b.id === bookId);
        if (book) {
          openPendingModal(book);
        }
      });
    });
  }

  // Abrir modal de libro en preparación
  function openPendingModal(book) {
    if (!modalOverlay) return;
    modalTitle.textContent = book.title;
    modalDesc.innerHTML = `
      El volumen <strong>${book.title}</strong> (${book.tomoLabel}: ${book.tomoTitle}), comentado por <strong>${book.author}</strong>, forma parte del catálogo oficial de la obra pero <em>aún no ha sido digitalizado o no se encontraba incluido en este volcado local</em>.<br><br>
      Si deseas leer el texto sagrado de este u otros libros bíblicos sin comentarios, puedes acceder a la traducción oficial de la Santa Sede: <strong>El Libro del Pueblo de Dios</strong> (traducción argentina) en <a href="https://www.vatican.va/archive/ESL0506/_INDEX.HTM" target="_blank" rel="noopener noreferrer" style="color: var(--accent-gold); font-weight: 700; text-decoration: underline;">Vatican.va ↗</a>.<br><br>
      También puedes consultar los demás libros disponibles en esta misma sección o en los tomos ya digitalizados.
    `;
    modalOverlay.classList.add('active');
  }

  // Cerrar modal
  function closePendingModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }

  // Render principal
  function render() {
    const filtered = getFilteredBooks();
    const availableCount = filtered.filter(b => b.available).length;

    if (resultsCountEl) {
      resultsCountEl.innerHTML = `Mostrando <b>${filtered.length}</b> libros (${availableCount} disponibles)`;
    }

    if (state.currentView === 'grid') {
      renderGridView(filtered);
    } else {
      renderTomosView(filtered);
    }
  }

  // Actualizar clases activas en pestañas
  function updateTabPills() {
    categoryTabs.forEach(tab => {
      if (tab.dataset.category === state.currentCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  // Event Listeners
  function setupEventListeners() {
    // Selector de tema
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme);
      });
    });

    // Pestañas de categoría
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        state.currentCategory = tab.dataset.category;
        updateTabPills();
        render();
      });
    });

    // Búsqueda en vivo con soporte para texto normalizado
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.query = e.target.value;
        if (searchClearBtn) {
          searchClearBtn.style.display = state.query.length > 0 ? 'block' : 'none';
        }
        render();
      });

      // Atajo de teclado: presionar '/' para enfocar búsqueda
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    // Botón borrar búsqueda
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.query = '';
        searchClearBtn.style.display = 'none';
        render();
        searchInput.focus();
      });
    }

    // Alternador de Vistas (Grid vs Tomos)
    if (viewGridBtn && viewTomosBtn) {
      viewGridBtn.addEventListener('click', () => {
        state.currentView = 'grid';
        viewGridBtn.classList.add('active');
        viewTomosBtn.classList.remove('active');
        render();
      });

      viewTomosBtn.addEventListener('click', () => {
        state.currentView = 'tomos';
        viewTomosBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
        render();
      });
    }

    // Modal cerrar
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePendingModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closePendingModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closePendingModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePendingModal();
    });
  }

  // Actualizar conteos numéricos en las pestañas
  function populateTabCounts() {
    categoryTabs.forEach(tab => {
      const cat = tab.dataset.category;
      let count = 0;
      if (cat === 'todos') {
        count = BIBLIA_CATALOG.length;
      } else if (cat.startsWith('tomo-')) {
        const t = parseInt(cat.replace('tomo-', ''), 10);
        count = BIBLIA_CATALOG.filter(b => b.tomo === t).length;
      } else {
        count = BIBLIA_CATALOG.filter(b => b.category === cat).length;
      }
      const badge = tab.querySelector('.tab-count-badge');
      if (badge) badge.textContent = count;
    });
  }

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(state.theme);
    populateTabCounts();
    setupEventListeners();
    render();
  });
})();
