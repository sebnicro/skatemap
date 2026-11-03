import React from 'react';
import { Flame, Activity, ShieldCheck, MapPin } from 'lucide-react';

export function Header({ spots, onOpenAddModal, activeFilter, onFilterChange }) {
  // Cálculo de los 3 Indicadores requeridos por el TP8
  const totalSpots = spots.length;
  
  const avgRating = totalSpots > 0 
    ? Math.round(spots.reduce((acc, curr) => acc + (curr.valor || 50), 0) / totalSpots)
    : 0;

  const countParks = spots.filter(s => s.categoria === 'skatepark').length;
  const countStreet = spots.filter(s => s.categoria === 'spot').length;
  const countShops = spots.filter(s => s.categoria === 'skateshop').length;

  return (
    <header className="panel-brutalist" style={{
      position: 'absolute',
      top: '12px',
      left: '12px',
      right: '12px',
      zIndex: 500,
      padding: '12px 18px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px',
      borderBottom: '3px solid #E10600'
    }}>
      {/* Título & Logo Estilo Thrasher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: '#000',
          border: '2px solid #E10600',
          padding: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Flame size={26} color="#FFDD00" />
          <h1 className="font-thrasher text-flame" style={{
            fontSize: '2.5rem',
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '3px'
          }}>
            SKATEMAP
          </h1>
        </div>
        <div style={{ display: 'none', flexDirection: 'column' }}>
          <span className="font-bebas" style={{ fontSize: '0.85rem', color: '#888', letterSpacing: '1px' }}>
            ARGENTINA SPOT DIRECTORY
          </span>
        </div>
      </div>

      {/* DASHBOARD CON LOS 3 INDICADORES OBLIGATORIOS (TP8) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: '#0a0a0a',
        padding: '6px 14px',
        border: '1px solid #333'
      }}>
        {/* Indicador 1: Total Registros */}
        <div style={{ textAlign: 'center', borderRight: '1px solid #333', paddingRight: '12px' }}>
          <div className="font-bebas" style={{ fontSize: '1.4rem', color: '#FFF', lineHeight: 1 }}>
            {totalSpots}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 'bold' }}>
            SPOTS TOTALES
          </div>
        </div>

        {/* Indicador 2: Nivel / Dificultad Promedio */}
        <div style={{ textAlign: 'center', borderRight: '1px solid #333', paddingRight: '12px' }}>
          <div className="font-bebas" style={{ fontSize: '1.4rem', color: '#FFD000', lineHeight: 1 }}>
            {avgRating} <span style={{ fontSize: '0.9rem' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 'bold' }}>
            RATING PROMEDIO
          </div>
        </div>

        {/* Indicador 3: Desglose por Categoría */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#E10600', fontWeight: 'bold', fontSize: '1rem' }}>{countParks}</span>
            <div style={{ fontSize: '0.65rem', color: '#aaa' }}>PARKS</div>
          </div>
          <span style={{ color: '#444' }}>•</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#FFD000', fontWeight: 'bold', fontSize: '1rem' }}>{countStreet}</span>
            <div style={{ fontSize: '0.65rem', color: '#aaa' }}>STREET</div>
          </div>
          <span style={{ color: '#444' }}>•</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '1rem' }}>{countShops}</span>
            <div style={{ fontSize: '0.65rem', color: '#aaa' }}>SHOPS</div>
          </div>
        </div>
      </div>

      {/* FILTROS Y BOTÓN AGREGAR SPOT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Filtros de Categoría */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            className="btn-secondary"
            onClick={() => onFilterChange('all')}
            style={{
              borderColor: activeFilter === 'all' ? '#FFF' : '#333',
              background: activeFilter === 'all' ? '#222' : 'transparent',
              color: activeFilter === 'all' ? '#FFF' : '#888'
            }}
          >
            TODOS
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onFilterChange('skatepark')}
            style={{
              borderColor: activeFilter === 'skatepark' ? '#E10600' : '#333',
              background: activeFilter === 'skatepark' ? '#E10600' : 'transparent',
              color: activeFilter === 'skatepark' ? '#FFF' : '#E10600'
            }}
          >
            PARKS
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onFilterChange('spot')}
            style={{
              borderColor: activeFilter === 'spot' ? '#FFD000' : '#333',
              background: activeFilter === 'spot' ? '#FFD000' : 'transparent',
              color: activeFilter === 'spot' ? '#000' : '#FFD000'
            }}
          >
            STREET
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onFilterChange('skateshop')}
            style={{
              borderColor: activeFilter === 'skateshop' ? '#00F0FF' : '#333',
              background: activeFilter === 'skateshop' ? '#00F0FF' : 'transparent',
              color: activeFilter === 'skateshop' ? '#000' : '#00F0FF'
            }}
          >
            SHOPS
          </button>
        </div>

        {/* Botón Agregar Spot */}
        <button 
          className="btn-thrasher"
          onClick={onOpenAddModal}
          style={{ padding: '6px 14px', fontSize: '1.1rem' }}
        >
          + AGREGAR SPOT
        </button>
      </div>
    </header>
  );
}
