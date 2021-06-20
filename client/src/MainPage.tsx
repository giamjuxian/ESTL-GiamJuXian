import React, { useEffect, useState } from "react";
import { APIType, fetchAPI } from "./api";
import EmployeeTable from "./components/EmployeeTable";
import { Employee } from "./components/EmployeeTableRow";

export default function MainPage(): JSX.Element {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      const results: Employee[] | null = await fetchAPI<Employee[]>({
        url: "/users?minSalary=0&maxSalary=4000&offset=0&limit=30&sort=+id",
        type: APIType.get,
      });
      console.log(results);

      if (results) setEmployees(results);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex-grow-1 px-4 pb-5">
      <EmployeeTable employees={employees} />
    </div>
  );
}
