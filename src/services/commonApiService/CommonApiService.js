import {  UnAuthApiService } from "../../config/apiServices";
import { GET_CITY_URL, GET_COUNTRY_URL, GET_STATE_URL } from "../../config/commonApiUrl/CommonApiUrlConfig";

export const getAllCountryList = () => {
  return null;
    return UnAuthApiService.get(GET_COUNTRY_URL);
};


export const getAllStateList = (countryId) => {
  return UnAuthApiService.get(`${GET_STATE_URL}${countryId}`);
};


export const getAllCityList = (stateId) => {
  return UnAuthApiService.get(`${GET_CITY_URL}${stateId}`);
};