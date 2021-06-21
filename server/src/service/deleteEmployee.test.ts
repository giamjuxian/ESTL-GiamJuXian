import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import addEmployees from "./addEmployees";
import deleteEmployee from "./deleteEmployee";
import getEmployee, { USER_NOT_FOUND } from "./getEmployee";

describe("deleteEmployee", () => {
  beforeAll(async () => {
    await db.none("TRUNCATE TABLE employees CASCADE");
    await addEmployees(employees);
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("deletes the right employee based on id", async () => {
    const employee1 = employees[1];
    const beforeDelete1 = await getEmployee(employee1.id);
    expect(beforeDelete1).toBeTruthy();

    await deleteEmployee(employee1.id);
    await expect(getEmployee(employee1.id)).rejects.toThrow(USER_NOT_FOUND);

    const employee2 = employees[5];
    const beforeDelete2 = await getEmployee(employee2.id);
    expect(beforeDelete2).toBeTruthy();

    await deleteEmployee(employee2.id);
    await expect(getEmployee(employee2.id)).rejects.toThrow(USER_NOT_FOUND);
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
