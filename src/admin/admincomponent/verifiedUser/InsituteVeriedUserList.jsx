import React, { useEffect, useState } from 'react'
import PageTitle from '../../../jsx/layouts/PageTitle';
import ReactPaginate from 'react-paginate';
import { Button } from 'react-bootstrap';
import { getAllSubCategory } from '../../../services/superadminService/SubCategory';
import { Link } from 'react-router-dom';
import { getOrganisationList } from '../../../services/adminApiService/organisationApi/OrganisationApiService';
import { useNavigate } from 'react-router-dom';
import { getIndividaulList } from '../../../services/adminApiService/individualApiService/IndividualAPiService';
import { formatDateTime } from '../../../utils/dateTimeFormate';
import { formatStatus, getStatusColor } from '../../../utils/colorAsperStatus';
import { getVerifieddataList } from '../../../services/adminApiService/verifiedlistApiService/VerifiedLIstApiService';

const InsituteVeriedUserList = ({ roletype, roleCategory }) => {
    const [verifiedUserdataList, setVerifiedUserdataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);





    const handleVerificationInsituteClick = (id) => {
        navigate(`/verification-insitute-view-form/${id}`); // Absolute path
    };

    const getverifiedListApi = async (roletype, perPage, currentPage) => {
        setLoading(true);
        try {
            const response = await getVerifieddataList(roletype, perPage, currentPage);
            console.log("responseINdividual", response.data.data.data);
            setVerifiedUserdataList(response?.data?.data);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getverifiedListApi(roletype, perPage, currentPage);
    }, [currentPage, perPage]);

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    };
    return (
        <>
            <PageTitle activeMenu="Institution Verification List"
                motherMenu="Manage Verification" />
            <div className="col-12">
                <div className="card">
                    {/* <div className="card-header d-flex">
                        <div>
                            <div className="input-group search-area">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search here..."
                                />
                                <span className="input-group-text">
                                    <Link to={"#"}><i className="flaticon-381-search-2"></i></Link>
                                </span>
                            </div>
                        </div>
                    </div> */}
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-100 table-responsive">
                                <div id="example_wrapper" className="dataTables_wrapper">
                                    <table id="example" className="display w-100 dataTable">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Legal Entity</th>
                                                <th>Reg. No</th>
                                                <th>Unique Id</th>
                                                <th>Name of Institution</th>
                                                <th>Contact Person Email</th>
                                                <th>Contact Person Mobile</th>
                                                <th>Registration Date</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {verifiedUserdataList?.data?.length > 0 ? (
                                                verifiedUserdataList.data.map((data, index) => {
                                                    console.log("atom_id==>", data?.atom_id);
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{data?.name_of_legel_entity}</td>
                                                            <td>{data?.organization?.registration_number}</td>
                                                            <td>{data?.atom_id}</td>
                                                            <td>{data?.organization?.name_of_organization}</td>
                                                            <td>{data?.organization?.contact_person_email}</td>
                                                            <td>{data?.organization?.contact_person_contact}</td>
                                                            <td>{formatDateTime(data?.created_at)}</td>
                                                                
                                                            <td>
                                                                <span className="text-success">Verified</span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <Button style={{ whiteSpace: 'nowrap' }} onClick={() => handleVerificationInsituteClick(data?.id)}> View More </Button>

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="9" className="text-center">Data is not available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={8}
                    marginPagesDisplayed={7}
                    pageCount={Math.ceil(verifiedUserdataList?.data?.total / perPage)}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </div>
        </>
    )
}

export default InsituteVeriedUserList