import { Button } from "@heroui/react";
import { RotateCcwIcon, Trash2Icon } from 'lucide-react';
import { ColorModeSettings } from './coponents/ColorModeSettings';
import { FontSizeSettings } from './coponents/FontSizeSettings';
import { useSettingsStore } from '@/stores/settings';
import { Helmet } from 'react-helmet';

export function SettingsPage() {
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  const handleRestoreDefaultSettings = () => {
    resetSettings();
  };
  const handleClearCache = () => {};

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <h1>Settings</h1>
      <ColorModeSettings />
      <FontSizeSettings />
      <h2 className="mb-2 text-danger">Danger zone</h2>
      <div className="flex flex-col divide-y-2 divide-danger rounded-lg border-2 border-danger">
        <div className="flex items-center p-4">
          <div className="flex flex-col">
            <b>Restore default settings</b>
            <span>
              This action will restore the default settings of the application.
            </span>
          </div>
          <Button
            color="danger"
            variant="flat"
            className="ml-auto"
            startContent={<RotateCcwIcon />}
            onPress={handleRestoreDefaultSettings}
          >
            Restore default settings
          </Button>
        </div>
        <div className="flex items-center p-4">
          <div className="flex flex-col">
            <b>Clear cache</b>
            <span>This action will clear the cache of the application.</span>
          </div>
          <Button
            color="danger"
            variant="flat"
            className="ml-auto"
            startContent={<Trash2Icon />}
            onPress={handleClearCache}
          >
            Clear all data
          </Button>
        </div>
      </div>
    </>
  );
}
