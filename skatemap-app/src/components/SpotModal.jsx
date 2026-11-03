import React from 'react';
import { X, Navigation, MapPin, Award, Edit3, Trash2 } from 'lucide-react';

export function SpotModal({ spot, onClose, onEdit, onDelete }) {
  if (!spot) return null;

  const categoryLabels = {
    skatepark: { name: 'SKATEPARK PÚBLICO / PISTA', color: '#E10600', icon: '🛹' },
    spot: { name: 'SPOT DE CALLE (STREET)', color: '#FFD000', icon: '🧱' },
    skateshop: { name: 'SKATESHOP / TIENDA TÉCNICA', color: '#00F0FF', icon: '🏪' }
  };

  const catInfo = categoryLabels[spot.categoria] || { name: spot.categoria, color: '#FFF', icon: '📍' };

  // Enlace directo a Google Maps con cálculo de ruta desde la ubicación del usuario
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitud},${spot.longitud}`;

  const handleDelete = () => {
    const confirmDelete = window.confirm(`¿Estás seguro de que querés eliminar "${spot.nombre}"? Esta acción no se puede deshacer.`);
    if (confirmDelete && onDelete) {
      onDelete(spot.id);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="panel-brutalist" style={{
        maxWidth: '520px',
        width: '100%',
        position: 'relative',
        padding: '24px',
        border: `3px solid ${catInfo.color}`
      }}>
        {/* Botón cerrar */}
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

        {/* Badge de categoría */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          backgroundColor: catInfo.color,
          color: spot.categoria === 'spot' ? '#000' : '#FFF',
          fontFamily: 'Bebas Neue',
          fontSize: '1rem',
          letterSpacing: '1px',
          marginBottom: '12px',
          fontWeight: 'bold'
        }}>
          <span>{catInfo.icon}</span>
          <span>{catInfo.name}</span>
        </div>

        {/* Título */}
        <h2 className="font-bebas" style={{
          fontSize: '2rem',
          lineHeight: '1.1',
          marginBottom: '8px',
          color: '#FFF'
        }}>
          {spot.nombre}
        </h2>

        {/* Ciudad / Ubicación */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#aaa',
          fontSize: '0.9rem',
          marginBottom: '16px'
        }}>
          <MapPin size={16} color={catInfo.color} />
          <span>{spot.ciudad || 'Argentina'}</span>
          <span style={{ margin: '0 4px' }}>•</span>
          <span>{spot.latitud.toFixed(4)}, {spot.longitud.toFixed(4)}</span>
        </div>

        {/* Descripción */}
        <div style={{
          backgroundColor: '#0a0a0a',
          padding: '14px',
          borderLeft: `4px solid ${catInfo.color}`,
          marginBottom: '18px',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          color: '#ddd'
        }}>
          {spot.descripcion || 'Sin descripción detallada por el momento.'}
        </div>

        {/* Métrica / Dificultad (TP8) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#161616',
          padding: '10px 14px',
          border: '1px solid #333',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#FFD000" />
            <span style={{ fontSize: '0.9rem', color: '#bbb' }}>PUNTUACIÓN / SPOT RATING:</span>
          </div>
          <span className="font-bebas" style={{ fontSize: '1.5rem', color: '#FFD000' }}>
            {spot.valor} / 100
          </span>
        </div>

        {/* Botones de Modificación / Edición / Eliminación */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '14px'
        }}>
          <button
            onClick={() => onEdit && onEdit(spot)}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderColor: '#FFD000',
              color: '#FFD000'
            }}
          >
            <Edit3 size={18} />
            <span>EDITAR SPOT</span>
          </button>

          <button
            onClick={handleDelete}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderColor: '#ff3333',
              color: '#ff4d4d'
            }}
          >
            <Trash2 size={18} />
            <span>ELIMINAR SPOT</span>
          </button>
        </div>

        {/* Botón Google Maps (Requerimiento clave del usuario) */}
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-thrasher"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            textDecoration: 'none',
            textAlign: 'center',
            width: '100%',
            fontSize: '1.3rem'
          }}
        >
          <Navigation size={22} />
          CÓMO LLEGAR (ABRIR EN GOOGLE MAPS)
        </a>
      </div>
    </div>
  );
}
