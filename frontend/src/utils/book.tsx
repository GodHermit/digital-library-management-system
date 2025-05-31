import { EStatus } from "@/types/book";
import { ColorScale } from "@heroui/theme";
import { BookCheckIcon, BookDashed, BookOpenTextIcon, BookXIcon } from "lucide-react";
import { ReactNode } from "react";

export const statusToText: Record<EStatus, string> = {
  [EStatus.Planning]: 'Планую прочитати',
  [EStatus.InProgress]: 'Читаю',
  [EStatus.Done]: 'Прочитано',
  [EStatus.ReInProgress]: 'Перечитую',
  [EStatus.Paused]: 'Призупинено',
};

export const statusToIcons: Record<EStatus, ReactNode> = {
  [EStatus.Planning]: <BookDashed />,
  [EStatus.InProgress]: <BookOpenTextIcon />,
  [EStatus.Done]: <BookCheckIcon />,
  [EStatus.ReInProgress]: <BookOpenTextIcon />,
  [EStatus.Paused]: <BookXIcon />,
};

export const statusToColor: Record<EStatus, ColorScale> = {
  [EStatus.Planning]: 'default',
  [EStatus.InProgress]: 'warning',
  [EStatus.Done]: 'success',
  [EStatus.ReInProgress]: 'warning',
  [EStatus.Paused]: 'danger',
};

export const statusToColorHex: Record<EStatus, `#${string}`> = {
  [EStatus.Planning]: '#3f3f46',
  [EStatus.InProgress]: '#f5a524',
  [EStatus.Done]: '#17c964',
  [EStatus.ReInProgress]: '#f5a524',
  [EStatus.Paused]: '#f31260',
};

