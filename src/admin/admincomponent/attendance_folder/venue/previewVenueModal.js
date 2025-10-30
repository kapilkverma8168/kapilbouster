// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { formatString } from "./venueModal";

// const CustomClearText = () => "clear all";
// const ClearIndicator = (props) => {
//   const {
//     children = <CustomClearText />,
//     getStyles,
//     innerProps: { ref, ...restInnerProps },
//   } = props;
//   return (
//     <div
//       {...restInnerProps}
//       ref={ref}
//       style={getStyles("clearIndicator", props)}
//     >
//       <div style={{ padding: "0px 5px" }}>{children}</div>
//     </div>
//   );
// };

// const ClearIndicatorStyles = (base, state) => ({
//   ...base,
//   cursor: "pointer",
//   color: state.isFocused ? "blue" : "black",
// });

// function VenueMultiSelect({
//   handleSubCategories = () => {},
//   subCategoryType = [],
//   data,
//   requiredValue = formatString(data?.notificationFor?.notification_for_name) !==
//   "website"
//     ? true
//     : false,
// }) {
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   useEffect(() => {
//     if (subCategoryType?.length === 0) {
//       setSelectedOptions([]);
//     }
//   }, [subCategoryType]);

//   const handleChange = (selectedOptions) => {
//     setSelectedOptions(selectedOptions);
//     handleSubCategories(selectedOptions);
//   };

//   const handleSelectAll = () => {
//     const allOptions = subCategoryType?.map((ele) => ({
//       label: ele?.sub_category_name,
//       value: ele?.sub_category_name.toLowerCase().split(" ").join(""),
//     }));
//     setSelectedOptions(allOptions);
//     handleSubCategories(allOptions);
//   };

//   const options =
//     data?.CategoryType !== ""
//       ? subCategoryType.map((ele) => ({
//           label: ele?.sub_category_name,
//           value: ele?.sub_category_name.toLowerCase().split(" ").join(""),
//         }))
//       : [];

//   const customOptions = [{ label: "All", value: "all" }, ...options];

//   const handleCustomChange = (selected) => {
//     if (selected.some((option) => option.value === "all")) {
//       handleSelectAll();
//     } else {
//       handleChange(selected);
//     }
//   };

//   return (
//     <Select
//       value={selectedOptions}
//       onChange={handleCustomChange}
//       closeMenuOnSelect={false}
//       components={{ ClearIndicator }}
//       styles={{ clearIndicator: ClearIndicatorStyles }}
//       isMulti
//       options={customOptions}
//       required={requiredValue}
//     />
//   );
// }

// export default React.memo(VenueMultiSelect);
