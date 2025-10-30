import React, { Fragment, useEffect, useState } from "react";

import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import { verifyFormData } from "./VerifyForm";
import { FaUserLarge } from "react-icons/fa6";

import RemarkModal from "./RemarkModal";

import { getInsituteverifyByID } from "../../../services/adminApiService/insituteVerficationApi/InsituteVerficationApiService";
import { useParams } from "react-router-dom";
import InsituteVerficationMapping from "../../../utils/maping/InsituteVerficationMapping";
import NotCleardCard from "./NotCleardCard";
import CleardCard from "./CleardCard";
import {
  clearIndividualVerfication,
  getIndividualVerfiedByID,
} from "../../../services/adminApiService/individualApiService/IndividualAPiService";
import ViewProject from "../../../jsx/pages/WidgetBasic/ViewProject";
import {
  formatLable,
  formatStatus,
  getStatusColor,
} from "../../../utils/colorAsperStatus";
import IndividualDetails from "./IndividualDetails";
import doc from "../../../images/google-docs.png";
import imgPdf from "../../../images/pdf.png";
import {
  getCityFromId,
  getCountryFromId,
  getStateFromId,
} from "../../../utils/CountryConveter";
import { getCorrectionByID } from "../../../services/adminApiService/admincorrectionApi/adminCorrectionApi";

