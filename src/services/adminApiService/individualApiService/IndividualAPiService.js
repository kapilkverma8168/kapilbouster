import { GET_ID_INDIVIDUAL_CLEAR_VERFIDATION_URL, GET_ID_INDIVIDUAL_VERFICATION_URL, GET_INDIVIDUAL_LIST } from "../../../config/adminUrlConfig";
import { ApiService } from "../../../config/apiServices";

export const getIndividaulList = (perPage,currentPage) => {
    return ApiService.get(`${GET_INDIVIDUAL_LIST}?number=${perPage}&page=${currentPage}`);
};


export const getIndividualVerfiedByID = (Id) => {
    return ApiService.get(`${GET_ID_INDIVIDUAL_VERFICATION_URL}${Id}`);
}


export const clearIndividualVerfication = (data) => {
    return ApiService.post(GET_ID_INDIVIDUAL_CLEAR_VERFIDATION_URL,data);
};