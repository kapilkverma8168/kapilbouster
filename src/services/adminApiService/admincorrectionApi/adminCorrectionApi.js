import { GET_CORRECTION_LIST } from "../../../config/adminUrlConfig";
import { ApiService } from "../../../config/apiServices";

export const getCorrectionByID = (roletype,Id) => {
    return ApiService.get(`${GET_CORRECTION_LIST}/${roletype}/${Id}`);
}