const IndividualVerificationForm = ({ roletype }) => {
  const { id } = useParams();
  const [remarkshowModal, setRemarkshowModal] = useState(false);
  const [verifyProfileRadio, setVerifyProfileRadio] = useState(false);
  const [showremarkrCard, setshowremarkCard] = useState(true);
  const [verficationList, setVerficationList] = useState({});
  const [insituteVerifyList, setInsituteVerifyList] = useState([]);

  const [correctionData, setCorrectionData] = useState([]);

  console.log("showremarkrCard", showremarkrCard);
  const [remarkdata, setRemarkdata] = useState("");
  const [currentRemarkId, setCurrentRemarkId] = useState(null);

  useEffect(() => {
    const fetchVerificationList = async () => {
      try {
        const response = await getIndividualVerfiedByID(id);
        setVerficationList(response?.data?.data);
      } catch (error) {
        console.error("Error fetching verification list:", error);
      }
    };

    fetchVerificationList();
  }, [id]);
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const fetchCountryName = async () => {
    const storedRemarks =
      JSON.parse(localStorage.getItem(`remarksIndividual`)) || {};

    if (Object.keys(verficationList).length > 0) {
      const countryName = await getCountryFromId(verficationList.country);
      const stateName = await getStateFromId(
        verficationList.country,
        verficationList.state
      );
      const cityName = await getCityFromId(
        verficationList.state,
        verficationList?.city
      );
      const baseList = [
        {
          id: 1,
          label: "Name",
          value: verficationList?.first_name,
          key: "first_name",
          isError: !!storedRemarks[1],
          action: false,
          remark: storedRemarks[1] || "",
        },
        {
          id: 2,
          label: "Date of Birth",
          value: verficationList?.dob,
          key: "dob",
          isError: !!storedRemarks[2],
          action: false,
          remark: storedRemarks[2] || "",
        },
        {
          id: 3,
          label: "Age",
          value: verficationList?.age,
          key: "age",
          isError: !!storedRemarks[3],
          action: false,
          remark: storedRemarks[3] || "",
        },
        {
          id: 4,
          label: "Gender",
          value: verficationList?.gender,
          key: "gender",
          isError: !!storedRemarks[4],
          action: false,
          remark: storedRemarks[4] || "",
        },
        {
          id: 5,
          label: "Mobile",
          value: verficationList?.mobile,
          key: "mobile",
          isError: !!storedRemarks[5],
          action: false,
          remark: storedRemarks[5] || "",
        },
        {
          id: 6,
          label: "Email",
          value: verficationList?.email,
          key: "email",
          isError: !!storedRemarks[6],
          action: false,
          remark: storedRemarks[6] || "",
        },
        {
          id: 7,
          label: "Address",
          value: verficationList?.address,
          key: "address",
          isError: !!storedRemarks[7],
          action: false,
          remark: storedRemarks[7] || "",
        },
        {
          id: 8,
          label: "Landmark",
          value: verficationList?.landmark,
          key: "landmark",
          isError: !!storedRemarks[8],
          action: false,
          remark: storedRemarks[8] || "",
        },
        {
          id: 9,
          label: "Country",
          value: countryName,
          key: "country",
          isError: !!storedRemarks[9],
          action: false,
          remark: storedRemarks[9] || "",
        },
        {
          id: 10,
          label: "State",
          value: stateName,
          key: "state",
          isError: !!storedRemarks[10],
          action: false,
          remark: storedRemarks[10] || "",
        },
        {
          id: 11,
          label: "City",
          value: cityName,
          key: "city",
          isError: !!storedRemarks[11],
          action: false,
          remark: storedRemarks[11] || "",
        },
        {
          id: 12,
          label: "Pincode",
          value: verficationList?.pincode,
          key: "pincode",
          isError: !!storedRemarks[12],
          action: false,
          remark: storedRemarks[12] || "",
        },
        {
          id: 13,
          label: "Sport Name",
          value: verficationList?.refsport?.sport_name,
          key: "sport_id",
          isError: !!storedRemarks[13],
          action: false,
          remark: storedRemarks[13] || "",
        },
        {
          id: 14,
          label: "Kit Size",
          value: verficationList?.kit_size,
          key: "kit_size",
          isError: !!storedRemarks[14],
          action: false,
          remark: storedRemarks[14] || "",
        },
        {
          id: 15,
          label: "Athlete Level",
          value: verficationList?.athlete_level,
          key: "athlete_level",
          isError: !!storedRemarks[15],
          action: false,
          remark: storedRemarks[15] || "",
        },
        {
          id: 16,
          label: "Account Holder Name",
          value: verficationList?.account_holder_name,
          key: "account_holder_name",
          isError: !!storedRemarks[16],
          action: false,
          remark: storedRemarks[16] || "",
        },
        {
          id: 17,
          label: "Bank Account Number",
          value: verficationList?.bank_account_number,
          key: "bank_account_number",
          isError: !!storedRemarks[17],
          action: false,
          remark: storedRemarks[17] || "",
        },
        {
          id: 18,
          label: "IFSC Code",
          value: verficationList?.ifsc_code,
          key: "ifsc_code",
          isError: !!storedRemarks[18],
          action: false,
          remark: storedRemarks[18] || "",
        },
        {
          id: 19,
          label: "Branch Name",
          value: verficationList?.branch_name,
          key: "branch_name",
          isError: !!storedRemarks[19],
          action: false,
          remark: storedRemarks[19] || "",
        },
        {
          id: 20,
          label: "Education Level",
          value: verficationList?.education_level,
          key: "education_level",
          isError: !!storedRemarks[20],
          action: false,
          remark: storedRemarks[20] || "",
        },
        {
          id: 21,
          label: "Marital Status",
          value: verficationList?.maritial_status,
          key: "maritial_status",
          isError: !!storedRemarks[21],
          action: false,
          remark: storedRemarks[21] || "",
        },
        {
          id: 22,
          label: "Highest Achievement",
          value: verficationList?.highest_achievement,
          key: "highest_achievement",
          isError: !!storedRemarks[22],
          action: false,
          remark: storedRemarks[22] || "",
        },
        {
          id: 23,
          label: "Identity Card",
          value: verficationList?.identity_card,
          key: "identity_card",
          isError: !!storedRemarks[23],
          action: false,
          remark: storedRemarks[23] || "",
        },
      ];

      if (
        verficationList.registration_docs &&
        Array.isArray(verficationList.registration_docs)
      ) {
        verficationList.registration_docs.forEach((doc, index) => {
          const displayLabel =
            doc.doc_name === "other" ? "Last Year Marksheet" : doc.doc_name;
          baseList.push({
            id: 24 + index, // Assuming the IDs continue sequentially
            label: displayLabel,
            value: doc.doc_file, // Assuming you want to display the file or use doc_name
            key: `registration_doc_${index + 1}`,
            action: false,
            remark: storedRemarks[24 + index] || "",
            isError: !!storedRemarks[24 + index],
          });
        });
      }

      setInsituteVerifyList(baseList);
    }
  };

  useEffect(() => {
    fetchCountryName();
  }, [verficationList]);

  const handleRadioChange = (id) => {
    setCurrentRemarkId(id);
    setRemarkshowModal(true);
    setshowremarkCard(false);

    insituteVerifyList.map((data) => {
      if (id == data.id) {
        data.isError = true;
      }
    });
  };

  const handleRadiogreenChange = (id) => {
    const storedIndividualRemarks =
      JSON.parse(localStorage.getItem("remarksIndividual")) || {};
    delete storedIndividualRemarks[id];
    localStorage.setItem(
      "remarksIndividual",
      JSON.stringify(storedIndividualRemarks)
    );
    fetchCountryName();
    setCurrentRemarkId(id);
    const dataAfterr =
      JSON.parse(localStorage.getItem("remarksIndividual")) || {};

    const isEmpty = Object.keys(storedIndividualRemarks).length === 0;
    console.log("isEmpty===>", isEmpty);
    if (isEmpty) {
      setshowremarkCard(true);
    }
    insituteVerifyList.map((data) => {
      if (id == data.id) {
        data.isError = false;
      }
    });

    // storedIndividualRemarks[currentRemarkId] = "";
    // console.log("storedIndividualRemarks after",storedIndividualRemarks[currentRemarkId])
  };

  const updateRemark = (remark) => {
    const updatedList = insituteVerifyList.map((item) => {
      if (item.id === currentRemarkId) {
        return { ...item, remark };
      }
      return item;
    });

    setInsituteVerifyList(updatedList);
    const storedIndividualRemarks =
      JSON.parse(localStorage.getItem(`remarksIndividual`)) || {};
    storedIndividualRemarks[currentRemarkId] = remark;
    localStorage.setItem(
      `remarksIndividual`,
      JSON.stringify(storedIndividualRemarks)
    );
  };

  useEffect(() => {
    const storedIndividualRemarks =
      JSON.parse(localStorage.getItem("remarksIndividual")) || {};

    // Check if storedRemarks is empty
    const isEmpty = Object.keys(storedIndividualRemarks).length === 0;

    // Conditionally set showremarkCard to true if storedRemarks is empty
    if (isEmpty) {
      setshowremarkCard(true);
    } else {
      setshowremarkCard(false);
    }
  }, [insituteVerifyList]);

  const profileImage = insituteVerifyList.find(
    (item) => item.label === "profile_image"
  );

  const getCorrectionList = async (roletype, id) => {
    try {
      const response = await getCorrectionByID(roletype, id);
      const correctionData = response?.data?.data;

      if (correctionData && correctionData.registration_correction) {
        const storedRemarks =
          JSON.parse(localStorage.getItem("remarksIndividual")) || {};
        // console.log("storedRemarks",storedRemarks);
        correctionData.registration_correction.forEach((correction, index) => {
          if (correction.remark) {
            storedRemarks[correction.id] = correction.remark;
          }
        });

        localStorage.setItem(
          "remarksIndividual",
          JSON.stringify(storedRemarks)
        );
        setInsituteVerifyList((prevList) =>
          prevList.map((item) =>
            item.id === id ? { ...item, remarks: storedRemarks } : item
          )
        );
      }

      setCorrectionData(correctionData);
    } catch (error) {
      console.error("Error fetching verification list:", error);
    }
  };

  useEffect(() => {
    getCorrectionList(roletype, id);
  }, [id]);

  return (
    <>
      <IndividualDetails verficationList={verficationList} />
      <div className="row">
        <Col lg={12} className="mb-3">
          <Card style={{ height: "35vh" }}>
            <Card.Header>
              <Card.Title className="text-danger">VERIFY PHOTO</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Student Profile Photo</th>
                    <th>Action</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>

                    <td>
                      {profileImage?.value ? (
                        <img
                          src={profileImage?.value}
                          alt="Profile"
                          style={{ width: "50px", height: "50px" }}
                        />
                      ) : (
                        "Photo not available"
                      )}
                    </td>
                    <td>
                      <div className="d-flex">
                        <div className="form-check">
                          <input
                            className="form-check-input bg-success"
                            type="radio"
                            name={`gridRadios-${profileImage?.id}`}
                            value="option1"
                            checked={!profileImage?.isError}
                            onChange={() =>
                              handleRadiogreenChange(profileImage?.id)
                            }
                          />
                        </div>
                        <div className="form-check mx-2">
                          <input
                            className="form-check-input bg-danger"
                            type="radio"
                            name={`gridRadios-${profileImage?.id}`}
                            value="option1"
                            checked={profileImage?.isError}
                            onClick={(event) =>
                              handleRadioChange(profileImage?.id)
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td>{profileImage?.remark}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="mb-3" style={{ height: "auto" }}>
            <Card.Header>
              <Card.Title className="text-danger">
                VERIFY FORM FIELDS & DOCUMENTS
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Form Fields</th>
                    <th>Action</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {insituteVerifyList
                    .filter((data) => data.value)
                    .map((data, index) => {
                      return (
                        <>
                          {" "}
                          {data.label === "profile_image" ? (
                            " "
                          ) : (
                            <tr key={data.id}>
                              <td>{index + 1}</td>
                              <td>
                                <span style={{ color: "#886CC0" }}>
                                  <strong>{formatLable(data?.label)}</strong>
                                </span>
                                <br />
                                {isValidUrl(data.value) ? (
                                  <div>
                                    {data.value.includes(".pdf") ? (
                                      <img
                                        src={imgPdf}
                                        alt={data.label}
                                        style={{
                                          maxWidth: "100px",
                                          height: "auto",
                                        }}
                                      />
                                    ) : data.value.includes(".doc") ? (
                                      <img
                                        src={doc}
                                        alt={data.label}
                                        style={{
                                          maxWidth: "100px",
                                          height: "auto",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={data.value}
                                        alt={data.label}
                                        style={{
                                          maxWidth: "100px",
                                          height: "auto",
                                        }}
                                      />
                                    )}
                                    <a
                                      href={data.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text_view mx-1"
                                    >
                                      View file
                                    </a>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: "13px" }}>
                                    {data.value}
                                  </span>
                                )}
                              </td>

                              <td>
                                <div className="d-flex">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input bg-success"
                                      type="radio"
                                      name={`gridRadios-${data.id}`}
                                      value="option1"
                                      checked={!data.isError}
                                      onChange={() =>
                                        handleRadiogreenChange(data?.id)
                                      }
                                    />
                                  </div>
                                  <div className="form-check mx-2">
                                    <input
                                      className="form-check-input bg-danger"
                                      type="radio"
                                      name={`gridRadios-${data.id}`}
                                      value="option1"
                                      checked={data.isError}
                                      onClick={(event) =>
                                        handleRadioChange(data?.id)
                                      }
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>{data.remark}</td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </div>
      <RemarkModal
        remarkshowModal={remarkshowModal}
        setRemarkshowModal={setRemarkshowModal}
        setRemarkdata={setRemarkdata}
        setVerficationList={setVerficationList}
        remarkdata={remarkdata}
        currentRemarkId={currentRemarkId}
        updateRemark={updateRemark}
      />

      {verficationList?.status === "final_submit" ? (
        showremarkrCard ? (
          <CleardCard id="1" clerVerifyApi={clearIndividualVerfication} />
        ) : (
          <NotCleardCard insituteVerifyList={insituteVerifyList} id="1" />
        )
      ) : verficationList?.status === "ongoing" ? (
        <Card className="text-center p-3">
          <h3 className="text-danger">
            It seems that Individual has not started further registration
            Process!
          </h3>
        </Card>
      ) : verficationList?.status === "ask_for_resubmit" ? (
        <Card className="text-center p-3">
          <h4>
            <span className="text-danger">Note: </span>
            The Application is sent back to the User for corrections. Once the
            User corrects information's asked, we can do further verification.
          </h4>
        </Card>
      ) : (
        ""
      )}
    </>
  );
};

export default IndividualVerificationForm;
