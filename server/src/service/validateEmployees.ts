import { HttpError } from "../error";
import { Employee } from "../router/user";

export const DUPLICATE_ID = "Contains duplicate employee ID";
export const DUPLICATE_LOGIN = "Contains duplicate employee login";
export const SALARY_NEGATIVE = "Contains salary with value less than 0.";
export const SALARY_WRONG_DECIMAL =
  "Contains salary with value not in two decimal places";

export const validateEmployees = (employees: Employee[]): boolean => {
  const idMap = {};
  const loginMap = {};

  // Validate for duplicate ids and logins
  employees.forEach((employee) => {
    if (employee.id in idMap) throw new HttpError(422, DUPLICATE_ID);

    if (employee.login in loginMap) throw new HttpError(422, DUPLICATE_LOGIN);

    if (parseFloat(employee.salary) < 0)
      throw new HttpError(422, SALARY_NEGATIVE);

    if (
      !employee.salary.split(".")[1] ||
      employee.salary.split(".")[1].length === 0 ||
      employee.salary.split(".")[1].length > 2 ||
      employee.salary.split(".")[1].length < 2
    )
      throw new HttpError(422, SALARY_WRONG_DECIMAL);

    idMap[employee.id] = 1;
    loginMap[employee.login] = 1;
  });

  return true;
};
