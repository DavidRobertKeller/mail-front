export interface MailDocument {
  name: string;
  type: string;
  filename: string;
  filetype: string;
  size: number;
}

export interface Mail {
  id: string;
  subject: string;
  creator: string;
  creationDate: Date;
  lastModificationDate: Date;
  type: string;
  issuer: string;
  issuerType: string;
  issuerReference: string;
  documents: MailDocument[];
}
