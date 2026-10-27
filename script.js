'use strict';

/* ─── NAVBAR scroll ───────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── BURGER menú móvil ───────────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.nav__links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── SCROLL ANIMATIONS ───────────────────────────────────── */
const aosObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.aosDelay || 0);
      setTimeout(() => e.target.classList.add('aos-on'), delay);
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

/* ─── TABS servicios académicos ───────────────────────────── */
const tabs   = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    panels.forEach(p => {
      const show = p.dataset.panel === tab.dataset.tab;
      p.classList.toggle('active', show);
      p.style.display = show ? 'block' : 'none';
      if (show) {
        p.querySelectorAll('[data-aos]').forEach(el => {
          el.classList.remove('aos-on');
          void el.offsetWidth;
          aosObs.observe(el);
        });
      }
    });
  });
});

/* ─── TABS formulario ─────────────────────────────────────── */
const ftabs  = document.querySelectorAll('.ftab');
const fforms = document.querySelectorAll('.form');
ftabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.ftab;
    ftabs.forEach(t => t.classList.toggle('active', t === tab));
    fforms.forEach(f => {
      const show = f.dataset.fpanel === target;
      f.classList.toggle('active', show);
      f.style.display = show ? 'block' : 'none';
    });
  });
});

/* ─── SELECTOR "Otra institución" ─────────────────────────── */
const selInst = document.getElementById('fi');
const fgOtra  = document.getElementById('fg-otra');
if (selInst && fgOtra) {
  selInst.addEventListener('change', () => {
    const show = selInst.value === 'otra';
    fgOtra.classList.toggle('hidden', !show);
    const inp = fgOtra.querySelector('input');
    if (inp) inp.required = show;
  });
}

/* ─── FILE INPUT label ────────────────────────────────────── */
const fileInput = document.getElementById('files');
if (fileInput) {
  const span = fileInput.closest('.file-drop')?.querySelector('label span');
  fileInput.addEventListener('change', () => {
    const n = fileInput.files.length;
    if (span) span.textContent = n
      ? `${n} archivo${n > 1 ? 's' : ''} seleccionado${n > 1 ? 's' : ''}`
      : 'Seleccionar o arrastrar archivos';
  });
}

/* ─── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.getBoundingClientRect().height + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ─── NAV link activo ─────────────────────────────────────── */
const secs  = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav__links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY + 130 >= s.offsetTop) cur = s.id; });
  navAs.forEach(a => {
    const on = a.getAttribute('href') === `#${cur}`;
    a.style.color = on ? 'var(--blue)' : '';
    a.style.background = on ? 'var(--blue-xl)' : '';
    a.style.borderRadius = on ? '8px' : '';
  });
}, { passive: true });

/* ─── BACK TO TOP ─────────────────────────────────────────── */
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 500), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── FORMULARIOS (sin backend) ───────────────────────────── */
document.querySelectorAll('.form').forEach(f => {
  f.addEventListener('submit', e => { e.preventDefault(); alert('Escríbenos por WhatsApp al 324 654 1604 para enviar tu solicitud.'); });
});

/* ── CONTADOR ANIMADO de números en Quiénes somos ───────── */
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  el.classList.add('counting');
  const run = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(run);
    else { el.textContent = target; el.classList.remove('counting'); }
  };
  requestAnimationFrame(run);
}

// Disparar contadores cuando entran al viewport
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateCount(el, parseInt(el.dataset.count));
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

/* ================================================================
   MODAL DE DESCRIPCIÓN AL CLIC EN ÍCONOS DE SERVICIO
================================================================ */

