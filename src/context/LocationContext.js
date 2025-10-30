import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getAllCityList, getAllCountryList, getAllStateList } from '../services/commonApiService/CommonApiService';

// Create a Context for the location data
export const LocationContext = createContext();

// export const useLocation = () => useContext(LocationContext);

// Create a Provider component
export const LocationProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
 // console.log("countries",countries);
  // Function to fetch countries
  const fetchCountries = async () => {
    try {
      const response = await getAllCountryList();
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Function to fetch states by country ID
  const fetchStates = async (countryId) => {
   
    try {
      const response = await getAllStateList(countryId);
      
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Function to fetch cities by state ID
  const fetchCities = async (stateId) => {
   
    console.log("stateId",stateId);
    try {
      const response = await getAllCityList(stateId);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch countries on initial render
  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <LocationContext.Provider value={{ countries, states, cities, fetchStates, fetchCities }}>
      {children}
    </LocationContext.Provider>
  );
};