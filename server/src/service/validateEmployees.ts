import { HttpError } from "../error";
import { Employee } from "../database/model/employee";

export const DUPLICATE_ID = "Contains duplicate employee ID";
export const DUPLICATE_LOGIN = "Contains duplicate employee login";
export const SALARY_INVALID = "Invalid salary string provided";
export const SALARY_NEGATIVE = "Contains salary with value less than 0.";
export const SALARY_WRONG_DECIMAL =
  "Contains salary with value not in two decimal places";
export const validSalaryRegex = /^[+-]?((\d+(\.\d*)?))$/;

/**
 * Validates all employee attributes in an array of employee. Throws an
 * error if the validation fails.
 */
export const validateEmployees = (data: Employee[]): boolean => {
  const idMap = {};
  const loginMap = {};

  // Validate for duplicate ids and logins
  data.forEach((employee) => {
    if (employee.id in idMap) throw new HttpError(400, DUPLICATE_ID);

    if (employee.login in loginMap) throw new HttpError(400, DUPLICATE_LOGIN);

    validateEmployee(employee);

    idMap[employee.id] = 1;
    loginMap[employee.login] = 1;
  });

  return true;
};

/** Validates an individual employee based on the salary */
export const validateEmployee = (employee: Employee): boolean => {
  if (!/^[+-]?((\d+(\.\d*)?))$/.test(employee.salary))
    throw new HttpError(400, SALARY_INVALID);

  if (parseFloat(employee.salary) < 0)
    throw new HttpError(400, SALARY_NEGATIVE);

  const stringAfterDecimal = employee.salary.split(".")[1];
  if (
    !stringAfterDecimal ||
    stringAfterDecimal.length === 0 ||
    stringAfterDecimal.length > 2 ||
    stringAfterDecimal.length < 2
  )
    throw new HttpError(400, SALARY_WRONG_DECIMAL);

  return true;
};
