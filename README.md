# 🛹 SkateMap - Thrasher Style Spot Locator (TP8)

Prueba de Concepto (PoC) de datos georreferenciados para el **Trabajo Práctico N° 8** de *Análisis y Exploración de Datos* (Tecnicatura en Ciencia de Datos e Inteligencia Artificial).

La aplicación permite explorar, filtrar y registrar **Skateparks públicos**, **Spots callejeros** y **Skateshops** en Argentina, visualizándolos en un mapa interactivo con **deck.gl**, conectando cada punto con rutas directas en **Google Maps**, y ofreciendo un dashboard con indicadores en tiempo real y estética inspirada en **Thrasher Magazine**.

---

## 🛠️ Stack Tecnológico Utilizado
- **Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + API REST)
- **Frontend / Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Visualización Geográfica**: [deck.gl](https://deck.gl/) (`ScatterplotLayer` con halos de resplandor e interactividad) + [MapLibre GL](https://maplibre.org/) con estilo Carto Dark Matter
- **Iconografía & Estilos**: [Lucide React](https://lucide.dev/), CSS Brutalista / Punk / Tipografías Google (*Bebas Neue*, *Pirata One*, *Montserrat*)
- **Despliegue**: [Vercel](https://vercel.com/)

---

## 🚀 Requisitos Cumplidos del TP8

1. **Dataset Georreferenciado**:
   - Más de 25 registros reales distribuidos en Argentina (CABA, Gran Buenos Aires, Mar del Plata, Córdoba, Rosario, Mendoza, Patagonia).
   - Atributos: `id`, `nombre`, `categoria` (*skatepark*, *spot*, *skateshop*), `latitud`, `longitud`, `valor` (rating/dificultad de 1 a 100), `descripcion`, `ciudad`.
2. **Dashboard de 3 Indicadores**:
   - **Spots Totales Registrados**.
   - **Puntuación / Dificultad Promedio** (calculado dinámicamente).
   - **Distribución por Categorías** (conteo de Parks vs. Street vs. Shops).
3. **Capa deck.gl (`ScatterplotLayer`)**:
   - Renderizado con coordenadas en formato `[longitud, latitud]` según la especificación de deck.gl.
   - Puntos con colores y tamaños diferenciados por categoría.
4. **Interactividad & Tooltips**:
   - Hover interactivo con vista rápida de información.
   - Click para abrir modal detallado del spot.
5. **Conexión con Google Maps (Requerimiento especial)**:
   - Botón directo **"CÓMO LLEGAR (ABRIR EN GOOGLE MAPS)"** que genera la ruta desde la ubicación del usuario:
     `https://www.google.com/maps/dir/?api=1&destination={latitud},{longitud}`
6. **Formulario para Agregar Nuevos Spots**:
   - Botón **"+ AGREGAR SPOT"** con geolocalización automática del navegador (GPS) o click en el mapa.
   - Inserción en tiempo real en Supabase (o memoria local en modo de prueba).

---

## ⚙️ Configuración y Ejecución Local

### 1. Clonar o ingresar a la carpeta
```bash
cd skatemap-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Supabase (Opcional si usas modo Offline/Semilla)
1. Entrá en [Supabase](https://supabase.com/) y creá un proyecto nuevo.
2. En el **SQL Editor**, pegá y ejecutá el contenido de [`skatemap_dataset.sql`](../skatemap_dataset.sql).
3. Creá un archivo `.env` en la raíz de `skatemap-app` con tus credenciales:
```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_API_KEY_ANON
```
*(Nota: Si no configuras las llaves, la app arranca automáticamente en modo semilla local con los 27 spots precargados).*

### 4. Iniciar en modo desarrollo
```bash
npm run dev
```

---

## 🌐 Publicación en Vercel (Etapa 8 del TP8)
1. Subí este proyecto a un repositorio de GitHub.
2. Ingresá a [Vercel](https://vercel.com/) y hacé click en **"Add New Project"**.
3. Seleccioná el repositorio y marcá como Root Directory la carpeta `skatemap-app`.
4. En **Environment Variables**, agregá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. Hacé click en **Deploy** para obtener tu URL pública (ejemplo: `https://skatemap-argentina.vercel.app`).

---

## 📝 Descripción para la Entrega del TP8 (Máximo 5 líneas)
> **Problema analizado:** La dispersión y falta de un mapa interactivo centralizado de infraestructura pública y espacios urbanos patinables para la comunidad skater en Argentina.  
> **Origen de los datos:** Relevamiento propio georreferenciado de pistas públicas, spots callejeros y comercios especializados, alojado en Supabase.  
> **Qué representa el mapa:** La localización geográfica y distribución espacial de skateparks, spots callejeros y skateshops en las principales ciudades del país.  
> **Información observable:** Densidad de pistas frente a spots no convencionales, accesibilidad urbana y niveles de dificultad promedio de cada zona.  
> **Segunda versión:** Incorporación de carga multimedia (fotos y videos de trucos en el spot), reporte del estado del piso y filtros de horarios de iluminación nocturna.
