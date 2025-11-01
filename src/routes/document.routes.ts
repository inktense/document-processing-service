import { Router } from "express";
import {
  createDocument,
  createDocumentFromFile,
  getDocumentByIdHandler,
  getDocumentByJobIdHandler,
  listDocumentsHandler,
  upload
} from "../controllers/document.controller.js";

export const documentsRouter = Router();

documentsRouter.post("/documents/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    createDocumentFromFile(req, res);
  } else {
    createDocument(req, res);
  }
});

documentsRouter.get("/documents", listDocumentsHandler);
documentsRouter.get("/documents/job/:jobId", getDocumentByJobIdHandler);
documentsRouter.get("/documents/:id", getDocumentByIdHandler);
