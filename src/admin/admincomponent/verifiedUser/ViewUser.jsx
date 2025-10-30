import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Card,
    Table,
    Badge,
    Dropdown,
    ProgressBar,
    Button
} from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { getVerfiedViewByID } from '../../../services/adminApiService/verifiedlistApiService/VerifiedLIstApiService';
import { formatLable } from '../../../utils/colorAsperStatus';
import doc from "../../../images/google-docs.png";
import imgPdf from "../../../images/pdf.png";
import { getCityFromId, getCountryFromId, getStateFromId } from '../../../utils/CountryConveter';
const ViewUser = () => {
    const { id } = useParams();
    const [individualverifyData, setIndividualverifyData] = useState({});
    const [insituteVerifyList, setInsituteVerifyList] = useState([]);
    useEffect(() => {
        const fetchVerifiedDetailsList = async (typeId) => {
            try {
                const response = await getVerfiedViewByID(typeId,id);
                console.log("verifiedResponse",response)
                setIndividualverifyData(response?.data?.data);
            } catch (error) {
                console.error('Error fetching verification list:', error);
            }
        };

        fetchVerifiedDetailsList(1);
    }, [id]);

    const isValidUrl = (string) => {
        console.log("string",string);
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    const fetchCountryName = async () => {
    if (Object.keys(individualverifyData).length > 0) {
        console.log("individualverifyData===>",individualverifyData)
        const countryName = await getCountryFromId(individualverifyData?.indivisual?.country);
        const stateName = await getStateFromId(individualverifyData?.indivisual?.country, individualverifyData?.indivisual?.state);
        const cityName = await getCityFromId(individualverifyData?.indivisual?.state, individualverifyData?.indivisual?.city);
        console.log("cityName==>",cityName);
        const baseList = [
            { id: 1, label: "First Name", value: individualverifyData?.first_name},
            { id: 1, label: "Middle Name", value: individualverifyData?.middle_name},
            { id: 1, label: "Last Name", value: individualverifyData?.last_name},
            { id: 1, label: "Father Name", value: individualverifyData?.indivisual?.father_name},
            { id: 2, label: "Date of Birth", value: individualverifyData?.indivisual?.dob},
            { id: 3, label: "Age", value: individualverifyData?.indivisual?.age},
            { id: 4, label: "Gender", value: individualverifyData?.indivisual?.gender, key: "gender"},
            { id: 5, label: "Mobile", value: individualverifyData?.indivisual?.mobile, key: "mobile"},
            { id: 6, label: "Email", value: individualverifyData?.email, key: "email"},
            { id: 7, label: "Address", value: individualverifyData?.indivisual?.address, key: "address"},
            { id: 8, label: "Landmark", value: individualverifyData?.indivisual?.landmark, key: "landmark"},
            { id: 9, label: "Country", value: countryName, key: "country"},
            { id: 10, label: "State", value: stateName, key: "state"},
            { id: 11, label: "City", value: cityName},
            { id: 11, label: "Pincode", value: individualverifyData?.indivisual?.pincode},
            { id: 11, label: "Nationality", value: individualverifyData?.indivisual?.nationality},
            { id: 12, label: "Sport Name", value: individualverifyData?.refsport?.sport_name},
            { id: 13, label: "kit size", value: individualverifyData?.indivisual?.kit_size},
            { id: 14, label: "Athlete Level", value: individualverifyData?.indivisual?.athlete_level},
            { id: 15, label: "Unique id", value: individualverifyData?.atom_id},
            { id: 15, label: "Account Holder Name", value: individualverifyData?.indivisual?.account_holder_name},
           
            { id: 16, label: "Bank Account Number", value: individualverifyData?.indivisual?.bank_account_number},
            { id: 17, label: "Ifsc code", value: individualverifyData?.indivisual?.ifsc_code},
            { id: 18, label: "Branch Name", value: individualverifyData?.indivisual?.branch_name},
            { id: 19, label: "Education Level", value: individualverifyData?.indivisual?.education_level},
            { id: 20, label: "Marital Status", value: individualverifyData?.indivisual?.maritial_status},
            { id: 21, label: "Highest Achivement", value: individualverifyData?.indivisual?.highest_achievement},
            // { id: 22, label: "Blood Group", value: individualverifyData?.indivisual?.blood_group},
            { id: 22, label: "Identity Card", value: individualverifyData?.indivisual?.indivisual?.identity_card},
          
        ];

        if (individualverifyData.indivisual_docs && Array.isArray(individualverifyData.indivisual_docs)) {
            individualverifyData.indivisual_docs.forEach((doc, index) => {
                baseList.push({
                    id: 23 + index, // Assuming the IDs continue sequentially
                    label: doc.doc_name,
                    value: doc.doc_file, // Assuming you want to display the file or use doc_name
                    // key: `registration_doc_${index + 1}`,
                    // action: false,
                    // remark: storedRemarks[23 + index] || ""
                });
            });
        }

        setInsituteVerifyList(baseList);
    }
};
useEffect(() => {
    fetchCountryName();

}, [individualverifyData, id]);
  return (
    <>
   <div className="row">
                <Col lg={12} className="mb-3">
                    <Card className="mb-3" style={{ height: 'auto' }}>
                        <Card.Header>
                            <Card.Title className="text-danger">VERIFIED DETAILS</Card.Title>
                        </Card.Header>
                        <Card.Body >
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Form Fields</th>
                                        <th>Form Data</th>
                                        

                                    </tr>
                                </thead>
                                <tbody>
                                    {insituteVerifyList
                                        .filter(data => data.value)
                                        .map((data, index) => (
                                            <tr key={data.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <span style={{ color: "#886CC0" }} ><strong>{formatLable(data?.label)}</strong></span><br />
                                                </td>
                                                <td>
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
                                              
                                               
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                </Col>

  </div>

   
</>
  )
}

export default ViewUser