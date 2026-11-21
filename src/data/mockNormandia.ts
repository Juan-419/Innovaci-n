import { CowProfile, MilkingRecord } from '../types/normandia';

export const NORMANDIA_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrAVt_tvpzIRg5A474B7mMbCcNIOOtQO0RJxjPvwqBxhP5u8LHNFrrbr31gduufTmIqlzQ075Iz9r8urAHlgP6KIdJ9dCMDJafJnixg1PiUJFeTsezcKNxDvXGfq7L2js23AgPChrOUEN7iAtWqoibJWD6n5j4DJ9BKpfRZRLC8JWFN1-meHBHP6mbxi7IXnGaCxcVV1eE_t17gxKKPpqeYaAWATWkoi2fU0qLJK7KY';

export const COW_MARIPOSA_CONFIRM_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBMNJtpqZKrKI9VfE-75Pt1A__LJMvTkqSMmVQ2vHmzC0g_voD3BorbWm-_ZBhxvw9Ayyy5R2-TJW45zD960N3dRt7QFafW_GQ4w6LUdDWalfbXe2PtpBr8N5tjXgGdOLbQfVwZZTe7CU6R3-kYrH3R9qQyM6JIi9DVeq_PiZgyHqsd75m6b-CMjy5WuY-G9PRXkWhhCqwOflqP28yiccyvTxAhmztvK_tatVjv15o';

export const COW_MARIPOSA_STEP2_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAGZ9IJtJJzWKVdEUwIxGIfxhyQKcnl4MnVHOzUvRN37FMgRrOqvXK2SMus6SqEA09YNxaePdRAEmyNZp3iMwWpYXigest7JYwNjik-dM4t2aDHi64JuWZNA4AQNzIgAe5iba9INjJaRICIW2TDMeYv2bBeOZpxx7pK_dicR-AH0IdOQu76UW2SKDAaNA15e7tV0NFVWtdGrZCwxfL94g4Oc8Us4LXi4WA6rnOIE84';

export const LOTE_EL_ROBLE_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBZlfHlXhV18qL4Wp2lHPnnuhCfsX95JsqYBcVjWxhI5FLjpHMzrMG9cel7yW0GDrW80L3My4vijgjUV1B6m7kBtSVjU97OBjNG0ptp-pEpKyedn02nK6dZ-5YFOVe7BTU2BbbTern9YaTatzZjcRsCvAFwjqK2L_I6XmZpJWKHNYiBmWOsXX-RlJi4vnH0nmZKfG1T-UHdMFosSfzX8X-1f36sw_F_JMHZM7f2ai8';

export const COW_CATALOG: CowProfile[] = [
  {
    id: 'mariposa-408',
    name: 'Mariposa',
    tagNumber: '#408',
    lot: 'Lote 2',
    breed: 'Raza Normanda',
    paddock: 'Corral de Ordeño',
    imageUrl: COW_MARIPOSA_STEP2_IMG,
    defaultLiters: 18.5,
  },
  {
    id: 'paloma-419',
    name: 'Paloma',
    tagNumber: '#419',
    lot: 'Lote 2',
    breed: 'Raza Normanda',
    paddock: 'Potrero Alto',
    imageUrl: COW_MARIPOSA_CONFIRM_IMG,
    defaultLiters: 16.0,
  },
  {
    id: 'canela-215',
    name: 'Canela',
    tagNumber: '#215',
    lot: 'Lote 2',
    breed: 'Raza Normanda',
    paddock: 'Corral de Ordeño',
    imageUrl: COW_MARIPOSA_STEP2_IMG,
    defaultLiters: 20.0,
  },
  {
    id: 'estrella-312',
    name: 'Estrella',
    tagNumber: '#312',
    lot: 'Lote 1',
    breed: 'Raza Normanda',
    paddock: 'Lote El Roble',
    imageUrl: LOTE_EL_ROBLE_IMG,
    defaultLiters: 21.5,
  },
  {
    id: 'luna-104',
    name: 'Luna',
    tagNumber: '#104',
    lot: 'Lote 3',
    breed: 'Raza Normanda',
    paddock: 'La Pradera',
    imageUrl: COW_MARIPOSA_CONFIRM_IMG,
    defaultLiters: 17.5,
  },
  {
    id: 'brisa-507',
    name: 'Brisa',
    tagNumber: '#507',
    lot: 'Lote 3',
    breed: 'Raza Normanda',
    paddock: 'La Pradera',
    imageUrl: LOTE_EL_ROBLE_IMG,
    defaultLiters: 19.0,
  },
];

export const INITIAL_RECORDS: MilkingRecord[] = [
  {
    id: 'rec-0842',
    receiptCode: '#REG-2025-0842',
    cowId: 'mariposa-408',
    cowName: 'Mariposa',
    cowTag: '#408',
    lot: 'Lote 2',
    breed: 'Raza Normanda',
    imageUrl: COW_MARIPOSA_CONFIRM_IMG,
    liters: 18.5,
    shift: 'Mañana',
    shiftTime: '6:00 AM',
    quality: 'Limpia y Normal',
    timeFormatted: '6:15 AM',
    dateFormatted: 'Hoy',
    operator: 'Don Carlos',
    syncStatus: 'offline',
  },
  {
    id: 'rec-0841',
    receiptCode: '#REG-2025-0841',
    cowId: 'estrella-312',
    cowName: 'Lote El Roble',
    cowTag: '#312',
    lot: 'Lote 1',
    breed: 'Raza Normanda',
    imageUrl: LOTE_EL_ROBLE_IMG,
    liters: 21.5,
    shift: 'Mañana',
    shiftTime: '6:00 AM',
    quality: 'Limpia y Normal',
    timeFormatted: '10:30 AM',
    dateFormatted: 'Hoy',
    operator: 'Don Carlos',
    syncStatus: 'synced',
  },
  {
    id: 'rec-0840',
    receiptCode: '#REG-2025-0840',
    cowId: 'luna-104',
    cowName: 'Luna',
    cowTag: '#104',
    lot: 'Lote 3',
    breed: 'Raza Normanda',
    imageUrl: COW_MARIPOSA_CONFIRM_IMG,
    liters: 17.5,
    shift: 'Mañana',
    shiftTime: '6:00 AM',
    quality: 'Limpia y Normal',
    timeFormatted: '5:50 AM',
    dateFormatted: 'Hoy',
    operator: 'Don Carlos',
    syncStatus: 'synced',
  },
];

export const NOVELTY_REASONS = [
  'Grumos leves',
  'Color distinto',
  'Ubre sensible',
  'Menor cantidad',
];
