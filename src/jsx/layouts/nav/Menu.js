export const SuperAdminMenuList = [
  //Dashboard
  // {
  //   title: "Dashboard",
  //   classsChange: "mm-collapse",
  //   iconStyle: <i className="fas fa-home"></i>,
  // },
  // {
  //   title: "Client",
  //   classsChange: "mm-collapse",
  //   // update:"New",
  //   iconStyle: <i className="fas fa-users" />,
  //   content: [
  //     {
  //       title: "Client List",
  //       to: "super-admin-client",
  //     },
  //   ],
  // },
  // {
  //   title: "users Category",
  //   classsChange: "mm-collapse",
  //   // update:"New",
  //   iconStyle: <i className="fas fa-users" />,
  //   content: [
  //     {
  //         title:'User Level',
  //         to:'user-level'
  //     },
  //     {
  //         title:'User category',
  //         to:'user-category'
  //     },
  //     {
  //       title: "User Category Type",
  //       to: "user-category-type",
  //     },
  //     {
  //       title: "User Sub Category",
  //       to: "user-type",
  //     },
  //   ],
  // },
];
export const AdminMenuList = [
  {
    title: "Venue Management",
    to: "venue",
    iconStyle: <i class="fa fa-globe"></i>,
    content: [
      {
        title: "Venue",
        to: "venue",
      },
    ],
  },
  {
    title: "Access Permission",
    to: "communication",
    iconStyle: <i class="fa fa-compass"></i>,
    content: [
      {
        title: "Access Permission",
        to: "permission",
      },
      // {
      //   title: "Permit Users List",
      //   to: "permitusers",
      // },
    ],
  },
  {
    title: "User Type",
    classsChange: "mm-collapse",
    // update:"New",
    iconStyle: <i className="fa fa-puzzle-piece" />,
    content: [
      {
        title: "Create Parent Type",
        to: "user-category-type",
      },
      {
        title: "Create User Type",
        to: "user-type",
      },
    ],
  },
  {
    title: "Users",
    classsChange: "mm-collapse",
    // update:"New",
    iconStyle: <i className="fas fa-users" />,
    content: [
      {
        title: "Add New User",
        to: "create-new-user",
      },
      {
        title: "Users List",
        to: "approve-users",
      },
    ],
  },

  // New options added for sidebar
  // {
  //   title: "Template Setup",
  //   iconStyle: <i className="fa fa-file-alt" />,
  //   content: [
  //     { title: "Template Setup", to: "template-setup" },
  //   ],
  // },
  // {
  //   title: "Printing",
  //   iconStyle: <i className="fa fa-print" />,
  //   content: [
  //     { title: "Printing", to: "printing" },
  //   ],
  // },
  // {
  //   title: "Handover",
  //   iconStyle: <i className="fa fa-exchange-alt" />,
  //   content: [
  //     { title: "Handover", to: "handover" },
  //   ],
  // },

  {
    title: "Dining Attendance",
    classsChange: "mm-collapse",
    // update:"New",
    iconStyle: <i className="fas fa-utensils" />, 
    content: [
      {
        title: "Dining Attendance",
        to: "dining-attendance",
      },
    ],
  },

  // {
  //   title: "Attendance",
  //   classsChange: "mm-collapse",
  //   // update:"New",
  //   iconStyle: <i className="fas fa-list" />,
  //   content: [
  //     {
  //       title: "Marked",
  //       to: "attendance-listing",
  //     },
  //     {
  //       title: "Attendance Settings",
  //       to: "attendance-setting",
  //     },
  //     // {
  //     //   title: "Manpower Allocation",
  //     //   to: "attendance-allocation",
  //     // },
  //   ],
  // },
  // {
  //   title: "Manpower Allocation",
  //   classsChange: "mm-collapse",
  //   // update:"New",
  //   iconStyle: <i className="fas fa-list" />,
  //   content: [
  //     // {
  //     //   title: "Marked",
  //     //   to: "attendance-listing",
  //     // },
  //     // {
  //     //   title: "Attendance Settings",
  //     //   to: "attendance-setting",
  //     // },
  //     {
  //       title: "Manpower Allocation",
  //       to: "attendance-allocation",
  //     },
  //     {
  //       title: "Assign Supervisor",
  //       to: "assign-supervisor",
  //     },
  //   ],
  // },
];

export const allSubAdminroutes = [
  {
    title: "Add Users",
    classsChange: "mm-collapse",
    // update:"New",
    iconStyle: <i className="fas fa-users" />,
    content: [
      {
        title: "Add New User",
        to: "create-new-user",
      },
      {
        title: "Users List",
        to: "approve-users",
      },
    ],
  },
];

