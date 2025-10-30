import React, { Fragment, useEffect, useState } from "react";
import { Button, ButtonGroup, SplitButton } from "react-bootstrap";
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




import { FaUserLarge } from "react-icons/fa6";

import { getInsituteverifyByID } from "../../../services/adminApiService/insituteVerficationApi/InsituteVerficationApiService";
import { useParams } from "react-router-dom";
import InsituteVerficationMapping from "../../../utils/maping/InsituteVerficationMapping";

import RemarkModal from "../Individual/RemarkModal";
import CleardCard from "../Individual/CleardCard";
import NotCleardCard from "../Individual/NotCleardCard";
import { formatLable, formatStatus, getStatusColor } from "../../../utils/colorAsperStatus";
import NotCleardOrganisation from "./NotCleardOrganisation";
import { clearIndividualVerfication } from "../../../services/adminApiService/individualApiService/IndividualAPiService";
import { clearInsituteVerfication } from "../../../services/adminApiService/organisationApi/OrganisationApiService";
import doc from "../../../images/google-docs.png";
import imgPdf from "../../../images/pdf.png";
import { getCityFromId, getCountryFromId, getStateFromId } from "../../../utils/CountryConveter";
import { getCorrectionByID } from "../../../services/adminApiService/admincorrectionApi/adminCorrectionApi";



