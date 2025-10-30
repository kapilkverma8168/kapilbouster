import { GET_ADMIN_SUB_CATEGORY_URL } from "../../../config/adminUrlConfig";
import { ApiService } from "../../../config/apiServices";

export const getAdminAllSubCategory = (categoryTypeId) => {
    return ApiService.get(`${GET_ADMIN_SUB_CATEGORY_URL}${categoryTypeId}`);
  }

 