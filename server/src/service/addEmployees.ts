import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";

/**
 * Inserts an array of employees into the database. If id of the inserted
 * employee already exists, we update the employees instead. This is done
 * as an atomic transaction so if any insert fails, all inserts are rolledback
 */
const addEmployees = async (employees: Employee[]) => {
  return db
    .tx(async (t) => {
      const defer = t.none("SET CONSTRAINTS ALL DEFERRED");
      const queries = employees.map((e) => {
        return t.none(
          ` INSERT INTO employees (id, login, name, salary) VALUES ($1, $2, $3, $4)
          ON CONFLICT (id)
          DO UPDATE SET (login, name, salary) = ($2, $3, $4)`,
          [e.id, e.login, e.name, e.salary]
        );
      });

      return t.batch([defer, ...queries]);
    })
    .catch((err) => {
      throw new HttpError(500, err.message);
    });
};

export default addEmployees;
