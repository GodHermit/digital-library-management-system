import { fileService } from '@/services/fileService';
import { IFile } from '@/types/files';
import { addErrorToast } from '@/utils/errorToast';
import { addToast, Button, ButtonProps } from '@heroui/react';
import { ChangeEvent, HTMLAttributes, useState } from 'react';

type TUploadFileButtonProps = ButtonProps & HTMLAttributes<HTMLInputElement>;

interface IUploadFileButtonProps extends TUploadFileButtonProps {
  children?: React.ReactNode;
  onSuccess?: (files: IFile[]) => void;
}

export function UploadFileButton({
  children,
  onSuccess,
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
      <input type="file" className="hidden size-0" onChange={handleUpload} />
    </Button>
  );
}
