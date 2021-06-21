import { db } from "../database/database";

/** Deletes a single employee based on the id provided */
const deleteEmployee = async (id: string) => {
  return db.oneOrNone(
    `
        DELETE FROM employees E 
        WHERE E.id = $1
    `,
    [id]
  );
};

export default deleteEmployee;
