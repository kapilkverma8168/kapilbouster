import { GET_ID_INSITUTE_CLEAR_VERFIDATION_URL, GET_ORGANISATION_LIST, IMPORT_ADMIN_EXCEL } from "../../../config/adminUrlConfig";
import { ApiService, FileUploadService } from "../../../config/apiServices";

export const UploadAdminExcel = (data) => {
    return FileUploadService.post(IMPORT_ADMIN_EXCEL,data);
};


// export const getOrganisationList = (currentPage, perPage) => {
//     return ApiService.get(GET_ORGANISATION_LIST);
// };

export const getOrganisationList = (perPage,currentPage) => {
    return ApiService.get(`${GET_ORGANISATION_LIST}?number=${perPage}&page=${currentPage}`);
};



export const clearInsituteVerfication = (data) => {
    return ApiService.post(GET_ID_INSITUTE_CLEAR_VERFIDATION_URL,data);
};