// Base de datos de servicios — ícono, título, descripción, bullets
const SVC_DATA = {
  /* ── Servicios académicos ── */
  pencil: {
    icon: 'ti ti-pencil', color: '#1677FF',
    title: 'Asesoría para actividades académicas',
    desc: 'Te ayudamos a entender y desarrollar cualquier actividad universitaria: desde interpretar la guía del docente hasta revisar el documento antes de entregarlo.',
    items: ['Interpretación de rúbricas y guías', 'Estructuración y organización de ideas', 'Acompañamiento durante todo el proceso', 'Revisión final antes de la entrega']
  },
  notes: {
    icon: 'ti ti-notes', color: '#7C3AED',
    title: 'Informes, ensayos y reseñas',
    desc: 'Elaboramos documentos académicos completos: informes, ensayos argumentativos, reseñas críticas, artículos y estudios de caso con fuentes verificadas.',
    items: ['Ensayos con argumento sólido', 'Informes técnicos y de práctica', 'Reseñas críticas y análisis de texto', 'Estudios de caso estructurados']
  },
  'adjustments-check': {
    icon: 'ti ti-adjustments-check', color: '#059669',
    title: 'Organización y formato documental',
    desc: 'Damos forma y estructura formal a tu documento: portada, índice, bibliografía, corrección de redacción y formato exacto según lo pida el docente.',
    items: ['Portadas, índices y tablas de contenido', 'Corrección ortográfica y gramatical', 'Formato Word, PDF o según indicaciones', 'Aplicación de normas institucionales']
  },
  presentation: {
    icon: 'ti ti-presentation', color: '#D97706',
    title: 'Presentaciones en PowerPoint',
    desc: 'Creamos diapositivas profesionales para tus sustentaciones y exposiciones universitarias: diseño claro, contenido bien organizado y material visual de apoyo.',
    items: ['Diseño visual ordenado y profesional', 'Integración de gráficos y tablas', 'Diapositivas para presentación oral', 'Entrega en PPT, PDF o Google Slides']
  },
  'chart-infographic': {
    icon: 'ti ti-chart-infographic', color: '#DC2626',
    title: 'Infografías y recursos visuales',
    desc: 'Diseñamos infografías académicas, cuadros comparativos, sinópticos y líneas de tiempo para trabajos, carteleras y material de apoyo en clase.',
    items: ['Infografías temáticas', 'Cuadros comparativos y sinópticos', 'Líneas de tiempo ilustradas', 'Material visual para carteleras']
  },
  'binary-tree': {
    icon: 'ti ti-binary-tree', color: '#0891B2',
    title: 'Mapas y diagramas conceptuales',
    desc: 'Creamos mapas mentales, mapas conceptuales y diagramas de flujo que organizan la información visualmente y facilitan el aprendizaje.',
    items: ['Mapas mentales y conceptuales', 'Diagramas de flujo de procesos', 'Material de apoyo para sustentaciones', 'Formato editable o imagen final']
  },
  database: {
    icon: 'ti ti-database', color: '#1677FF',
    title: 'Bases de datos y SQL',
    desc: 'Modelado relacional, diagramas entidad-relación y consultas SQL para asignaturas de ingeniería de sistemas o administración de datos.',
    items: ['Diagramas entidad-relación (DER)', 'Consultas SQL y procedimientos almacenados', 'Normalización de tablas', 'Documentación del proyecto de BD']
  },
  code: {
    icon: 'ti ti-code', color: '#7C3AED',
    title: 'Ejercicios de programación',
    desc: 'Desarrollamos y explicamos ejercicios de programación en los lenguajes más usados en universidades. Cada solución incluye comentarios para entenderla.',
    items: ['Python, Java, C# y C++', 'HTML, CSS y JavaScript', 'Algoritmos y estructuras de datos', 'Explicación línea por línea del código']
  },
  'hierarchy-2': {
    icon: 'ti ti-hierarchy-2', color: '#059669',
    title: 'Diagramas UML y arquitectura',
    desc: 'Elaboramos diagramas UML completos para proyectos de software: clases, secuencia, casos de uso, componentes y arquitectura de sistemas.',
    items: ['Diagramas de clases, secuencia y casos de uso', 'Arquitectura de sistemas', 'Diagramas de infraestructura de redes', 'Documentación técnica del proyecto']
  },
  table: {
    icon: 'ti ti-table', color: '#D97706',
    title: 'Excel y análisis de datos',
    desc: 'Diseñamos hojas de cálculo con fórmulas avanzadas, tablas dinámicas y gráficos estadísticos para prácticas, proyectos e informes académicos.',
    items: ['Fórmulas y funciones avanzadas', 'Tablas dinámicas y gráficos', 'Análisis estadístico básico', 'Informes y dashboards en Excel']
  },
  'world-www': {
    icon: 'ti ti-world-www', color: '#DC2626',
    title: 'Prototipos web',
    desc: 'Desarrollamos interfaces y prototipos funcionales en HTML, CSS y JavaScript para proyectos académicos de desarrollo de sistemas.',
    items: ['Maquetado HTML/CSS responsive', 'Interactividad con JavaScript', 'Documentación técnica del prototipo', 'Entrega con código comentado']
  },
  /* ── Normas ── */
  'book-2': {
    icon: 'ti ti-book-2', color: '#1677FF',
    title: 'Norma APA',
    desc: 'Aplicamos el estilo APA correctamente en citas, referencias, márgenes y espaciado. Nos ajustamos a la versión que indique el docente (APA 6 o APA 7).',
    items: ['Citas en texto y lista de referencias', 'Márgenes, fuente y espaciado APA', 'Adaptación a APA 6 o APA 7', 'Revisión completa del documento']
  },
  flag: {
    icon: 'ti ti-flag', color: '#059669',
    title: 'Norma ICONTEC',
    desc: 'Aplicamos la norma técnica colombiana NTC 1486 para trabajos escritos: portada, tabla de contenido, numeración, cuerpo y bibliografía.',
    items: ['Portada e índice ICONTEC', 'Márgenes y numeración normativos', 'Referencias y bibliografía', 'Formato según requisitos institucionales']
  },
  'circuit-cell': {
    icon: 'ti ti-circuit-cell', color: '#7C3AED',
    title: 'Norma IEEE',
    desc: 'Formato para documentos técnicos de ingeniería: estructura de artículo, numeración de secciones, referencias en corchetes y manejo de ecuaciones y figuras.',
    items: ['Estructura de artículo técnico IEEE', 'Referencias en formato IEEE', 'Figuras, tablas y ecuaciones', 'Revisión completa del documento']
  },
  university: {
    icon: 'ti ti-university', color: '#D97706',
    title: 'Plantillas institucionales',
    desc: 'Si tu universidad tiene un manual de estilo propio o plantilla descargable, la aplicamos siguiendo exactamente las instrucciones que nos compartas.',
    items: ['Plantillas propias de la institución', 'Instrucciones específicas del docente', 'Formato Word, PDF o el solicitado', 'Revisión de cumplimiento de requisitos']
  },
  /* ── Exposiciones ── */
  chalkboard: {
    icon: 'ti ti-chalkboard', color: '#1677FF',
    title: 'Organización de exposición',
    desc: 'Seleccionamos y estructuramos la información clave para que tu exposición tenga secuencia lógica, tiempo bien distribuido y mensaje claro para el evaluador.',
    items: ['Esquema de contenidos', 'Distribución del tiempo por sección', 'Hilo conductor claro', 'Revisión del guión antes de exponer']
  },
  script: {
    icon: 'ti ti-script', color: '#7C3AED',
    title: 'Guiones y resúmenes de estudio',
    desc: 'Elaboramos guiones para presentaciones orales, resúmenes por secciones y fichas de conceptos para preparar la sustentación con seguridad.',
    items: ['Guión para presentación oral', 'Resúmenes por secciones del tema', 'Fichas de conceptos clave', 'Material de repaso conciso']
  },
  'help-circle': {
    icon: 'ti ti-help-circle', color: '#059669',
    title: 'Preguntas de práctica',
    desc: 'Generamos preguntas frecuentes del tema, explicamos conceptos difíciles y preparamos material para que llegues a la sustentación con dominio del contenido.',
    items: ['Preguntas tipo evaluación', 'Explicación de conceptos complejos', 'Respuestas modelo para practicar', 'Material de repaso previo a la sustentación']
  },
  /* ── Soporte TI ── */
  tool: {
    icon: 'ti ti-tool', color: '#2563EB',
    title: 'Soporte técnico general',
    desc: 'Diagnóstico y solución de fallas en hardware y software. Identificamos el problema y aplicamos la solución más eficiente para tu equipo.',
    items: ['Diagnóstico de fallas de hardware', 'Solución de problemas de software', 'Atención remota o presencial', 'Informe del problema y solución aplicada']
  },
  'device-desktop-analytics': {
    icon: 'ti ti-device-desktop-analytics', color: '#2563EB',
    title: 'Mantenimiento preventivo y correctivo',
    desc: 'Limpieza interna, revisión de componentes y corrección de fallas físicas o lógicas para prolongar la vida útil del equipo y mejorar su rendimiento.',
    items: ['Limpieza interna del equipo', 'Revisión de componentes críticos', 'Corrección de fallas de software', 'Mejora del rendimiento general']
  },
  apps: {
    icon: 'ti ti-apps', color: '#2563EB',
    title: 'Instalación y configuración de software',
    desc: 'Sistemas operativos, suites de oficina, herramientas de desarrollo y aplicaciones especializadas configuradas correctamente desde el inicio.',
    items: ['Sistemas operativos Windows/Linux', 'Paquetes de oficina (Office, LibreOffice)', 'Herramientas de desarrollo', 'Configuración y activación correcta']
  },
  rocket: {
    icon: 'ti ti-rocket', color: '#2563EB',
    title: 'Optimización de equipos',
    desc: 'Mejora del rendimiento: limpieza de archivos innecesarios, actualización de controladores, ajuste del sistema y arranque más rápido.',
    items: ['Limpieza de archivos y registro', 'Actualización de drivers y sistema', 'Configuración del inicio de Windows', 'Aumento visible de velocidad del equipo']
  },
  headset: {
    icon: 'ti ti-headset', color: '#2563EB',
    title: 'Asistencia remota',
    desc: 'Nos conectamos de forma segura a tu equipo para resolver problemas de software sin necesidad de desplazamiento. Rápido y sin complicaciones.',
    items: ['Conexión segura a distancia', 'Resolución de problemas de software', 'Sin necesidad de trasladar el equipo', 'Disponible en cualquier momento acordado']
  },
  router: {
    icon: 'ti ti-router', color: '#2563EB',
    title: 'Configuración de redes',
    desc: 'Configuración de routers, solución de problemas de conectividad y redes domésticas u oficinas pequeñas para conexión estable y segura.',
    items: ['Configuración de router doméstico', 'Solución de problemas de wifi', 'Red cableada e inalámbrica', 'Seguridad básica de la red']
  },
  'table-column': {
    icon: 'ti ti-table-column', color: '#2563EB',
    title: 'Asesoría en herramientas digitales',
    desc: 'Capacitación práctica en Word, Excel, PowerPoint, Google Workspace y otras herramientas de productividad para mejorar tu rendimiento.',
    items: ['Word, Excel y PowerPoint', 'Google Docs, Sheets y Drive', 'Correo y herramientas de productividad', 'Clases prácticas paso a paso']
  }
};

