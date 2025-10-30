
import { ApiService } from "../../config/apiServices";
import { CREATE_CATEGORY_TYPE_URL, GET_CATEGORY_TYPE_BY_ID_URL, GET_CATEGORY_TYPE_URL, GET_CATEGORY_URL, UPDATE_CATEGORY_TYPE_URL } from "../../config/superadmin/superadminUrlConfig";



export const getAllUserCategory = () => {
  return ApiService.get(GET_CATEGORY_URL);
}

export const getAllCategoryType = () => {
    return ApiService.get(GET_CATEGORY_TYPE_URL);
  };

  export const createCategoryType = (data) => {
    return ApiService.post(CREATE_CATEGORY_TYPE_URL,data);
  }

  export const getCategoryTypeById = (categoryId) => {
    return ApiService.get(`${GET_CATEGORY_TYPE_BY_ID_URL}${categoryId}`);
   
  }
  
  export const updateCategoryType = (editData,id) => {
    return ApiService.post(`${UPDATE_CATEGORY_TYPE_URL}${id}`, editData);
    
  }