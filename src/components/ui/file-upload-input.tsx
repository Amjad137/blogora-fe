import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/utils/tailwind-utils';
import { uniq } from 'lodash';
import { FileText, FileWarning, Minus, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { DragEventHandler, useEffect, useState } from 'react';

type Props = {
  value?: File[];
  onChange: (fileList: File[]) => void;
  multiple?: boolean;
  loading?: boolean;
  fileSizeInBytes?: number;
  supportedFormats?: string[];
  additionalInstructions?: string[];
};

const FILE_SIZE = 5000000; // 5MB
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const FileUploadInput = (props: Props) => {
  const [fileList, setFileList] = useState<File[]>([]);

  useEffect(() => {
    setFileList(props.value ?? []);
  }, [props.value]);

  const handleFiles = (newFiles: File[]) => {
    if (props.multiple) {
      const newList = [...fileList, ...newFiles];
      setFileList(newList);
      props.onChange(newList);
    } else {
      setFileList(newFiles);
      props.onChange(newFiles);
    }
  };

  const onDragDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const dataTransferItems = event.dataTransfer.items || event.dataTransfer.files;
    const newFiles = Array.from(dataTransferItems)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));
    handleFiles(newFiles);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;
    if (inputFiles) {
      handleFiles(Array.from(inputFiles));
    }
  };

  const isValidFileSize = (size: number) =>
    props.fileSizeInBytes ? size <= props.fileSizeInBytes : size <= FILE_SIZE;

  const isValidFileType = (type: string) =>
    uniq([
      ...(props.supportedFormats?.length ? props.supportedFormats : SUPPORTED_FORMATS),
    ]).includes(type);

  const removeFile = (event: React.SyntheticEvent, file: File) => {
    event.preventDefault();
    const newList = fileList.filter((f) => f !== file);
    setFileList(newList);
    props.onChange(newList);
  };

  const getAdditionalInstructions = () => {
    if (props.additionalInstructions && props.additionalInstructions.length > 0) {
      return props.additionalInstructions.join(' ・ ');
    }
  };

  return (
    <div
      onDrop={onDragDrop}
      onDragOver={(e) => e.preventDefault()}
      className='group relative w-full min-h-[140px] group-hover:bg-primary-foreground/20 rounded-xl border-2 border-dashed border-primary/50 flex items-center justify-center p-4 transition ease-in'
    >
      {props.loading ? (
        <div className='flex flex-col items-center w-full'>
          <div className='flex space-x-2'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className='w-12 h-12' />
            ))}
          </div>
          <Skeleton className='w-64 h-3 mt-2' />
          <Skeleton className='w-48 h-3 mt-2' />
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          <div className='mb-1'>
            {fileList.length > 0 ? (
              <div className='flex justify-center items-center space-x-2 w-full'>
                {fileList.map((file, index) => {
                  if (!(isValidFileSize(file.size) && isValidFileType(file.type))) {
                    return (
                      <TooltipProvider key={file.lastModified * file.size * index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='relative flex items-center justify-center bg-red-500/20 w-12 h-12 rounded-lg z-10'>
                              <button
                                className='absolute flex justify-center items-center bg-red-600 -top-1 -right-1 w-4 h-4 rounded-full'
                                onClick={(e) => removeFile(e, file)}
                              >
                                <Minus className='text-white' size={11} />
                              </button>
                              <FileWarning className='text-red-600 text-xl' />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='text-xs text-slate-500'>
                              {!isValidFileSize(file.size)
                                ? 'File size too large'
                                : 'Invalid file type'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  } else {
                    return (
                      <div key={file.lastModified * file.size * index}>
                        {!file.type.startsWith('image') ? (
                          <TooltipProvider key={file.lastModified * file.size * index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='relative flex items-center justify-center bg-primary-foreground/80 w-12 h-12 rounded-lg z-10'>
                                  <button
                                    className='absolute flex justify-center items-center bg-red-600 -top-1 -right-1 w-4 h-4 rounded-full'
                                    onClick={(e) => removeFile(e, file)}
                                  >
                                    <Minus className='text-white' size={11} />
                                  </button>
                                  <FileText className='text-primary text-xl' />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='text-xs text-slate-500'>{file.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <TooltipProvider key={file.lastModified * file.size * index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='relative w-12 aspect-square z-10'>
                                  <button
                                    className='absolute flex justify-center items-center bg-red-600 -top-1 -right-1 w-4 h-4 rounded-full'
                                    onClick={(e) => removeFile(e, file)}
                                  >
                                    <Minus className='text-white' size={11} />
                                  </button>
                                  <Image
                                    src={URL.createObjectURL(file)}
                                    alt='image preview'
                                    width={160}
                                    height={160}
                                    className='object-cover w-full h-full rounded-lg'
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='text-xs text-slate-500'>{file.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center w-full'>
                <div className='flex items-center justify-center bg-primary-foreground/80 w-12 h-12 rounded-lg'>
                  <UploadCloud className='text-primary text-xl' />
                </div>
                <p className='text-primary text-sm'>Drag and drop your files here</p>
                <p className='text-sm'>or select it on the computer</p>
              </div>
            )}
          </div>
          <div className='flex flex-col items-center'>
            {fileList.length > 0 ? (
              <p className='text-sm text-slate-500'>
                {fileList.length} file{fileList.length > 1 ? 's' : ''} selected
              </p>
            ) : null}
            <p className={cn(`text-slate-500`, 'text-xs')}>{getAdditionalInstructions()}</p>
          </div>
          <Input
            title=''
            type='file'
            multiple={!!props.multiple}
            className='bg-primary-foreground cursor-pointer absolute block opacity-0 inset-0 w-full h-full z-0'
            onChange={onChangeHandler}
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadInput;
