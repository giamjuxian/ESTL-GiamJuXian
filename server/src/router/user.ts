import express from "express";
import multer from "multer";

const router = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() });

router.post("/upload", uploadMiddleware.single("file"), (req, res, next) => {
  console.log(req.file);
  res.json({ success: true, data: "hello world" });
});

export default router;
