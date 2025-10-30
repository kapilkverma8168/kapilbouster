import React, { useEffect, useMemo, useState, useCallback } from "react";
import { DataTable, StatCard, Pagination, HandoverFlowModal } from "../../../jsx/components/common";
import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon, ShareIcon, ClockIcon } from "@hugeicons/core-free-icons";
import PageTitle from "../../../jsx/layouts/PageTitle";
import image from "../../../images/pic3.jpg";
import id from "../../../images/id.jpg";
import { 
  enhancedAccreditationService, 
  enhancedAccreditationHandoverService,
  handleApiError, 
  getErrorMessage 
} from "../../../services/enhancedAccreditationApiService";

const Handover = () => {
  const [selected, setSelected] = useState(new Set([2, 4]));
  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [handoverType, setHandoverType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data,setData]=useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await enhancedAccreditationService.getHandoverSummary();
        if (response.success && response.data) {
          setSummary(response.data);
        } else {
          console.error("Failed to fetch summary:", response.message);
        }
      } catch (err) {
        console.error("Failed to fetch summary", err);
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
      }
    };
    fetchSummary();
  }, []);


  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await enhancedAccreditationService.getUserTypes();
        console.log("Handover - User types API response:", response);
        
        if (response.success && response.data) {
          setUserTypes(response.data);
          console.log("Handover - User types set successfully:", response.data);
        } else {
          throw new Error(response.message || "Failed to fetch user types");
        }
      } catch (err) {
        console.error("Failed to fetch user types", err);
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setUserTypes([]);
      }
    };
    fetchUserTypes();
  }, []);


  // const stats = [
  //   {
  //     key: "printed",
  //     title: "Printed Record",
  //     value: 123,
  //     icon: <HugeiconsIcon icon={PrinterIcon} />,
  //   },
  //   {
  //     key: "handed",
  //     title: "Records Handedover",
  //     value: 35,
  //     icon: <HugeiconsIcon icon={ShareIcon} />,
  //   },
  //   {
  //     key: "pending",
  //     title: "Total Pending",
  //     value: 23,
  //     icon: <HugeiconsIcon icon={ClockIcon} />,
  //   },
  // ];


 const stats = useMemo(() => {
    if (!summary) return [];
    return[
    {
      key: "printed",
      title: "Printed Record",
      value: summary.printedAccred||0,
      icon: <HugeiconsIcon icon={PrinterIcon} />,
    },
    {
      key: "handed",
      title: "Records Handedover",
      value: summary.accredsHandedover||0,
      icon: <HugeiconsIcon icon={ShareIcon} />,
    },
    {
      key: "pending",
      title: "Total Pending",
      value: summary.totalPending||0,
      icon: <HugeiconsIcon icon={ClockIcon} />,
    },
  ];
  }, [summary]);

  // const data = useMemo(
  //   () =>
  //     Array.from({ length: 8 }).map((_, i) => ({
  //       id: i + 1,
  //       firstName: "Ayush",
  //       middleName: "Singh",
  //       lastName: "Bhandari",
  //       email: "ayushbhandari123@gmail.com",
  //       idNumber: "1234123412331233",
  //       phone: "7521860156",
  //       userPhoto: (
  //         <img
  //           src={image}
  //           alt=""
  //           width={55}
  //           height={55}
  //           style={{ objectFit: "contain" }}
  //         />
  //       ),
  //       idPhoto: (
  //         <img
  //           src={id}
  //           alt=""
  //           width={55}
  //           height={55}
  //           style={{ objectFit: "contain" }}
  //         />
  //       ),
  //       userType: "GMS",
  //       responsibleOrg: "Thomas Cook Designs",
  //       createdBy: "Admin",
  //       handOver: (
  //         <button className="btn btn-primary handoverbutton">Hand Over</button>
  //       ),
  //     })),
  //   []
  // );





  const handleExport = useCallback(async () => {
    try {
      // Determine include_handover value based on handoverType selection
      let includeHandover = undefined;
      if (handoverType === "HANDED_OVER") {
        includeHandover = true;
      } else if (handoverType === "PENDING") {
        includeHandover = false;
      }

      const params = {
        page: 1,
        limit: 1000,
        user_type_id: selectedUserType || undefined,
        include_handover: includeHandover,
      };

      const response = await enhancedAccreditationService.exportData(params);
      
      if (response.success && response.data) {
        // Create blob and trigger download
        const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `handover_data_${timestamp}.csv`;
        link.setAttribute("download", filename);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log(response.message || "Data exported successfully");
      } else {
        throw new Error(response.message || "Failed to export data");
      }
    } catch (err) {
      console.error("Export failed", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  }, [selectedUserType, handoverType]);



  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Determine include_handover value based on handoverType selection
      let includeHandover = undefined;
      if (handoverType === "HANDED_OVER") {
        includeHandover = true;
      } else if (handoverType === "PENDING") {
        includeHandover = false;
      }

      const params = {
        page,
        limit: pageSize,
        user_type_id: selectedUserType || undefined,
        include_handover: includeHandover,
      };

      const response = await enhancedAccreditationService.getCards(params);
      
      if (response.success && response.data) {
        const items = response.data;
        const formatted = items.map((item, index) => ({
          id: item.id,
          firstName: item.full_name?.split(" ")[0] || "",
          middleName: "",
          lastName: item.full_name?.split(" ")[1] || "",
          email: item.email_id,
          idNumber: item.kitd_unique_id,
          phone: item.contact,
          userPhoto: (
            <img
              src={item.photo_url || image}
              alt="user"
              width={55}
              height={55}
              style={{ objectFit: "contain" }}
            />
          ),
          idPhoto: (
            <img
              src={item.id_photo || id}
              alt="id"
              width={55}
              height={55}
              style={{ objectFit: "contain" }}
            />
          ),
          userType: item.user_type,
          responsibleOrg: item.organization,
          createdBy: item.user_created_by_name,
          virtualPrintStatus: item.virtual_print_status,
          handOver: (
            <button className="btn btn-primary handoverbutton" onClick={() => {
              setSelected(new Set([item.id]));
              setModalOpen(true);
            }}>Hand Over</button>
          ),
        }));

        setData(formatted);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalItems || 0);
      } else {
        throw new Error(response.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, selectedUserType, handoverType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
 



  useEffect(() => {
    setPage(1);
  }, [userTypes, handoverType]);

  const columns = [
    { key: "firstName", header: "First Name", accessor: "firstName" },
    { key: "middleName", header: "Middle Name", accessor: "middleName" },
    { key: "lastName", header: "Last Name", accessor: "lastName" },
    { key: "email", header: "Email Id", accessor: "email" },
    { key: "idNumber", header: "ID Number", accessor: "idNumber" },
    { key: "phone", header: "Phone", accessor: "phone" },
    { key: "userPhoto", header: "User Photo", accessor: "userPhoto" },
    { key: "idPhoto", header: "Id Photo", accessor: "idPhoto" },
    { key: "userType", header: "User Type", accessor: "userType" },
    {
      key: "responsibleOrg",
      header: "Responsible Organization",
      accessor: "responsibleOrg",
    },
    { key: "virtualPrintStatus", header: "Print Status", accessor: "virtualPrintStatus" },
    { key: "createdBy", header: "Created By", accessor: "createdBy" },
    { key: "handOver", header: "Hand Over", accessor: "handOver" },
  ];

  console.log("Handover - Current userTypes state:", userTypes);

  return (
    <>
      <div className="card">
        <PageTitle motherMenu={"Handover"} activeMenu={"Handover"} />
        <div>
          <div className="row mx-3 ">
            {stats.map((s) => (
              <div className="col-md-4" key={s.key}>
                <StatCard title={s.title} value={s.value} icon={s.icon} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-12">
          <div>
            <div className="card-header d-flex align-items-center justify-content-between border-bottom-0">
              <div className="d-flex align-items-center gap-3 w-100">
                <div className="w-25 bg-transparent">
                  <select
                    className="form-select select-brand"
                    value={selectedUserType}
                    onChange={(e) => setSelectedUserType(e.target.value)}
                  >
                    <option value="">Select User Type</option>
                    {userTypes.length > 0 ? userTypes.map((type) => (
                      <option key={type.id} value={type.sub_category_id}>
                        {type.sub_category_name_view}
                      </option>
                    )) : (
                      <option value="" disabled>Loading user types...</option>
                    )}
                  </select>
                </div>
                <div className="w-25 bg-transparent">
                  <select
                    className="form-select select-brand"
                    value={handoverType}
                    onChange={(e) => setHandoverType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Handover Type
                    </option>
                    <option value="HANDED_OVER">Handed Over</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
                <div className="ms-auto d-flex gap-2">
                  <button className="btn btn-outline-primary" disabled={!selected || selected.size === 0} onClick={() => setModalOpen(true)}>Handover Record</button>
                  <button className="btn btn-primary" onClick={handleExport}>Export</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? (<p>Loading...</p>):(<>
               <DataTable
                columns={columns}
                data={data}
                rowKey="id"
                selectable
                selectedRowIds={selected}
                onSelectChange={setSelected}
                showIndex
                stickyHeader
                maxBodyHeight={420}
                page={page}
                pageSize={pageSize}
                total={totalItems}
              />
              <div className="d-flex justify-content-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
              </>)}
             
            </div>
          </div>
        </div>
      </div>
      <HandoverFlowModal
        open={modalOpen}
        selectedCount={selected?.size || 0}
        onClose={() => setModalOpen(false)}
        onConfirm={async (pocName, pocContact, handoverDate, handoverTime) => {
          try {
            const ids = Array.from(selected);
            const payload = { handover_to_name: pocName, handover_to_phone: pocContact, handover_date: handoverDate, handover_time: handoverTime };
            const response = await enhancedAccreditationHandoverService.handoverCards(ids, payload);
            if (response.success) {
              // refresh data and close modal
              setSelected(new Set());
              setModalOpen(false);
              await fetchData();
              console.log(response.message || 'Cards handed over successfully');
            } else {
              setError(response.message || 'Failed to handover');
            }
          } catch (e) {
            console.error(e);
            const errorMessage = getErrorMessage(e);
            setError(errorMessage);
          }
        }}
      />
    </>
  );
};

export default Handover;
