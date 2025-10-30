// import React, { useMemo, useState } from "react";
// import { DataTable, AddZoneModal, AddTransportModal, AddDiningModal } from "../../../jsx/components/common";
// import { HugeiconsIcon } from "@hugeicons/react";
// import { Delete02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";

// const mockZones = Array.from({ length: 8 }).map((_, i) => ({
//   id: i + 1,
//   code: `Z${i + 1}`,
//   name: ["Main Arena", "Warm-up Pool", "Training Hall", "Media Center", "VIP Lounge", "Accreditation Center", "Dining Hall", "Transport Hub"][i] || `Zone ${i+1}`,
//   capacity: 100 + i * 25,
// }));

// const VenueManagement = () => {
//   const [page, setPage] = useState(1);
//   const pageSize = 6;

//   const [showAddZone, setShowAddZone] = useState(false);
//   const [showAddTransport, setShowAddTransport] = useState(false);
//   const [showAddDining, setShowAddDining] = useState(false);

//   const totalPages = Math.ceil(mockZones.length / pageSize) || 1;
//   const data = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return mockZones.slice(start, start + pageSize).map((z) => ({
//       ...z,
//       edit: (
//         <button type="button" className="btn btn-outline-primary btn-sm" disabled>
//           <HugeiconsIcon icon={PencilEdit02Icon} />
//         </button>
//       ),
//       remove: (
//         <button type="button" className="btn btn-outline-danger btn-sm" disabled>
//           <HugeiconsIcon icon={Delete02Icon} />
//         </button>
//       ),
//     }));
//   }, [page]);

//   const columns = [
//     { key: "code", header: "Zone Code", accessor: "code" },
//     { key: "name", header: "Zone Name", accessor: "name" },
//     { key: "capacity", header: "Capacity", accessor: "capacity" },
//     { key: "edit", header: "Edit", accessor: "edit" },
//     { key: "remove", header: "Delete", accessor: "remove" },
//   ];

//   return (
//     <div className="card">
//       <div className="card-body pb-0">
//         <h6 className="mb-2">Zone</h6>
//         <hr className="mt-0" />
//         <div className="d-flex align-items-center justify-content-between mb-3">
//           <div className="fw-semibold">Venue: Aquatics Venue</div>
//           <div className="d-flex gap-2">
//             <button className="btn btn-primary" onClick={() => setShowAddZone(true)}>
//               Add Zones
//             </button>
//             <button className="btn btn-primary" onClick={() => setShowAddTransport(true)}>
//               Add Transport
//             </button>
//             <button className="btn btn-primary" onClick={() => setShowAddDining(true)}>
//               Add Dining
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="card-body pt-0">
//         <DataTable
//           columns={columns}
//           data={data}
//           rowKey="id"
//           showIndex
//           stickyHeader
//           maxBodyHeight={400}
//         />
//         {totalPages > 1 && (
//           <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
//             <button className="btn btn-light" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>Previous</button>
//             <button className="btn btn-light" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</button>
//           </div>
//         )}
//       </div>

//       <AddZoneModal
//         open={showAddZone}
//         onClose={() => setShowAddZone(false)}
//         onSave={(payload) => {
//           // TODO: integrate API
//           console.log("Save Zone", payload);
//         }}
//       />

//       <AddTransportModal
//         open={showAddTransport}
//         onClose={() => setShowAddTransport(false)}
//         onSave={(payload) => {
//           // TODO: integrate API
//           console.log("Save Transport", payload);
//         }}
//       />

//       <AddDiningModal
//         open={showAddDining}
//         onClose={() => setShowAddDining(false)}
//         onSave={(payload) => {
//           // TODO: integrate API
//           console.log("Save Dining", payload);
//         }}
//       />
//     </div>
//   );
// };

// export default VenueManagement;
