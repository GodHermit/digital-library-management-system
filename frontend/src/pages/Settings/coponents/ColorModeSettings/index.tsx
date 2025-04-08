import { useSettingsStore } from '@/stores/settings';
import { COLOR_MODE } from '@/types/settings';
import { Select, SelectItem } from "@heroui/react";
import { useShallow } from 'zustand/shallow';

export function ColorModeSettings() {
  const [colorMode, setColorMode] = useSettingsStore(
    useShallow((s) => [s.colorMode, s.setColorMode])
  );

  return (
    <div className="mt-12">
      <Select
        label="Тема"
        labelPlacement="outside"
        placeholder="Select color mode"
        variant="bordered"
        selectedKeys={[colorMode]}
        onChange={(e) => setColorMode(e.target.value as COLOR_MODE)}
      >
        <SelectItem key={COLOR_MODE.LIGHT}>Світла</SelectItem>
        <SelectItem key={COLOR_MODE.DARK}>Темна</SelectItem>
        <SelectItem key={COLOR_MODE.SYSTEM}>Системна</SelectItem>
      </Select>
    </div>
  );
}
