import express from "express";
import multer from "multer";
import { db } from "../database/database";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";
import addEmployees from "../service/addEmployees";
import getEmployees from "../service/getEmployees";
import { parseCSVFile } from "../service/parseCSVFile";
import { validateEmployees } from "../service/validateEmployees";

const router = express.Router();

const uploadMiddleware = multer({ dest: "uploads/" });

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req, res, next) => {
    if (!req.file || !req.file.path)
      next(new HttpError(500, "Missing csv file"));

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
  console.log(minSalary, maxSalary, offset, limit, sort);

  try {
    const options = {
      minSalary: minSalary ? parseFloat(minSalary as string) : undefined,
      maxSalary: maxSalary ? parseFloat(maxSalary as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sort: sort ? (sort as string) : undefined,
    };
    const employees: Employee[] = await getEmployees(options);
    res.json({ success: true, status: 200, results: employees });
  } catch (err) {
    next(err);
  }
});

export default router;
