import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import addEmployees from "./addEmployees";
import getEmployee, { USER_NOT_FOUND } from "./getEmployee";

describe("getEmployee", () => {
  beforeAll(async () => {
    await db.none("TRUNCATE TABLE employees CASCADE");
    await addEmployees(employees);
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("retrieves the right employee based on id", async () => {
    const employee1 = employees[1];
    const result1 = await getEmployee(employee1.id);

    expect(result1).toBeTruthy();
    expect(result1.id).toBe(employee1.id);
    expect(result1.login).toBe(employee1.login);
    expect(result1.name).toBe(employee1.name);
    expect(result1.salary).toBe(employee1.salary);

    const employee2 = employees[1];
    const result2 = await getEmployee(employee2.id);

    expect(result2).toBeTruthy();
    expect(result2.id).toBe(employee2.id);
    expect(result2.login).toBe(employee2.login);
    expect(result2.name).toBe(employee2.name);
    expect(result2.salary).toBe(employee2.salary);
  });

  it("throws error if employee does not exists", async () => {
    const id = "notexists";
    await expect(getEmployee(id)).rejects.toThrow(USER_NOT_FOUND);
  });
});

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
