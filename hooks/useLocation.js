import React, {useState, useEffect} from 'react'
import {
  Platform,
  Keyboard
} from 'react-native'
import * as Location from 'expo-location';

export default function useInfo() {
  const [location, setLocation] = useState({})
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({});
      setLocation(currentPosition);
    })();
  }, [])

  function computeDistance([prevLat, prevLong], [lat, long]) {
    const prevLatInRad = toRad(prevLat);
    const prevLongInRad = toRad(prevLong);
    const latInRad = toRad(lat);
    const longInRad = toRad(long);

    return (
      // In kilometers
      6377.830272 *
      Math.acos(
        Math.sin(prevLatInRad) * Math.sin(latInRad) +
          Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
      )
    );
  }

  function toRad(angle) {
    return (angle * Math.PI) / 180;
  }

  const getDistanceToLocation = ({longitude, latitude}) => {
    if (!location || !location.coords) {
      return
    }
    return computeDistance([location.coords.latitude, location.coords.longitude], [latitude, longitude])
  }

  return {
    location,
    errorMessage,
    getDistanceToLocation
  }
}
