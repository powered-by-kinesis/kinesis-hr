export type CreateContextRequestDTO = {
  jobDescription: string;
  localLanguage: 'indonesian' | 'japanese' | 'english';
  documentIds: number[];
};
