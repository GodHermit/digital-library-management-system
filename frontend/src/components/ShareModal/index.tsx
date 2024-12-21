import { useColorMode } from '@/hooks/useColorMode';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { COLOR_MODE } from '@/types/settings';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { CheckIcon, LinkIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ShareModal({ isOpen, onOpenChange }: ShareModalProps) {
  const url = window.location.href;
  const [copiedText, copyText] = useCopyToClipboard(3000);
  const colorMode = useColorMode();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Share link
            </ModalHeader>
            <ModalBody>
              <QRCodeSVG
                value={url}
                width={undefined}
                height={undefined}
                className="w-full max-w-88"
                bgColor="none"
                fgColor={colorMode === COLOR_MODE.DARK ? '#fafafa' : '#333'}
                title={url}
              />
              <Input variant="flat" type="url" value={url} readOnly />
            </ModalBody>
            <ModalFooter className="grid grid-cols-2">
              <Button
                startContent={copiedText ? <CheckIcon /> : <LinkIcon />}
                onPress={() => copyText(url)}
                variant="flat"
                color={copiedText ? 'success' : 'default'}
              >
                {copiedText ? 'Copied!' : 'Copy link'}
              </Button>
              <Button color="primary" onPress={onClose}>
                Done
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
