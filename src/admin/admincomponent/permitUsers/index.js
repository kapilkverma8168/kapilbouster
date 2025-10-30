import { useNavigate } from "react-router-dom";
import PageTitle from "../../../jsx/layouts/PageTitle";
import { PermitUserProvider } from "./PermitUserContext";
import PermitUserModal from "./PermitUserModal";
import { Button } from "react-bootstrap";

function usePermitData() {
  const navigate = useNavigate();
  return (
    <>
      <PermitUserProvider>
        <PageTitle
          activeMenu="Users"
          motherMenu="Permit"
          Button={() => <Button onClick={() => navigate(-1)}>Back</Button>}
        />
        <PermitUserModal />
      </PermitUserProvider>
    </>
  );
}

export default usePermitData;
