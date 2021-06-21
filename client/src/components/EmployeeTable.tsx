import React from "react";
import EmployeeTableHeader from "./EmployeeTableHeader";
import EmployeeTableRow, { Employee } from "./EmployeeTableRow";

interface Props {
  employees: Employee[];
}

/** Table to display records of employees based on filters */
export default function EmployeeTable(props: Props) {
  const { employees } = props;

  const renderTableRows = () =>
    employees.map((e) => <EmployeeTableRow employee={e} />);

  return (
    <div className="d-flex flex-column py-5">
      <h3 className="mb-3">Employees</h3>
      <EmployeeTableHeader />
      {renderTableRows()}
    </div>
  );
}
