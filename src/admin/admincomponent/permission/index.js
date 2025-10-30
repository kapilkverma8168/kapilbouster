import PageTitle from "../../../jsx/layouts/PageTitle";
import PermissionModal from "./PermissionModal";

function usePermissionData() {
  return (
    <>
      <PageTitle activeMenu="Permission" motherMenu="Register" />
      <PermissionModal />
    </>
  );
}

export default usePermissionData;
