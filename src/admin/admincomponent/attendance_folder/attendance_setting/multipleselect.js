import React, { useEffect } from "react";
import { MultiSelect as MultiSelectComp } from "react-multi-select-component";

function MultiSelect({ options = [], selected, setSelected }) {
  useEffect(() => {}, [options]);

  return (
    <div id="multiselect">
      <MultiSelectComp
        className="py-1"
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy="Select"
        overrideStrings={{
          search: "Type to search...",
          selectSomeItems: "Select User Types",
        }}
      />
    </div>
  );
}

export default MultiSelect;
