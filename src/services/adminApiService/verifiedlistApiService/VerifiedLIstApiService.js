import { resolveMotionValue } from "framer-motion";
import { GET_VERIFIED_LIST, GET_VERIFIED_VIEW_LIST } from "../../../config/adminUrlConfig";
import { ApiService } from "../../../config/apiServices";

export const getVerifieddataList = (roletype,perPage,currentPage) => {
    
    return ApiService.get(`${GET_VERIFIED_LIST}/${roletype}?number=${perPage}&page=${currentPage}`);
};


export const getVerfiedViewByID = (typeId,Id) => {
  
    return ApiService.get(`${GET_VERIFIED_VIEW_LIST}${typeId}/${Id}`);
}