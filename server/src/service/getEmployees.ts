import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";

export const INVALID_SORT_QUERY = "Invalid query for sort";
export const MISSING_PARAMTERS = "Missing parameters";

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
  if (
    minSalary === undefined ||
    maxSalary === undefined ||
    offset === undefined ||
    limit === undefined ||
    sort === undefined
  )
    throw new HttpError(400, MISSING_PARAMTERS);

  let querySortParam = sort && sort.slice(1);
  let querySortDirection;

  switch (sort[0]) {
    case "+":
      querySortDirection = "ASC";
      break;
    case "-":
      querySortDirection = "DESC";
      break;
    default:
      throw new HttpError(400, INVALID_SORT_QUERY);
  }

  switch (querySortParam) {
    case "id":
    case "login":
    case "name":
    case "salary":
      break;
    default:
      throw new HttpError(400, INVALID_SORT_QUERY);
  }

  let employees: Employee[];
  employees = await db.manyOrNone(
    `
        SELECT * FROM employees E 
        WHERE E.salary >= $1
        AND E.salary <= $2
        ORDER BY ${querySortParam} ${querySortDirection}
        OFFSET $3
        LIMIT $4
      `,
    [minSalary, maxSalary, offset, limit]
  );

  return employees || [];
};

export default getEmployees;
