'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, XIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDocuments } from '@/hooks/use-documents/use-documents';

export function StepTwo({
  isOpen,
  onOpenChange,
  onNext,
  onBack,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: (documentIds: number[]) => void;
  onBack: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { isUploading, supportedTypes, uploadDocuments } = useDocuments();

  const handleRemoveFile = (file: File) => {
    setSelectedFiles(selectedFiles.filter((f) => f !== file));
  };

  const handleFileUpload = async (files: File[]): Promise<number[]> => {
    return uploadDocuments(files);
  };

  const handleDoneClick = async () => {
    if (selectedFiles.length > 0) {
      const documentIds = await handleFileUpload(selectedFiles);
      onNext(documentIds);
    } else {
      onNext([]);
    }
    onOpenChange(false);
    setSelectedFiles([]);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-[95vw] w-full sm:max-w-[600px] lg:max-w-[800px] max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            AI HR Assistant Setup
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Upload your CV/Resume candidate to help me understand your recruitment context better.
            This will enable me to provide more accurate and relevant assistance.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInputChange}
            accept={supportedTypes.join(',')}
            multiple
          />

          <div
            className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-blue-400/30'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <FileText
                  className={`h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-blue-400/70'}`}
                />
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium text-gray-700">Upload CV/Resume</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Drag & drop here, or{' '}
                  <button
                    className="text-blue-500 hover:underline font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrowseClick();
                    }}
                  >
                    browse files
                  </button>
                </p>
              </div>
              <div className="space-y-1 sm:space-y-2 mt-2 text-start">
                <p className="text-xs sm:text-sm text-gray-500">Supported Extensions:</p>
                <ul className="text-xs sm:text-sm text-gray-500 list-disc list-inside">
                  <li>PDF</li>
                  <li>DOC</li>
                  <li>DOCX</li>
                </ul>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <div className="p-4">
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-3 border border-text-foreground  rounded-lg text-sm "
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-700" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(file)}
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-6 gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isUploading}
            className="border-2 bg-card"
          >
            Back
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white px-8"
            onClick={handleDoneClick}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? 'Uploading...' : 'Done'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
