import React, { useEffect, useState } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axiosInstance from "../../../services/AxiosInstance";
import ClientAddModal from "../../../jsx/components/SuperAdmin/client/ClientAddModal";
import PageTitle from "../../../jsx/layouts/PageTitle";
import Editable from "../../../jsx/pages/Editable";
import AddSubCategoryModal from "./AddSubCategoryModal";
import EditSubCategoryModal from "./EditSubCategoryModal";
import ViewSubCategoryModal from "./ViewSubCategoryModal";
import Pagination from "./pagination";

const SubCategoryList = () => {
  const perPage = 10;
  const [addCard, setAddCard] = useState(false);
  const [clientData, setClientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [basicModal, setBasicModal] = useState(false);
  const [subCategoryIdData, setSubCategoryIdData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryTypeListData, setCategoryTypeListData] = useState([]);
  const [viewShowModal, setViewShowModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const handleEditClick = (data) => {
    setShowEditModal(true);
    setClientId(data?.sub_category_id);
    setSubCategoryIdData(data);
  };

  const handleViewClick = (data) => {
    setSelectedSubCategory(data);
    setViewShowModal(true);
  };

  const CategorySubListApi = async (pageNumber = 1, query=null) => {
    try {
      const params = {
        page: pageNumber,
        limit: perPage,
      };
      if (query) {
        params.search = query;
      }
      const response = await axiosInstance.get(`/user-sub-type/all`, {
        params, 
      });
      const data = response?.data?.data || [];
      setClientData(data);
      setFilteredData(data);
      setTotalPages(response?.data?.totalPages || 1);
      setCurrentPage(response?.data?.currentPage || 1);
    } catch (error) {
      console.error("Error fetching sub-category list:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    CategorySubListApi(1,query)
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    CategorySubListApi(pageNumber);
  };

  const CategoryTypeListApi = async () => {
    try {
      const response = await axiosInstance.get("/user-type");
      setCategoryTypeListData(response?.data || []);
    } catch (error) {
      console.error("Error fetching category type list:", error);
    }
  };

  useEffect(() => {
    CategoryTypeListApi();
  }, []);

  useEffect(() => {
    CategorySubListApi(currentPage);
  }, [currentPage]);

  return (
    <>
      <PageTitle activeMenu="Table" motherMenu="User Type" />
      <div className="col-12">
        <ClientAddModal addCard={addCard} setAddCard={setAddCard} />
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              {/* Uncomment the search input if required */}
              <div className="input-group search-area">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <span className="input-group-text">
                  <Link to="#">
                    <i className="flaticon-381-search-2"></i>
                  </Link>
                </span>
              </div>
            </div>
            <div>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="mx-2"
              >
                Add User Type <i className="fa fa-plus"></i>
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="w-100 table-responsive">
              <div id="example_wrapper" className="dataTables_wrapper">
                <form>
                  <table id="example" className="display w-100 dataTable">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>User Type</th>
                        <th>Parent Type</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData?.length > 0 ? (
                        filteredData.map((data, index) => (
                          <tr key={index}>
                            <td>{(currentPage - 1) * perPage + index + 1}</td>
                            <td>{data?.sub_category_name_view || "N/A"}</td>
                            <td>{data?.parentCategory?.category_name_view || "N/A"}</td>
                            <td>
                              {data?.active_status ? "Active" : "Inactive"}
                            </td>
                            <td>
                              <div
                                className={`d-flex align-items-center justify-content-center gap-2`}
                                style={{ minHeight: "40px", marginLeft: "-50px" }}
                              >
                                <Link
                                  className="btn btn-outline-primary shadow btn-sm sharp"
                                  onClick={() => handleViewClick(data)}
                                >
                                  <i className="fas fa-eye"></i>
                                </Link>
                                {data?.is_accreditation !== false && (
                                  <Link
                                    className="btn btn-outline-warning shadow btn-sm sharp"
                                    onClick={() => handleEditClick(data)}
                                  >
                                    <i className="fas fa-pen"></i>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Data is not available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <AddSubCategoryModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        categoryTypeListData={categoryTypeListData}
        CategorySubListApi={CategorySubListApi}
      />
      <EditSubCategoryModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        ClientId={clientId}
        categoryTypeListData={categoryTypeListData}
        subCategoryIdData={subCategoryIdData}
        CategorySubListApi={CategorySubListApi}
      />
      <ViewSubCategoryModal
        viewShowModal={viewShowModal}
        setViewShowModal={setViewShowModal}
        subCategoryData={selectedSubCategory}
      />
    </>
  );
  
};

export default SubCategoryList;
