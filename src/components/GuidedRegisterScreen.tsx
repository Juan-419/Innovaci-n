import { useMemo, useState } from 'react';
import { COW_CATALOG, NOVELTY_REASONS } from '../data/mockNormandia';
import {
  CowProfile,
  DraftRecord,
  MilkQuality,
  MilkingRecord,
  ShiftType,
  ThemeMode,
} from '../types/normandia';
import { SafeImage } from './SafeImage';

interface GuidedRegisterScreenProps {
  theme: ThemeMode;
  initialStep: 1 | 2;
  initialDraft: DraftRecord | null;
  todayRecords: MilkingRecord[];
  onBackHome: () => void;
  onSaveDraft: (draft: DraftRecord) => void;
  onCompleteRecord: (payload: {
    cow: CowProfile;
    liters: number;
    shift: ShiftType;
    quality: MilkQuality;
    qualityNote?: string;
  }) => void;
}

function getBucketLabel(liters: number): string {
  if (liters <= 0) return 'Sin pesada aún';
  if (liters < 8) return 'Menos de 1 balde';
  if (liters <= 13) return 'Aprox. 1 balde';
  if (liters <= 20) return 'Aprox. 1 balde y medio';
  if (liters <= 26) return 'Aprox. 2 baldes';
  return `Aprox. ${(liters / 12).toFixed(1)} baldes`;
}

