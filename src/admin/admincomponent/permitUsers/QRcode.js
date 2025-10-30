import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeComponent = ({ data, error }) => {
  if (error || !data) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        <h2>Invalid Token</h2>
        <p>The provided token is invalid or corrupted. Please check and try again.</p>
      </div>
    );
  }

  const encodedLink = `${window.location.origin}/profile?token=${btoa(
    JSON.stringify({
      user_id: data.user_id,
      full_name: data.full_name,
      gender: data.gender,
      sport_name: data.sport_name,
      venue_name: data.venue_name,
      zone_names: data.zones,
    })
  )}`;

  const handleDownload = () => {
    const canvas = document.querySelector(`#qr-code-${data.user_id} canvas`);
    if (canvas) {
      const link = document.createElement("a");
      link.download = `QRCode-${data.user_id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div
      id={`qr-code-${data.user_id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginTop: "20px",
      }}
    >
      <QRCodeCanvas
        value={encodedLink} // Encode the URL as QR data
        size={data.height || 128}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"H"}
        style={{ marginBottom: "10px" }}
      />
      {/* <button
        onClick={handleDownload}
        style={{
          backgroundColor: "#886cc0",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        Download QR Code
      </button> */}
    </div>
  );
};

export default QRCodeComponent;
