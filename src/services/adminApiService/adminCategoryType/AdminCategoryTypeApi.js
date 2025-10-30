import { GET_ADMIN_CATEGORY_TYPE_URL } from "../../../config/adminUrlConfig";
import { ApiService } from "../../../config/apiServices";

export const getAdminCategoryType = () => {
    return ApiService.get(GET_ADMIN_CATEGORY_TYPE_URL);
  };