export function GuidedRegisterScreen({
  theme,
  initialStep,
  initialDraft,
  todayRecords,
  onBackHome,
  onSaveDraft,
  onCompleteRecord,
}: GuidedRegisterScreenProps) {
  const isNight = theme === 'noche';

  const nextPendingCow = useMemo(() => {
    const recordedIds = new Set(todayRecords.map((r) => r.cowId));
    return COW_CATALOG.find((c) => !recordedIds.has(c.id)) ?? COW_CATALOG[0];
  }, [todayRecords]);

  const [step, setStep] = useState<1 | 2>(initialDraft?.step ?? initialStep);
  const [selectedCowId, setSelectedCowId] = useState<string>(
    initialDraft?.cowId ?? (initialStep === 2 ? COW_CATALOG[0].id : nextPendingCow.id)
  );
  const [lotFilter, setLotFilter] = useState<'Todos' | 'Lote 1' | 'Lote 2' | 'Lote 3'>('Todos');
  const [liters, setLiters] = useState<number>(
    initialDraft?.liters ?? COW_CATALOG[0].defaultLiters
  );
  const [shift, setShift] = useState<ShiftType>(initialDraft?.shift ?? 'Mañana');
  const [quality, setQuality] = useState<MilkQuality>(
    initialDraft?.quality ?? 'Limpia y Normal'
  );
  const [qualityNote, setQualityNote] = useState<string>(initialDraft?.qualityNote ?? '');

  const selectedCow = useMemo(
    () => COW_CATALOG.find((c) => c.id === selectedCowId) ?? COW_CATALOG[0],
    [selectedCowId]
  );

  const recordedCowIds = useMemo(
    () => new Set(todayRecords.map((r) => r.cowId)),
    [todayRecords]
  );

  const filteredCows = useMemo(() => {
    if (lotFilter === 'Todos') return COW_CATALOG;
    return COW_CATALOG.filter((c) => c.lot === lotFilter);
  }, [lotFilter]);

  const adjustLiters = (delta: number) => {
    setLiters((prev) => Math.max(0, Math.round((prev + delta) * 10) / 10));
  };

  const handleSelectCow = (cow: CowProfile) => {
    setSelectedCowId(cow.id);
    if (!initialDraft) {
      setLiters(cow.defaultLiters);
    }
    setStep(2);
  };

  const handleSaveDraftClick = () => {
    onSaveDraft({
      step,
      cowId: selectedCow.id,
      liters,
      shift,
      quality,
      qualityNote,
      updatedAt: new Date().toLocaleTimeString('es-CO', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    });
  };

  const handleComplete = () => {
    onCompleteRecord({
      cow: selectedCow,
      liters,
      shift,
      quality,
      qualityNote: quality === 'Con Novedad' ? qualityNote || 'Observación general' : undefined,
    });
  };

  const formattedLiters = liters % 1 === 0 ? liters.toFixed(0) : liters.toFixed(1);

  return (
    <div className="flex flex-col w-full pb-6 space-y-5">
      {/* Top Orientation Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={() => (step === 2 ? setStep(1) : onBackHome())}
          aria-label="Volver a la pantalla anterior"
          className={`min-h-[52px] px-4 rounded-xl flex items-center gap-1.5 active:translate-y-0.5 transition-transform cursor-pointer ${
            isNight
              ? 'bg-[#222222] border border-[#3A3A3A] text-white hover:bg-[#2E2E2E]'
              : 'bg-surface-container-high hover:bg-surface-variant text-on-surface'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[26px] ms-filled ${
              isNight ? 'text-[#FFB784]' : 'text-primary'
            }`}
          >
            arrow_back
          </span>
          <span className="font-display text-[20px] font-bold">Atrás</span>
        </button>

        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full ${
            isNight
              ? 'bg-[#132418] border border-[#22C55E] text-[#4AE176]'
              : 'bg-surface-container-low text-on-surface'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
          <span className="text-[14px] font-semibold whitespace-nowrap">
            Modo Campo (Sin Internet)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Progress + Cow Reference + Offline Peace of Mind (Right on desktop, Top on mobile) */}
        <div className="lg:col-span-5 flex flex-col space-y-4 lg:order-2">
          {/* Progress Card */}
          <div
            className={`rounded-xl p-5 shadow-sm space-y-3 ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333]'
                : 'bg-surface-container-lowest'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-display text-[20px] font-bold ${
                  isNight ? 'text-[#FFB784]' : 'text-primary'
                }`}
              >
                Paso {step} de 3
              </span>
              <span
                className={`text-[16px] font-medium ${
                  isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                }`}
              >
                Ordeño del Día
              </span>
            </div>

            <div aria-label="Progreso de 3 pasos" className="grid grid-cols-3 gap-2 pt-1">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex flex-col gap-1 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-primary rounded"
              >
                <div
                  className={`h-3.5 rounded-full flex items-center justify-center ${
                    step === 1 ? 'bg-[#B85D19]' : 'bg-[#15803D]'
                  }`}
                >
                  {step > 1 && (
                    <span className="material-symbols-outlined text-[12px] text-white font-bold">
                      check
                    </span>
                  )}
                </div>
                <span
                  className={`text-[14px] font-bold text-center ${
                    step === 1
                      ? isNight
                        ? 'text-[#FFB784]'
                        : 'text-primary'
                      : isNight
                        ? 'text-[#4AE176]'
                        : 'text-[#15803D]'
                  }`}
                >
                  1. Vaca
                </span>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex flex-col gap-1 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-primary rounded"
              >
                <div
                  className={`h-3.5 rounded-full ${
                    step === 2
                      ? 'bg-[#8d4b00]'
                      : isNight
                        ? 'bg-[#2A2A2A]'
                        : 'bg-surface-container-highest'
                  }`}
                />
                <span
                  className={`text-[14px] text-center ${
                    step === 2
                      ? isNight
                        ? 'font-bold text-[#FFB784]'
                        : 'font-bold text-primary'
                      : isNight
                        ? 'text-[#9CA3AF]'
                        : 'text-on-surface-variant'
                  }`}
                >
                  2. Litros
                </span>
              </button>

              {/* Step 3 */}
              <div className="flex flex-col gap-1">
                <div
                  className={`h-3.5 rounded-full ${
                    isNight ? 'bg-[#2A2A2A]' : 'bg-surface-container-highest'
                  }`}
                />
                <span
                  className={`text-[14px] text-center ${
                    isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                  }`}
                >
                  3. Fin
                </span>
              </div>
            </div>
          </div>

          {/* Selected Cow Reference Card */}
          <div
            className={`rounded-xl p-3.5 flex items-center justify-between gap-3 ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333]'
                : 'bg-surface-container-low'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <SafeImage
                src={selectedCow.imageUrl}
                alt={`${selectedCow.name} ${selectedCow.tagNumber}`}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
                fallbackIcon="pets"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-display text-[20px] font-bold truncate ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    {selectedCow.name} {selectedCow.tagNumber}
                  </span>
                  <span className="bg-[#1e8642] text-white px-2 py-0.5 rounded-full text-[12px] font-bold shrink-0">
                    {selectedCow.lot}
                  </span>
                </div>
                <p
                  className={`text-[14px] truncate ${
                    isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                  }`}
                >
                  {selectedCow.breed} • {selectedCow.paddock}
                </p>
              </div>
            </div>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`min-h-[44px] px-3 rounded-lg text-[14px] font-bold shrink-0 cursor-pointer ${
                  isNight
                    ? 'bg-[#2A2A2A] border border-[#444444] text-[#FFB784]'
                    : 'bg-primary-fixed text-on-primary-fixed'
                }`}
              >
                Cambiar
              </button>
            )}
          </div>

          {/* Offline Reassurance Card (visible prominently on desktop column & mobile bottom) */}
          <div
            className={`hidden lg:flex rounded-xl p-4 items-center gap-3 ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333]'
                : 'bg-surface-container-low'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#1e8642] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px] ms-filled">
                cloud_sync
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <p
                className={`font-display text-[18px] font-bold leading-tight ${
                  isNight ? 'text-[#4AE176]' : 'text-[#006b2f]'
                }`}
              >
                Tranquilo, Don Carlos
              </p>
              <p
                className={`text-[14px] leading-snug mt-0.5 ${
                  isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                }`}
              >
                Todo queda guardado en este teléfono aunque no tenga señal ni datos en el potrero.
              </p>
            </div>
          </div>
        </div>

        {/* Main Active Step Area (Left on desktop) */}
        <div className="lg:col-span-7 flex flex-col space-y-5 lg:order-1">
          {step === 1 ? (
            <>
              <div className="space-y-1">
                <p
                  className={`font-display text-[16px] font-bold tracking-wide uppercase ${
                    isNight ? 'text-[#FFB784]' : 'text-primary'
                  }`}
                >
                  Paso 1 • Selección de vaca
                </p>
                <h1
                  className={`font-display text-[30px] font-bold leading-tight ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  ¿Qué vaca está ordeñando?
                </h1>
                <p
                  className={`text-[18px] ${
                    isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                  }`}
                >
                  Toque la tarjeta de la vaca para continuar al conteo de litros.
                </p>
              </div>

              {/* Lot Filter Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {(['Todos', 'Lote 1', 'Lote 2', 'Lote 3'] as const).map((lot) => {
                  const active = lotFilter === lot;
                  return (
                    <button
                      key={lot}
                      type="button"
                      onClick={() => setLotFilter(lot)}
                      className={`min-h-[48px] px-2 rounded-xl font-display text-[15px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#B85D19] text-white shadow-sm'
                          : isNight
                            ? 'bg-[#222222] border border-[#333333] text-[#D1D5DB]'
                            : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {lot}
                    </button>
                  );
                })}
              </div>

              {/* Cow Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCows.map((cow) => {
                  const isSelected = cow.id === selectedCowId;
                  const alreadyRecorded = recordedCowIds.has(cow.id);

                  return (
                    <button
                      key={cow.id}
                      type="button"
                      onClick={() => handleSelectCow(cow)}
                      className={`rounded-xl p-3.5 flex items-center gap-3 text-left transition-all active:translate-y-0.5 cursor-pointer border-2 ${
                        isSelected
                          ? isNight
                            ? 'bg-[#2E2319] border-[#FFB784]'
                            : 'bg-primary-fixed border-[#18181B] shadow-[4px_4px_0px_#18181B]'
                          : isNight
                            ? 'bg-[#1A1A1A] border-[#333333] hover:border-[#555555]'
                            : 'bg-surface-container-lowest border-[#18181B]/20 hover:border-[#18181B]'
                      }`}
                    >
                      <SafeImage
                        src={cow.imageUrl}
                        alt={`${cow.name} ${cow.tagNumber}`}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                        fallbackIcon="pets"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`font-display text-[19px] font-bold truncate ${
                              isNight ? 'text-white' : 'text-on-surface'
                            }`}
                          >
                            {cow.name} {cow.tagNumber}
                          </span>
                        </div>
                        <span
                          className={`text-[14px] ${
                            isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                          }`}
                        >
                          {cow.lot} • {cow.paddock}
                        </span>
                        <span
                          className={`mt-1 text-[13px] font-bold inline-flex items-center gap-1 ${
                            alreadyRecorded
                              ? isNight
                                ? 'text-[#4AE176]'
                                : 'text-[#15803D]'
                              : isNight
                                ? 'text-[#FFB784]'
                                : 'text-[#B85D19]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {alreadyRecorded ? 'check_circle' : 'pending'}
                          </span>
                          {alreadyRecorded ? 'Registrada hoy' : 'Por registrar'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full min-h-[64px] px-6 rounded-xl bg-[#B85D19] hover:bg-[#a24f12] text-white flex items-center justify-center gap-2 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span className="font-display text-[20px] font-bold uppercase tracking-wide">
                  Continuar con {selectedCow.name} (Paso 2 de 3)
                </span>
                <span className="material-symbols-outlined text-[28px]">arrow_forward</span>
              </button>
            </>
          ) : (
            <>
              {/* Central Plain-Language Question */}
              <div className="space-y-1">
                <p
                  className={`font-display text-[18px] font-bold tracking-wide uppercase ${
                    isNight ? 'text-[#FFB784]' : 'text-primary'
                  }`}
                >
                  Registro de hoy
                </p>
                <h1
                  className={`font-display text-[30px] font-bold leading-tight ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  ¿Cuánto ordeñó {selectedCow.name}?
                </h1>
                <p
                  className={`text-[18px] ${
                    isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                  }`}
                >
                  Escoja el turno y use los botones grandes para poner la cantidad.
                </p>
              </div>

              {/* Shift Selector Cards */}
              <div className="space-y-2">
                <span
                  className={`font-display text-[16px] font-bold block ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  Seleccione el Turno:
                </span>
                <div
                  aria-label="Turno de ordeño"
                  className="grid grid-cols-2 gap-2.5"
                  role="radiogroup"
                >
                  {(['Mañana', 'Tarde'] as const).map((option) => {
                    const isSelected = shift === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setShift(option)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl min-h-[96px] text-center shadow-sm relative active:scale-95 transition-all cursor-pointer ${
                          isSelected
                            ? isNight
                              ? 'bg-[#2E2319] border-2 border-[#FFB784] text-white'
                              : 'bg-primary-fixed text-on-primary-fixed border-2 border-[#18181B]/20'
                            : isNight
                              ? 'bg-[#1A1A1A] border border-[#333333] text-[#D1D5DB]'
                              : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#15803D] text-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] font-bold">
                              check
                            </span>
                          </div>
                        )}
                        <span
                          className={`material-symbols-outlined text-[32px] ${
                            isSelected
                              ? isNight
                                ? 'text-[#FFB784] ms-filled'
                                : 'text-primary ms-filled'
                              : isNight
                                ? 'text-[#9CA3AF]'
                                : 'text-on-surface-variant'
                          }`}
                        >
                          {option === 'Mañana' ? 'wb_sunny' : 'nights_stay'}
                        </span>
                        <span className="font-display text-[20px] font-bold mt-1">
                          {option}
                        </span>
                        <span
                          className={`text-[14px] font-semibold ${
                            isSelected
                              ? isNight
                                ? 'text-[#FFDCC3]'
                                : 'text-on-primary-fixed-variant'
                              : isNight
                                ? 'text-[#9CA3AF]'
                                : 'text-on-surface-variant'
                          }`}
                        >
                          {option === 'Mañana' ? '6:00 AM' : '4:30 PM'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Giant Liters Counter Card */}
              <div
                className={`rounded-xl p-5 shadow-md space-y-3 ${
                  isNight
                    ? 'bg-[#1A1A1A] border border-[#333333]'
                    : 'bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-display text-[18px] font-bold ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    Litros obtenidos
                  </span>
                  <span
                    className={`text-[14px] px-2.5 py-0.5 rounded font-bold ${
                      isNight
                        ? 'bg-[#35261A] text-[#FFDCC3]'
                        : 'bg-primary-fixed text-on-primary-fixed'
                    }`}
                  >
                    {getBucketLabel(liters)}
                  </span>
                </div>

                {/* Big Numeric Display */}
                <div
                  className={`flex items-center justify-center py-3 rounded-xl ${
                    isNight ? 'bg-[#222222] border border-[#333333]' : 'bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`font-display text-[54px] font-extrabold tracking-tight leading-none tabular-nums ${
                        isNight ? 'text-white' : 'text-on-surface'
                      }`}
                    >
                      {formattedLiters}
                    </span>
                    <span
                      className={`font-display text-[24px] font-bold ${
                        isNight ? 'text-[#FFB784]' : 'text-primary'
                      }`}
                    >
                      Litros
                    </span>
                  </div>
                </div>

                {/* Tactile +/- Controls */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <button
                    type="button"
                    aria-label="Restar 5 litros"
                    onClick={() => adjustLiters(-5)}
                    className={`min-h-[60px] rounded-xl flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer ${
                      isNight
                        ? 'bg-[#2A2A2A] border border-[#444444] text-white hover:bg-[#333333]'
                        : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
                    }`}
                  >
                    <span className="font-display text-[20px] font-bold text-[#dc2626] tabular-nums">
                      -5
                    </span>
                    <span
                      className={`text-[12px] font-semibold ${
                        isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                      }`}
                    >
                      Litros
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Restar medio litro"
                    onClick={() => adjustLiters(-0.5)}
                    className={`min-h-[60px] rounded-xl flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer ${
                      isNight
                        ? 'bg-[#2A2A2A] border border-[#444444] text-white hover:bg-[#333333]'
                        : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
                    }`}
                  >
                    <span className="font-display text-[20px] font-bold tabular-nums">
                      -0.5
                    </span>
                    <span
                      className={`text-[12px] font-semibold ${
                        isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                      }`}
                    >
                      Litros
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Sumar medio litro"
                    onClick={() => adjustLiters(0.5)}
                    className={`min-h-[60px] rounded-xl flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer ${
                      isNight
                        ? 'bg-[#35261A] border border-[#8D4B00] text-white hover:bg-[#422f20]'
                        : 'bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed'
                    }`}
                  >
                    <span
                      className={`font-display text-[20px] font-bold tabular-nums ${
                        isNight ? 'text-[#FFB784]' : 'text-primary'
                      }`}
                    >
                      +0.5
                    </span>
                    <span
                      className={`text-[12px] font-semibold ${
                        isNight ? 'text-[#FFDCC3]' : 'text-on-primary-fixed-variant'
                      }`}
                    >
                      Litros
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Sumar 5 litros"
                    onClick={() => adjustLiters(5)}
                    className={`min-h-[60px] rounded-xl flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer ${
                      isNight
                        ? 'bg-[#35261A] border border-[#8D4B00] text-white hover:bg-[#422f20]'
                        : 'bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed'
                    }`}
                  >
                    <span
                      className={`font-display text-[20px] font-bold tabular-nums ${
                        isNight ? 'text-[#FFB784]' : 'text-primary'
                      }`}
                    >
                      +5
                    </span>
                    <span
                      className={`text-[12px] font-semibold ${
                        isNight ? 'text-[#FFDCC3]' : 'text-on-primary-fixed-variant'
                      }`}
                    >
                      Litros
                    </span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <span
                    className={`text-[14px] font-semibold ${
                      isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                    }`}
                  >
                    Rápido:
                  </span>
                  {[12, 16, 20, 24].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLiters(preset)}
                      className={`min-h-[44px] px-3 py-1.5 rounded-lg font-display text-[16px] font-semibold active:scale-95 cursor-pointer tabular-nums ${
                        liters === preset
                          ? 'bg-[#B85D19] text-white'
                          : isNight
                            ? 'bg-[#222222] border border-[#333333] text-white'
                            : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {preset} L
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Quality */}
              <div
                className={`rounded-xl p-5 shadow-sm space-y-2.5 ${
                  isNight
                    ? 'bg-[#1A1A1A] border border-[#333333]'
                    : 'bg-surface-container-lowest'
                }`}
              >
                <span
                  className={`font-display text-[16px] font-bold block ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  ¿Cómo salió la leche?
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setQuality('Limpia y Normal')}
                    className={`min-h-[58px] px-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
                      quality === 'Limpia y Normal'
                        ? 'bg-[#1e8642] text-white font-bold shadow-sm'
                        : isNight
                          ? 'bg-[#222222] border border-[#333333] text-[#D1D5DB]'
                          : 'bg-surface-container text-on-surface font-semibold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                    <span className="font-display text-[17px]">Limpia y Normal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuality('Con Novedad')}
                    className={`min-h-[58px] px-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
                      quality === 'Con Novedad'
                        ? 'bg-[#fd651e] text-white font-bold shadow-sm'
                        : isNight
                          ? 'bg-[#222222] border border-[#333333] text-[#D1D5DB]'
                          : 'bg-surface-container text-on-surface font-semibold'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[24px] ${
                        quality === 'Con Novedad' ? 'text-white' : 'text-secondary'
                      }`}
                    >
                      report_problem
                    </span>
                    <span className="font-display text-[17px]">Con Novedad</span>
                  </button>
                </div>

                {quality === 'Con Novedad' && (
                  <div className="pt-2 space-y-2">
                    <span
                      className={`text-[14px] font-semibold block ${
                        isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                      }`}
                    >
                      Toque el detalle de la novedad (opcional):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {NOVELTY_REASONS.map((reason) => {
                        const selected = qualityNote === reason;
                        return (
                          <button
                            key={reason}
                            type="button"
                            onClick={() =>
                              setQualityNote((prev) => (prev === reason ? '' : reason))
                            }
                            className={`min-h-[46px] px-3 rounded-lg text-[15px] font-semibold cursor-pointer ${
                              selected
                                ? 'bg-[#B85D19] text-white'
                                : isNight
                                  ? 'bg-[#222222] border border-[#444444] text-white'
                                  : 'bg-surface-container text-on-surface'
                            }`}
                          >
                            {reason}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Offline Reassurance on Mobile */}
              <div
                className={`lg:hidden rounded-xl p-4 flex items-center gap-3 ${
                  isNight
                    ? 'bg-[#1A1A1A] border border-[#333333]'
                    : 'bg-surface-container-low'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#1e8642] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px] ms-filled">
                    cloud_sync
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <p
                    className={`font-display text-[18px] font-bold leading-tight ${
                      isNight ? 'text-[#4AE176]' : 'text-[#006b2f]'
                    }`}
                  >
                    Tranquilo, Don Carlos
                  </p>
                  <p
                    className={`text-[14px] leading-snug ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    Todo queda guardado en este teléfono aunque no tenga señal ni datos en el potrero.
                  </p>
                </div>
              </div>

              {/* Primary Thumb-Zone Actions */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleComplete}
                  className="w-full min-h-[66px] px-6 rounded-xl bg-[#B85D19] hover:bg-[#9c4c12] text-white flex items-center justify-center gap-3 shadow-md active:translate-y-1 transition-all cursor-pointer"
                >
                  <span className="font-display text-[20px] font-bold tracking-wide uppercase text-white">
                    Siguiente Paso (3 de 3)
                  </span>
                  <span className="material-symbols-outlined text-[30px] text-white">
                    arrow_forward
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraftClick}
                  className={`w-full min-h-[54px] px-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer ${
                    isNight
                      ? 'bg-[#222222] border border-[#333333] text-white hover:bg-[#2C2C2C]'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                    }`}
                  >
                    save
                  </span>
                  <span className="font-display text-[17px] font-semibold">
                    Guardar borrador y terminar después
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
