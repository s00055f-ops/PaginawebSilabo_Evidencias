/* ============================================================
   PORTAFOLIO ACADÉMICO – GERENCIA DE SISTEMAS DE INFORMACIÓN
   Universidad Peruana Los Andes · 2026-I
   app.js – Lógica principal e interactividad
   ============================================================ */

/* ── 1. CONFIGURACIÓN GLOBAL ──────────────────────────────── */

// Total de semanas del curso (para cálculo de progreso)
const TOTAL_SEMANAS = 16;

// Porcentaje de progreso actual (0–100).
// Cambia este valor según el avance real del semestre.
// Ejemplo: si van 8 semanas completadas → (8/16)*100 = 50
const PROGRESO_ACTUAL = 65; // 65% como ejemplo

/* ── 2. DATOS DE BÚSQUEDA ─────────────────────────────────── */
// Arreglo de semanas y temas para el buscador.
// Para agregar nuevas semanas: copiar un objeto y modificar.
const datosBusqueda = [
  { semana: 1, titulo: "La Información en la Empresa",      temas: "sistemas información tipos componentes", id: "semana1" },
  { semana: 2, titulo: "Computación en la Nube",            temas: "cloud computing IaaS PaaS SaaS despliegue", id: "semana2" },
  { semana: 3, titulo: "Administración en la Nube",         temas: "funciones tecnología virtualización docker", id: "semana3" },
  { semana: 4, titulo: "Infraestructura de TI",             temas: "componentes hardware software red tipos", id: "semana4" },
  { semana: 5, titulo: "Sistemas de Información en Negocios", temas: "inteligencia negocios bases datos BI ETL", id: "semana5" },
  { semana: 6, titulo: "Estructura Informática Integral",   temas: "SIG diseño arquitectura KPI gerencial", id: "semana6" },
  { semana: 7, titulo: "Aplicaciones Empresariales ERP CRM SCM", temas: "SAP Salesforce EAS SIG integración", id: "semana7" },
  { semana: 8, titulo: "Gestión de Aplicaciones Nube Híbrida", temas: "hybrid cloud OpenShift kubernetes migración", id: "semana8" },
  { semana: 9, titulo: "Gobierno de TI",                    temas: "COBIT alineamiento estratégico valor procesos ISACA", id: "semana9" },
  { semana: 10, titulo: "Gestión de Servicios ITIL",        temas: "ITIL v4 estrategia servicio ITSM ServiceNow", id: "semana10" },
  { semana: 11, titulo: "Diseño y Transición del Servicio", temas: "SLA OLA CMDB disponibilidad capacidad", id: "semana11" },
  { semana: 12, titulo: "Cambio, Conocimiento e Incidencias", temas: "RFC CAB change management help desk centro", id: "semana12" },
  { semana: 13, titulo: "Ciclo de Vida y Metodologías",     temas: "SDLC Scrum agil kanban XP burndown sprint", id: "semana13" },
  { semana: 14, titulo: "Implementación de Sistemas",       temas: "despliegue migración capacitación rollout ERP", id: "semana14" },
  { semana: 15, titulo: "Proyecto Práctico",                temas: "sistema integrador desarrollo software documentación", id: "semana15" },
  { semana: 16, titulo: "Exposición del Proyecto",          temas: "sustentación final presentación demo evaluación", id: "semana16" },
];

/* ── 3. INICIALIZACIÓN ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initProgress();
  initSearch();
  initSidebarHighlight();
  initBackToTop();
  initHamburger();
});

/* ── 4. TEMA OSCURO / CLARO ───────────────────────────────── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Recuperar preferencia guardada o usar preferencia del sistema
  const saved = localStorage.getItem('gsi-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('gsi-theme', next);
  });

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ── 5. PARTÍCULAS ANIMADAS EN EL HERO ───────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  // Crear 18 partículas con tamaños y posiciones aleatorias
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 60 + 10;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${Math.random() * 6 + 5}s;
      --delay: ${Math.random() * -8}s;
    `;
    container.appendChild(p);
  }
}

/* ── 6. BARRAS DE PROGRESO ────────────────────────────────── */
function initProgress() {
  // Animar con pequeño retardo para que la animación CSS sea visible
  setTimeout(() => {
    // Barra hero
    const heroFill = document.getElementById('heroFill');
    const heroPct  = document.getElementById('heroPct');
    if (heroFill) heroFill.style.width = PROGRESO_ACTUAL + '%';
    if (heroPct)  heroPct.textContent  = PROGRESO_ACTUAL + '%';

    // Barra sidebar
    const spFill   = document.getElementById('sidebarFill');
    const spPct    = document.getElementById('sidebarPercent');
    if (spFill) spFill.style.width = PROGRESO_ACTUAL + '%';
    if (spPct)  spPct.textContent  = PROGRESO_ACTUAL + '%';
  }, 400);
}

