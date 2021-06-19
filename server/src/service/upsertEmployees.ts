import { db, pgp } from "../database/database";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";

const upsertEmployees = async (employees: Employee[]) => {
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

export default upsertEmployees;
