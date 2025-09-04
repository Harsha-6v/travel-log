import React, { useState, useEffect, useMemo } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import { listLogEntries, deleteLogEntry } from "./API";
import LogEntryForm from "./LogEntryForm";
import DeleteConfirmation from "./DeleteConfirmation";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 22.5937,
    longitude: 78.9629,
    zoom: 4,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activePopup, setActivePopup] = useState(null);

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    if (!searchTerm) {
      return logEntries;
    }
    return logEntries.filter((entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logEntries, searchTerm]);

  const handleSearchResultClick = (entry) => {
    setViewport({
      ...viewport,
      latitude: entry.latitude,
      longitude: entry.longitude,
      zoom: 5,
      transitionDuration: 1000,
    });
    setActivePopup({ type: 'view', entry });
    setSearchTerm('');
  };

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setActivePopup({ type: 'add', latitude, longitude });
  };

  const confirmDelete = async (apiKey) => {
    try {
      await deleteLogEntry(activePopup.entry._id, apiKey);
      setActivePopup(null);
      getEntries();
    } catch (error) {
      console.error(error);
      alert(error.message);
      setActivePopup(null);
    }
  };

  const handlePopupClose = (refresh = false) => {
    setActivePopup(null);
    if (refresh) {
      getEntries();
    }
  };

  const renderPopup = () => {
    if (!activePopup) return null;

    let latitude, longitude;
    if (activePopup.type === 'add') {
      latitude = activePopup.latitude;
      longitude = activePopup.longitude;
    } else {
      latitude = activePopup.entry.latitude;
      longitude = activePopup.entry.longitude;
    }

    let content = null;
    switch (activePopup.type) {
      case 'view':
        const { entry } = activePopup;
        content = (
          <div className="popup">
            <h3>{entry.title}</h3>
            <p>{entry.comments}</p>
            <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
            {entry.image && <img src={entry.image} alt={entry.title} />}
            <div className="popup-buttons-container">
              <button style={{ backgroundColor: '#4cd1f6ff', color: '#fff' }} onClick={() => setActivePopup({ type: 'edit', entry })}>Edit</button>
              <button style={{ backgroundColor: '#fd0808ff', color: '#fff' }} onClick={() => setActivePopup({ type: 'delete', entry })}>Delete</button>
            </div>
          </div>
        );
        break;
      case 'add':
        content = <LogEntryForm location={{ latitude, longitude }} onClose={() => handlePopupClose(true)} />;
        break;
      case 'edit':
        content = <LogEntryForm entry={activePopup.entry} onClose={() => handlePopupClose(true)} />;
        break;
      case 'delete':
        content = <DeleteConfirmation onConfirm={confirmDelete} onCancel={handlePopupClose} />;
        break;
      default:
        return null;
    }

    return (
      <Popup
        latitude={latitude}
        longitude={longitude}
        closeButton={true}
        closeOnClick={false}
        dynamicPosition={true}
        onClose={handlePopupClose}
        anchor="top"
      >
        <div className="popup">{content}</div>
      </Popup>
    );
  };
  
  return (
    <>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {searchTerm && (
          <ul className="search-results">
            {filteredEntries.map(entry => (
              <li
                key={entry._id}
                onClick={() => handleSearchResultClick(entry)}
                className="search-result-item"
              >
                {entry.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={setViewport}
        onDblClick={showAddMarkerPopup}
      >
        {logEntries.map((entry) => (
          <Marker key={entry._id} latitude={entry.latitude} longitude={entry.longitude}>
            <div onClick={() => setActivePopup({ type: 'view', entry })}>
              <svg className="marker green" style={{ height: `${6 * viewport.zoom}px`, width: `${6 * viewport.zoom}px` }} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                <g><g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035 c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z" /></g></g>
              </svg>
            </div>
          </Marker>
        ))}
        
        {renderPopup()}

        {activePopup?.type === 'add' && (
          <Marker latitude={activePopup.latitude} longitude={activePopup.longitude}>
            <div>
              <svg className="marker red" style={{ height: `${6 * viewport.zoom}px`, width: `${6 * viewport.zoom}px` }} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                <g><g><path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035 c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z" /></g></g>
              </svg>
            </div>
          </Marker>
        )}
      </ReactMapGL>
    </>
  );
};

export default App;