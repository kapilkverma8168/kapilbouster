import { ApiService, FileUploadService } from "../../config/apiServices";
import { CREATE_CLIENT_URL, GET_CLIENT_URL,GET_CLIENT_BY_ID_URL,EDIT_CLIENT_URL, UPLOAD_CLIENT_LOGO } from "../../config/superadmin/superadminUrlConfig";


export const getAllClientList = (id) => {
    return ApiService.get(`${GET_CLIENT_URL}?page=${id}`);
  };


  export const getAllClientByIDList = (id) => {
    return ApiService.get(`${GET_CLIENT_BY_ID_URL}${id}`);
  };

  
  export const EditClient = (editData,id) => {
    return ApiService.post(`${EDIT_CLIENT_URL}${id}`, editData);
  };


  export const CreateAllClientList = (data) => {
    return ApiService.post(CREATE_CLIENT_URL,data);
  };

  
  export const UploadClientLogo = (data) => {
    return FileUploadService.post(UPLOAD_CLIENT_LOGO,data);
  };