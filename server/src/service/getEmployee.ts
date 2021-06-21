import { db } from "../database/database";
import { HttpError } from "../error";

export const USER_NOT_FOUND = "User does not exists";

/** Get a single employee based on the id provided */
const getEmployee = async (id: string) => {
  const employee = await db.oneOrNone(
    `
        SELECT * FROM employees E 
        WHERE E.id = $1
    `,
    [id]
  );

  if (!employee) throw new HttpError(400, USER_NOT_FOUND);
  return employee;
};

export default getEmployee;
