import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import upsertEmployees from "./upsertEmployees";

describe("upsertEmployees", () => {
  beforeEach(async () => {
    await db.none("TRUNCATE TABLE employees CASCADE");
  });
  afterAll(db.$pool.end);

  it("upserts employees into the database", async () => {
    const employees: Employee[] = [
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

    await upsertEmployees(employees);

    const created = await Promise.all(
      employees.map((e) => {
        return db.one("SELECT * FROM employees WHERE id=$1", [e.id]);
      })
    );

    expect(created).toHaveLength(3);
    created.forEach((e, index) => {
      const origEmployee = employees[index];
      expect(e).toBeTruthy();
      expect(e.id).toBe(origEmployee.id);
      expect(e.login).toBe(origEmployee.login);
      expect(e.name).toBe(origEmployee.name);
      expect(e.salary).toBe(origEmployee.salary);
    });

    const updatedEmployees: Employee[] = [
      {
        id: "e0001",
        login: "newhpotter",
        name: "New Harry Potter",
        salary: "12224.00",
      },
      {
        id: "e0002",
        login: "newrwesley",
        name: "New Ron Weasley",
        salary: "1933234.50",
      },
      {
        id: "e0003",
        login: "newssnape",
        name: "New Severus Snape",
        salary: "3000.00",
      },
    ];

    await upsertEmployees(updatedEmployees);

    const updateCreated = await Promise.all(
      updatedEmployees.map((e) => {
        return db.one("SELECT * FROM employees WHERE id=$1", [e.id]);
      })
    );

    expect(updateCreated).toHaveLength(3);
    updateCreated.forEach((e, index) => {
      const origEmployee = updatedEmployees[index];
      expect(e).toBeTruthy();
      expect(e.id).toBe(origEmployee.id);
      expect(e.login).toBe(origEmployee.login);
      expect(e.name).toBe(origEmployee.name);
      expect(e.salary).toBe(origEmployee.salary);
    });
  });

  it("swaps login without constraint error when uploading employees", async () => {
    // Insert original employees
    const employees: Employee[] = [
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
    ];

    await upsertEmployees(employees);

    const created = await Promise.all(
      employees.map((e) => {
        return db.one("SELECT * FROM employees WHERE id=$1", [e.id]);
      })
    );

    expect(created).toHaveLength(2);
    created.forEach((e, index) => {
      const origEmployee = employees[index];
      expect(e).toBeTruthy();
      expect(e.id).toBe(origEmployee.id);
      expect(e.login).toBe(origEmployee.login);
      expect(e.name).toBe(origEmployee.name);
      expect(e.salary).toBe(origEmployee.salary);
    });

    const swapped: Employee[] = [
      {
        id: "e0001",
        login: "rwesley",
        name: "Harry Potter",
        salary: "1234.00",
      },
      {
        id: "e0002",
        login: "hpotter",
        name: "Ron Weasley",
        salary: "19234.50",
      },
    ];

    await upsertEmployees(swapped);

    const swapCreated = await Promise.all(
      swapped.map((e) => {
        return db.one("SELECT * FROM employees WHERE id=$1", [e.id]);
      })
    );

    expect(swapCreated).toHaveLength(2);
    swapCreated.forEach((e, index) => {
      const origEmployee = swapped[index];
      expect(e).toBeTruthy();
      expect(e.id).toBe(origEmployee.id);
      expect(e.login).toBe(origEmployee.login);
      expect(e.name).toBe(origEmployee.name);
      expect(e.salary).toBe(origEmployee.salary);
    });
  });

  it("throws error when we try to add the same login with different id", async () => {
    const employees: Employee[] = [
      {
        id: "e0001",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00",
      },
    ];

    await upsertEmployees(employees);

    const differentId: Employee[] = [
      {
        id: "e0002",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00",
      },
    ];

    expect(upsertEmployees(differentId)).rejects.toThrow(
      `duplicate key value violates unique constraint "employees_login_key"`
    );
  });
});
