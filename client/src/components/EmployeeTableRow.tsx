import React from 'react'

export interface Employee {
  id: string
  login: string
  name: string
  salary: string
}

interface Props {
  employee: Employee
}

/** Employee table row which includes action buttons to modify record */
export default function EmployeeTableRow(props: Props): JSX.Element {
  const { employee } = props

  return (
    <div className="table_row px-3 py-2">
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-lg-2">{employee.id}</div>
        <div className="col-xs-12 col-sm-6 col-lg-2">{employee.login}</div>
        <div className="col-xs-12 col-sm-6 col-lg-4">{employee.name}</div>
        <div className="col-xs-12 col-sm-6 col-lg-2">{employee.salary}</div>
        <div className="col-xs-2 col-lg-2"></div>
      </div>
    </div>
  )
}
