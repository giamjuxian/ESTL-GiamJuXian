import { EMPTY_CSV, parseCSVFile } from "./parseCSVFile";

describe("parseCSVFile", () => {
  it("parses a valid csv upload file for employees", async () => {
    const path = __dirname + "/../test/validWithHeader.csv";
    const employees = await parseCSVFile(path);
    expect(employees).toMatchObject(validEmployees);
  });

  it("parses a valid csv ignoring lines that start with #", async () => {
    const path = __dirname + "/../test/validWithComments.csv";
    const employees = await parseCSVFile(path);
    expect(employees).toMatchObject(validEmployees);
  });

  it("parses a valid csv ignoring first line", async () => {
    const path = __dirname + "/../test/validIgnoreFirstLine.csv";
    const employees = await parseCSVFile(path);
    expect(employees).toMatchObject(validEmployees);
  });

  it("throws error for empty file", async () => {
    const path = __dirname + "/../test/invalidEmpty.csv";
    expect(parseCSVFile(path)).rejects.toThrow(EMPTY_CSV);
  });

  it("throws error for empty file even with comments", async () => {
    const path = __dirname + "/../test/invalidEmptyWithComments.csv";
    expect(parseCSVFile(path)).rejects.toThrow(EMPTY_CSV);
  });

  it("throws error when there are too few columns", async () => {
    const path = __dirname + "/../test/invalidTooFewColumns.csv";
    expect(parseCSVFile(path)).rejects.toThrow(
      "Invalid Record Length: columns length is 4, got 3 on line 2"
    );
  });
  it("throws error when there are too many columns", async () => {
    const path = __dirname + "/../test/invalidTooManyColumns.csv";
    expect(parseCSVFile(path)).rejects.toThrow(
      "Invalid Record Length: columns length is 4, got 5 on line 3"
    );
  });
});

const validEmployees = [
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
  {
    id: "e0004",
    login: "rhagrid",
    name: "Rubeus Hagrid",
    salary: "3999.99",
  },
  {
    id: "e0005",
    login: "voldemort",
    name: "Lord Voldemort",
    salary: "523.40",
  },
  {
    id: "e0006",
    login: "gwesley",
    name: "Ginny Weasley",
    salary: "4000.00",
  },
  {
    id: "e0007",
    login: "hgranger",
    name: "Hermione Granger",
    salary: "0.00",
  },
  {
    id: "e0008",
    login: "adumbledore",
    name: "Albus Dumbledore",
    salary: "34.23",
  },
  {
    id: "e0009",
    login: "dmalfoy",
    name: "Draco Malfoy",
    salary: "34234.50",
  },
  { id: "e0010", login: "basilisk", name: "Basilisk", salary: "23.43" },
];
