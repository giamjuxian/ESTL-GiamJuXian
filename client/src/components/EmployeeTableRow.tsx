import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";

export interface Employee {
  id: string;
  login: string;
  name: string;
  salary: string;
}

interface Props {
  employee: Employee;
  onEdit: (id: string) => unknown;
  onDelete: (id: string) => unknown;
}

/** Employee table row which includes action buttons to modify or delete employee */
export default function EmployeeTableRow(props: Props): JSX.Element {
  const { employee, onEdit, onDelete } = props;

  return (
    <div className="table_row px-3 py-2">
      <div className="row align-items-center">
        <div className="col-xs-12 col-sm-6 col-lg-2">{employee.id}</div>
        <div className="col-xs-12 col-sm-6 col-lg-2">{employee.login}</div>
        <div className="col-xs-12 col-sm-6 col-lg-4">{employee.name}</div>
        <div className="col-xs-12 col-sm-6 col-lg-2">{employee.salary}</div>
        <div className="col-xs-2 col-lg-2">
          <Button
            size="sm"
            variant="link"
            className="m-0 p-0 px-1"
            onClick={() => onEdit(employee.id)}
          >
            <FontAwesomeIcon color={"#000"} size="xs" icon="pen" />
          </Button>
          <Button
            size="sm"
            variant="link"
            className="m-0 p-0 px-1 mx-3"
            onClick={() => onDelete(employee.id)}
          >
            <FontAwesomeIcon color={"#000"} size="xs" icon="trash-alt" />
          </Button>
        </div>
      </div>
    </div>
  );
}
