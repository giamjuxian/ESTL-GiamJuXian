import {
  DUPLICATE_ID,
  DUPLICATE_LOGIN,
  SALARY_NEGATIVE,
  SALARY_WRONG_DECIMAL,
  validateEmployees,
} from "./validateEmployees";

describe("validateEmployees", () => {
  it("validates a valid array of employees", async () => {
    const employees = [
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
    expect(validateEmployees(employees)).toBe(true);
  });

  it("throws error for duplicate IDs", async () => {
    const employees = [
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
    expect(() => validateEmployees(employees)).toThrowError(DUPLICATE_ID);
  });

  it("throws error for duplicate logins", async () => {
    const employees = [
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
    expect(() => validateEmployees(employees)).toThrowError(DUPLICATE_LOGIN);
  });

  it("throws error for negative salary", async () => {
    const employees = [
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
    expect(() => validateEmployees(employees)).toThrowError(SALARY_NEGATIVE);
  });

  it("throws error for negative salary", async () => {
    const noDecimals = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234", // No decimals
      },
    ];

    const moreDecimals = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00000", // Too many decimal places
      },
    ];

    const lessDecimals = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.1", // Too little decimal places
      },
    ];

    const zeroWithNoDecimals = [
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
