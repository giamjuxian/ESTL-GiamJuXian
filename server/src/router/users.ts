import express from "express";
import multer from "multer";
import { Employee } from "../database/model/employee";
import { HttpError } from "../error";
import addEmployees from "../service/addEmployees";
import getCount from "../service/getCount";
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

export default router;
