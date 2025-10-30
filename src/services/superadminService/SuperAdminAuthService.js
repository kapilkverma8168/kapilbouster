import { UnAuthApiService } from "../../config/apiServices";
import { SUPER_ADMIN_LOGIN_URL } from "../../config/superadmin/superadminUrlConfig";

export const SuperadminloginApi = (loginData) => {
    return UnAuthApiService.post(SUPER_ADMIN_LOGIN_URL,loginData);
}