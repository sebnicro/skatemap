// Generador de SVG Data URI para pines y alfileres profesionales
export function createPinIconSvg(type) {
  // Configuración según categoría
  const configs = {
    skatepark: {
      color: '#E10600',       // Rojo fuego Thrasher
      border: '#FFFFFF',
      glyph: '🛹',
      label: 'PARK'
    },
    spot: {
      color: '#FFB800',       // Amarillo dorado callejero
      border: '#000000',
      glyph: '🧱',
      label: 'SPOT'
    },
    skateshop: {
      color: '#00D4FF',       // Cyan eléctrico
      border: '#FFFFFF',
      glyph: '🏪',
      label: 'SHOP'
    },
    user: {
      color: '#2563EB',       // Azul posición actual
      border: '#FFFFFF',
      glyph: '📍',
      label: 'VOS'
    }
  };

  const cfg = configs[type] || configs.spot;

  // Pin estilo gota de mapa con relieve y glifo
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64" width="48" height="64">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <!-- Sombra y cuerpo del marcador -->
    <path d="M 24 2 C 12 2 2 12 2 24 C 2 38 24 62 24 62 C 24 62 46 38 46 24 C 46 12 36 2 24 2 Z" 
          fill="${cfg.color}" 
          stroke="${cfg.border}" 
          stroke-width="2.5" 
          filter="url(#shadow)"/>
    <!-- Círculo interior blanco -->
    <circle cx="24" cy="22" r="14" fill="#FFFFFF" opacity="0.95" />
    <!-- Emoji o Icono central -->
    <text x="24" y="27" font-size="16" text-anchor="middle" font-family="Arial, sans-serif">${cfg.glyph}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
