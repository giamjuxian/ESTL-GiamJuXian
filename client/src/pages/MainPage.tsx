import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { APIType, fetchAPI } from "../api";
import EmployeeTable from "../components/EmployeeTable";
import { Employee } from "../components/EmployeeTableRow";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import CreateModal from "../components/CreateModal";
import FilterSection from "../components/FilterSection";
import SearchAndCreateSection from "../components/SearchAndCreateSection";

enum SortParam {
  id = "ID",
  login = "Login",
  name = "Name",
  salary = "Salary",
}

enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

/** Main page of the web application. Displays the table of employees */
export default function MainPage(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);
  const [sortParams, setSortParams] = useState<SortParam>(SortParam.id);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageActive, setPageActive] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  useEffect(() => {
    getEmployees();
  }, [pageActive]);

  const getEmployees = async () => {
    setError(null);
    const queryMinSalary = minSalary || 0;
    const queryMaxSalary = maxSalary || 9999999999;
    const queryLimit = 30;
    const queryOffset = (pageActive - 1) * queryLimit;
    const querySort =
      (sortOrder === SortOrder.ASC ? "+" : "-") + sortParams.toLowerCase();

    try {
      const results: Employee[] | null = await fetchAPI<Employee[]>({
        url: `/users?minSalary=${queryMinSalary}&maxSalary=${queryMaxSalary}&offset=${queryOffset}&limit=${queryLimit}&sort=${querySort}`,
        type: APIType.get,
      });

      if (results && results.length > 0) {
        setEmployees(results);
      } else {
        setEmployees([]);
        setError("No employees found");
      }

      const count: number | null = await fetchAPI<number>({
        url: `/users/count?minSalary=${queryMinSalary}&maxSalary=${queryMaxSalary}`,
        type: APIType.get,
      });

      if (count) {
        setPageCount(Math.ceil(count / 30));
      } else {
        setPageCount(4);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterClear = () => {
    setMinSalary(undefined);
    setMaxSalary(undefined);
    setSortParams(SortParam.id);
    setSortOrder(SortOrder.ASC);
  };

  const handleFilter = () => {
    setPageActive(1);
    getEmployees();
  };

  const handlePageClick = (index: number) => {
    setPageActive(index);
  };

  const handleEditButtonClick = (id: string) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handleDeleteButtonClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleCreate = (employee: Employee) => {
    const newEmployees = employees;
    newEmployees.unshift(employee);
    setEmployees(newEmployees);
  };

  const handleEdit = (employee: Employee) => {
    setEmployees(
      employees.map((e) => {
        if (e.id === employee.id) {
          return employee;
        }
        return e;
      })
    );
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const handleSearch = async (id: string) => {
    setError(null);
    try {
      const result: Employee | null = await fetchAPI<Employee>({
        url: `/users/${id}`,
        type: APIType.get,
      });

      if (result) {
        setEmployees([result]);
      } else {
        setEmployees([]);
        setError("No employees found");
      }
    } catch (err) {
      setEmployees([]);
      setError(err.message);
    }
  };

  const renderSearchAndCreateSection = () => (
    <SearchAndCreateSection
      onCreate={() => setShowCreateModal(true)}
      onSearch={handleSearch}
    />
  );

  const renderFilterSection = () => (
    <FilterSection
      minSalary={minSalary}
      maxSalary={maxSalary}
      sortParams={sortParams}
      sortOrder={sortOrder}
      onMinSalaryChange={(value) => setMinSalary(value)}
      onMaxSalaryChange={(value) => setMaxSalary(value)}
      onSortParamChange={(value) => setSortParams(value)}
      onSortOrderChange={(value) => setSortOrder(value)}
      onFilter={handleFilter}
      onFilterClear={handleFilterClear}
    />
  );

  const renderEmployeeTable = () => (
    <>
      <EmployeeTable
        employees={employees}
        onEdit={handleEditButtonClick}
        onDelete={handleDeleteButtonClick}
      />
      {error && <p className="error">{error}</p>}
    </>
  );

  const renderPagination = () => {
    if (pageCount === 0) return;

    const maxPagesShown = 10;
    const hasTooManyPages = pageCount > maxPagesShown;
    const pageItems = [];

    if (pageActive > maxPagesShown) {
      for (let i = pageActive - maxPagesShown + 1; i <= pageActive; i++) {
        pageItems.push(
          <Pagination.Item
            active={pageActive === i}
            onClick={(e) => handlePageClick(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      for (let i = 1; i <= Math.min(pageCount, maxPagesShown); i++) {
        pageItems.push(
          <Pagination.Item
            active={pageActive === i}
            onClick={(e) => handlePageClick(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    return (
      <div className="d-flex mt-4 justify-content-center">
        <Pagination>
          {hasTooManyPages && pageActive !== 1 && (
            <>
              <Pagination.First onClick={(e) => handlePageClick(1)} />
              <Pagination.Prev
                onClick={(e) => handlePageClick(pageActive - 1)}
              />
            </>
          )}
          {pageItems}
          {hasTooManyPages && pageActive !== pageCount && (
            <>
              <Pagination.Next
                onClick={(e) => handlePageClick(pageActive + 1)}
              />
              <Pagination.Last onClick={(e) => handlePageClick(pageCount)} />
            </>
          )}
        </Pagination>
      </div>
    );
  };

  const renderModals = () => {
    const employee = employees.find((e) => e.id === selectedId);
    return (
      <>
        {employee && (
          <>
            <EditModal
              employee={employee}
              show={showEditModal}
              onEdit={handleEdit}
              onHide={() => setShowEditModal(false)}
            />

            <DeleteModal
              employee={employee}
              show={showDeleteModal}
              onDelete={handleDelete}
              onHide={() => setShowDeleteModal(false)}
            />
          </>
        )}
        <CreateModal
          show={showCreateModal}
          onCreate={handleCreate}
          onHide={() => setShowCreateModal(false)}
        />
      </>
    );
  };

  return (
    <div className="flex-grow-1 px-4 py-5">
      <div className="row mt-3">
        <div className="col-md-12 col-lg-6">
          {renderSearchAndCreateSection()}
        </div>
        <div className="col-md-12 col-lg-6">{renderFilterSection()}</div>
      </div>
      {renderEmployeeTable()}
      {renderPagination()}
      {renderModals()}
    </div>
  );
}
