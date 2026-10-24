# 📖 Biblia Comentada — BAC (Edición Digital Moderna)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://en.wikipedia.org/wiki/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://en.wikipedia.org/wiki/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25_Ready-brightgreen?style=for-the-badge)](https://developer.mozilla.org/es/docs/Web)
[![Telegram](https://img.shields.io/badge/Comunidad-Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/labiblia365)
[![License](https://img.shields.io/badge/License-Dominio_Público_/_Uso_Académico-lightgrey?style=for-the-badge)](#licencia)

> **Portal digital y visor editorial de la monumental *Biblia Comentada* de la Biblioteca de Autores Cristianos (BAC)**, desarrollada en 6 tomos por eminentes catedráticos y escrituristas de la Universidad Pontificia de Salamanca y las órdenes Dominicana y Franciscana.
>
> Adaptada a la web moderna, saneada, estructurada y rediseñada con ergonomía de lectura de última generación por **Alejandro Garcia Garay (c) 2026**.

---

## 🌟 Características Principales

* **🚀 Cero Dependencias y 100% Offline:** Desarrollada con HTML5 nativo, Vanilla CSS y JavaScript puro. No requiere Node.js, compiladores, ni servidores web para funcionar; basta con abrir `index.html` en cualquier navegador web o móvil.
* **📜 Ergonomía Editorial de Lectura:**
  * **Tipografía de alta legibilidad:** Fuentes optimizadas para textos sagrados y notas académicas (`Literata`, `Cinzel`, `Plus Jakarta Sans`).
  * **Ancho de línea calibrado:** Contenedor de lectura estándar a ~75 caracteres por línea para reducir la fatiga ocular, con opción de expandir a modo ancho.
  * **3 Temas de Color con Persistencia:**
    * ☀️ **Claro:** Fondo apergaminado limpio con tonos cálidos editoriales.
    * 📜 **Sepia:** Tono de papel de libro clásico con tinta espresso para lectura descansada.
    * 🌙 **Oscuro:** Modo nocturno con negros profundos, acentos carmesí y texto marfil para cero fatiga visual.
    * *Sincronización instantánea mediante `localStorage` en todos los libros.*
  * **Ajustes Personalizados:** Selector de tamaño de letra (`A-`, `A`, `A+`, `A++`), alternador de fuentes (Serif / Sans-serif) y ancho de columna.
* **🔍 Buscador en Tiempo Real con Normalización:**
  * Búsqueda instantánea en el catálogo por título, autor, tomo, abreviatura o descripción.
  * Insensible a tildes (encuentra *Isaías* o *Génesis* escribiendo `isaias` o `genesis`).
  * Atajo de teclado global: presiona <kbd>/</kbd> en cualquier momento para activar el buscador.
* **📑 Cajón de Índice de Secciones (TOC Drawer):**
  * Panel lateral desplegable en cada libro que escanea automáticamente capítulos, introducciones y anclas del texto para saltar directamente a cualquier sección.
  * Incluye buscador interno dentro del libro.
* **🧭 Navegación Fluida e Intuitiva:**
  * Barra de progreso de lectura superior que mide el avance en tiempo real.
  * Botones de avance y retroceso entre libros correlativos (`← Anterior` / `Siguiente →`).
  * Atajos de teclado: <kbd>Alt</kbd> + <kbd>←</kbd> (Libro anterior) y <kbd>Alt</kbd> + <kbd>→</kbd> (Libro siguiente).
  * Botón flotante para volver arriba con desplazamiento suave (*smooth scroll*).
  * Tarjeta inferior al concluir cada libro para continuar al siguiente volumen o volver al catálogo general.
* **📱 Diseño 100% Responsivo:** Adaptado a pantallas de escritorio, portátiles, tablets y smartphones.

---

## 🏛️ Estructura del Corpus Bíblico (6 Volúmenes BAC)

La obra comprende un corpus de **más de 18 megabytes de texto exegético versículo a versículo**:

| Tomo | Título del Volumen | Exégetas / Autores | Estado en el Proyecto |
| :--- | :--- | :--- | :---: |
| **Preliminar** | Prólogo General y Tablas de Abreviaturas | Alberto Colunga, O.P. & García Cordero, O.P. | ✅ Disponible |
| **Tomo I** | **Pentateuco** (Génesis a Deuteronomio) | Alberto Colunga, O.P. & García Cordero, O.P. | ✅ Disponible (Caps. base) |
| **Tomo II** | **Libros Históricos del A. T.** (Josué a Macabeos) | Luis Arnaldich, O.F.M. | ✅ Completo (11 libros) |
| **Tomo III** | **Libros Proféticos** (Isaías a Malaquías) | Maximiliano García Cordero, O.P. | ✅ Completo (18 libros) |
| **Tomo IV** | **Libros Sapienciales** (Job, Salmos, Proverbios, etc.) | Maximiliano García Cordero, O.P. | ✅ Completo (10 libros) |
| **Tomo V** | **Evangelios** (San Mateo, Marcos, Lucas, Juan) | Manuel de Tuya, O.P. | ⏳ San Mateo (1-9) disp. |
| **Tomo VI** | **Hechos, Epístolas y Apocalipsis** | Lorenzo Turrado | ⏳ Catalogado |

---

## 📂 Estructura de Archivos del Proyecto

```text
Biblia/
├── index.html               # Portal principal, buscador, tabs de tomos y catálogo
├── README.md                # Documentación oficial del proyecto
├── css/
│   ├── theme.css            # Tokens de diseño, tipografías y variables de temas (Claro/Sepia/Oscuro)
│   ├── portal.css           # Estilos de la portada, hero, cards, buscador y modales
│   └── reader.css           # Estilos editoriales del lector, barra sticky, drawer y tipografía
├── js/
│   ├── books-data.js        # Base de datos y catálogo maestro de los 65 libros/tratados
│   ├── portal.js            # Lógica del portal: búsqueda en vivo, filtros por tomo y vistas
│   └── reader.js            # Motor del lector: barra superior, progreso, TOC y preferencias
├── images/
│   └── icon_32.png          # Iconografía optimizada
└── pages/                   # 48 Libros en HTML5 semántico con el texto bíblico y exégesis
    ├── prologo.htm.html
    ├── libros_de_la_biblia.htm.html
    ├── Genesis_01-20.htm.html
    ├── Exodo_01-23.htm.html
    ├── Levitico.htm.html
    ├── Numeros.htm.html
    ├── deuteronomio.htm.html
    ├── Josue.htm.html
    ├── jueces.htm.html
    ├── rut.htm.html
    ├── samuel_1_y_2.htm.html
    ├── reyes_1_y_2.htm.html
    ├── cronica_1_y_2.htm.html
    ├── esdras_nehemias.htm.html
    ├── tobit.htm.html
    ├── judit.htm.html
    ├── ester.htm.html
    ├── macabeos_1_y_2.htm.html
    ├── profetas_introduccion.htm.html
    ├── profetas_isaias.htm.html
    ├── profetas_jeremias.htm.html
    ├── profetas_lamentaciones.htm.html
    ├── profetas_baruc.htm.html
    ├── profetas_ezequiel.htm.html
    ├── profetas_daniel.htm.html
    ├── profetas_oseas.htm.html
    ├── profetas_joel.htm.html
    ├── profetas_amos.htm.html
    ├── profetas_abdias.htm.html
    ├── profetas_jonas.htm.html
    ├── profetas_miqueas.htm.html
    ├── profetas_nahum.htm.html
    ├── profetas_habacuc.htm.html
    ├── profetas_sofonias.htm.html
    ├── profetas_ageo.htm.html
    ├── profetas_zacarias.htm.html
    ├── profetas_malaquias.htm.html
    ├── sapienciales_introduccion.htm.html
    ├── sapienciales_libro_de_job.htm.html
    ├── sapienciales_salmos_000-050.htm.html
    ├── sapienciales_salmos_051-099.htm.html
    ├── sapienciales_salmos_100-150.htm.html
    ├── sapienciales_proverbios.htm.html
    ├── sapienciales_eclesiastes.htm.html
    ├── sapienciales_cantar_de_los_cantares.htm.html
    ├── sapienciales_sabiduria.htm.html
    ├── sapienciales_eclesiastico.htm.html
    └── evang_mateo_00-09.htm.html
```

---

## 🚀 Instalación y Puesta en Marcha

No se requiere ninguna instalación de paquetes ni compilación previa. Puedes utilizar este proyecto de cualquiera de las siguientes formas:

### Opción 1: Uso Local Inmediato (Sin servidor)
1. Descarga el repositorio o clónalo con git:
   ```bash
   git clone https://github.com/TU_USUARIO/Biblia-Comentada-BAC.git
   ```
2. Entra a la carpeta del proyecto.
3. Haz doble clic en `index.html` para abrirlo directamente en tu navegador favorito (Chrome, Firefox, Edge, Safari, Brave, Opera).

### Opción 2: Servidor Local Ligero
Si prefieres servirlo mediante HTTP local:

* **Con Python:**
  ```bash
  # Python 3
  python -m http.server 8080
  ```
  Luego abre en tu navegador: `http://localhost:8080`

* **Con Node.js (npx):**
  ```bash
  npx serve .
  ```

* **Con VS Code:**
  Instala la extensión **Live Server** y haz clic en *"Go Live"* sobre `index.html`.

### Opción 3: Publicación Gratuita en GitHub Pages
1. Sube este repositorio a tu cuenta de GitHub.
2. Ve a **Settings > Pages**.
3. En **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
4. Haz clic en **Save**. En cuestión de segundos tu sitio estará disponible públicamente en `https://TU_USUARIO.github.io/Biblia-Comentada-BAC/`.

---

## ⌨️ Atajos de Teclado Útiles

| Atajo | Acción |
| :---: | :--- |
| <kbd>/</kbd> | Enfocar la barra de búsqueda en el catálogo principal |
| <kbd>Esc</kbd> | Cerrar el cajón de Índice (TOC), menú de ajustes o modales |
| <kbd>Alt</kbd> + <kbd>←</kbd> | Ir al libro anterior en el modo lectura |
| <kbd>Alt</kbd> + <kbd>→</kbd> | Ir al libro siguiente en el modo lectura |

---

## 🤝 Comunidad y Lectura Diaria

Te invitamos a sumarte a nuestro grupo en Telegram para el acompañamiento diario de la lectura de la Sagrada Escritura:

* 📱 **Comunidad en Telegram:** [t.me/labiblia365](https://t.me/labiblia365)
* 📖 **Plan:** *Lectura Diaria de la Biblia Católica en 365 Días*.

---

## 👤 Autoría y Créditos

* **Autores de la Exégesis Original:**
  * **Alberto Colunga, O.P.** (Catedrático de Sagrada Escritura en la Univ. Pontificia de Salamanca).
  * **Maximiliano García Cordero, O.P.** (Catedrático de Teología Bíblica).
  * **Luis Arnaldich, O.F.M.** (Catedrático de Sagrada Escritura).
  * **Manuel de Tuya, O.P.** (Catedrático de Teología Bíblica de los Evangelios).
  * **Lorenzo Turrado** (Catedrático de Sagrada Escritura y Secretario General de la Univ. Pontificia de Salamanca).
  * **Editorial Original:** *Biblioteca de Autores Cristianos (BAC)*, Madrid.

* **Desarrollo, Diseño UI/UX y Adaptación Digital:**
  * **Alejandro Garcia Garay (c) 2026**
  * ✉️ **Contacto / Correo:** [agarciagaray.dev@gmail.com](mailto:agarciagaray.dev@gmail.com)
  * 💬 **Telegram:** [@labiblia365](https://t.me/labiblia365)

---

## ⚖️ Licencia y Propósito

Este proyecto ha sido desarrollado con fines exclusivamente educativos, de difusión cultural, estudio teológico e investigación bíblica para la comunidad hispanohablante.
