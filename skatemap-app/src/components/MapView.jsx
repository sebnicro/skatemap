import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import { Map as MapLibreMap, NavigationControl } from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { createPinIconSvg } from '../utils/pinIcons';
import { Map as MapIcon, Plus, Minus, RotateCcw } from 'lucide-react';

const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || '';
const apiKeyParam = (cartoApiKey && !cartoApiKey.includes('TU_CARTO')) ? `?api_key=${cartoApiKey}` : '';

// Estilos de CARTO
export const MAP_STYLES = {
  Light: `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json${apiKeyParam}`,
  Dark: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json${apiKeyParam}`
};

const RASTER_SOURCES = {
  Light: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
  Dark: 'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png'
};

const INITIAL_CENTER = [-60.0, -35.5];
const INITIAL_ZOOM = 5;

export function MapView({
  spots,
  onSelectSpot,
  onMapClickCoordinates,
  userLocation,
  activeMapStyle = 'Light',
  setActiveMapStyle
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  const iconDataUris = useMemo(() => ({
    skatepark: createPinIconSvg('skatepark'),
    spot: createPinIconSvg('spot'),
    skateshop: createPinIconSvg('skateshop'),
    user: createPinIconSvg('user')
  }), []);

  const buildLayers = useCallback(() => {
    const result = [];

    // 1. Sombras bajo los pines
    result.push(new ScatterplotLayer({
      id: 'spots-ground-shadow',
      data: spots,
      pickable: false,
      getPosition: d => [d.longitud, d.latitud],
      getRadius: 40,
      getFillColor: [0, 0, 0, 140],
      radiusUnits: 'meters',
      radiusMinPixels: 4,
      radiusMaxPixels: 14
    }));

    // 2. Pines / Alfileres
    result.push(new IconLayer({
      id: 'spots-icon-pins',
      data: spots,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 90],
      getPosition: d => [d.longitud, d.latitud],
      getIcon: d => ({
        url: iconDataUris[d.categoria] || iconDataUris.spot,
        width: 48,
        height: 64,
        anchorY: 64,
        anchorX: 24
      }),
      sizeScale: 1,
      getSize: 42,
      sizeUnits: 'pixels',
      sizeMinPixels: 24,
      sizeMaxPixels: 52,
      onHover: info => setHoverInfo(info.object ? info : null),
      onClick: info => {
        if (info && info.object) {
          onSelectSpot(info.object);
        }
      }
    }));

    // 3. Pin del usuario
    if (userLocation) {
      result.push(new IconLayer({
        id: 'user-location-pin',
        data: [userLocation],
        pickable: false,
        getPosition: d => [d.longitude, d.latitude],
        getIcon: () => ({
          url: iconDataUris.user,
          width: 48,
          height: 64,
          anchorY: 64,
          anchorX: 24
        }),
        getSize: 44,
        sizeUnits: 'pixels',
        sizeMinPixels: 28,
        sizeMaxPixels: 56
      }));
    }

    return result;
  }, [spots, iconDataUris, onSelectSpot, userLocation]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: MAP_STYLES[activeMapStyle] || MAP_STYLES.Light,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: 1.5,
      maxZoom: 20,
      attributionControl: false
    });

    map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('error', (e) => {
      console.warn('MapLibre event error:', e);
      if (e && e.error && e.error.status === 403) {
        map.setStyle({
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [RASTER_SOURCES[activeMapStyle] || RASTER_SOURCES.Light],
              tileSize: 256,
              attribution: 'CARTO / OpenStreetMap'
            }
          },
          layers: [{
            id: 'raster-tiles-layer',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 20
          }]
        });
      }
    });

    const overlay = new MapboxOverlay({
      interleaved: false,
      layers: buildLayers()
    });

    map.addControl(overlay);

    map.on('click', (e) => {
      const picked = overlay.pickObject({ x: e.point.x, y: e.point.y, radius: 10 });
      if (!picked && onMapClickCoordinates) {
        onMapClickCoordinates({
          lng: parseFloat(e.lngLat.lng.toFixed(6)),
          lat: parseFloat(e.lngLat.lat.toFixed(6))
        });
      }
    });

    mapRef.current = map;
    overlayRef.current = overlay;

    return () => {
      map.remove();
      mapRef.current = null;
      overlayRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setProps({ layers: buildLayers() });
    }
  }, [buildLayers]);

  useEffect(() => {
    if (mapRef.current) {
      const styleUrl = MAP_STYLES[activeMapStyle] || MAP_STYLES.Light;
      mapRef.current.setStyle(styleUrl);
    }
  }, [activeMapStyle]);

  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });
  const handleResetView = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      duration: 800
    });
  };

  const renderTooltip = () => {
    if (!hoverInfo || !hoverInfo.object) return null;
    const { object, x, y } = hoverInfo;
    const catTitles = {
      skatepark: '🛹 SKATEPARK',
      spot: '🧱 SPOT DE CALLE',
      skateshop: '🏪 SKATESHOP',
      user: '📍 VOS'
    };

    return (
      <div
        className="deck-tooltip"
        style={{
          position: 'absolute',
          zIndex: 999,
          pointerEvents: 'none',
          left: x + 14,
          top: y + 14
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#FFF', marginBottom: '3px' }}>
          {object.nombre}
        </div>
        <div style={{
          display: 'inline-block',
          fontSize: '0.75rem',
          padding: '2px 8px',
          fontWeight: 'bold',
          background: object.categoria === 'skatepark' ? '#E10600' : object.categoria === 'spot' ? '#FFB800' : object.categoria === 'skateshop' ? '#00D4FF' : '#2563EB',
          color: object.categoria === 'spot' ? '#000' : '#FFF',
          marginBottom: '6px'
        }}>
          {catTitles[object.categoria] || object.categoria}
        </div>
        {object.categoria !== 'user' && (
          <>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
              <strong>Ciudad:</strong> {object.ciudad || 'Argentina'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#FFD000', marginTop: '2px' }}>
              <strong>Dificultad / Calidad:</strong> {object.valor} / 100
            </div>
            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px', borderTop: '1px solid #333', paddingTop: '4px' }}>
              🎯 Click para ver cómo llegar con Google Maps
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div 
        ref={mapContainerRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%', 
          height: '100%' 
        }} 
      />

      {/* Controles de Zoom propios */}
      <div className="map-zoom-controls">
        <button onClick={handleZoomIn} title="Acercar" style={zoomBtnStyle}>
          <Plus size={18} />
        </button>
        <button onClick={handleZoomOut} title="Alejar" style={zoomBtnStyle}>
          <Minus size={18} />
        </button>
        <button onClick={handleResetView} title="Vista general Argentina" style={{ ...zoomBtnStyle, color: '#FFD000', borderTop: '1px solid #333' }}>
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Selector de Vista: Light / Dark ubicado en la esquina inferior izquierda (donde antes estaba el dataset semilla) */}
      <div className="map-style-selector">
        <MapIcon size={14} color="#FFD000" />
        <span style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 'bold' }}>VISTA:</span>
        <button
          onClick={() => setActiveMapStyle('Light')}
          style={{
            background: activeMapStyle === 'Light' ? '#FFF' : '#222',
            color: activeMapStyle === 'Light' ? '#000' : '#FFF',
            border: '1px solid #444',
            padding: '3px 8px',
            fontSize: '0.75rem',
            fontFamily: 'Bebas Neue',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontWeight: activeMapStyle === 'Light' ? 'bold' : 'normal'
          }}
        >
          LIGHT
        </button>
        <button
          onClick={() => setActiveMapStyle('Dark')}
          style={{
            background: activeMapStyle === 'Dark' ? '#E10600' : '#222',
            color: '#FFF',
            border: '1px solid #444',
            padding: '3px 8px',
            fontSize: '0.75rem',
            fontFamily: 'Bebas Neue',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontWeight: activeMapStyle === 'Dark' ? 'bold' : 'normal'
          }}
        >
          DARK
        </button>
      </div>

      {renderTooltip()}
    </div>
  );
}

const zoomBtnStyle = {
  background: '#1a1a1a',
  border: 'none',
  color: '#fff',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};