/* ── 7. BUSCADOR DE SEMANAS ───────────────────────────────── */
function initSearch() {
  const input   = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { closeSearch(); return; }

    const matches = datosBusqueda.filter(d =>
      d.titulo.toLowerCase().includes(q) ||
      d.temas.toLowerCase().includes(q)  ||
      String(d.semana).includes(q)
    );

    if (!matches.length) {
      results.innerHTML = `<div class="sr-item"><i class="fas fa-search-minus"></i> Sin resultados para "${q}"</div>`;
    } else {
      results.innerHTML = matches.map(m => `
        <div class="sr-item" onclick="goToSemana('${m.id}')">
          <i class="fas fa-calendar-week"></i>
          <strong>Semana ${m.semana}</strong> · ${m.titulo}
        </div>
      `).join('');
    }
    results.classList.add('active');
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      closeSearch();
    }
  });

  // Navegar con teclado
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); input.blur(); }
  });
}

function closeSearch() {
  const results = document.getElementById('searchResults');
  if (results) results.classList.remove('active');
}

// Navegar a una semana y abrirla automáticamente
function goToSemana(id) {
  closeSearch();
  const el = document.getElementById(id);
  if (!el) return;

  // Desplazamiento suave
  const offset = 80; // altura navbar
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });

  // Abrir el acordeón si está cerrado
  setTimeout(() => {
    const header = el.querySelector('.wc-header');
    const body   = el.querySelector('.wc-body');
    if (header && body && !body.classList.contains('open')) {
      openWeek(header, body);
    }
    // Resaltar brevemente la tarjeta
    el.style.outline = '2px solid var(--accent)';
    setTimeout(() => { el.style.outline = ''; }, 2000);
  }, 600);

  // Limpiar campo de búsqueda
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
}

/* ── 8. ACORDEÓN DE SEMANAS ───────────────────────────────── */

/**
 * Función llamada al hacer clic en el encabezado de una semana.
 * @param {HTMLElement} header - El elemento .wc-header clickeado
 */
function toggleWeek(header) {
  const body = header.nextElementSibling;
  if (!body || !body.classList.contains('wc-body')) return;

  if (body.classList.contains('open')) {
    closeWeek(header, body);
  } else {
    openWeek(header, body);
  }
}

function openWeek(header, body) {
  header.classList.add('open');
  body.classList.add('open');
}

function closeWeek(header, body) {
  header.classList.remove('open');
  body.classList.remove('open');
}

/* ── 9. RESALTAR ENLACE ACTIVO EN SIDEBAR ────────────────── */
function initSidebarHighlight() {
  const links = document.querySelectorAll('.sidebar-link');
  const sections = [
    'inicio', 'semana1','semana2','semana3','semana4',
    'semana5','semana6','semana7','semana8',
    'semana9','semana10','semana11','semana12',
    'semana13','semana14','semana15','semana16'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const id = entry.target.id;
        const activeLink = document.querySelector(`.sidebar-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/* ── 10. BOTÓN "VOLVER ARRIBA" ────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 11. MENÚ HAMBURGUESA (MÓVIL) ────────────────────────── */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Cerrar al hacer clic en un enlace del menú móvil
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

/* ── 12. VISOR DE PDF ─────────────────────────────────────── */

/**
 * Abrir el modal de PDF.
 * @param {string} filename - Nombre del archivo PDF (debe estar en la misma carpeta)
 */
function openPDF(filename) {
  const modal     = document.getElementById('pdfModal');
  const overlay   = document.getElementById('pdfOverlay');
  const frame     = document.getElementById('pdfFrame');
  const title     = document.getElementById('pdfModalTitle');
  const placeholder = document.getElementById('pdfPlaceholder');

  if (!modal) return;

  title.innerHTML = `<i class="fas fa-file-pdf" style="color:#DC2626"></i> ${filename}`;

  // Intentar cargar el PDF; si no existe, mostrar placeholder
  frame.src = filename;
  frame.style.display = 'block';
  placeholder.style.display = 'none';

  // Si el iframe falla (archivo no encontrado), mostrar placeholder
  frame.onerror = () => {
    frame.style.display = 'none';
    placeholder.style.display = 'flex';
  };

  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Cerrar el modal de PDF.
 */
function closePDF() {
  const modal   = document.getElementById('pdfModal');
  const overlay = document.getElementById('pdfOverlay');
  const frame   = document.getElementById('pdfFrame');

  if (!modal) return;
  modal.classList.remove('open');
  overlay.classList.remove('open');
  frame.src = '';
  document.body.style.overflow = '';
}

// Cerrar modal PDF con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePDF();
});

/* ── 13. ANIMACIONES DE ENTRADA (Intersection Observer) ──── */
// Animar secciones al hacer scroll
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.unit-header').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  animObserver.observe(el);
});

/* ── 14. SCROLL SUAVE PARA TODOS LOS ANCLAJES ────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 15. CONSOLA DE AYUDA ─────────────────────────────────── */
// Instrucciones para el desarrollador en la consola del navegador
console.log(
  '%c📚 Portafolio GSI – UPLA 2026-I\n' +
  '%cPara agregar evidencias:\n' +
  '• Sube imágenes a la carpeta del proyecto\n' +
  '• Reemplaza los <div class="gallery-placeholder"> por <img src="tu-imagen.jpg">\n' +
  '• Sube archivos PDF con el nombre indicado en openPDF()\n' +
  '• Ajusta PROGRESO_ACTUAL en app.js para actualizar la barra de progreso\n' +
  '• Modifica datosBusqueda[] para mejorar los resultados del buscador',
  'font-weight:bold;font-size:14px;color:#2563EB;',
  'color:#334155;font-size:12px;'
);
