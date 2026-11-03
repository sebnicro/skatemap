import React, { useState } from 'react';
import { X, PlusCircle, Crosshair, AlertCircle } from 'lucide-react';

export function AddSpotModal({ onClose, onSpotAdded, defaultCoords }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('skatepark');
  const [latitud, setLatitud] = useState(defaultCoords ? defaultCoords.lat : -34.6037);
  const [longitud, setLongitud] = useState(defaultCoords ? defaultCoords.lng : -58.3816);
  const [valor, setValor] = useState(75);
  const [descripcion, setDescripcion] = useState('');
  const [ciudad, setCiudad] = useState('CABA, Buenos Aires');
  const [loadingGps, setLoadingGps] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Capturar geolocalización actual
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Tu navegador no soporta geolocalización.');
      return;
    }
    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitud(parseFloat(pos.coords.latitude.toFixed(6)));
        setLongitud(parseFloat(pos.coords.longitude.toFixed(6)));
        setLoadingGps(false);
        setErrorMsg('');
      },
      (err) => {
        setErrorMsg('No se pudo obtener la ubicación actual: ' + err.message);
        setLoadingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('Ingresa un nombre para el lugar.');
      return;
    }

    const newSpot = {
      nombre: nombre.trim(),
      categoria,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      valor: parseInt(valor, 10),
      descripcion: descripcion.trim(),
      ciudad: ciudad.trim() || 'Argentina'
    };

    onSpotAdded(newSpot);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="panel-brutalist" style={{
        maxWidth: '540px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '24px',
        border: '3px solid #E10600'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#000',
            border: '2px solid #fff',
            color: '#fff',
            padding: '4px',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <PlusCircle size={28} color="#E10600" />
          <h2 className="font-bebas" style={{ fontSize: '2.2rem', color: '#FFF' }}>
            REGISTRAR NUEVO SPOT
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '16px' }}>
          Agregá un skatepark, spot callejero o skateshop en Argentina.
        </p>

        {errorMsg && (
          <div style={{
            background: '#330000',
            border: '1px solid #ff3333',
            color: '#ff9999',
            padding: '8px 12px',
            marginBottom: '14px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#ccc', marginBottom: '4px' }}>
              NOMBRE DEL LUGAR:
            </label>
            <input 
              type="text" 
              required
              placeholder="Ej. Skatepark Plaza Houssay / Bordes de Correo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #444',
                color: '#fff',
                padding: '10px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Categoría */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#ccc', marginBottom: '6px' }}>
              TIPO DE LUGAR (CATEGORÍA):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCategoria('skatepark')}
                style={{
                  padding: '10px 4px',
                  border: categoria === 'skatepark' ? '2px solid #fff' : '1px solid #333',
                  background: categoria === 'skatepark' ? '#E10600' : '#181818',
                  color: '#fff',
                  fontFamily: 'Bebas Neue',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🛹 SKATEPARK
              </button>
              <button
                type="button"
                onClick={() => setCategoria('spot')}
                style={{
                  padding: '10px 4px',
                  border: categoria === 'spot' ? '2px solid #000' : '1px solid #333',
                  background: categoria === 'spot' ? '#FFD000' : '#181818',
                  color: categoria === 'spot' ? '#000' : '#fff',
                  fontFamily: 'Bebas Neue',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🧱 SPOT CALLE
              </button>
              <button
                type="button"
                onClick={() => setCategoria('skateshop')}
                style={{
                  padding: '10px 4px',
                  border: categoria === 'skateshop' ? '2px solid #fff' : '1px solid #333',
                  background: categoria === 'skateshop' ? '#00F0FF' : '#181818',
                  color: '#000',
                  fontFamily: 'Bebas Neue',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🏪 SKATESHOP
              </button>
            </div>
          </div>

          {/* Coordenadas & Botón GPS */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ccc' }}>
                UBICACIÓN GEOGRÁFICA (COORDENADAS):
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={loadingGps}
                style={{
                  background: '#222',
                  border: '1px solid #666',
                  color: '#FFD000',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Crosshair size={14} />
                {loadingGps ? 'OBTENIENDO GPS...' : 'USAR MI UBICACIÓN ACTUAL'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Latitud:</span>
                <input 
                  type="number" 
                  step="any"
                  required
                  value={latitud}
                  onChange={(e) => setLatitud(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111',
                    border: '1px solid #444',
                    color: '#fff',
                    padding: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Longitud:</span>
                <input 
                  type="number" 
                  step="any"
                  required
                  value={longitud}
                  onChange={(e) => setLongitud(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111',
                    border: '1px solid #444',
                    color: '#fff',
                    padding: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Ciudad / Provincia */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#ccc', marginBottom: '4px' }}>
              CIUDAD / PROVINCIA:
            </label>
            <input 
              type="text" 
              placeholder="Ej. CABA, Buenos Aires / Rosario, Santa Fe"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #444',
                color: '#fff',
                padding: '10px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Dificultad / Valoración (TP8) */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ccc' }}>
                CALIFICACIÓN / DIFICULTAD (1 a 100):
              </label>
              <span className="font-bebas" style={{ color: '#FFD000', fontSize: '1.1rem' }}>
                {valor} pts
              </span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              style={{ width: '100%', accentColor: '#E10600' }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#ccc', marginBottom: '4px' }}>
              DESCRIPCIÓN / OBSTÁCULOS:
            </label>
            <textarea 
              rows="3"
              placeholder="Ej. Barandas circulares, bordes encerados, suelo liso, seguridad..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #444',
                color: '#fff',
                padding: '10px',
                fontSize: '0.9rem',
                resize: 'none'
              }}
            />
          </div>

          <button 
            type="submit"
            className="btn-thrasher"
            style={{ width: '100%', fontSize: '1.3rem' }}
          >
            GUARDAR Y PUBLICAR SPOT
          </button>
        </form>
      </div>
    </div>
  );
}
