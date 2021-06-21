import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import addEmployees from "./addEmployees";
import getEmployee from "./getEmployee";
import updateEmployee, { LOGIN_ALREADY_EXISTS } from "./updateEmployee";

describe("updateEmployee", () => {
  beforeAll(async () => {
    await db.none("TRUNCATE TABLE employees CASCADE");
    await addEmployees(employees);
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("updates the right employee based on id", async () => {
    const employee1 = employees[1];
    const toUpdated = {
      ...employee1,
      login: "newlogin",
      name: "New Login",
      salary: "4321.21",
    };
    const beforeUpdate = await getEmployee(employee1.id);
    expect(beforeUpdate).toBeTruthy();
    expect(beforeUpdate.id).toBe(employee1.id);
    expect(beforeUpdate.login).toBe(employee1.login);
    expect(beforeUpdate.name).toBe(employee1.name);
    expect(beforeUpdate.salary).toBe(employee1.salary);

    await updateEmployee(toUpdated);

    const afterUpdate = await getEmployee(employee1.id);
    expect(afterUpdate).toBeTruthy();
    expect(afterUpdate.id).toBe(toUpdated.id);
    expect(afterUpdate.login).toBe(toUpdated.login);
    expect(afterUpdate.name).toBe(toUpdated.name);
    expect(afterUpdate.salary).toBe(toUpdated.salary);
  });

  it("throws error when updating employee to an existing an login", async () => {
    const employee1 = employees[1];
    const toUpdated = {
      ...employee1,
      login: "login01",
      name: "New Login",
      salary: "4321.21",
    };

    await expect(updateEmployee(toUpdated)).rejects.toThrow(
      LOGIN_ALREADY_EXISTS
    );
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
