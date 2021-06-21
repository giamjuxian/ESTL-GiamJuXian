import { db } from "../database/database";
import createEmployee from "./createEmployee";
import getEmployee from "./getEmployee";

describe("createEmployee", () => {
  beforeAll(async () => {
    await db.none("TRUNCATE TABLE employees CASCADE");
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  it("creates the right employee based on id", async () => {
    const employee1 = {
      id: "id01",
      login: "login01",
      name: "name01",
      salary: "1000.00",
    };
    const id1 = await createEmployee(employee1);

    const employee2 = {
      id: "id07",
      login: "login07",
      name: "name07",
      salary: "7000.00",
    };
    const id2 = await createEmployee(employee2);

    const created1 = await getEmployee(id1);
    expect(created1.id).toBe(employee1.id);
    expect(created1.login).toBe(employee1.login);
    expect(created1.name).toBe(employee1.name);
    expect(created1.salary).toBe(employee1.salary);

    const created2 = await getEmployee(id2);
    expect(created2.id).toBe(employee2.id);
    expect(created2.login).toBe(employee2.login);
    expect(created2.name).toBe(employee2.name);
    expect(created2.salary).toBe(employee2.salary);
  });
});
