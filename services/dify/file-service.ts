import difyClient from '../../lib/dify-client';
import { DifyFileUploadRequest, DifyFileUploadResponse } from './interfaces/file-upload';

export const uploadFileToDify = async (
  request: DifyFileUploadRequest,
): Promise<DifyFileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('user', request.user);

  try {
    const response = await difyClient.post<DifyFileUploadResponse>('/files/upload', formData);
    return response.data;
  } catch (error) {
    console.error('Error during Dify file upload service call:', error);
    throw error;
  }
};
