import express from "express";
import multer from "multer";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";
import addEmployees from "../service/addEmployees";
import createEmployee from "../service/createEmployee";
import deleteEmployee from "../service/deleteEmployee";
import getCount, { MISSING_PARAMTERS } from "../service/getCount";
import getEmployee from "../service/getEmployee";
import getEmployees from "../service/getEmployees";
import { parseCSVFile } from "../service/parseCSVFile";
import updateEmployee from "../service/updateEmployee";
import { validateEmployees } from "../service/validateEmployees";

const router = express.Router();

const uploadMiddleware = multer({ dest: "uploads/" });

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req, res, next) => {
    if (!req.file || !req.file.path)
      return next(new HttpError(500, "Missing csv file"));

    try {
      const employees = await parseCSVFile(req.file.path, true);
      validateEmployees(employees);
      await addEmployees(employees);
      res.json({
        success: true,
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", async (req, res, next) => {
  const { minSalary, maxSalary, offset, limit, sort } = req.query;

  try {
    let sortFixed = sort as string;
    if (sort && sort[0] === " ") {
      sortFixed = "+" + (sort as string).slice(1);
    }

    const options = {
      minSalary: minSalary ? parseFloat(minSalary as string) : undefined,
      maxSalary: maxSalary ? parseFloat(maxSalary as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sort: sortFixed ? sortFixed : undefined,
    };
    const employees: Employee[] = await getEmployees(options);
    res.json({ success: true, status: 200, results: employees });
  } catch (err) {
    next(err);
  }
});

router.get("/count", async (req, res, next) => {
  const { minSalary, maxSalary } = req.query;

  const options = {
    minSalary: minSalary ? parseFloat(minSalary as string) : undefined,
    maxSalary: maxSalary ? parseFloat(maxSalary as string) : undefined,
  };

  try {
    const count: number = await getCount(options);
    res.json({ success: true, status: 200, results: count });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const employee = await getEmployee(id);
    res.json({ success: true, status: 200, results: employee });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const { id, login, name, salary } = req.body;

  try {
    if (
      id === undefined ||
      login === undefined ||
      name === undefined ||
      salary === undefined
    ) {
      return next(new HttpError(400, MISSING_PARAMTERS));
    }
    const createdId: string = await createEmployee({ id, login, name, salary });
    res.json({ success: true, status: 200, results: createdId });
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  const { id, login, name, salary } = req.body;

  try {
    if (
      id === undefined ||
      login === undefined ||
      name === undefined ||
      salary === undefined
    ) {
      return next(new HttpError(400, MISSING_PARAMTERS));
    }
    await updateEmployee({ id, login, name, salary });
    res.json({ success: true, status: 200 });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await deleteEmployee(id);
    res.json({ success: true, status: 200 });
  } catch (err) {
    next(err);
  }
});

export default router;
