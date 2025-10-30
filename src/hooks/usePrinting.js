import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  enhancedAccreditationService, 
  handleApiError, 
  getErrorMessage 
} from "../services/enhancedAccreditationApiService";

export const usePrinting = () => {
  const [selected, setSelected] = useState(new Set());
  const [userType, setUserType] = useState("");
  const [page, setPage] = useState(1);
  const [printType, setPrintType] = useState("");
  const [printedIds, setPrintedIds] = useState(new Set());
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [summary, setSummary] = useState(null);
  const [userTypes, setUserTypes] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  
  const pageSize = 10;

  const showSuccess = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  }, []);

  const fetchUserTypes = useCallback(async () => {
    try {
      const response = await enhancedAccreditationService.getUserTypes();
      console.log("usePrinting - User types API response:", response);
      
      if (response.success && response.data) {
        setUserTypes(response.data);
        console.log("usePrinting - User types set successfully:", response.data);
      } else {
        throw new Error(response.message || "Failed to fetch user types");
      }
    } catch (err) {
      console.error("Failed to fetch user types", err);
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
      setUserTypes([]);
    }
  }, [showError]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await enhancedAccreditationService.getPrintingSummary();
      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch summary");
      }
    } catch (err) {
      console.error("Failed to fetch summary", err);
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
    }
  }, [showError]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      const params = {
        page,
        limit: pageSize
      };
      
      if (userType) params.user_type_id = userType;
      if (printType) {
        if (printType === "PRINTED") params.physical_print_status = "printed";
        else if (printType === "REPRINT") params.physical_print_status = "reprinted";
        else if (printType === "BLOCKED") params.status = "blocked";
      }

      const response = await enhancedAccreditationService.getCards(params);
      
      if (response.success && response.data) {
        const apiData = response.data;
        setTotalCount(response.totalItems || 0);

        const formatted = apiData.map((item) => {
          const isPrinted = item.physical_print_status === "printed" || item.physical_print_status === "reprinted";
          const isBlocked = item.status === "blocked";
          
          if (isPrinted) {
            setPrintedIds((prev) => {
              const next = new Set(prev);
              next.add(item.id);
              return next;
            });
          }

          return {
            id: item.id,
            firstName: item.full_name?.split(" ")[0] || "",
            middleName: "",
            lastName: item.full_name?.split(" ")[1] || "",
            email: item.email_id,
            idNumber: item.kitd_unique_id,
            phone: item.contact,
            userPhoto: item.photo_url,
            idPhoto: item.id_photo,
            userType: item.user_type,
            responsibleOrg: item.organization,
            createdBy: item.user_created_by_name || "Admin",
            isPrinted,
            isBlocked
          };
        });
        
        setData(formatted);
      } else {
        throw new Error(response.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, userType, printType, showError]);

  const handlePrint = useCallback(async (rowId) => {
    try {
      const response = await enhancedAccreditationService.updatePrintStatus([rowId], "printed");
      if (response.success) {
        setPrintedIds((prev) => {
          const next = new Set(prev);
          next.add(rowId);
          return next;
        });
        showSuccess(response.message || "Print status updated successfully");
        await fetchData();
      } else {
        showError(response.message || "Failed to update print status");
      }
    } catch (err) {
      console.error("Failed to update print status", err);
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
    }
  }, [fetchData, showSuccess, showError]);

  const handleReprint = useCallback(async (rowId) => {
    try {
      // First, block the current card
      await enhancedAccreditationService.updateBlacklistStatus([rowId], "blocked");
      
      // Then, reprint the card using the same print API
      const response = await enhancedAccreditationService.updatePrintStatus([rowId], "printed");
      
      if (response.success) {
        // Check if there's a reprint_count in the response
        const cardData = response.data && response.data.find(card => card.id === rowId);
        const reprintCount = cardData?.reprint_count || 0;
        
        setPrintedIds((prev) => {
          const next = new Set(prev);
          next.add(rowId);
          return next;
        });
        
        showSuccess(`Card reprinted successfully. Reprint count: ${reprintCount}`);
        await fetchData();
      } else {
        showError(response.message || "Failed to reprint card");
      }
    } catch (err) {
      console.error("Failed to reprint card", err);
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
    }
  }, [fetchData, showSuccess, showError]);

  const handleBlock = useCallback(async (rowId) => {
    try {
      const response = await enhancedAccreditationService.updateBlacklistStatus([rowId], "blocked");
      if (response.success) {
        setPrintedIds((prev) => {
          const next = new Set(prev);
          next.delete(rowId);
          return next;
        });
        showSuccess(response.message || "Card blocked successfully");
        await fetchData();
      } else {
        showError(response.message || "Failed to block card");
      }
    } catch (err) {
      console.error("Failed to block card", err);
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
    }
  }, [fetchData, showSuccess, showError]);

  const handlePreview = useCallback((item) => {
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
      Block Status: ${item.isBlocked ? 'Blocked' : 'Active'}
    `;
    alert(previewInfo);
  }, []);

  const resetFilter = useCallback(async () => {
    setUserType("");
    setPrintType("");
    setPage(1);
    showSuccess("Filters reset successfully");
    await fetchData();
  }, [fetchData, showSuccess]);

  const handleExport = useCallback(async () => {
    try {
      setExportLoading(true);
      
      const params = {
        page: 1,
        limit: 1000
      };
      
      if (userType) params.user_type_id = userType;
      if (printType) {
        if (printType === "PRINTED") params.physical_print_status = "printed";
        else if (printType === "REPRINT") params.physical_print_status = "reprinted";
        else if (printType === "BLOCKED") params.status = "blocked";
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
        
        showSuccess(response.message || "Data exported successfully");
      } else {
        throw new Error(response.message || "Failed to export data");
      }
    } catch (err) {
      console.error("Failed to export data", err);
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
    } finally {
      setExportLoading(false);
    }
  }, [userType, printType, showSuccess, showError]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize) || 1, [totalCount, pageSize]);

  const stats = useMemo(() => {
    if (!summary) return [];
    return [
      {
        key: "approved",
        title: "Approved Accreditation",
        value: summary.approvedAccreditation ?? 0,
      },
      {
        key: "printed",
        title: "Total Printed",
        value: summary.totalPrinted ?? 0,
      },
      {
        key: "reprint",
        title: "Total Reprint",
        value: summary.totalReprint ?? 0,
      },
      {
        key: "blacklisted",
        title: "Blacklisted",
        value: summary.blackListed ?? 0,
      },
    ];
  }, [summary]);

  useEffect(() => {
    fetchUserTypes();
    fetchSummary();
  }, [fetchUserTypes, fetchSummary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    resetPage();
  }, [userType, printType, resetPage]);

  return {
    selected,
    setSelected,
    userType,
    setUserType,
    page,
    setPage,
    printType,
    setPrintType,
    data,
    totalCount,
    loading,
    error,
    setError,
    success,
    setSuccess,
    summary,
    userTypes,
    exportLoading,
    totalPages,
    stats,
    handlePrint,
    handleReprint,
    handleBlock,
    handlePreview,
    handleExport,
    resetFilter
  };
};
