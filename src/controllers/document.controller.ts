import { Request, Response } from "express";

export async function upload(req: Request, res: Response) {
  const { file } = req.file;
  const document = await uploadService(file);
  res.status(201).json(document);
}

export async function createDocument(req: Request, res: Response) {
  const { text } = req.body;
  const document = await createDocumentService(text);
  res.status(201).json(document);
}

export async function createDocumentFromFile(req: Request, res: Response) {
  const { file } = req.file;
  const document = await createDocumentService(file);
  res.status(201).json(document);
}

export async function getDocumentByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  const document = await getDocumentByIdService(id);
  res.status(200).json(document);
}

export async function getDocumentByJobIdHandler(req: Request, res: Response) {
  const { jobId } = req.params;
  const document = await getDocumentByJobIdService(jobId);
  res.status(200).json(document);
}

export async function listDocumentsHandler(req: Request, res: Response) {
  const documents = await listDocumentsService();
  res.status(200).json(documents);
}