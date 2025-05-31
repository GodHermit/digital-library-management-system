import { fileService } from '@/services/fileService';
import { IFile } from '@/types/files';
import { addErrorToast } from '@/utils/errorToast';
import { addToast, Button, ButtonProps } from '@heroui/react';
import { ChangeEvent, InputHTMLAttributes, useState } from 'react';

interface IUploadFileButtonProps extends ButtonProps {
  children?: React.ReactNode;
  onSuccess?: (files: IFile[]) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

export function UploadFileButton({
  children,
  onSuccess,
  inputProps,
  ...props
}: IUploadFileButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsSubmitting(true);

      const files = e.target.files;
      if (!files || files.length <= 0) {
        throw new Error('No file selected');
      }

      const data = await fileService.uploadFiles(files);

      onSuccess?.(data);

      addToast({
        title: 'Файл успішно завантажено',
        severity: 'success',
      });
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button as="label" isLoading={isSubmitting} {...props}>
      {children}
      <input
        type="file"
        className="hidden size-0"
        {...inputProps}
        onChange={handleUpload}
      />
    </Button>
  );
}
