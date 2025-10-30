import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { ListGroup, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment";

import PageTitle from "../../../jsx/layouts/PageTitle";
import Pagination from "./pagination";
import AddCategoryModal from "./AddCategoryModal";
import ViewCategoryModal from "./ViewCategoryModal";
import CategoryUpdateModal from "./CategoryUpdateModal";
import axiosInstance from "../../../services/AxiosInstance";

const CategoryTypeList = () => {
  const perPage = 10;
  const [addCard, setAddCard] = useState(false);
  const [contents, setContents] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewShowModal, setViewShowModal] = useState(false);
  const [categoryidList, setCategoryidList] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryListById, setCategoryListById] = useState({});

  const handleEditClick = (data) => {
    setShowEditModal(true);
    setCategoryListById(data);
  };

  const viewClientFun = (data) => {
    setCategoryListById(data);
    setViewShowModal(true);
  };

  const ClientListApi = async (pageNumber = 1, query = null) => {
    try {
      const params = { page: pageNumber, limit: perPage };
      if (query) {
        params.search = query;
      }
      const response = await axiosInstance.get(`/user-type/all`, { params });
      const data = response?.data?.data || [];
      setClientData(data);
      setFilteredData(data);
      setTotalPages(response?.data?.totalPages || 1);
      setCurrentPage(response?.data?.currentPage || 1);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    ClientListApi(1, query);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    ClientListApi(pageNumber);
  };

  useEffect(() => {
    ClientListApi(currentPage);
  }, [currentPage]);

  return (
    <>
      <PageTitle activeMenu="Table" motherMenu="User Category Type" />
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-purple text-white">
            <div>
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
              <Dropdown as={ButtonGroup}>
                <Button variant="primary" onClick={() => setAddCard(true)}>
                  Add Category <i className="fa fa-plus"></i>
                </Button>
              </Dropdown>
            </div>
          </div>
          <div className="card-body">
            <div className="w-100 table-responsive">
              <div id="example_wrapper" className="dataTables_wrapper">
                <table id="example" className="display w-100 dataTable">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Category Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.length > 0 ? (
                      filteredData.map((data, index) => (
                        <tr key={index}>
                          <td>{(currentPage - 1) * perPage + index + 1}</td>
                          <td>{data?.category_name_view || "N/A"}</td>
                          <td>{data?.active_status ? "Active" : "Inactive"}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditClick(data)}
                                title="Edit"
                              >
                                <i className="fas fa-pen"></i>
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => viewClientFun(data)}
                                title="View"
                              >
                                <i className="fa fa-eye"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
      <AddCategoryModal
        addCard={addCard}
        setAddCard={setAddCard}
        CategoryList={ClientListApi}
      />
      <ViewCategoryModal
        viewShowModal={viewShowModal}
        setViewShowModal={setViewShowModal}
        categoryidList={categoryListById}
      />
      <CategoryUpdateModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        categoryidList={categoryListById}
        CategoryList={ClientListApi}
      />
    </>
  );
};

export default CategoryTypeList;
