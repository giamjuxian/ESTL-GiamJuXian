import { Employee } from "../database/model/employee";
import {
  DUPLICATE_ID,
  DUPLICATE_LOGIN,
  SALARY_INVALID,
  SALARY_NEGATIVE,
  SALARY_WRONG_DECIMAL,
  validateEmployees,
} from "./validateEmployees";

describe("validateEmployees", () => {
  it("converts a valid array of employees", async () => {
    const data: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00",
      },
      {
        id: "e0002",
        login: "rwesley",
        name: "Ron Weasley",
        salary: "19234.50",
      },
      {
        id: "e0003",
        login: "ssnape",
        name: "Severus Snape",
        salary: "4000.00",
      },
    ];

    expect(validateEmployees(data)).toBe(true);
  });

  it("throws error for duplicate IDs", async () => {
    const data: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00",
      },
      {
        id: "e0001", // Duplicate
        login: "rwesley",
        name: "Ron Weasley",
        salary: "19234.50",
      },
      {
        id: "e0003",
        login: "ssnape",
        name: "Severus Snape",
        salary: "4000.00",
      },
    ];
    expect(() => validateEmployees(data)).toThrowError(DUPLICATE_ID);
  });

  it("throws error for duplicate logins", async () => {
    const data: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00",
      },
      {
        id: "e0002",
        login: "hpotter", // Duplicate
        name: "Ron Weasley",
        salary: "19234.50",
      },
      {
        id: "e0003",
        login: "ssnape",
        name: "Severus Snape",
        salary: "4000.00",
      },
    ];
    expect(() => validateEmployees(data)).toThrowError(DUPLICATE_LOGIN);
  });

  it("throws error for invalid salary string", async () => {
    const invalidData1: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "12.34.00",
      },
    ];

    const invalidData2: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: ".00",
      },
    ];

    expect(() => validateEmployees(invalidData1)).toThrowError(SALARY_INVALID);
    expect(() => validateEmployees(invalidData2)).toThrowError(SALARY_INVALID);
  });

  it("throws error for negative salary", async () => {
    const data: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00",
      },
      {
        id: "e0002",
        login: "rwesley",
        name: "Ron Weasley",
        salary: "-19234.50", // Negative salary
      },
      {
        id: "e0003",
        login: "ssnape",
        name: "Severus Snape",
        salary: "4000.00",
      },
    ];
    expect(() => validateEmployees(data)).toThrowError(SALARY_NEGATIVE);
  });

  it("throws error for negative salary", async () => {
    const noDecimals: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234", // No decimals
      },
    ];

    const moreDecimals: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00000", // Too many decimal places
      },
    ];

    const lessDecimals: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.1", // Too little decimal places
      },
    ];

    const zeroWithNoDecimals: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "0", // No decimals
      },
    ];
    expect(() => validateEmployees(noDecimals)).toThrowError(
      SALARY_WRONG_DECIMAL
    );
    expect(() => validateEmployees(moreDecimals)).toThrowError(
      SALARY_WRONG_DECIMAL
    );
    expect(() => validateEmployees(lessDecimals)).toThrowError(
      SALARY_WRONG_DECIMAL
    );
    expect(() => validateEmployees(zeroWithNoDecimals)).toThrowError(
      SALARY_WRONG_DECIMAL
    );
  });
});
