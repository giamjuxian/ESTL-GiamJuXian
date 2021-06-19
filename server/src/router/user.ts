import express from "express";
import multer from "multer";
import { HttpError } from "../error";
import { parseCSVFile } from "../service/parseCSVFile";
import { validateEmployees } from "../service/validateEmployees";

const router = express.Router();

const uploadMiddleware = multer({ dest: "uploads/" });

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req, res, next) => {
    if (!req.file && !req.file.path)
      next(new HttpError(500, "Missing csv file"));

    try {
      const employees = await uploadEmployees(req.file.path);
      res.json({ success: true, data: employees });
    } catch (err) {
      next(err);
    }
  }
);

const uploadEmployees = async (path: string) => {
  const employees = await parseCSVFile(path, true);
  validateEmployees(employees);
  return employees;
};

export default router;
