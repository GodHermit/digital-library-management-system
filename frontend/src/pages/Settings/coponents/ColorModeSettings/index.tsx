import { useSettingsStore } from '@/stores/settings';
import { COLOR_MODE } from '@/types/settings';
import { Select, SelectItem } from '@nextui-org/react';
import { useShallow } from 'zustand/shallow';

export function ColorModeSettings() {
  const [colorMode, setColorMode] = useSettingsStore(
    useShallow((s) => [s.colorMode, s.setColorMode])
  );

  return (
    <div className="mt-12">
      <Select
        label="Color mode"
        labelPlacement="outside"
        placeholder="Select color mode"
        variant="bordered"
        selectedKeys={[colorMode]}
        onChange={(e) => setColorMode(e.target.value as COLOR_MODE)}
      >
        <SelectItem key={COLOR_MODE.LIGHT}>Light</SelectItem>
        <SelectItem key={COLOR_MODE.DARK}>Dark</SelectItem>
        <SelectItem key={COLOR_MODE.SYSTEM}>Same as system</SelectItem>
      </Select>
    </div>
  );
}
