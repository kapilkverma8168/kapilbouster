
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
const IndividualList = () => {
    const [organisationdataList, setOrganisationdataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();

    const handleVerificationClick = (id) => {
        localStorage.removeItem('remarksIndividual');
        navigate(`/verification-Individual-form/${id}`); // Absolute path
    };

    const getOrganisationListApi = async (perPage, currentPage) => {
        setLoading(true);
        try {
            const response = await getIndividaulList(perPage, currentPage);
            console.log("responseINdividual", response);
            setOrganisationdataList(response?.data);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrganisationListApi(perPage, currentPage);
    }, [currentPage, perPage]);

    const handlePageChange = (event) => {
        // Adjusting for zero-based index by adding 1
        const selectedPage = event.selected + 1;
        setCurrentPage(selectedPage);
    };


    return (
        <>
           <PageTitle
                activeMenu="Individual List"
                motherMenu="Manage Registration"
            />
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
                                <form>
                                    <table id="example" className="display w-100 dataTable">
                                        <thead>
                                            <tr>
                                                <th>Sr.No</th>
                                                <th>Prov.Reg.Id</th>
                                                <th>Applicant Full Name</th>
                                                <th>Email Id</th>
                                                <th>Contact Number</th>
                                                <th>Registration Date</th>
                                                <th>Attempt</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {organisationdataList?.data?.data?.length > 0 ? (
                                                organisationdataList.data.data.map((data, index) => {
                                                    return (
                                                        <tr key={data?.id}>
                                                            <td>{index + 1 + (currentPage - 1) * perPage}</td>  {/* Correct Serial Number */}
                                                            <td>{data?.provisinal_registration_id}</td>
                                                            <td>{data?.name}</td>
                                                            <td>{data?.email}</td>
                                                            <td>{data?.mobile}</td>
                                                            <td>{formatDateTime(data?.created_at)}</td>
                                                            <td>{data?.attempt_count + 1}</td>
                                                            <td style={{ color: getStatusColor(data?.status) }}>
                                                                {data?.status && formatStatus(data?.status)}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <Button style={{ whiteSpace: 'nowrap' }} onClick={() => handleVerificationClick(data?.id)} disabled={data?.status === "pass"}>
                                                                        Verify Application
                                                                    </Button>
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
                                </form>
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
                    pageCount={Math.ceil(organisationdataList?.data?.total / perPage)}
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
    );
};

export default IndividualList;

