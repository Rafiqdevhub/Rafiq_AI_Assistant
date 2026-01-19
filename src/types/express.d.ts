declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      path: string;
      destination: string;
      filename: string;
      size: number;
      buffer: Buffer;
    }
  }

  interface Request {
    file?: Multer.File;
    files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
  }
}
