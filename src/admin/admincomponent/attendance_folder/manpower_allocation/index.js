import PageTitle from "../../../jsx/layouts/PageTitle";
import ManpowerAllocation from "./ManpowerAllocation";
import ManpowerListing from "./manpowerListing";

function useManpowerData() {
  return (
    <>
      <PageTitle activeMenu="Manpower Allocation" motherMenu="Attendance" />
      <ManpowerListing />
    </>
  );
}

export default useManpowerData;
