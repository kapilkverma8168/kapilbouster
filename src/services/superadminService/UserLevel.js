
  import { ApiService } from "../../config/apiServices";
  import { GET_CATEGORY_URL } from "../../config/superadmin/superadminUrlConfig";
  import { GET_USER_URL} from "../../config/adminUrlConfig";

  
  export const getAllUserLevel = () => {
    return ApiService.get(GET_USER_URL);
  };
  
  export const getAllUserCategory = () => {
    return ApiService.get(GET_CATEGORY_URL);
  };
  
 
  