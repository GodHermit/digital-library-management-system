import { useSettingsStore } from '@/stores/settings';
import { FONT_SIZE } from '@/types/settings';
import { Select, SelectItem } from '@nextui-org/react';
import { useShallow } from 'zustand/shallow';

export function FontSizeSettings() {
  const [fontSize, setFontSize] = useSettingsStore(
    useShallow((s) => [s.fontSize, s.setFontSize])
  );

  return (
    <div className="mt-12">
      <Select
        label="Font size"
        labelPlacement="outside"
        placeholder="Select font size"
        variant="bordered"
        selectedKeys={[fontSize]}
        onChange={(e) => setFontSize(e.target.value as FONT_SIZE)}
      >
        <SelectItem key={FONT_SIZE.SMALL} textValue="Small">
          <span className="text-sm">Small</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.BASE} textValue="Base">
          <span className="text-base">Base</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.MEDIUM} textValue="Medium">
          <span className="text-md">Medium</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.LARGE} textValue="Large">
          <span className="text-lg">Large</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.EXTRA_LARGE} textValue="Extra large">
          <span className="text-xl">Extra large</span>
        </SelectItem>
      </Select>
    </div>
  );
}
