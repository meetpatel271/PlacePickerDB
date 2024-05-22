import { useState, useEffect } from 'react';
import { fecthAvailablePlaces } from '../http.js';
import { sortPlacesByDistance } from '../loc.js';
import Error from './Error.jsx';
import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();
  
  useEffect(() => {
    async function fetchPlaces()   {
      setIsFetching(true);

      try {
        const places = await fecthAvailablePlaces();

      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
        setAvailablePlaces(sortedPlaces);
        setIsFetching(false);
      });

      } catch (error) {
        setError({message: error.message || 'Could not fetch places, please try again later.'});
        setIsFetching(false);
      }
      
    }
        fetchPlaces();
  }, []);

    if(error){
      return <Error title="An error occured" message={error.message}/>;
    }


  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
