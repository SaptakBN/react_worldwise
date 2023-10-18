import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import {useCities} from '../context/CityContext'
import Button from "./Button";
import { useGeolocation } from "../hooks/Geolocator";
import { useUrlLocation } from "../hooks/UrlLocation";


export default function Map() {
  const { cities, currentCity } = useCities()
  const [mapPosition, setMapPosition] = useState((currentCity.position!==undefined) ? [currentCity.position.lat, currentCity.position.lng] : [40, 0])
  const { isLoading: geoLoading, position: geoPosition, getPosition } = useGeolocation()
  const {lat, lng} = useUrlLocation()

  useEffect(()=>{
    if(lat && lng) setMapPosition([lat, lng])
  }, [lat, lng])

  useEffect(()=>{
    if(geoPosition){
      setMapPosition([geoPosition.lat, geoPosition.lng])
    }
  }, [geoPosition])
  return (
    <div className={styles.mapContainer} >
      <Button type="position" onClickFun={()=>{getPosition()}}>{geoLoading ? 'Loading...' : 'Use your location' }</Button>
      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
        <DetectClick />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(el=>
        <Marker key={el.id} position={[el.position.lat, el.position.lng]}>
          <Popup>
            You visited {el.cityName} on {new Date(el.date).toDateString()}.
          </Popup>
        </Marker>)}
        <ChangeMapView position={mapPosition} />
      </MapContainer>
    </div>
  );
}

function ChangeMapView({position}){
  const map = useMap()
  map.setView(position)
}

function DetectClick(){
  const navigate = useNavigate();
  useMapEvents({
    click: e => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  })
}