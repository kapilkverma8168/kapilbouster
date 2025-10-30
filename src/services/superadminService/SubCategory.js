import { CREATE_SUB_CATEGORY_URL, GET_SUB_CATEGORY_BY_ID_URL, GET_SUB_CATEGORY_URL, UPDATE_SUB_CATEGORY_URL } from "../../config/superadmin/superadminUrlConfig";
import { ApiService } from "../../config/apiServices";


export const getAllSubCategory = () => {
    return ApiService.get(GET_SUB_CATEGORY_URL);
  }

  export const createSubCategory = (data) => {
    return ApiService.post(CREATE_SUB_CATEGORY_URL,data);
  }

  export const getSubCategoryById = (id) => {
    return ApiService.get(`${GET_SUB_CATEGORY_BY_ID_URL}${id}`);
  }
 

  export const updateSubCategory = (editData,id) => {
    return ApiService.post(`${UPDATE_SUB_CATEGORY_URL}${id}`, editData);
    
  }