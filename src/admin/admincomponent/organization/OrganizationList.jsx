import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import PageTitle from '../../../jsx/layouts/PageTitle'
import { Link, useNavigate } from 'react-router-dom'
import ImportExcelModal from './ImportExcelModal'
import { getAdminCategoryType } from '../../../services/adminApiService/adminCategoryType/AdminCategoryTypeApi'
import { getOrganisationList } from '../../../services/adminApiService/organisationApi/OrganisationApiService'
import { useParams } from 'react-router-dom';
import { formatStatus, getStatusColor } from '../../../utils/colorAsperStatus'
import ReactPaginate from 'react-paginate'
import { formatDateTime } from '../../../utils/dateTimeFormate'



const OrganizationList = () => {
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [showImportModal, setShowImportModal] = useState(false);
    const [adminCategoryTypeData, setAdminCategoryTypeData] = useState([]);
    const [organisationdataList, setOrganisationdataList] = useState([]);
    const [loading, setLoading] = useState(false);



    const navigate = useNavigate();
    const handleVerificationClick = (id) => {
        localStorage.removeItem('verify_doc_remarks');
        navigate(`/verification-form/${id}`); // Absolute path
    };


    const getOrganisationListApi = async (perPage, currentPage) => {
        setLoading(true);
        try {

            const response = await getOrganisationList(perPage, currentPage);
            setOrganisationdataList(response?.data?.data)

        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    }


    const getAdminCategoryTypeListApi = async () => {

        try {

            const response = await getAdminCategoryType();
            console.log("responseCategoryTYpe", response);
            setAdminCategoryTypeData(response?.data)

        } catch (error) {
            console.error('Login error:', error);
        }
    }
    useEffect(() => {
        getAdminCategoryTypeListApi();
    }, []);

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
                activeMenu="Institution List"
                motherMenu="Manage Registration"
            />
            <div className="col-12">
                <div className="card">
                    <div className="card-header d-flex justify-content-end">
                        {/* <div>
                            <div className="input-group search-area">
                                <input
                                    type="text"
                                    className={`form-control `}
                                    placeholder="Search here..."
                                />
                                <span className="input-group-text">
                                    <Link to={"#"}><i className="flaticon-381-search-2"></i></Link>
                                </span>
                            </div> <div className="card-header d-flex">
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
                            </div>
                        </div> */}
                        <div>
                            <Button variant="primary" className="mx-2" onClick={() => setShowImportModal(true)}>
                                Import Excel  <i className="fa fa-plus"></i>
                            </Button>
                        </div>
                    </div>
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
                                                    <th>S.No</th>
                                                    <th>Legal Entity</th>
                                                    <th>Reg. No</th>
                                                    <th>Prov.Reg.Id</th>
                                                    <th>Name of Institution</th>
                                                    <th>Institution Email</th>
                                                    <th>Attempt</th>
                                                    <th>Contact Person Email</th>
                                                    <th>Contact Person Mobile</th>
                                                    <th>Registration Date</th>
                                                    <th> Institution Password</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {organisationdataList?.data?.length > 0 ? (
                                                    organisationdataList.data.map((data, index) => (
                                                        <tr key={index}>
                                                            <>
                                                                <td>{index + 1 + (currentPage - 1) * perPage}</td>
                                                                <td>{data?.name_of_legel_entity}</td>
                                                                <td>{data?.registration_number}</td>
                                                                <td>{data?.provisinal_registration_id}</td>
                                                                <td>{data?.name_of_organization}</td>

                                                                <td>{data?.email}</td>
                                                                <td>{data?.attempt_count + 1}</td>
                                                                <td>{data?.contact_person_email}</td>
                                                                <td>{data?.mobile}</td>
                                                                <td>{formatDateTime(data?.created_at)}</td>
                                                                <td>{data?.org_pwd}</td>
                                                                <td style={{ color: getStatusColor(data?.status) }}>
                                                                    {data?.status && formatStatus(data?.status)}
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex">
                                                                        <Button style={{ whiteSpace: 'nowrap' }} onClick={() => handleVerificationClick(data?.id)} disabled={data?.status === "initial" || data?.status === "pass"}>
                                                                            Verify Application
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">Data is not available</td>
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
            </div>

            <ImportExcelModal
                showImportModal={showImportModal}
                setShowImportModal={setShowImportModal}
                adminCategoryTypeData={adminCategoryTypeData}
                getOrganisationListApi={getOrganisationListApi}
                currentPage={currentPage}
                perPage={perPage}

            />

            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageChange}
                pageRangeDisplayed={8}
                marginPagesDisplayed={7}
                pageCount={Math.ceil(organisationdataList?.total / perPage)}
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
        </>
    )
}

export default OrganizationList