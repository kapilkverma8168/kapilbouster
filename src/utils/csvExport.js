export const exportToCSV = (data, filename, headers) => {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }

  if (!headers || headers.length === 0) {
    throw new Error("No headers provided for export");
  }

  const csvContent = [
    headers.join(","),
    ...data.map(item => 
      headers.map(header => {
        const value = item[header] || "";
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `${filename}_${timestamp}.csv`;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } else {
    window.open(url);
  }
};

export const formatDataForExport = (data) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(item => ({
    "First Name": item.full_name?.split(" ")[0] || "",
    "Last Name": item.full_name?.split(" ")[1] || "",
    "Email": item.email_id || "",
    "ID Number": item.kitd_unique_id || "",
    "Phone": item.contact || "",
    "User Type": item.user_type || "",
    "Organization": item.organization || "",
    "Created By": item.user_created_by_name || "Admin",
    "Print Status": item.physical_print_status || "not_printed",
    "Status": item.status || "active"
  }));
};
