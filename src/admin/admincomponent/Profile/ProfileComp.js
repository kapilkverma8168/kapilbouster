import React from "react";

const optionsGender = {
  male: "Male",
  female: "Female",
  other: "Other",
};

const ProfileComp = () => {
  const profileData = {
    profileImage:
      "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202108/AP21219464016565_1200x768.jpeg?size=690:388s",
    fullName: "Neeraj Chopra",
    gender: "male",
    sport: "Javelin Throw",
    colorCode: "#FFD700",
    categoryCode: "Athletics",
    functionalCode: "Gold Medalist",
    venuesAndZones: "Venue 1: Zone A, Zone B\nVenue 2: Zone C, Zone D",
  };

  return (
    <div className="row g-4">
      {/* Profile Image Section */}
      <div className="col-xl-3 col-lg-4">
        <div className="card profile-card border-0 shadow-sm">
          <div className="card-body text-center py-4">
            <img
              src={profileData.profileImage}
              alt="Profile"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "50%",
                marginBottom: "20px",
                border: "4px solid #e9ecef",
              }}
            />
            <h5 className="title mb-1">{profileData.fullName}</h5>
            <p className="text-muted mb-0">Athlete</p>
          </div>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="col-xl-9 col-lg-8">
        <div className="card profile-card border-0 shadow-sm">
          <div className="card-body p-4">
            <h4 className="mb-4 text-primary">Profile Details</h4>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex">
                <strong className="me-3" style={{ minWidth: "150px" }}>
                  Full Name:
                </strong>
                <span>{profileData.fullName}</span>
              </li>
              <li className="mb-3 d-flex">
                <strong className="me-3" style={{ minWidth: "150px" }}>
                  Gender:
                </strong>
                <span>{optionsGender[profileData.gender]}</span>
              </li>
              <li className="mb-3 d-flex">
                <strong className="me-3" style={{ minWidth: "150px" }}>
                  Sport:
                </strong>
                <span>{profileData.sport}</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <strong className="me-3" style={{ minWidth: "150px" }}>
                  Colour Code:
                </strong>
                <span
                  style={{
                    backgroundColor: profileData.colorCode,
                    color: "#000",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {profileData.colorCode}
                </span>
              </li>
              <li className="mb-3 d-flex">
                <strong className="me-3" style={{ minWidth: "150px" }}>
                  Category Code:
                </strong>
                <span>{profileData.categoryCode}</span>
              </li>
              <li className="mb-3 d-flex">
                <strong className="me-3" style={{ minWidth: "150px" }}>
                  Functional Code:
                </strong>
                <span>{profileData.functionalCode}</span>
              </li>
              <li className="d-flex">
                <strong className="me-3" style={{ minWidth: "150px" }}>
                  Venues and Zones:
                </strong>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    fontFamily: "inherit",
                  }}
                >
                  {profileData.venuesAndZones}
                </pre>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComp;
