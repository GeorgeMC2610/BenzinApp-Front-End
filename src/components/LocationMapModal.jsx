import { Modal, Button } from 'react-bootstrap';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMapModal({ show, onHide, location }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!show || !location || !mapContainerRef.current) {
      return;
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const { coords, label } = location;
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([coords.lat, coords.lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.circleMarker([coords.lat, coords.lng], {
      radius: 8,
      color: '#2f9d27',
      fillColor: '#2f9d27',
      fillOpacity: 0.9
    })
      .addTo(map)
      .bindPopup(label)
      .openPopup();

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [show, location]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Show on Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '320px' }}
          className="rounded"
        ></div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LocationMapModal;

