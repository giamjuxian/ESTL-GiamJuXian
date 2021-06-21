import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";
import { validateEmployee } from "./validateEmployees";

export const LOGIN_ALREADY_EXISTS = "Login already exists";
export const USER_NOT_FOUND = "User does not exists";

/** Updates a single employee based on the id provided */
const updateEmployee = async (employee: Employee) => {
  validateEmployee(employee);

  try {
    await db.none(
      `
            UPDATE employees E
            SET (login, name, salary) = ($1, $2, $3)
            WHERE E.id = $4
        `,
      [employee.login, employee.name, employee.salary, employee.id]
    );
  } catch (err) {
    if (
      err.message ===
      `duplicate key value violates unique constraint "employees_login_key"`
    ) {
      throw new HttpError(400, LOGIN_ALREADY_EXISTS);
    }
    throw new HttpError(400, err.message);
  }

  return;
};

export default updateEmployee;
