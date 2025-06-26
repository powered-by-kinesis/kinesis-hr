import { DocumentResponseDTO } from '@/types/document/DocumentResponseDTO';
import { toast } from 'sonner';
import { useState } from 'react';
import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';

export const useDocuments = () => {
  const [isUploading, setIsUploading] = useState(false);
  const supportedTypes = [
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  ];
  const supportedExtensions = ['pdf', 'docx', 'doc'];

  const validateFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const maxSize = 10 * 1024 * 1024;

    if (!supportedTypes.includes(file.type)) {
      toast.error(`Please upload CV/Resume in PDF, DOC, or DOCX format only.`);
      return false;
    }

    if (!extension || !supportedExtensions.includes(extension)) {
      toast.error(`Please upload CV/Resume in PDF, DOC, or DOCX format only.`);
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File too large. Maximum file size is 10MB for CV/Resume.');
      return false;
    }

    return true;
  };

  const uploadDocuments = async (files: File[]) => {
    setIsUploading(true);

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return [];

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const documents: DocumentResponseDTO[] = data.data;

      if (documents.length === 0) {
        toast.error('No documents uploaded.');
        return [];
      }

      const documentIds = documents.map((doc) => doc.id);

      toast.success('Documents uploaded successfully.');
      return documentIds;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload CV/Resume. Please try again.');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const storeContextDocuments = async (
    contextId: number,
    documentIds: number[],
    updateChatHistory: (contextId: number, updatedContext: ContextResponseDTO) => void,
  ) => {
    try {
      const response = await fetch(`/api/contexts/documents`, {
        method: 'POST',
        body: JSON.stringify({ contextId, documentIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to store context documents');
      }

      const data = await response.json();
      const context: ContextResponseDTO = data.data;
      updateChatHistory(contextId, context);
    } catch (error) {
      console.error('Store context documents error:', error);
      toast.error('Failed to store context documents. Please try again.');
    }
  };

  const deleteDocument = async (documentId: number): Promise<boolean> => {
    toast.loading('Deleting document...');
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      toast.dismiss();
      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete document error:', error);
      toast.dismiss();
      toast.error('Failed to delete document. Please try again.');
      return false;
    }
  };

  return {
    supportedTypes,
    supportedExtensions,
    isUploading,
    setIsUploading,
    validateFile,
    uploadDocuments,
    storeContextDocuments,
    deleteDocument,
  };
};
