import { GET_ID_INSITUTE_VERFICATION_URL, INSERT_INCORRECT_VERIFICATION_FORM_URL } from "../../../config/adminUrlConfig";
import { ApiService } from "../../../config/apiServices";

export const getInsituteverifyByID = (Id) => {
    return ApiService.get(`${GET_ID_INSITUTE_VERFICATION_URL}${Id}`);
  }

  export const insertCorrectionVerifcationForm= (data) => {
    return ApiService.post(INSERT_INCORRECT_VERIFICATION_FORM_URL,data);
  }