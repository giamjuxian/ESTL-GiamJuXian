import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import addEmployees from "./addEmployees";

describe("addEmployees", () => {
  beforeEach(async () => {
    await db.none("TRUNCATE TABLE employees CASCADE");
  });
  afterAll(db.$pool.end);

  it("inserts or updates employees into the database", async () => {
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

    await addEmployees(employees);

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

    const update: Employee[] = [
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

    await addEmployees(update);

    const updateCreated = await Promise.all(
      update.map((e) => {
        return db.one("SELECT * FROM employees WHERE id=$1", [e.id]);
      })
    );

    expect(updateCreated).toHaveLength(3);
    updateCreated.forEach((e, index) => {
      const origEmployee = update[index];
      expect(e).toBeTruthy();
      expect(e.id).toBe(origEmployee.id);
      expect(e.login).toBe(origEmployee.login);
      expect(e.name).toBe(origEmployee.name);
      expect(e.salary).toBe(origEmployee.salary);
    });

    const newEmployee: Employee = {
      id: "e0005",
      login: "thisisnew",
      name: "New Employee",
      salary: "12224.00",
    };

    await addEmployees([newEmployee]);

    const allEmployees = await db.many("SELECT * FROM employees");

    expect(allEmployees).toHaveLength(4);
    const e = allEmployees[3];
    expect(e.id).toBe(newEmployee.id);
    expect(e.login).toBe(newEmployee.login);
    expect(e.name).toBe(newEmployee.name);
    expect(e.salary).toBe(newEmployee.salary);
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

    await addEmployees(employees);

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

    await addEmployees(swapped);

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

    await addEmployees(employees);

    const differentId: Employee[] = [
      {
        id: "e0002",
        login: "hpotter",
        name: "Harry Potter",
        salary: "1234.00",
      },
    ];

    await expect(addEmployees(differentId)).rejects.toThrow(
      `duplicate key value violates unique constraint "employees_login_key"`
    );
  });

  it("rollbacks all insert and update when there is an error", async () => {
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

    await addEmployees(employees);

    const differentId: Employee[] = [
      {
        id: "e0001",
        login: "newhpotter",
        name: "New Harry Potter",
        salary: "1234.00",
      },
      {
        id: "e0003",
        login: "rwesley", //  Should throw error for duplicate login
        name: "Ron Weasley",
        salary: "19234.50",
      },
    ];

    await expect(addEmployees(differentId)).rejects.toThrow(
      `duplicate key value violates unique constraint "employees_login_key"`
    );

    const created = await Promise.all([
      db.oneOrNone("SELECT * FROM employees WHERE id=$1", ["e0001"]),
      db.oneOrNone("SELECT * FROM employees WHERE id=$1", ["e0002"]),
      db.oneOrNone("SELECT * FROM employees WHERE id=$1", ["e0003"]),
    ]);

    expect(created[0]).toBeTruthy();
    expect(created[0].id).toBe(employees[0].id);
    expect(created[0].login).toBe(employees[0].login);
    expect(created[0].name).toBe(employees[0].name);
    expect(created[0].salary).toBe(employees[0].salary);

    expect(created[1]).toBeTruthy();
    expect(created[1].id).toBe(employees[1].id);
    expect(created[1].login).toBe(employees[1].login);
    expect(created[1].name).toBe(employees[1].name);
    expect(created[1].salary).toBe(employees[1].salary);

    expect(created[2]).toBeFalsy();
  });
});