const OrganizationVerficationForm = ({ roletype }) => {
    const { id } = useParams();
    const [remarkshowModal, setRemarkshowModal] = useState(false);
    console.log("remarkshowModal===>",remarkshowModal);
    const [showremarkrCard, setshowremarkCard] = useState(true);
    const [verficationList, setVerficationList] = useState({});

    const [insituteVerifyList, setInsituteVerifyList] = useState([]);
    const [correctionData, setCorrectionData] = useState([]);
    const [remarkdata, setRemarkdata] = useState('');
    const [currentRemarkId, setCurrentRemarkId] = useState(null);
    const [loading, setLoading] = useState(false);

 

    useEffect(() => {
        const fetchVerificationList = async () => {
            setLoading(true);
            try {
                const response = await getInsituteverifyByID(id);
                setVerficationList(response?.data?.data);
            } catch (error) {
                console.error('Error fetching verification list:', error);
            } finally {
                setLoading(false);
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
        const storedRemarks = JSON.parse(localStorage.getItem(`verify_doc_remarks`)) || {};
        if (Object.keys(verficationList).length > 0) {
            const countryName = await getCountryFromId(verficationList.country);
            const stateName = await getStateFromId(verficationList.country, verficationList.state);
            const cityName = await getCityFromId(verficationList.state, verficationList?.city);
            const baseList = [
                { id: 1, label: "Name", value: verficationList?.name_of_legel_entity, key: "name_of_legel_entity", isError: !!storedRemarks[1], action: false, remark: storedRemarks[1] || "" },
                { id: 2, label: "Registration Number", value: verficationList?.registration_number, key: "Reg_No", isError: !!storedRemarks[2], action: false, remark: storedRemarks[2] || "" },
                { id: 3, label: "Date of Establishment", value: verficationList?.year_of_operation, key: "year_of_operation", isError: !!storedRemarks[3], action: false, remark: storedRemarks[3] || "" },
                { id: 4, label: "Type of Sports Institution", value: verficationList?.type_of_sports_institution, key: "registration_number", isError: !!storedRemarks[4], action: false, remark: storedRemarks[4] || "" },
                { id: 5, label: "Country", value: countryName, key: "country", isError: !!storedRemarks[5], action: false, remark: storedRemarks[5] || "" },
                { id: 6, label: "State", value: stateName, key: "state", isError: !!storedRemarks[6], action: false, remark: storedRemarks[6] || "" },
                { id: 7, label: "City", value: cityName, key: "city", isError: !!storedRemarks[7], action: false, remark: storedRemarks[7] || "" },
                { id: 8, label: "Pincode", value: verficationList?.pincode, key: "Zip_Code", isError: !!storedRemarks[8], action: false, remark: storedRemarks[8] || "" },
                { id: 9, label: "Contact Phone Number", value: verficationList?.contact_person_contact, key: "contact_person_contact", isError: !!storedRemarks[9], action: false, remark: storedRemarks[9] || "" },
                { id: 10, label: "Contact Email Address", value: verficationList?.contact_person_email, key: "contact_person_email", isError: !!storedRemarks[10], action: false, remark: storedRemarks[10] || "" },
                { id: 11, label: "Website", value: verficationList?.website, key: "website", isError: !!storedRemarks[11], action: false, remark: storedRemarks[11] || "" },
                { id: 12, label: "Name of Representative", value: verficationList?.represntive_name, key: "represntive_name", isError: !!storedRemarks[12], action: false, remark: storedRemarks[12] || "" },
                { id: 13, label: "Representative of Role", value: verficationList?.represntive_role, key: "represntive_role", isError: !!storedRemarks[13], action: false, remark: storedRemarks[13] || "" },
                { id: 14, label: "Representative of Phone Number", value: verficationList?.represntive_phone, key: "represntive_phone", isError: !!storedRemarks[14], action: false, remark: storedRemarks[14] || "" },
                { id: 15, label: "Representative of Email", value: verficationList?.represntive_email, key: "represntive_email", isError: !!storedRemarks[15], action: false, remark: storedRemarks[15] || "" },
                { id: 16, label: "Sports Offered", value: verficationList?.sports_offered, key: "sports_offered", isError: !!storedRemarks[16], action: false, remark: storedRemarks[16] || "" },
                { id: 17, label: "Facilities Available", value: verficationList?.facilities, key: "facilities", isError: !!storedRemarks[17], action: false, remark: storedRemarks[17] || "" },
                { id: 18, label: "Achievements", value: verficationList?.achievements, key: "achievements", isError: !!storedRemarks[18], action: false, remark: storedRemarks[18] || "" },
                { id: 19, label: "Affiliated Organizations", value: verficationList?.affiliated_sport_body, key: "affiliated_sport_body", isError: !!storedRemarks[19], action: false, remark: storedRemarks[19] || "" },
                { id: 20, label: "Number of Members", value: verficationList?.club_member_count, key: "club_member_count", isError: !!storedRemarks[20], action: false, remark: storedRemarks[20] || "" },
                { id: 21, label: "Training Programs Offered", value: verficationList?.program_offered, key: "program_offered", isError: !!storedRemarks[21], action: false, remark: storedRemarks[21] || "" },
                { id: 22, label: "Facility Type", value: verficationList?.facility_type, key: "facility_type", isError: !!storedRemarks[22], action: false, remark: storedRemarks[22] || "" },
                { id: 23, label: "Sports Supported", value: verficationList?.sport_support, key: "sport_support", isError: !!storedRemarks[23], action: false, remark: storedRemarks[23] || "" },
                { id: 24, label: "Capacity", value: verficationList?.capacity, key: "capacity", isError: !!storedRemarks[24], action: false, remark: storedRemarks[24] || "" },
                { id: 25, label: "Available Equipment", value: verficationList?.available_equipment, key: "available_equipment", isError: !!storedRemarks[25], action: false, remark: storedRemarks[25] || "" },
                { id: 26, label: "Operating Hours", value: verficationList?.operation_hour, key: "operation_hour", isError: !!storedRemarks[26], action: false, remark: storedRemarks[26] || "" },
                { id: 27, label: "Additional Services", value: verficationList?.additional_services, key: "additional_services", isError: !!storedRemarks[27], action: false, remark: storedRemarks[27] || "" },
                { id: 28, label: "Head Coach", value: verficationList?.head_coach, key: "head_coach", isError: !!storedRemarks[28], action: false, remark: storedRemarks[28] || "" },
            ];
            
            if (verficationList.registration_docs && Array.isArray(verficationList.registration_docs)) {
                verficationList.registration_docs.forEach((doc, index) => {
                    
                    baseList.push({
                        id: 29 + index, // Continue IDs sequentially
                        label: doc.doc_name,
                        value: doc.doc_file, // Assuming you want to display the file or use doc_name
                        key: `registration_doc_${index + 1}`,
                        action: false,
                        remark: storedRemarks[29 + index] || "",
                        isError: !!storedRemarks[29 + index],
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
        // isError(true)


        insituteVerifyList.map((data) => {
            if (id == data.id) {
                data.isError = true

         
            }

        })
        

    };

  
    const handleRadiogreenChange = (id) => {
        const storedRemarks = JSON.parse(localStorage.getItem('verify_doc_remarks')) || {};
        delete storedRemarks[id];
        localStorage.setItem('verify_doc_remarks', JSON.stringify(storedRemarks));

        fetchCountryName();
        
        setCurrentRemarkId(id);

        const dataAfterr = JSON.parse(localStorage.getItem('verify_doc_remarks')) || {};
        const isEmpty = Object.keys(storedRemarks).length === 0;
        if (isEmpty) {
            setshowremarkCard(true);
        }

        insituteVerifyList.map((data) => {
           
            if (id == data.id) {
                
                data.isError = false;
               
            }

        })

        // fetchCountryName();

    };


    const updateRemark = (remark) => {
        const updatedList = insituteVerifyList.map(item => {
            // console.log("updatedList",updatedList);
            if (item.id === currentRemarkId) {
                return { ...item, remark };
            }
            return item;
        });

        setInsituteVerifyList(updatedList);

        const storedRemarks = JSON.parse(localStorage.getItem(`verify_doc_remarks`)) || {};
        storedRemarks[currentRemarkId] = remark;
        localStorage.setItem(`verify_doc_remarks`, JSON.stringify(storedRemarks));
    };


    const profileImage = insituteVerifyList.find(item => item.label === "profile_image");
   

    useEffect(() => {
        const storedRemarks = JSON.parse(localStorage.getItem('verify_doc_remarks')) || {};
        const isEmpty = Object.keys(storedRemarks).length === 0;
      
        if (isEmpty) {
            setshowremarkCard(true);
        } else {
            setshowremarkCard(false);
        }
    }, [insituteVerifyList]);


    const getCorrectionList = async (roletype,id) => {
       
        try {
            const response = await getCorrectionByID(roletype,id);
            const correctionData = response?.data?.data;
           
    
           
            if (correctionData && correctionData.registration_correction) {
                const storedRemarks = JSON.parse(localStorage.getItem('verify_doc_remarks')) || {};
                console.log("storedRemarks",storedRemarks);
                correctionData.registration_correction.forEach((correction, index) => {
                    if (correction.remark) {
                        storedRemarks[correction.id] = correction.remark;
                    }
                });
    
                localStorage.setItem('verify_doc_remarks', JSON.stringify(storedRemarks));
                setInsituteVerifyList(prevList => prevList.map(item =>
                    item.id === id ? { ...item, remarks: storedRemarks } : item
                ));
            }
    
            setCorrectionData(correctionData);
        } catch (error) {
            console.error('Error fetching verification list:', error);
        } 
    };
    

   

    useEffect(() => {
        getCorrectionList(roletype,id)
    }, [id]);



    return (
        <>
            <div className="row ">
                <Col lg={12} className="mb-3">
                    <Card style={{ height: 'auto' }}>
                        <div className="d-flex justify-content-between p-2">
                            <div className="mt-2">
                                <h4><span className="mx-2"><FaUserLarge className="text-primary" /></span><span className="mx-2">NAME OF Organisation :{verficationList?.name_of_organization}</span></h4>
                            </div>
                            <div>
                                <div><strong>User Type</strong></div>
                                <Button className="bg-primary py-1">{verficationList?.category_name}</Button>
                            </div>
                        </div>
                    </Card>



                </Col>

                <Col lg={12} className="mb-3">
                    <Card style={{ height: 'auto' }}>
                        <div className="d-flex justify-content-between p-2">
                            <div className="mt-2">
                                <h4><span className="mx-2 text-danger">Current Status: <span style={{ color: getStatusColor(verficationList?.status) }}>
                                    {verficationList?.status && formatStatus(verficationList?.status)}
                                </span></span></h4>
                            </div>


                            <div className="" style={{ lineHeight: '0px' }}>
                                <div>
                                    <h4>Attempt Count
                                    </h4>
                                </div>
                                <div className="text-center">

                                    <strong> {verficationList?.attempt_count + 1}</strong>
                                </div>

                            </div>

                        </div>
                    </Card>
                </Col>

            </div>
            <div className="row">
                <Col lg={12} className="mb-3">
                    <Card style={{ height: '35vh' }}>
                        <Card.Header>
                            <Card.Title className="text-danger">VERIFY PHOTO</Card.Title>
                        </Card.Header>
                        <Card.Body >
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
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            ) : (
                                                'Photo not available'
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
                                                        onChange={() => handleRadiogreenChange(profileImage?.id)}
                                                    />
                                                </div>
                                                <div className="form-check mx-2">
                                                    <input
                                                        className="form-check-input bg-danger"
                                                        type="radio"
                                                        name={`gridRadios-${profileImage?.id}`}
                                                        value="option1"
                                                        checked={profileImage?.isError}
                                                       
                                                        onClick={(event) => handleRadioChange(profileImage?.id)}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {profileImage?.remark}
                                        </td>



                                    </tr>

                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>


                    <Card className="mb-3" style={{ height: 'auto' }}>
                        <Card.Header>
                            <Card.Title className="text-danger">VERIFY FORM FIELDS & DOCUMENTS</Card.Title>
                        </Card.Header>
                        <Card.Body >
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Form Fields</th>
                                        <th>Action</th>
                                        <th>Remarks</th>

                                    </tr>
                                </thead>
                                {loading ? (
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <tbody>
                                        {insituteVerifyList
                                            .filter(data => data.value)
                                            .map((data, index) => {

                                                return (
                                                    <> {
                                                        data.label === "profile_image" ? " " : (
                                                            <tr key={data.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <span style={{ color: "#886CC0" }}><strong>{formatLable(data?.label)}</strong></span><br />
                                                                    {isValidUrl(data.value) ? (
                                                                        <div>
                                                                            {data.value.includes(".pdf") ? (
                                                                                <img src={imgPdf} alt={data.label} style={{ maxWidth: "100px", height: "auto" }} />
                                                                            ) : data.value.includes(".doc") ? (
                                                                                <img src={doc} alt={data.label} style={{ maxWidth: "100px", height: "auto" }} />
                                                                            ) : (
                                                                                <img src={data.value} alt={data.label} style={{ maxWidth: "100px", height: "auto" }} />
                                                                            )}
                                                                            <a href={data.value} target="_blank" rel="noopener noreferrer" className="text_view mx-1">View file</a>
                                                                        </div>
                                                                    ) : (
                                                                        <span style={{ fontSize: "13px" }}>{data.value}</span>
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
                                                                                onChange={() => handleRadiogreenChange(data?.id)}
                                                                            />
                                                                        </div>
                                                                        <div className="form-check mx-2">
                                                                            <input
                                                                                className="form-check-input bg-danger"
                                                                                type="radio"
                                                                                name={`gridRadios-${data.id}`}
                                                                                value="option1"
                                                                                checked={data.isError}
                                                                                onClick={(event) => handleRadioChange(data?.id)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {data.remark}
                                                                </td>
                                                            </tr>
                                                        )


                                                    }

                                                    </>
                                                )

                                            })}
                                    </tbody>
                                )}

                            </Table>
                        </Card.Body>
                    </Card>

                </Col>

            </div>

            <RemarkModal remarkshowModal={remarkshowModal} setRemarkshowModal={setRemarkshowModal} setRemarkdata={setRemarkdata} setVerficationList={setVerficationList} remarkdata={remarkdata} currentRemarkId={currentRemarkId} updateRemark={updateRemark} />


            {
                (verficationList?.status === "final_submit") ? (
                    showremarkrCard ? (
                        <CleardCard userType="2" clerVerifyApi={clearInsituteVerfication} />
                    ) : (
                        <NotCleardOrganisation insituteVerifyList={insituteVerifyList} userType="2" />
                    )
                ) : (verficationList?.status === "ongoing") ? (
                    <Card className="text-center p-3">
                        <h3 className="text-danger">It seems that Institution has not started further registration Process!
                        </h3>
                    </Card>
                ) : (verficationList?.status === "ask_for_resubmit") ? (
                    <Card className="text-center p-3">
                        <h4><span className="text-danger">Note: </span>
                        The Application is sent back to the User for corrections. Once the User corrects information's asked, we can do further verification.
                        </h4>
                    </Card>
                ) : ""
            }
        </>

    )
}

export default OrganizationVerficationForm;