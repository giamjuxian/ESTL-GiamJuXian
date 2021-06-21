import { db } from "../database/database";
import { HttpError } from "../error";

export const MISSING_PARAMTERS = "Missing parameters";

/**
 * Get the count of employees that fulfil the condition where salary is
 * more than or equals minSalary and less than or equals maxSalary. Used
 * for pagination.
 */
const getCount = async ({
  minSalary,
  maxSalary,
}: {
  minSalary?: number;
  maxSalary?: number;
}): Promise<number> => {
  if (maxSalary === undefined || minSalary === undefined) {
    throw new HttpError(400, MISSING_PARAMTERS);
  }
  const result = await db.one(
    `
        SELECT count(*) FROM employees E 
        WHERE E.salary >= $1
        AND E.salary <= $2
    `,
    [minSalary, maxSalary]
  );

  return parseInt(result.count);
};

export default getCount;
