import React, { useEffect, useState } from 'react'
import doc from "../../../images/google-docs.png";
import imgPdf from "../../../images/pdf.png";
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
import { getCityFromId, getCountryFromId, getStateFromId } from '../../../utils/CountryConveter';

const InsituteViewUser = () => {
    const { id } = useParams();
    const [individualverifyData, setIndividualverifyData] = useState({});
    const [insituteVerifyList, setInsituteVerifyList] = useState([]);

    useEffect(() => {
        const fetchVerifiedDetailsList = async (typeId) => {
            try {
                const response = await getVerfiedViewByID(typeId, id);
                setIndividualverifyData(response?.data?.data);
            } catch (error) {
                console.error('Error fetching verification list:', error);
            }
        };

        fetchVerifiedDetailsList(2);
    }, [id]);

    const isValidUrl = (string) => {
        console.log("string", string);
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const fetchCountryName = async () => {
        if (Object.keys(individualverifyData).length > 0) {
            console.log("countery id==>", individualverifyData.organization.city)
            const countryName = await getCountryFromId(individualverifyData?.organization?.country);
            const stateName = await getStateFromId(individualverifyData?.organization?.country, individualverifyData?.organization?.state);
            const cityName = await getCityFromId(individualverifyData?.organization?.state, individualverifyData?.organization?.city);

            const baseList = [
                { id: 1, label: "Name", value: individualverifyData?.name_of_legel_entity },
                { id: 1, label: "Registration Number", value: individualverifyData?.organization?.registration_number },
                { id: 1, label: "Date of Establishment", value: individualverifyData?.organization?.year_of_operation },
                { id: 1, label: "Type of Sports Institution", value: individualverifyData?.organization?.type_of_sports_institution },
                { id: 2, label: "Country", value: countryName },
                { id: 3, label: "State", value: stateName },
                { id: 4, label: "City", value: cityName },
                { id: 5, label: "Pincode", value: individualverifyData?.organization?.pincode },
                { id: 6, label: "Contact Phone Number", value: individualverifyData?.organization?.contact_person_contact },
                { id: 7, label: "Contact Email Address", value: individualverifyData?.organization?.contact_person_email },
                { id: 8, label: "Website", value: individualverifyData?.organization?.website },
                { id: 9, label: "Name of Representative", value: individualverifyData?.organization?.represntive_name },
                { id: 10, label: "Representative of Phone Number", value: individualverifyData?.organization?.represntive_phone },
                { id: 11, label: "Representative of Email", value: individualverifyData?.organization?.represntive_email },
                { id: 11, label: "Sports Offered", value: individualverifyData?.organization?.sports_offered },
                { id: 11, label: "Facilities Available", value: individualverifyData?.organization?.available_equipment },
                { id: 12, label: "Achievements", value: individualverifyData?.organization?.achievements },
                { id: 13, label: "Affiliated Organizations", value: individualverifyData?.organization?.affiliated_sport_body },
                { id: 14, label: "Number of Members", value: individualverifyData?.organization?.affiliated_number },
                { id: 15, label: "Unique ID", value: individualverifyData?.atom_id },
                { id: 15, label: "Training Programs Offered", value: individualverifyData?.organization?.training_program_offer },

                { id: 16, label: "Facility Type", value: individualverifyData?.organization?.facility_type },
                { id: 17, label: "Sports Supported", value: individualverifyData?.organization?.sport_support },
                { id: 18, label: "Capacity", value: individualverifyData?.organization?.capacity },
                { id: 19, label: "Available Equipment", value: individualverifyData?.organization?.available_equipment },
                { id: 20, label: "Operating Hours", value: individualverifyData?.organization?.operation_hour },
                { id: 21, label: "Additional Services", value: individualverifyData?.organization?.additional_services },


            ];

            if (individualverifyData.organization_docs && Array.isArray(individualverifyData.organization_docs)) {
                individualverifyData.organization_docs.forEach((doc, index) => {
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

export default InsituteViewUser