import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from '@nextui-org/react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ExportFormat,
  ExportFormScheme,
  ExportFormSchemeType,
  ExportType,
} from './scheme';

interface ExportModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ExportModal({ isOpen, onOpenChange }: ExportModalProps) {
  const form = useForm<ExportFormSchemeType>({
    resolver: zodResolver(ExportFormScheme),
  });

  const exportType = useWatch({ control: form.control, name: 'type' });

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);

    if (!isOpen) {
      form.reset();
    }
  };

  const handleSubmit = async () => {
    try {
      // await articlesService.exportArticles({
      //   type: data.type,
      //   format: data.format,
      //   shouldIncludeMedia: data.shouldIncludeMedia,
      //   articleId,
      // });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(() => (
          <div>
            <b>Failed to export articles</b>
            <br />
            {error.message}
          </div>
        ));
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen || form.formState.isSubmitting}
      onOpenChange={handleOpenChange}
      backdrop="blur"
    >
      <ModalContent as="form" onSubmit={form.handleSubmit(handleSubmit)}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Export article
            </ModalHeader>
            <ModalBody>
              <div>
                <Select
                  label="Export type"
                  labelPlacement="outside"
                  placeholder="Select export type"
                  variant="bordered"
                  isDisabled={form.formState.isSubmitting}
                  isInvalid={!!form.formState.errors.type}
                  errorMessage={form.formState.errors.type?.message}
                  {...form.register('type')}
                >
                  <SelectItem key={ExportType.CURRENT_ARTICLE}>
                    Current article
                  </SelectItem>
                  <SelectItem key={ExportType.ALL_ARTICLES_IN_ONE_FILE}>
                    All articles in one file
                  </SelectItem>
                  <SelectItem key={ExportType.ALL_ARTICLES_IN_A_ZIP_ARCHIVE}>
                    All articles in a zip archive
                  </SelectItem>
                </Select>
              </div>
              <div className="mt-4">
                <Select
                  label="Format"
                  labelPlacement="outside"
                  placeholder="Select format"
                  variant="bordered"
                  isDisabled={form.formState.isSubmitting}
                  isInvalid={!!form.formState.errors.format}
                  errorMessage={form.formState.errors.format?.message}
                  {...form.register('format')}
                >
                  <SelectItem key={ExportFormat.MARKDOWN}>Markdown</SelectItem>
                  <SelectItem key={ExportFormat.HTML}>HTML</SelectItem>
                </Select>
              </div>
              <div className="mt-4">
                <Switch
                  isDisabled={
                    form.formState.isSubmitting ||
                    exportType === ExportType.ALL_ARTICLES_IN_A_ZIP_ARCHIVE
                  }
                  isSelected={
                    form.watch('shouldIncludeMedia') ||
                    exportType === ExportType.ALL_ARTICLES_IN_A_ZIP_ARCHIVE
                  }
                  {...form.register('shouldIncludeMedia')}
                >
                  Include media
                </Switch>
                <div className="text-tiny text-foreground-400 flex p-1 relative flex-col gap-1.5">
                  This will increase the size of the exported file
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="grid grid-cols-2">
              <Button
                onPress={onClose}
                variant="flat"
                isDisabled={form.formState.isSubmitting}
                type="button"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={form.formState.isSubmitting}
              >
                Export
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
