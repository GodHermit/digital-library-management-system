import { useSettingsStore } from '@/stores/settings';
import { FONT_SIZE } from '@/types/settings';
import { Select, SelectItem } from "@heroui/react";
import { useShallow } from 'zustand/shallow';

export function FontSizeSettings() {
  const [fontSize, setFontSize] = useSettingsStore(
    useShallow((s) => [s.fontSize, s.setFontSize])
  );

  return (
    <div className="mt-12">
      <Select
        label="Розмір шрифту"
        labelPlacement="outside"
        placeholder="Select font size"
        variant="bordered"
        selectedKeys={[fontSize]}
        onChange={(e) => setFontSize(e.target.value as FONT_SIZE)}
      >
        <SelectItem key={FONT_SIZE.SMALL} textValue="Small">
          <span className="text-sm">Малий</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.BASE} textValue="Base">
          <span className="text-base">Нормальний (за замовчуванням)</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.MEDIUM} textValue="Medium">
          <span className="text-medium">Середній</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.LARGE} textValue="Large">
          <span className="text-lg">Великий</span>
        </SelectItem>
        <SelectItem key={FONT_SIZE.EXTRA_LARGE} textValue="Extra large">
          <span className="text-xl">Найбільший</span>
        </SelectItem>
      </Select>
    </div>
  );
}
