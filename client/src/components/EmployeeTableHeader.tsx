import React from 'react'

/** Header row of the employee table */
export default function EmployeeTableHeader(): JSX.Element {
  return (
    <div className="table_header px-3 py-2">
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-lg-2">ID</div>
        <div className="col-xs-12 col-sm-6 col-lg-2">Login</div>
        <div className="col-xs-12 col-sm-6 col-lg-4">Name</div>
        <div className="col-xs-12 col-sm-6 col-lg-2">Salary</div>
        <div className="col-xs-12 col-sm-12 col-lg-2">Action</div>
      </div>
    </div>
  )
}
