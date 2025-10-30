import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import axiosInstance from "../../../../services/AxiosInstance";

const SportsFacilitiesMultiSelect = ({ onChange, selectedValues = [] }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/sports-name"); //please check the end-point
        const data = response.data.data;
        const formattedOptions = data.map((item) => ({
          label: item.sport_name,
          value: item.sport_id,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching sports/facilities options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div>
      <Select
        isMulti
        options={options}
        isLoading={loading}
        value={selectedValues.map((val) => options.find((opt) => opt.value == val))}
        onChange={(selected) => {
          const selectedIds = selected.map((option) => option.value);
          onChange(selectedIds); 
        }}
        placeholder="Select Sports/Facilities"
      />
    </div>
  );
};

export default SportsFacilitiesMultiSelect;
