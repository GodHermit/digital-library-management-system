import { addToast, Button } from '@heroui/react';
import { RotateCcwIcon, Trash2Icon } from 'lucide-react';
import { ColorModeSettings } from './coponents/ColorModeSettings';
import { FontSizeSettings } from './coponents/FontSizeSettings';
import { useSettingsStore } from '@/stores/settings';
import { Helmet } from 'react-helmet';
import { addErrorToast } from '@/utils/errorToast';
import { userService } from '@/services/userService';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/types/routes';
import { usePrivy } from '@privy-io/react-auth';

export function SettingsPage() {
  const { logout } = usePrivy();
  const navigate = useNavigate();
  const resetSettings = useSettingsStore(s => s.resetSettings);

  const handleRestoreDefaultSettings = () => {
    resetSettings();
  };
  const handleClearCache = () => {};

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      await logout();
      navigate(ROUTES.HOME);

      addToast({
        title: 'Акаунт успішно видалено!',
        severity: 'success',
      })
    } catch (error) {
      addErrorToast(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Налаштування</title>
      </Helmet>
      <h1>Налаштування</h1>
      <ColorModeSettings />
      <FontSizeSettings />
      <h2 className="mb-2 text-danger">Небезпечна зона</h2>
      <div className="flex flex-col divide-y-2 divide-danger rounded-lg border-2 border-danger">
        <div className="flex items-center p-4">
          <div className="flex flex-col">
            <b>Відновити Налаштування</b>
            <span>
              Ця дія відновить налаштування програми до значень за
              замовчуванням.
            </span>
          </div>
          <Button
            color="danger"
            variant="flat"
            className="ml-auto"
            startContent={<RotateCcwIcon />}
            onPress={handleRestoreDefaultSettings}
          >
            Відновити налаштування
          </Button>
        </div>
        <div className="flex items-center p-4">
          <div className="flex flex-col">
            <b>Кеш</b>
            <span>Ця дія очистить кеш програми.</span>
          </div>
          <Button
            color="danger"
            variant="flat"
            className="ml-auto"
            startContent={<Trash2Icon />}
            onPress={handleClearCache}
          >
            Очистити кеш
          </Button>
        </div>
        <div className="flex items-center p-4">
          <div className="flex flex-col">
            <b>Видалити акаунт</b>
            <span>
              Якщо ви бажаєте бути забутим, натисніть цю кнопку. Всі ваші дані
              будуть видалені з нашої бази даних. Ця дія є незворотною.
            </span>
          </div>
          <Button
            color="danger"
            variant="flat"
            className="ml-auto"
            startContent={<Trash2Icon />}
            onPress={handleDeleteAccount}
          >
            Видалити акаунт
          </Button>
        </div>
      </div>
    </>
  );
}
