import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { readFile } from "fs/promises";
import path from "path";

const router = Router();

// POST /api/upload - Upload image
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
      return;
    }

    // Read file and convert to base64
    const filePath = path.join(process.cwd(), req.file.path);
    const fileBuffer = await readFile(filePath);
    const base64 = fileBuffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    res.json({
      status: "success",
      data: {
        imageDataUrl: dataUrl,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

