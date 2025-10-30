// import React, { useMemo, useState } from "react";
// import PageTitle from "../../../jsx/layouts/PageTitle";
// import { DataTable } from "../../../jsx/components/common";
// import CreatePermissionModal from "../../../jsx/components/common/CreatePermissionModal";

// const AccessPermission = () => {
//   const [userType, setUserType] = useState("");
//   const [sport, setSport] = useState("");
//   const [gender, setGender] = useState("");
//   const [page, setPage] = useState(1);
//   const [open, setOpen] = useState(false);

//   const pageSize = 8;

//   const rows = useMemo(() => (
//     Array.from({ length: 18 }).map((_, i) => ({
//       id: i + 1,
//       userType: i % 2 ? "GMS" : "Broadcast",
//       gender: "Male",
//       sport: "Aquatics",
//       venue: i % 2 ? "Aquatics Stadium" : "Maharana pratap complex",
//       zone1: i % 2 ? "Yes" : "FOP",
//       zone2: i % 3 ? (i % 2 ? "-" : "Media") : "Yes",
//       dining: "D1",
//       transport: "T1",
//       color: "#000000",
//       edit: (
//         <button type="button" className="btn btn-outline-primary btn-sm">
//           <i className="fa fa-pen" />
//         </button>
//       ),
//     }))
//   ), []);

//   const totalPages = Math.ceil(rows.length / pageSize) || 1;
//   const data = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return rows.slice(start, start + pageSize);
//   }, [rows, page]);

//   const columns = [
//     { key: "userType", header: "User Type", accessor: "userType" },
//     { key: "gender", header: "Gender", accessor: "gender" },
//     { key: "sport", header: "Sport", accessor: "sport" },
//     { key: "venue", header: "Venue", accessor: "venue" },
//     { key: "zone1", header: "Zone 1 FOP", accessor: "zone1" },
//     { key: "zone2", header: "Zone 2 Broadcast", accessor: "zone2" },
//     { key: "dining", header: "Dining", accessor: "dining" },
//     { key: "transport", header: "Transport", accessor: "transport" },
//     { key: "color", header: "Colour Code", accessor: "color" },
//     { key: "edit", header: "Edit", accessor: "edit" },
//   ];

//   return (
//     <div className="card">
//       <PageTitle motherMenu={"Permission"} activeMenu={"Permission"} />

//       <div className="card-body">
//         <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-3">
//           <div className="d-flex gap-3 flex-wrap w-100">
//             <div className="flex-grow-1" style={{ minWidth: 240 }}>
//               <label className="form-label">Select User Type <span className="text-danger">*</span></label>
//               <select className="form-select select-brand" value={userType} onChange={(e) => setUserType(e.target.value)}>
//                 <option value="" disabled>Select User Type</option>
//                 <option>Broadcast</option>
//                 <option>GMS</option>
//               </select>
//             </div>
//             <div className="flex-grow-1" style={{ minWidth: 240 }}>
//               <label className="form-label">Select Sport <span className="text-danger">*</span></label>
//               <select className="form-select select-brand" value={sport} onChange={(e) => setSport(e.target.value)}>
//                 <option value="" disabled>Select Sport</option>
//                 <option>Aquatics</option>
//                 <option>Swimming</option>
//               </select>
//             </div>
//             <div className="flex-grow-1" style={{ minWidth: 240 }}>
//               <label className="form-label">Select Gender <span className="text-danger">*</span></label>
//               <select className="form-select select-brand" value={gender} onChange={(e) => setGender(e.target.value)}>
//                 <option value="" disabled>Select Gender</option>
//                 <option>Male</option>
//                 <option>Female</option>
//               </select>
//             </div>
//           </div>
//           <div className="d-flex gap-2 ms-auto">
//             <button className="btn btn-primary">Get Data</button>
//             <button className="btn btn-outline-primary" onClick={() => { setUserType(""); setSport(""); setGender(""); }}>Reset</button>
//             <button className="btn btn-primary" onClick={() => setOpen(true)}>Create permission</button>
//           </div>
//         </div>

//         <div className="table-responsive">
//           <DataTable
//             columns={columns}
//             data={data}
//             rowKey="id"
//             showIndex
//             stickyHeader
//             maxBodyHeight={420}
//           />
//         </div>

//         {totalPages > 1 && (
//           <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
//             <button className="btn btn-light" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>Previous</button>
//             <button className="btn btn-light" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</button>
//           </div>
//         )}
//       </div>

//       <CreatePermissionModal open={open} onClose={() => setOpen(false)} onCreate={() => {}} />
//     </div>
//   );
// };

// export default AccessPermission;
