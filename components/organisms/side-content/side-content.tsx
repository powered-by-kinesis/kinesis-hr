import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { FileIcon, Trash2Icon } from 'lucide-react';
import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ContextDocument } from '@/types/context/ContextResponseDTO';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useDocuments } from '@/hooks/use-documents/use-documents';
import { toast } from 'sonner';
import { useCandidateRank } from '@/hooks/use-candidate-rank';
import { RankList } from './rank-list';
import { cn } from '@/lib/utils';
import { AnalysisLanguage } from '@/components/organisms/analysis-language';

interface SideContentProps {
  context: ContextResponseDTO;
  isContextLoading: boolean;
  updateContext: (contextId: number, updates: Partial<ContextResponseDTO>) => void;
  onNewChat: () => void;
  updateChatHistory: (contextId: number, updatedContext: ContextResponseDTO) => void;
  getChatHistory?: () => Promise<void>;
  className?: string;
}

export const SideContent: React.FC<SideContentProps> = ({
  context,
  isContextLoading,
  updateContext,
  onNewChat,
  updateChatHistory,
  getChatHistory,
  className,
}) => {
  const [localContext, setLocalContext] = useState<ContextResponseDTO>(context || {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const {
    supportedTypes,
    supportedExtensions,
    isUploading,
    uploadDocuments,
    storeContextDocuments,
    deleteDocument,
  } = useDocuments();
  const {
    rankings,
    loading: isRankLoading,
    error: rankError,
    getCandidateRank,
    loadExistingCandidates,
  } = useCandidateRank();

  useEffect(() => {
    setLocalContext(context || {});

    // Load existing candidates when context changes
    if (context?.id) {
      loadExistingCandidates(context);
    }
  }, [context, loadExistingCandidates]);

  const handleSave = () => {
    const updates: Partial<ContextResponseDTO> = {};
    if (localContext.jobDescription && localContext.jobDescription !== context.jobDescription) {
      updates.jobDescription = localContext.jobDescription;
    }
    if (localContext.localLanguage && localContext.localLanguage !== context.localLanguage) {
      updates.localLanguage = localContext.localLanguage;
    }
    if (Object.keys(updates).length > 0) {
      updateContext(context.id, updates);
    }
  };

  const handleFileDrop = (files: File[]) => {
    const validFiles = files.filter((file) => supportedTypes.includes(file.type));
    if (!validFiles.length) {
      toast.error(`Please upload CV/Resume in PDF, DOC, or DOCX format only.`);
      return;
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const dropZoneProps = {
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFileDrop(files);
    },
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    const documentIds = await uploadDocuments(selectedFiles);

    if (documentIds.length > 0) {
      await storeContextDocuments(context.id, documentIds, updateChatHistory);
      setSelectedFiles([]);
    }
  };

  const handleRemoveFile = (file: File) => {
    setSelectedFiles(selectedFiles.filter((f) => f !== file));
  };

  const handleDeleteDocument = async (documentId: number) => {
    const isDeleted = await deleteDocument(documentId);
    if (isDeleted) {
      setLocalContext({
        ...localContext,
        documents: localContext.documents?.filter((doc) => doc.document.id !== documentId),
      });
    }
  };

  const UploadSection = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm text-foreground">CV Files</label>
        <span className="text-xs text-muted-foreground">
          {localContext?.documents?.length || 0} files
        </span>
      </div>

      <div
        className={`
          border-2 border-dashed hover:border-blue-500 rounded-lg p-4 transition-all duration-200
          ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        {...dropZoneProps}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept={supportedTypes.join(',')}
          onChange={async (e) => {
            if (e.target.files) {
              handleFileDrop(Array.from(e.target.files));
            }
          }}
        />

        <div className="flex flex-col items-center gap-2 py-4 ">
          <UploadIcon className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Drag & drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported Extensions: {supportedExtensions.join(', ')}
          </p>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-sm text-muted-foreground">Selected files:</p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] items-center bg-background p-2 rounded gap-2 w-full"
            >
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <FileIcon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFile(file)}
                className="hover:text-destructive cursor-pointer"
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button className="w-full mt-2" disabled={isUploading} onClick={handleFileUpload}>
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <UploadIcon className="w-4 h-4 mr-2" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Selected Files'}
          </Button>
        </div>
      )}

      {/* Existing Files List */}
      <div className="space-y-2 mt-4">
        {localContext?.documents?.map((document: ContextDocument) => (
          <div
            key={document.document.id}
            className="grid grid-cols-[1fr_auto] items-center p-3 border hover:bg-accent rounded-lg group hover:border-blue-500 transition-all duration-200 gap-3 w-full"
          >
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
              <div className="bg-primary/20 p-2 rounded-lg flex-shrink-0">
                <FileIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-sm font-medium truncate">{document.document.fileName}</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(document.document.fileSize / 1024)} KB
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="transition-all duration-200 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => handleDeleteDocument(document.document.id)}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const hasChanges =
    localContext.jobDescription !== context.jobDescription ||
    localContext.localLanguage !== context.localLanguage;

  return (
    <Card className={cn('h-full w-full rounded-none shadow-none border-none px-4', className)}>
      <Tabs defaultValue="cv-list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cv-list" disabled={!context.id}>
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="rankings" disabled={!context.id}>
            Rank
          </TabsTrigger>
        </TabsList>

        {context.id ? (
          <>
            {/* CV List Content */}
            <TabsContent value="cv-list">
              <ScrollArea className="h-[calc(100dvh-200px)] w-full rounded-md">
                <div className="space-y-2 p-4">
                  {isContextLoading && !hasChanges ? (
                    <>
                      <Skeleton className="h-[60px] w-full" />
                      <Skeleton className="h-[60px] w-full" />
                    </>
                  ) : (
                    <>
                      <UploadSection />
                      <div className="space-y-6 mt-6">
                        {/* Job Descriptions */}
                        <div className="grid gap-3">
                          <label className="text-sm text-foreground">
                            Job Description{' '}
                            <span className="text-xs text-muted-foreground">
                              (Minimum 50 characters)
                            </span>
                            <span className="text-xs text-red-500">*</span>
                          </label>
                          <Textarea
                            id="job-description"
                            value={localContext?.jobDescription}
                            onChange={(e) =>
                              setLocalContext({ ...localContext, jobDescription: e.target.value })
                            }
                            minLength={50}
                            placeholder="Example:
  We are seeking a Senior Software Engineer with 5+ years of experience in full-stack development, Strong proficiency in React, Node.js, and TypeScript, Experience with cloud services (AWS/GCP), Track record of leading technical projects, Excellent problem-solving and communication skills"
                            className="max-h-[100px] resize-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 "
                            maxLength={5000}
                          />
                          <div className="flex justify-between items-center text-sm">
                            <p className="text-muted-foreground">
                              Tip: Include key requirements, responsibilities, and qualifications
                            </p>
                            <span className="text-muted-foreground">
                              {localContext?.jobDescription?.length || 0}/5000
                            </span>
                          </div>
                        </div>

                        {/* Local Language */}
                        <div className="flex flex-col gap-3">
                          <AnalysisLanguage
                            language={localContext?.localLanguage}
                            setLanguage={(value: string) =>
                              setLocalContext({
                                ...localContext,
                                localLanguage: value as 'indonesian' | 'english' | 'japanese',
                              })
                            }
                          />
                        </div>

                        <div className="w-full flex justify-end">
                          <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={isContextLoading || !hasChanges}
                            className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 cursor-pointer"
                          >
                            {isContextLoading && hasChanges ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Save'
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Rankings Content */}
            <TabsContent value="rankings">
              <RankList
                rankings={rankings || []}
                isRankLoading={isRankLoading}
                rankError={rankError}
                onGetCandidateRank={() => getCandidateRank(context.id, getChatHistory)}
              />
            </TabsContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100dvh-200px)] space-y-4">
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-xl font-semibold text-slate-200">No Knowledge Base</h3>
              <p className="text-sm text-slate-400">Start by setting up your knowledge base</p>
            </div>
            <Button
              variant="outline"
              onClick={onNewChat}
              className="cursor-pointer gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              Upload Knowledge
            </Button>
          </div>
        )}
      </Tabs>
    </Card>
  );
};
