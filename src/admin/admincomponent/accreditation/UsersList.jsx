// import React, { useMemo, useState } from "react";
// import PageTitle from "../../../jsx/layouts/PageTitle";
// import { DataTable } from "../../../jsx/components/common";
// import userImg from "../../../images/user.jpg";
// import EditUserModal from "../../../jsx/components/common/EditUserModal";
// import { HugeiconsIcon } from "@hugeicons/react";
// import { PencilEdit02Icon } from "@hugeicons/core-free-icons";

// const UsersList = () => {
//   const [userType, setUserType] = useState("");
//   const [page, setPage] = useState(1);
//   const [selected, setSelected] = useState(new Set());
//   const [editing, setEditing] = useState(null);
//   const pageSize = 10;

//   const rows = useMemo(() => (
//     Array.from({ length: 28 }).map((_, i) => ({
//       id: i + 1,
//       firstName: "Ayush",
//       middleName: "Singh",
//       lastName: "Bhandari",
//       email: "ayushbhandari123@gmail.com",
//       idNumber: "1234 1234 1233 1233",
//       phone: "9876543210",
//       userPhoto: <img src={userImg} alt="user" width={40} height={40} style={{borderRadius: 6, objectFit: 'cover'}} />,
//       idPhoto: <img src={userImg} alt="id" width={40} height={40} style={{borderRadius: 6, objectFit: 'cover'}} />,
//       userType: i % 2 ? "GMS" : "Broadcast",
//       responsibleOrg: "Thomas Cook designs",
//       createdBy: "John Snow",
//       accrdFront: <button className="btn btn-outline-primary btn-sm">Preview</button>,
//       accrdBack: <button className="btn btn-outline-primary btn-sm">Preview</button>,
//       action: (
//         <div className="d-flex gap-2">
//           <button className="btn btn-outline-primary btn-sm">Sort for Printing</button>
//           <button className="btn btn-primary btn-sm">Ready for Printing</button>
//           <button className="btn btn-danger btn-sm">Disapprove</button>
//           <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing({
//             firstName: "Ayush",
//             middleName: "Singh",
//             lastName: "Bhandari",
//             email: "ayushbhandari123@gmail.com",
//             idNumber: "1234123412331233",
//             phone: "9876543210",
//             responsibleOrg: "Thomas Cook Design",
//             userType: "GMS",
//           })}><HugeiconsIcon icon={PencilEdit02Icon} /></button>
//         </div>
//       ),
//     }))
//   ), []);

//   const totalPages = Math.ceil(rows.length / pageSize) || 1;
//   const data = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return rows.slice(start, start + pageSize);
//   }, [rows, page]);

//   const columns = [
//     { key: 'firstName', header: 'First Name', accessor: 'firstName' },
//     { key: 'middleName', header: 'Middle Name', accessor: 'middleName' },
//     { key: 'lastName', header: 'Last Name', accessor: 'lastName' },
//     { key: 'email', header: 'Email Id', accessor: 'email' },
//     { key: 'idNumber', header: 'ID Number', accessor: 'idNumber' },
//     { key: 'phone', header: 'Phone Number', accessor: 'phone' },
//     { key: 'userPhoto', header: 'User Photo', accessor: 'userPhoto' },
//     { key: 'idPhoto', header: 'ID Photo', accessor: 'idPhoto' },
//     { key: 'userType', header: 'User Type', accessor: 'userType' },
//     { key: 'responsibleOrg', header: 'Responsible Organization', accessor: 'responsibleOrg' },
//     { key: 'createdBy', header: 'Created By', accessor: 'createdBy' },
//     { key: 'accrdFront', header: 'Accrd Front', accessor: 'accrdFront' },
//     { key: 'accrdBack', header: 'Accrd Back', accessor: 'accrdBack' },
//     { key: 'action', header: 'Action', accessor: 'action' },
//   ];

//   return (
//     <div className="card">
//       <PageTitle motherMenu={"Users List"} activeMenu={"Users List"} />

//       <div className="card-body">
//         <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
//           <div className="flex-grow-1" style={{ maxWidth: 320 }}>
//             <select className="form-select select-brand" value={userType} onChange={(e) => setUserType(e.target.value)}>
//               <option value="" disabled>Select User Type</option>
//               <option>GMS</option>
//               <option>Broadcast</option>
//             </select>
//           </div>
//           <div>
//             <button className="btn btn-primary">Export</button>
//           </div>
//         </div>

//         <DataTable
//           columns={columns}
//           data={data}
//           rowKey="id"
//           selectable
//           selectedRowIds={selected}
//           onSelectChange={setSelected}
//           showIndex
//           stickyHeader
//           maxBodyHeight={460}
//         />

//         {totalPages > 1 && (
//           <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
//             <button className="btn btn-light" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>Previous</button>
//             <button className="btn btn-light" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</button>
//           </div>
//         )}
//       </div>

//       <EditUserModal open={!!editing} user={editing} onClose={() => setEditing(null)} onSave={() => {}} />
//     </div>
//   );
// };

// export default UsersList;