/* ── Modal DOM ──────────────────────────────────────────────── */
const overlay   = document.getElementById('iconModal');
const modalClose = document.getElementById('modalClose');
const modalIco   = document.getElementById('modalIco');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');
const modalList  = document.getElementById('modalList');

function openModal(key) {
  const d = SVC_DATA[key];
  if (!d) return;

  modalIco.innerHTML   = `<i class="${d.icon}" style="color:${d.color}"></i>`;
  modalIco.style.background = d.color + '18';
  modalTitle.textContent = d.title;
  modalDesc.textContent  = d.desc;
  modalList.innerHTML    = d.items.map(i => `<li>${i}</li>`).join('');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── Detectar clic en íconos de card ──────────────────────── */
document.addEventListener('click', e => {
  // Buscar el ícono de Tabler más cercano
  const btn = e.target.closest('.svc-ico-btn');
  if (!btn) return;

  // Extraer el nombre del ícono desde la clase ti-XXXX
  const ico = btn.querySelector('[class*="ti-"]') || btn;
  const cls = [...ico.classList].find(c => c.startsWith('ti-') && c !== 'ti');
  if (!cls) return;

  const key = cls.replace('ti-', '');
  openModal(key);
});

/* ── Tilt 3D en tarjetas (solo desktop) ──────────────────── */
if (window.matchMedia('(min-width:768px) and (hover:hover)').matches) {
  document.querySelectorAll('.card, .tech-card, .step, .line-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `translateY(-5px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}
