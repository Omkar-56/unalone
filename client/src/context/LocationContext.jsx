import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext(null);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Check if we have a saved location in localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    } else {
      // Try to get location automatically on mount
      requestLocation();
    }
  }, []);

  const requestLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationPermission('denied');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        };
        
        setUserLocation(location);
        setLocationPermission('granted');
        setIsLoadingLocation(false);
        
        // Save to localStorage
        localStorage.setItem('userLocation', JSON.stringify(location));
      },
      (error) => {
        setIsLoadingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location or enter manually.');
            setLocationPermission('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const setManualLocation = (lat, lng, locationName = null) => {
    const location = {
      lat,
      lng,
      manual: true,
      locationName,
      timestamp: Date.now(),
    };
    
    setUserLocation(location);
    setLocationPermission('granted');
    setLocationError(null);
    
    // Save to localStorage
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const clearLocation = () => {
    setUserLocation(null);
    setLocationPermission('prompt');
    setLocationError(null);
    localStorage.removeItem('userLocation');
  };

  const value = {
    userLocation,
    locationPermission,
    isLoadingLocation,
    locationError,
    requestLocation,
    setManualLocation,
    clearLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
