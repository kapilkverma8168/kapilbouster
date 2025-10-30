import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import QRCodeComponent from "./QRcode"
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const QRCodeBackend = () => {
  const query = useQuery(); 
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const encryptedQR = query.get("token");
    console.log(encryptedQR);
    try {
      if (!encryptedQR) throw new Error("Missing token in query parameters");

      const decodedToken = JSON.parse(window.atob(encryptedQR.split(".")[1]));
      console.log(decodedToken);
      if (decodedToken) {
        setQrData({
          user_id: decodedToken.user_id,
          full_name: decodedToken.full_name,
          gender: decodedToken.gender,
          sport_name: decodedToken.sport_name,
          venue_name: decodedToken.venue_name,
          zone_names: decodedToken.zone_names,
          height: 512,
        });
      } else {
        throw new Error("Decoded token is empty or invalid");
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      setError(true); 
    }
  }, []); 

  return (
    <div>
      <QRCodeComponent data={qrData} error={error} />
    </div>
  );
};

export default QRCodeBackend;
