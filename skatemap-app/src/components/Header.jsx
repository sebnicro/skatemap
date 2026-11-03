import React, { useState } from 'react';
import { Flame, ChevronDown, ChevronUp } from 'lucide-react';

export function Header({ spots, onOpenAddModal, activeFilter, onFilterChange }) {
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);

  // Cálculo de los 3 Indicadores requeridos por el TP8
  const totalSpots = spots.length;
  
  const avgRating = totalSpots > 0 
    ? Math.round(spots.reduce((acc, curr) => acc + (curr.valor || 50), 0) / totalSpots)
    : 0;

  const countParks = spots.filter(s => s.categoria === 'skatepark').length;
  const countStreet = spots.filter(s => s.categoria === 'spot').length;
  const countShops = spots.filter(s => s.categoria === 'skateshop').length;

  return (
    <header className="panel-brutalist header-responsive">
      {/* Barra Principal: Logo + Botón Añadir Spot + Botón Toggle Info Móvil */}
      <div className="header-top-row">
        {/* Título & Logo Estilo Thrasher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#000',
            border: '2px solid #E10600',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Flame size={20} color="#FFDD00" />
            <h1 className="font-thrasher text-flame logo-title">
              SKATEMAP
            </h1>
          </div>
        </div>

        {/* Acciones de la barra superior */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botón Agregar Spot */}
          <button 
            className="btn-thrasher btn-add-spot"
            onClick={onOpenAddModal}
          >
            + SPOT
          </button>

          {/* Toggle para colapsar/desplegar el dashboard en celular */}
          <button
            className="btn-secondary btn-mobile-toggle"
            onClick={() => setIsExpandedMobile(!isExpandedMobile)}
            title="Ver estadísticas y filtros"
          >
            {isExpandedMobile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Sección Colapsable en Móvil / En línea en Desktop */}
      <div className={`header-collapsible ${isExpandedMobile ? 'expanded' : ''}`}>
        {/* DASHBOARD CON LOS 3 INDICADORES OBLIGATORIOS (TP8) */}
        <div className="dashboard-stats">
          {/* Indicador 1: Total Registros */}
          <div style={{ textAlign: 'center', borderRight: '1px solid #333', paddingRight: '10px' }}>
            <div className="font-bebas" style={{ fontSize: '1.25rem', color: '#FFF', lineHeight: 1 }}>
              {totalSpots}
            </div>
            <div style={{ fontSize: '0.6rem', color: '#888', fontWeight: 'bold' }}>
              SPOTS
            </div>
          </div>

          {/* Indicador 2: Nivel / Dificultad Promedio */}
          <div style={{ textAlign: 'center', borderRight: '1px solid #333', paddingRight: '10px' }}>
            <div className="font-bebas" style={{ fontSize: '1.25rem', color: '#FFD000', lineHeight: 1 }}>
              {avgRating} <span style={{ fontSize: '0.8rem' }}>/100</span>
            </div>
            <div style={{ fontSize: '0.6rem', color: '#888', fontWeight: 'bold' }}>
              PROMEDIO
            </div>
          </div>

          {/* Indicador 3: Desglose por Categoría */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#E10600', fontWeight: 'bold', fontSize: '0.9rem' }}>{countParks}</span>
              <div style={{ fontSize: '0.6rem', color: '#aaa' }}>PARKS</div>
            </div>
            <span style={{ color: '#444' }}>•</span>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#FFD000', fontWeight: 'bold', fontSize: '0.9rem' }}>{countStreet}</span>
              <div style={{ fontSize: '0.6rem', color: '#aaa' }}>STREET</div>
            </div>
            <span style={{ color: '#444' }}>•</span>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '0.9rem' }}>{countShops}</span>
              <div style={{ fontSize: '0.6rem', color: '#aaa' }}>SHOPS</div>
            </div>
          </div>
        </div>

        {/* Filtros de Categoría */}
        <div className="filter-buttons">
          <button 
            className="btn-secondary btn-filter"
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
            className="btn-secondary btn-filter"
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
            className="btn-secondary btn-filter"
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
            className="btn-secondary btn-filter"
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
      </div>
    </header>
  );
}
