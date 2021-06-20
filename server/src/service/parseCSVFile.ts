import fs from "fs";
import parse from "csv-parse";
import { HttpError } from "../error";
import { Employee } from "../database/model/employee";

export const EMPTY_CSV = "File provided is empty";

/**
 * Takes in a file path of a CSV file and parse it into an array
 * of employee objects.
 */
export const parseCSVFile = async (
  path: string,
  deleteAfterParse?: boolean
): Promise<Employee[]> => {
  const employees: Employee[] = await new Promise((resolve, reject) => {
    const csvParseOptions: parse.Options = {
      from_line: 2, // Ignore the first row
      columns: ["id", "login", "name", "salary"],
      comment: "#",
    };

    const stream = fs.createReadStream(path).pipe(parse(csvParseOptions));
    const employees: Employee[] = [];

    stream.on("data", (row) => {
      const { id, login, name, salary } = row;
      employees.push({ id, login, name, salary });
    });

    stream.on("end", function () {
      if (employees.length === 0) reject(new HttpError(422, EMPTY_CSV));
      resolve(employees);
    });

    stream.on("error", (err) => {
      reject(new HttpError(422, err.message));
    });

    stream.on("close", () => {
      if (deleteAfterParse) fs.unlinkSync(path);
    });
  });

  return employees;
};
