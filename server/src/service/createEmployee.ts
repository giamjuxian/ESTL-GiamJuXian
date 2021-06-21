import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";
import { validateEmployee } from "./validateEmployees";

/** Creates a single employee based on information provided provided */
const createEmployee = async (employee: Employee): Promise<string> => {
  validateEmployee(employee);

  try {
    const result = await db.oneOrNone(
      `
            INSERT INTO employees (id, login, name, salary) VALUES ($1, $2, $3, $4)
            RETURNING id
        `,
      [employee.id, employee.login, employee.name, employee.salary]
    );
    return result && result.id;
  } catch (err) {
    throw new HttpError(400, err.message);
  }

  return;
};

export default createEmployee;