// "export const SuperAdminMenuList = [
//   //Dashboard
//   {
//     title: "Dashboard",
//     classsChange: "mm-collapse",
//     iconStyle: <i className="fas fa-home"></i>,
//   },
//   {
//     title: "Client",
//     classsChange: "mm-collapse",
//     // update:"New",
//     iconStyle: <i className="fas fa-users" />,
//     content: [
//       {
//         title: "Client List",
//         to: "super-admin-client",
//       },
//     ],
//   },
//   {
//     title: "users Category",
//     classsChange: "mm-collapse",
//     // update:"New",
//     iconStyle: <i className="fas fa-users" />,
//     content: [
//       {
//           title:'User Level',
//           to:'user-level'
//       },
//       {
//           title:'User category',
//           to:'user-category'
//       },
//       {
//         title: "User Category Type",
//         to: "user-category-type",
//       },
//       {
//         title: "User Sub Category",
//         to: "user-type",
//       },
//     ],
//   },
// ];
// export const AdminMenuList = [
//   //Dashboard
//   // {
//   //   title: "Dashboard",
//   //   classsChange: "mm-collapse",
//   //   iconStyle: <i className="fas fa-home"></i>,
//   // },
//   // {
//   //   title: "Manage Registration",
//   //   classsChange: "mm-collapse",
//   //   // update:"New",
//   //   iconStyle: <i className="fas fa-users" />,
//   //   content: [
//   //     {
//   //       title: "Institution List",
//   //       to: "Organization",
//   //     },
//   //     {
//   //       title: "Individual  List",
//   //       to: "Individual",
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: "Manage Verification",
//   //   classsChange: "mm-collapse",
//   //   // update:"New",
//   //   iconStyle: <i className="fas fa-suitcase" />,
//   //   content: [
//   //     {
//   //       title: "Institution  Verification List",
//   //       to: "verified-insitute-user",
//   //     },
//   //     {
//   //       title: "Individual Verification List",
//   //       to: "verified-individual-user",
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: "Communication",
//   //   to: "communication",
//   //   iconStyle: <i class="bi bi-chat-fill"></i>,
//   //   content: [
//   //     {
//   //       title: "Communication List",
//   //       to: "communication/communication-list",
//   //     },
//   //     {
//   //       title: "Website Notification List",
//   //       to: "communication/website-notification-list",
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: "Event Calendar",
//   //   to: "event/event-calendar",
//   //   iconStyle: <i class="bi bi-calendar-event-fill"></i>,
//   //   content: [
//   //     {
//   //       title: "Event Calendar",
//   //       to: "event/event-calendar",
//   //     },
//   //   ],
//   // },
//   // {
//   //   title: "Grievance Management",
//   //   to: "communication",
//   //   iconStyle: <i class="bi bi-chat-fill"></i>,
//   //   content: [
//   //     {
//   //       title: "Grievance Management",
//   //       to: "grievance-management",
//   //     },
//   //   ],
//   // },
//   {
//     title: "Venue Management",
//     to: "venue",
//     iconStyle: <i class="fa fa-globe"></i>,
//     content: [
//       {
//         title: "Venue",
//         to: "venue",
//       },
//     ],
//   },
//   {
//     title: "Access Permission",
//     to: "communication",
//     iconStyle: <i class="fa fa-compass"></i>,
//     content: [
//       {
//         title: "Access Permission",
//         to: "permission",
//       },
//       {
//         title: "Permit Users List",
//         to: "permitusers",
//       },
//     ],
//   },
//   {
//     title: "User Type",
//     classsChange: "mm-collapse",
//     // update:"New",
//     iconStyle: <i className="fa fa-puzzle-piece" />,
//     content: [
//       // {
//       //     title:'User Level',
//       //     to:'user-level'
//       // },
//       // {
//       //     title:'User category',
//       //     to:'user-category'
//       // },
//       // {
//       //   title: "User Category Type",
//       //   to: "user-category-type",
//       // },
//       {
//         title: "Create User Type",
//         to: "user-type",
//       },
//     ],
//   },
//   {
//     title: "Add Users",
//     classsChange: "mm-collapse",
//     // update:"New",
//     iconStyle: <i className="fas fa-users" />,
//     content: [
//       {
//         title: "Add New User",
//         to: "create-new-user",
//       },
//       {
//         title: "Users List",
//         to: "approve-users",
//       },
//     ],
//   },
//   {
//     title: "Attendance",
//     classsChange: "mm-collapse",
//     // update:"New",
//     iconStyle: <i className="fas fa-list" />,
//     content: [
//       {
//         title: "Marked",
//         to: "attendance-listing",
//       },
//       {
//         title: "Attendance Settings",
//         to: "attendance-setting",
//       },
//       // {
//       //   title: "Manpower Allocation",
//       //   to: "attendance-allocation",
//       // },
//     ],
//   },
//   {
//     title: "Manpower Allocation",
//     classsChange: "mm-collapse",
//     // update:"New",
//     iconStyle: <i className="fas fa-list" />,
//     content: [
//       // {
//       //   title: "Marked",
//       //   to: "attendance-listing",
//       // },
//       // {
//       //   title: "Attendance Settings",
//       //   to: "attendance-setting",
//       // },
//       {
//         title: "Manpower Allocation",
//         to: "attendance-allocation",
//       },
//     ],
//   },
// ];
