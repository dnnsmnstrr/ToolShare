import React from 'react'
import { View } from '../components/Themed';
import MapView, {Marker} from 'react-native-maps';

const Map = ({latitude, longitude, name, description, style}) => {
  return (
    <View
    style={{ width: '100%', height: 200, borderRadius: 20, overflow: 'hidden', ...style}}
    >
      <MapView
        // provider='google'
        style={{ width: '100%', height: '100%', borderRadius: 20 }}
        mapType='satellite'
        showsUserLocation
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{latitude, longitude}} title={name} description={description}/>
      </MapView>
    </View>
  )
}

export default Map
