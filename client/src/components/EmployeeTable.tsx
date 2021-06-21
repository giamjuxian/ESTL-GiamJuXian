import React from "react";
import EmployeeTableHeader from "./EmployeeTableHeader";
import EmployeeTableRow, { Employee } from "./EmployeeTableRow";

interface Props {
  employees: Employee[];
  onEdit: (id: string) => unknown;
  onDelete: (id: string) => unknown;
}

/** Table to display records of employees based on filters */
export default function EmployeeTable(props: Props) {
  const { employees, onEdit, onDelete } = props;

  const renderTableRows = () =>
    employees.map((e) => (
      <EmployeeTableRow
        key={e.id}
        employee={e}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ));

  return (
    <div className="d-flex flex-column py-5">
      <h3 className="mb-3">Employees</h3>
      <EmployeeTableHeader />
      {renderTableRows()}
    </div>
  );
}
