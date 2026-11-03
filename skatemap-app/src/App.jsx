import React, { useState, useEffect } from 'react';
import { MapView, MAP_STYLES } from './components/MapView';
import { Header } from './components/Header';
import { SpotModal } from './components/SpotModal';
import { AddSpotModal } from './components/AddSpotModal';
import { EditSpotModal } from './components/EditSpotModal';
import { SEED_SPOTS } from './data/seedSpots';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Database, AlertTriangle, Crosshair } from 'lucide-react';

export default function App() {
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [editingSpot, setEditingSpot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState('checking'); // 'supabase', 'local-seed'
  const [activeMapStyle, setActiveMapStyle] = useState('Light'); // 'Light' o 'Dark'
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Consulta de datos de Supabase o fallback a Semilla
  const fetchSpots = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skate_spots')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.warn('Error al consultar Supabase, usando dataset semilla local:', error);
          setSpots(SEED_SPOTS);
          setDbStatus('local-seed');
        } else if (data && data.length > 0) {
          setSpots(data);
          setDbStatus('supabase');
        } else {
          setSpots(SEED_SPOTS);
          setDbStatus('local-seed');
        }
      } catch (err) {
        console.warn('Fallo de red en Supabase:', err);
        setSpots(SEED_SPOTS);
        setDbStatus('local-seed');
      }
    } else {
      setSpots(SEED_SPOTS);
      setDbStatus('local-seed');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  // Geolocalizar al usuario
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        alert('No pudimos acceder a tu ubicación: ' + err.message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Agregar nuevo spot
  const handleSpotAdded = async (newSpotData) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skate_spots')
          .insert([newSpotData])
          .select();

        if (error) {
          alert('Error al guardar en Supabase: ' + error.message);
          return;
        }

        if (data && data.length > 0) {
          setSpots(prev => [...prev, data[0]]);
        } else {
          setSpots(prev => [...prev, { ...newSpotData, id: Date.now() }]);
        }
      } catch (err) {
        alert('Error inesperado: ' + err.message);
        return;
      }
    } else {
      const localNewSpot = { ...newSpotData, id: Date.now() };
      setSpots(prev => [...prev, localNewSpot]);
    }

    setIsAddModalOpen(false);
    setClickedCoords(null);
  };

  // Modificar / Editar spot existente
  const handleSpotUpdated = async (spotId, updatedFields) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skate_spots')
          .update(updatedFields)
          .eq('id', spotId)
          .select();

        if (error) {
          alert('Error al actualizar en Supabase: ' + error.message);
          return;
        }

        const updated = data && data.length > 0 ? data[0] : { id: spotId, ...updatedFields };
        setSpots(prev => prev.map(s => s.id === spotId ? updated : s));
        if (selectedSpot && selectedSpot.id === spotId) {
          setSelectedSpot(updated);
        }
      } catch (err) {
        alert('Error inesperado al actualizar: ' + err.message);
        return;
      }
    } else {
      // Modo local
      setSpots(prev => prev.map(s => s.id === spotId ? { ...s, ...updatedFields } : s));
      if (selectedSpot && selectedSpot.id === spotId) {
        setSelectedSpot({ ...selectedSpot, ...updatedFields });
      }
    }

    setEditingSpot(null);
  };

  // Eliminar spot
  const handleSpotDeleted = async (spotId) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('skate_spots')
          .delete()
          .eq('id', spotId);

        if (error) {
          alert('Error al eliminar en Supabase: ' + error.message);
          return;
        }

        setSpots(prev => prev.filter(s => s.id !== spotId));
      } catch (err) {
        alert('Error inesperado al eliminar: ' + err.message);
        return;
      }
    } else {
      // Modo local
      setSpots(prev => prev.filter(s => s.id !== spotId));
    }

    setSelectedSpot(null);
  };

  // Filtrado de spots por categoría
  const filteredSpots = spots.filter(spot => {
    if (activeFilter === 'all') return true;
    return spot.categoria === activeFilter;
  });

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Header con indicadores del TP8, estética Thrasher y filtros */}
      <Header 
        spots={spots}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Mapa interactivo con deck.gl e IconLayer con alfileres y vistas intercambiables */}
      <MapView 
        spots={filteredSpots}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        activeMapStyle={activeMapStyle}
        setActiveMapStyle={setActiveMapStyle}
        onSelectSpot={setSelectedSpot}
        onMapClickCoordinates={(coords) => {
          setClickedCoords(coords);
          setIsAddModalOpen(true);
        }}
      />

      {/* Botón flotante: "Mi Ubicación" (Estilo Google Maps) */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        title="Mostrar mi ubicación en el mapa"
        style={{
          position: 'absolute',
          bottom: '72px',
          right: '16px',
          zIndex: 500,
          background: '#000',
          border: '2px solid #FFF',
          color: userLocation ? '#2563EB' : '#FFF',
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
          fontFamily: 'Bebas Neue',
          fontSize: '1rem'
        }}
      >
        <Crosshair size={18} color={userLocation ? '#2563EB' : '#FFD000'} />
        <span>{isLocating ? 'LOCALIZANDO...' : userLocation ? 'UBICACIÓN ACTIVA' : 'DONDE ESTOY'}</span>
      </button>

      {/* Badge de estado de conexión a Base de Datos (en esquina inferior izquierda) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 500,
        background: 'rgba(0, 0, 0, 0.88)',
        border: '1px solid #333',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem',
        color: '#aaa'
      }}>
        {dbStatus === 'supabase' ? (
          <>
            <Database size={14} color="#3ecf8e" />
            <span>Base de datos: <strong style={{ color: '#3ecf8e' }}>Supabase Conectado</strong></span>
          </>
        ) : (
          <>
            <AlertTriangle size={14} color="#FFD000" />
            <span>Datos: <strong style={{ color: '#FFD000' }}>Dataset Semilla Local ({spots.length} spots)</strong></span>
          </>
        )}
      </div>

      {/* Leyenda de Categorías en esquina inferior derecha */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 490,
        background: 'rgba(0, 0, 0, 0.92)',
        border: '2px solid #222',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1rem' }}>🛹</span>
          <span style={{ color: '#FF4D4D', fontWeight: 'bold' }}>Skatepark</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1rem' }}>🧱</span>
          <span style={{ color: '#FFCC00', fontWeight: 'bold' }}>Spot Calle</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1rem' }}>🏪</span>
          <span style={{ color: '#00D4FF', fontWeight: 'bold' }}>Skateshop</span>
        </div>
      </div>

      {/* Modal para ver detalles del Spot, editar, eliminar o abrir Google Maps */}
      {selectedSpot && !editingSpot && (
        <SpotModal 
          spot={selectedSpot} 
          onClose={() => setSelectedSpot(null)} 
          onEdit={(spotToEdit) => setEditingSpot(spotToEdit)}
          onDelete={handleSpotDeleted}
        />
      )}

      {/* Modal para editar spot existente */}
      {editingSpot && (
        <EditSpotModal 
          spot={editingSpot}
          onClose={() => setEditingSpot(null)}
          onSpotUpdated={handleSpotUpdated}
        />
      )}

      {/* Modal para registrar un nuevo Spot */}
      {isAddModalOpen && (
        <AddSpotModal 
          defaultCoords={clickedCoords}
          onClose={() => {
            setIsAddModalOpen(false);
            setClickedCoords(null);
          }}
          onSpotAdded={handleSpotAdded}
        />
      )}
    </div>
  );
}
