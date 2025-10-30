import { getAllCityList, getAllCountryList, getAllStateList } from '../services/commonApiService/CommonApiService';


const getCountryList =  async () => {
    const response = await getAllCountryList();
    console.log("getCountryList 1",response.data)
    return response.data
}

export const getCountryFromId = async (countryId) => {
  console.log("countryId===>")
    try {
      const response = await getCountryList();

      const country = response.find((country) => country.id == countryId);
      console.log("country===>",country);
      return country ? country.name : "Country not found";
    } catch (error) {
      console.error("Error fetching countries:", error);
      return "Country not found";
    }
  };



  const getStateList =  async (countryId) => {
    // console.log("getStateList countryId",countryId)
    const response = await getAllStateList(countryId);
    // console.log("getStateList 1",response.data)
    return response.data
}

export const getStateFromId = async (countryId,stateId) => {
  console.log("getStateFromId stateId",stateId)
    try {
      const response = await getStateList(countryId);
      console.log("getStateFromId response",response)
      const country = response.find((state) => state.id == stateId);
      return country ? country.name : "state not found";
    } catch (error) {
      console.error("Error fetching state:", error);
      return "state not found";
    }
  };


  const getCityList =  async (stateId) => {
    console.log("getCityList==>",stateId)
    const response = await getAllCityList(stateId);
    console.log("getCityList 1",response.data)
    return response.data
}

export const getCityFromId = async (stateId,cityid) => {
    console.log("cityid====>",stateId,cityid);
    try {
      const response = await getCityList(stateId);
      const city = response.find((city) => city.id == cityid);
      return city ? city.name : "city not found";
    } catch (error) {
      console.error("Error fetching city:", error);
      return "city not found";
    }
  };
