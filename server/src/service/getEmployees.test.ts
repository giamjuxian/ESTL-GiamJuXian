import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import addEmployees from "./addEmployees";
import getEmployees, { INVALID_SORT_QUERY } from "./getEmployees";

describe("getEmployees", () => {
  beforeAll(async () => {
    await db.none("TRUNCATE TABLE employees CASCADE");
    await addEmployees(employees);
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("retrieves employees ordered by ascending id if no options given", async () => {
    const results = await getEmployees({});
    expect(results).toHaveLength(8);
    let prevId;
    results.forEach((e) => {
      if (!prevId) {
        prevId = e.id;
      } else {
        expect(e.id > prevId).toBe(true);
      }
    });
  });

  it("retrieves employees with salary more than or equals to min salary", async () => {
    const minSalary = 3001;
    const results = await getEmployees({ minSalary });
    expect(results).toHaveLength(5);
    results.forEach((e) => {
      expect(parseFloat(e.salary)).toBeGreaterThanOrEqual(minSalary);
    });
  });

  it("retrieves employees with salary less than or equals max salary", async () => {
    const maxSalary = 3001;
    const results = await getEmployees({ maxSalary });
    expect(results).toHaveLength(3);
    results.forEach((e) => {
      expect(parseFloat(e.salary)).toBeLessThanOrEqual(maxSalary);
    });
  });

  it("retrieves employees with offset", async () => {
    const offset = 5;
    const results = await getEmployees({ offset });
    expect(results).toHaveLength(3);
    results.forEach((e) => {
      expect(e.id > employees[4].id).toBe(true);
    });
  });

  it("retrieves employees with limit", async () => {
    const limit = 3;
    const results = await getEmployees({ limit });
    expect(results).toHaveLength(limit);
  });

  it("retrieves employees sorted in ascending order of name", async () => {
    const sort = " name"; // space as +
    const results = await getEmployees({ sort });
    expect(results).toHaveLength(8);

    let prevName;
    results.forEach((e) => {
      if (!prevName) {
        prevName = e.name;
      } else {
        expect(e.name > prevName).toBe(true);
      }
    });
  });

  it("retrieves employees sorted in descending order of login", async () => {
    const sort = "-login";
    const results = await getEmployees({ sort });
    expect(results).toHaveLength(8);

    let prevLogin;
    results.forEach((e) => {
      if (!prevLogin) {
        prevLogin = e.login;
      } else {
        expect(e.login < prevLogin).toBe(true);
      }
    });
  });

  it("throws invalid sort query error if it is no an attribute of employees", async () => {
    const sort = "-character";
    await expect(getEmployees({ sort })).rejects.toThrow(INVALID_SORT_QUERY);
  });

  it("throws invalid sort query error if it is no space or -", async () => {
    const sort1 = "$login";
    const sort2 = "0login";
    const sort3 = "alogin";
    const sort4 = "#login";
    await expect(getEmployees({ sort: sort1 })).rejects.toThrow(
      INVALID_SORT_QUERY
    );
    await expect(getEmployees({ sort: sort2 })).rejects.toThrow(
      INVALID_SORT_QUERY
    );
    await expect(getEmployees({ sort: sort3 })).rejects.toThrow(
      INVALID_SORT_QUERY
    );
    await expect(getEmployees({ sort: sort4 })).rejects.toThrow(
      INVALID_SORT_QUERY
    );
  });
});

// Salary range of employees from 1000 to 8000
const employees: Employee[] = [
  {
    id: "id01",
    login: "login01",
    name: "name01",
    salary: "1000.00",
  },
  {
    id: "id02",
    login: "login02",
    name: "name02",
    salary: "2000.00",
  },
  {
    id: "id03",
    login: "login03",
    name: "name03",
    salary: "3000.00",
  },
  {
    id: "id04",
    login: "login04",
    name: "name04",
    salary: "4000.00",
  },
  {
    id: "id05",
    login: "login05",
    name: "name05",
    salary: "5000.00",
  },
  {
    id: "id06",
    login: "login06",
    name: "name06",
    salary: "6000.00",
  },
  {
    id: "id07",
    login: "login07",
    name: "name07",
    salary: "7000.00",
  },
  {
    id: "id08",
    login: "login08",
    name: "name08",
    salary: "8000.00",
  },
];
