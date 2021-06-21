import React from "react";
import { Dropdown, Button, Form } from "react-bootstrap";

export enum SortParam {
  id = "ID",
  login = "Login",
  name = "Name",
  salary = "Salary",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

interface Props {
  minSalary?: number;
  maxSalary?: number;
  sortParams: SortParam;
  sortOrder: SortOrder;

  onMinSalaryChange: (value: number) => unknown;
  onMaxSalaryChange: (value: number) => unknown;
  onSortParamChange: (value: SortParam) => unknown;
  onSortOrderChange: (value: SortOrder) => unknown;
  onFilter: () => unknown;
  onFilterClear: () => unknown;
}

/** Filter section of the main page */
export default function FilterSection(props: Props) {
  const {
    minSalary,
    maxSalary,
    sortParams,
    sortOrder,
    onMinSalaryChange,
    onMaxSalaryChange,
    onSortParamChange,
    onSortOrderChange,
    onFilter,
    onFilterClear,
  } = props;

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row ">
        <div className="d-flex flex-column justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <Form.Group controlId="formBasicSalary">
              <Form.Label>Salary</Form.Label>
              <div className="d-flex flex-row align-items-center">
                <Form.Control
                  type="number"
                  placeholder="Minimum"
                  value={minSalary || ""}
                  onChange={(e) =>
                    onMinSalaryChange(parseFloat(e.target.value))
                  }
                />
                <div className="m-2">to</div>
                <Form.Control
                  type="number"
                  placeholder="Maximum"
                  value={maxSalary || ""}
                  onChange={(e) =>
                    onMaxSalaryChange(parseFloat(e.target.value))
                  }
                />
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="d-flex flex-column mx-5">
          <Form.Label>Sorting</Form.Label>
          <div className="d-flex flex-row">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary">
                {sortParams}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={() => onSortParamChange(SortParam.id)}>
                  ID
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => onSortParamChange(SortParam.login)}
                >
                  Login
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => onSortParamChange(SortParam.name)}
                >
                  Name
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => onSortParamChange(SortParam.salary)}
                >
                  Salary
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="mx-2">
              <Dropdown.Toggle variant="outline-secondary">
                {sortOrder}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onSelect={() => onSortOrderChange(SortOrder.ASC)}
                >
                  Ascending
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => onSortOrderChange(SortOrder.DESC)}
                >
                  Descending
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="d-flex flex-row my-4">
        <Button onClick={onFilterClear} variant="outline-secondary">
          Clear
        </Button>
        <Button className="mx-2" onClick={onFilter} variant="outline-primary">
          Filter
        </Button>
      </div>
    </div>
  );
}
