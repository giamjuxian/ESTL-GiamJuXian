import React, { useEffect, useState } from "react";
import { Dropdown, Button, Pagination } from "react-bootstrap";
import { APIType, fetchAPI } from "../api";
import EmployeeTable from "../components/EmployeeTable";
import { Employee } from "../components/EmployeeTableRow";

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

export default function MainPage(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);
  const [sortParams, setSortParams] = useState<SortParam>(SortParam.id);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [pageCount, setPageCount] = useState<number>(5);
  const [pageActive, setPageActive] = useState<number>(1);

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

  const renderFilterSection = () => (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row">
        <div className="d-flex flex-column">
          <div className="input_header mt-2 mb-1">Salary</div>
          <div className="d-flex flex-row align-items-center">
            <input
              type="number"
              placeholder="min"
              value={minSalary || ""}
              onChange={(e) => setMinSalary(parseFloat(e.target.value))}
            />
            <div className="m-2">to</div>
            <input
              type="number"
              placeholder="max"
              value={maxSalary || ""}
              onChange={(e) => setMaxSalary(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div className="d-flex flex-column mx-5">
          <div className="input_header mt-2 mb-1">Sorting</div>
          <div className="d-flex flex-row">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary">
                {sortParams}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={() => setSortParams(SortParam.id)}>
                  ID
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => setSortParams(SortParam.login)}>
                  Login
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => setSortParams(SortParam.name)}>
                  Name
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => setSortParams(SortParam.salary)}>
                  Salary
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="mx-2">
              <Dropdown.Toggle variant="outline-secondary">
                {sortOrder}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={() => setSortOrder(SortOrder.ASC)}>
                  Ascending
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => setSortOrder(SortOrder.DESC)}>
                  Descending
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="d-flex flex-row mt-4">
        <Button onClick={() => handleFilter()} variant="primary">
          Filter
        </Button>
        <Button
          className="mx-2"
          onClick={() => handleFilterClear()}
          variant="outline-secondary"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  const renderEmployeeTable = () => (
    <>
      <EmployeeTable employees={employees} />
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

  return (
    <div className="flex-grow-1 px-4 py-5">
      {renderFilterSection()}
      {renderEmployeeTable()}
      {renderPagination()}
    </div>
  );
}
