export type ThemeMode = 'calido' | 'noche';

export type AppScreen = 'inicio' | 'registrar' | 'historial';

export type ShiftType = 'Mañana' | 'Tarde';

export type MilkQuality = 'Limpia y Normal' | 'Con Novedad';

export interface CowProfile {
  id: string;
  name: string;
  tagNumber: string;
  lot: string;
  breed: string;
  paddock: string;
  imageUrl: string;
  defaultLiters: number;
  isCustom?: boolean;
}

export interface MilkingRecord {
  id: string;
  receiptCode: string;
  cowId: string;
  cowName: string;
  cowTag: string;
  lot: string;
  breed: string;
  imageUrl: string;
  liters: number;
  shift: ShiftType;
  shiftTime: string;
  quality: MilkQuality;
  qualityNote?: string;
  timeFormatted: string;
  dateFormatted: string;
  operator: string;
  syncStatus: 'offline' | 'synced';
}

export interface DraftRecord {
  step: 1 | 2;
  cowId: string;
  liters: number;
  shift: ShiftType;
  quality: MilkQuality;
  qualityNote: string;
  updatedAt: string;
}
