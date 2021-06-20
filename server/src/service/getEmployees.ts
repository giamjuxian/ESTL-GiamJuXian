import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";

export const INVALID_SORT_QUERY = "Invalid query for sort";
/**
 * Get existing employees. If no parameters are give, we retrieve the 30
 * records in ascending order of their id.
 */
const getEmployees = async ({
  offset,
  limit,
  minSalary,
  maxSalary,
  sort,
}: {
  offset?: number;
  limit?: number;
  minSalary?: number;
  maxSalary?: number;
  sort?: string;
}): Promise<Employee[]> => {
  let queryMinSalary = minSalary || 0;
  let queryMaxSalary = maxSalary;
  let queryOffset = offset || 0;
  let queryLimit = limit || 30;
  let querySortParam = "id";
  let querySortDirection = "ASC";
  if (sort && sort.length > 1) {
    querySortParam = sort && sort.slice(1);
    switch (sort[0]) {
      case " ":
        // Plus sign gets converted to space in URL so we identify space as a +
        querySortDirection = "ASC";
        break;
      case "-":
        querySortDirection = "DESC";
        break;
      default:
        throw new HttpError(422, INVALID_SORT_QUERY);
    }

    switch (querySortParam) {
      case "id":
      case "login":
      case "name":
      case "salary":
        break;
      default:
        throw new HttpError(422, INVALID_SORT_QUERY);
    }
  }

  let employees: Employee[];
  if (queryMaxSalary) {
    employees = await db.manyOrNone(
      `
        SELECT * FROM employees E 
        WHERE E.salary >= $1
        AND E.salary <= $2
        ORDER BY ${querySortParam} ${querySortDirection}
        OFFSET $3
        LIMIT $4
      `,
      [queryMinSalary, queryMaxSalary, queryOffset, queryLimit]
    );
  } else {
    employees = await db.manyOrNone(
      `
        SELECT * FROM employees E 
        WHERE E.salary >= $1
        ORDER BY ${querySortParam} ${querySortDirection}
        OFFSET $2
        LIMIT $3
      `,
      [queryMinSalary, queryOffset, queryLimit]
    );
  }

  return employees || [];
};

export default getEmployees;
