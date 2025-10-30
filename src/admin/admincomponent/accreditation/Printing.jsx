import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import image from '../../../images/pic3.jpg';
import id from '../../../images/id.jpg';
import { DataTable, StatCard, ErrorModal } from "../../../jsx/components/common";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PrinterIcon,
  ArrowReloadHorizontalIcon,
  UnavailableIcon,
  PassportValidIcon,
} from "@hugeicons/core-free-icons";
import PageTitle from "../../../jsx/layouts/PageTitle";
import Pagination from "../../../jsx/components/common/Pagination";
import { 
  enhancedAccreditationService, 
  getErrorMessage 
} from "../../../services/enhancedAccreditationApiService";

const Printing = () => {
  const [selected, setSelected] = useState(new Set());
  const [userType, setUserType] = useState("");
  const [page, setPage] = useState(1);
  const [printType, setPrintType] = useState("");
  const [data, setData] = useState([]); 
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("Error");
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const [userTypes, setUserTypes] = useState([]);
  const pageSize = 10;
  const fetchDataRef = useRef(async () => {});


  useEffect(() => {
    console.log("Printing component mounted");
    const fetchSummary = async () => {
      try {
        const response = await enhancedAccreditationService.getPrintingSummary();
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
        console.log("User types API response:", response);
        
        if (response.success && response.data) {
          setUserTypes(response.data);
          console.log("User types set successfully:", response.data);
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

 const stats = useMemo(() => {
    if (!summary) return [];
    return [
      {
        key: "approved",
        title: "Approved Accreditation",
        value: summary.approvedAccreditation ?? 0,
        icon: <HugeiconsIcon icon={PassportValidIcon} />,
      },
      {
        key: "printed",
        title: "Total Printed",
        value: summary.totalPrinted ?? 0,
        icon: <HugeiconsIcon icon={PrinterIcon} />,
      },
      {
        key: "reprint",
        title: "Total Reprint",
        value: summary.totalReprint ?? 0,
        icon: <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />,
      },
      {
        key: "blacklisted",
        title: "Blacklisted",
        value: summary.blackListed ?? 0,
        icon: <HugeiconsIcon icon={UnavailableIcon} />,
      },
    ];
  }, [summary]);

  const handlePrint = useCallback(async (rowId) => {
    try {
      const response = await enhancedAccreditationService.updatePrintStatus([rowId], "printed");
      if (response.success) {
        console.log(response.message || "Print status updated successfully");
        await fetchDataRef.current();
      } else {
        console.error(response.message || "Failed to update print status");
        setError(response.message || "Failed to update print status");
      }
    } catch (err) {
      console.error("Failed to update print status", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  }, []);

  const handleBlock = useCallback(async (rowId) => {
    try {
      const response = await enhancedAccreditationService.updateBlacklistStatus([rowId], "blocked");
      if (response.success) {
        console.log(response.message || "Card blocked successfully");
        await fetchDataRef.current();
      } else {
        console.error(response.message || "Failed to block card");
        setError(response.message || "Failed to block card");
      }
    } catch (err) {
      console.error("Failed to block card", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  }, []);

  const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: pageSize,
        };

        // Add user_type_id if userType is selected
        if (userType) {
          params.user_type_id = userType;
        }

        // Add status if printType is selected (backend expects 'status')
        if (printType) {
          params.status = printType; // 'printed' | 'not_printed'
        }

      console.log("Printing - calling /user/cards with params:", params);
      const response = await enhancedAccreditationService.getCards(params);
      console.log("Printing - fetchData params:", params);
      
      if (response.success && response.data) {
        const apiData = response.data;
        setTotalCount(response.totalItems || 0);

        const formatted = apiData.map((item) => {
          const isPrinted = (item.physical_print_status === "printed" || item.physical_print_status === "reprinted");
          const isBlocked = item.status === "blocked";
          
          return {
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
                alt=""
                width={55}
                height={55}
                style={{ objectFit: "contain" }}
              />
            ),
            idPhoto: (
              <img
                src={item.id_photo || id}
                alt=""
                width={55}
                height={55}
                style={{ objectFit: "contain" }}
              />
            ),
            userType: item.user_type,
            responsibleOrg: item.organization,
            createdBy: item.user_created_by_name || "Admin",
            isPrinted,
            isBlocked,
            action: (
              <div className="d-flex flex-column gap-2">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handlePreview({
                    firstName: item.full_name?.split(" ")[0] || "",
                    lastName: item.full_name?.split(" ")[1] || "",
                    email: item.email_id,
                    idNumber: item.kitd_unique_id,
                    phone: item.contact,
                    userType: item.user_type,
                    responsibleOrg: item.organization,
                    isPrinted
                  })}
                  >
                    Preview
                  </button>
                  {isPrinted ? (
                    <button
                      type="button"
                    className="btn btn-secondary btn-sm"
                      disabled
                    >
                      Printed
                    </button>
                  ) : (
                    <button
                      type="button"
                    className="btn btn-primary btn-sm"
                      onClick={() => handlePrint(item.id)}
                    >
                      Print
                    </button>
                  )}
                </div>
                {isPrinted && (
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={async () => {
                        try {
                          const response = await enhancedAccreditationService.updatePrintStatus([item.id], "printed");
                          if (response.success) {
                            await fetchDataRef.current();
                          } else {
                            setError(response.message || 'Failed to re-print');
                          }
                        } catch (e) {
                          console.error(e);
                          const errorMessage = getErrorMessage(e);
                          setError(errorMessage);
                        }
                      }}
                    >
                      Re-print
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${isBlocked ? 'btn-secondary' : 'btn-danger'}`}
                      onClick={() => handleBlock(item.id)}
                      disabled={isBlocked}
                      title={isBlocked ? 'Card is already blocked' : ''}
                    >
                      {isBlocked ? 'Blocked' : 'Block'}
                    </button>
                  </div>
                )}
              </div>
            ),
          };
        });
        setData(formatted);
      } else {
        throw new Error(response.message || "Failed to fetch data");
      }
      } catch (err) {
      console.log("Failed to fetch data", err);
      const msg = getErrorMessage(err);
      setError(msg);
      setErrorTitle("Resource not found");
      setErrorMessage(msg || "Record not found");
      setErrorOpen(true);
      } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataRef.current = fetchData;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [page, userType, printType]);

  const handlePreview = (item) => {
    // You can implement a modal or redirect to preview page here
    console.log("Preview item:", item);
    // For now, we'll just show an alert with item details
    const previewInfo = `
      Name: ${item.firstName} ${item.lastName}
      Email: ${item.email}
      ID Number: ${item.idNumber}
      Phone: ${item.phone}
      User Type: ${item.userType}
      Organization: ${item.responsibleOrg || 'N/A'}
      Print Status: ${item.isPrinted ? 'Printed' : 'Not Printed'}
    `;
    alert(previewInfo);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const columns = [
    { key: 'firstName', header: 'First Name', accessor: 'firstName' },
    { key: 'middleName', header: 'Middle Name', accessor: 'middleName' },
    { key: 'lastName', header: 'Last Name', accessor: 'lastName' },
    { key: 'email', header: 'Email Id', accessor: 'email' },
    { key: 'idNumber', header: 'ID Number', accessor: 'idNumber' },
    { key: 'phone', header: 'Phone', accessor: 'phone' },
    { key: 'userPhoto', header: 'User Photo', accessor: 'userPhoto' },
    { key: 'idPhoto', header: 'Id Photo', accessor: 'idPhoto' },
    { key: 'userType', header: 'User Type', accessor: 'userType' },
    { key: 'responsibleOrg', header: 'Responsible Organization', accessor: 'responsibleOrg' },
    { key: 'createdBy', header: 'Created By', accessor: 'createdBy' },
    { key: 'action', header: 'Action', accessor: 'action' },
  ];

  console.log("Current userTypes state:", userTypes);

  return (
    <div className="card">
      <PageTitle motherMenu={"Printing"} activeMenu={"Printing"} />
      <div>
        <div className="row mx-3">
          {stats.map((s) => (
            <div className="col-md-3" key={s.key}>
              <StatCard title={s.title} value={s.value} icon={s.icon} />
            </div>
          ))}
        </div>
        <div className="col-12">
          <div>
            <div className="card-header d-flex align-items-center justify-content-between border-bottom-0">
              <div className="d-flex align-items-center gap-3 w-100">
                <div className="w-25">
                  <select
                    className="form-select select-brand"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select User Type
                    </option>
                    {userTypes.length > 0 ? userTypes.map((type) => (
                      <option key={type.id} value={type.sub_category_id}>
                        {type.sub_category_name_view}
                      </option>
                    )) : (
                      <option value="" disabled>Loading user types...</option>
                    )}
                  </select>
                </div>
                <div className="w-25">
                  <select
                    className="form-select select-brand"
                    value={printType}
                    onChange={(e) => {
                      setPrintType(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select Print Type
                    </option>
                    <option value="printed">Printed</option>
                    <option value="not_printed">Not Printed</option>
                  </select>
                </div>
                <div className="ms-auto d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    disabled={selected.size === 0}
                    title={selected.size === 0 ? 'Select at least one row to enable' : ''}
                    onClick={async () => {
                      try {
                        const ids = Array.from(selected);
                        if (ids.length === 0) {
                          setError('Select at least one row to print');
                          return;
                        }
                        const response = await enhancedAccreditationService.updatePrintStatus(ids, "printed");
                        if (response.success) {
                          setSelected(new Set());
                          console.log(response.message || 'Print status updated successfully');
                          await fetchDataRef.current();
                        } else {
                          setError(response.message || 'Failed to update print status');
                        }
                      } catch (e) {
                        console.error(e);
                        const errorMessage = getErrorMessage(e);
                        setError(errorMessage);
                      }
                    }}
                  >
                    Print Selected
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        const params = {
                          page: 1,
                          limit: 1000
                        };
                        
                        if (userType) params.user_type_id = userType;
                        if (printType) {
                          if (printType === "printed") params.physical_print_status = "printed";
                          else if (printType === "not_printed") params.physical_print_status = "not_printed";
                        }

                        const response = await enhancedAccreditationService.exportData(params);
                        
                        if (response.success && response.data) {
                          // Create blob and trigger download
                          const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
                          
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          
                          // Generate filename with timestamp
                          const timestamp = new Date().toISOString().split('T')[0];
                          const filename = `printing_data_${timestamp}.csv`;
                          link.setAttribute("download", filename);
                          
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                          
                          console.log(response.message || "Data exported successfully");
                        } else {
                          setError(response.message || "Failed to export data");
                        }
                      } catch (e) {
                        console.error(e);
                        const errorMessage = getErrorMessage(e);
                        setError(errorMessage);
                      }
                    }}
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="alert alert-warning" role="alert">
                  {error}
                </div>
              )}
              {!loading && (
                <>
                  <DataTable
                    columns={columns}
                    data={data}
                    rowKey="id"
                    selectable
                    selectedRowIds={selected}
                    onSelectChange={setSelected}
                    showIndex
                    stickyHeader
                    maxBodyHeight={400}
                  />
                  <div className="d-flex justify-content-end">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ErrorModal
        open={errorOpen}
        title={errorTitle}
        message={errorMessage}
        onClose={() => {
          setErrorOpen(false);
          setError("");
        }}
      />
    </div>
  );
};

export default Printing;
