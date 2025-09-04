import React, { useState, useEffect, useMemo } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries, deleteLogEntry } from './API';
import LogEntryForm from './LogEntryForm';
import DeleteConfirmation from './DeleteConfirmation';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 22.5937,
    longitude: 78.9629,
    zoom: 4
  });
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  // 1. New state for the search term
  const [searchTerm, setSearchTerm] = useState('');

  const getEntries = async () => {
    setLoading(true);
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    setLoading(false);
  };

  useEffect(() => {
    getEntries();
  }, []);

  // 3. Create a filtered list of entries based on the search term
  const filteredEntries = useMemo(() => 
    logEntries.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase())
    ), [logEntries, searchTerm]);

  // ... (All other functions: showAddMarkerPopup, handleDeleteClick, confirmDelete, handleEditClick)
  
  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  const handleDeleteClick = (id) => {
    setShowPopup({});
    setDeletingEntry(id);
  };
  
  const confirmDelete = async (apiKey) => {
    try {
      await deleteLogEntry(deletingEntry, apiKey);
      setDeletingEntry(null);
      getEntries();
    } catch (error) {
      console.error(error);
      alert(error.message);
      setDeletingEntry(null);
    }
  };

  const handleEditClick = (entry) => {
    setShowPopup({});
    setEditingEntry(entry);
  };

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* 2. Add the search input field to the UI */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: '1px solid #ccc',
            padding: '8px',
            borderRadius: '3px',
            width: '250px',
          }}
        />
      </div>

      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={setViewport}
        onDblClick={showAddMarkerPopup}
      >
        {/* 4. Use the new filteredEntries array for mapping */}
        {filteredEntries.map(entry => (
          <React.Fragment key={entry._id}>
            <Marker latitude={entry.latitude} longitude={entry.longitude}>
              <div
                onClick={() => {
                  setShowPopup({ [entry._id]: true });
                  setDeletingEntry(null);
                  setEditingEntry(null);
                }}
              >
                <svg /* ... svg code ... */ className="marker yellow" style={{height: `${6 * viewport.zoom}px`,width: `${6 * viewport.zoom}px`}} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"><g><g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035 c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/></g></g></svg>
              </div>
            </Marker>
            {showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top"
              >
                <div className="popup">
                  <h3>{entry.title}</h3>
                  <p>{entry.comments}</p>
                  <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                  {entry.image && <img src={entry.image} alt={entry.title} />}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button onClick={() => handleEditClick(entry)}>Edit</button>
                    <button onClick={() => handleDeleteClick(entry._id)}>Delete</button>
                  </div>
                </div>
              </Popup>
            ) : null}
          </React.Fragment>
        ))}
        {/* ... All other popups for adding, deleting, and editing entries ... */}
        {addEntryLocation ? (
          <>
            <Marker latitude={addEntryLocation.latitude} longitude={addEntryLocation.longitude}>
              <div><svg /* ... svg code ... */ className="marker red" style={{height: `${6 * viewport.zoom}px`,width: `${6 * viewport.zoom}px`,}} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"><g><g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035 c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/></g></g></svg></div>
            </Marker>
            <Popup latitude={addEntryLocation.latitude} longitude={addEntryLocation.longitude} closeButton={true} closeOnClick={false} dynamicPosition={true} onClose={() => setAddEntryLocation(null)} anchor="top">
              <div className="popup">
                <LogEntryForm onClose={() => { setAddEntryLocation(null); getEntries(); }} location={addEntryLocation} />
              </div>
            </Popup>
          </>
        ) : null}
        {deletingEntry && (
          <Popup latitude={logEntries.find(e => e._id === deletingEntry).latitude} longitude={logEntries.find(e => e._id === deletingEntry).longitude} closeButton={true} closeOnClick={false} dynamicPosition={true} onClose={() => setDeletingEntry(null)} anchor="top">
            <div className="popup">
              <DeleteConfirmation onConfirm={confirmDelete} onCancel={() => setDeletingEntry(null)} />
            </div>
          </Popup>
        )}
        {editingEntry && (
          <Popup
            latitude={editingEntry.latitude}
            longitude={editingEntry.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setEditingEntry(null)}
            anchor="top"
          >
            <div className="popup">
              <LogEntryForm
                entry={editingEntry}
                onClose={() => {
                  setEditingEntry(null);
                  getEntries();
                }}
              />
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </>
  );
}

export default App;