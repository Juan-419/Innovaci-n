import { useMemo, useState } from 'react';
import { CowProfile, MilkingRecord, ThemeMode } from '../types/normandia';
import { SafeImage } from './SafeImage';

interface ConfirmationHistoryScreenProps {
  theme: ThemeMode;
  operatorName: string;
  cows: CowProfile[];
  records: MilkingRecord[];
  selectedRecordId: string;
  justSaved: boolean;
  onSelectRecord: (id: string) => void;
  onCloseToHome: () => void;
  onRegisterNextCow: () => void;
  onSyncAll: () => void;
}

export function ConfirmationHistoryScreen({
  theme,
  operatorName,
  cows,
  records,
  selectedRecordId,
  justSaved,
  onSelectRecord,
  onCloseToHome,
  onRegisterNextCow,
  onSyncAll,
}: ConfirmationHistoryScreenProps) {
  const isNight = theme === 'noche';
  const [showAllList, setShowAllList] = useState(!justSaved);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeRecord = useMemo(
    () => records.find((r) => r.id === selectedRecordId) ?? records[0],
    [records, selectedRecordId]
  );

  const remainingCows = useMemo(() => {
    const recordedIds = new Set(records.map((r) => r.cowId));
    return cows.filter((c) => !recordedIds.has(c.id)).length;
  }, [cows, records]);

  const totalLitersToday = useMemo(
    () => records.reduce((acc, rec) => acc + rec.liters, 0),
    [records]
  );

  const offlineRecordsCount = useMemo(
    () => records.filter((r) => r.syncStatus === 'offline').length,
    [records]
  );

  const neoBorder = isNight ? 'border-2 border-[#3A3A3A]' : 'border-2 border-[#1b1b1e]';
  const neoShadow = isNight
    ? 'shadow-[4px_4px_0px_#000000]'
    : 'shadow-[4px_4px_0px_#1b1b1e]';

  if (!activeRecord) {
    return (
      <div className="flex flex-col w-full pb-6 space-y-5">
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onCloseToHome}
            className={`min-h-[48px] px-3.5 rounded-xl flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
              isNight
                ? 'bg-[#222222] text-white border-2 border-[#3A3A3A] shadow-[2px_2px_0px_#000000]'
                : 'bg-surface-container-high active:bg-surface-variant text-on-surface shadow-[2px_2px_0px_#1b1b1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
            <span className="font-display text-[16px] font-semibold">Cerrar</span>
          </button>
        </div>

        <div
          className={`rounded-2xl p-6 sm:p-8 text-center space-y-4 ${neoBorder} ${neoShadow} ${
            isNight ? 'bg-[#1A1A1A] text-white' : 'bg-[#FFFDF8] text-[#18181B]'
          }`}
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#B85D19] text-white border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">receipt_long</span>
          </div>
          <h1 className="font-display text-[28px] font-bold leading-tight">
            Todavía no hay comprobantes hoy
          </h1>
          <p
            className={`text-[17px] leading-relaxed max-w-md mx-auto ${
              isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
            }`}
          >
            Hola {operatorName}, cuando registres tu primera vaca y sus litros, aquí aparecerá el comprobante y el historial del día.
          </p>
          <button
            type="button"
            onClick={onRegisterNextCow}
            className="w-full max-w-md mx-auto min-h-[64px] px-6 rounded-xl bg-[#15803D] hover:bg-[#116932] text-white font-display text-[19px] font-bold border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px] ms-filled">
              add_circle
            </span>
            <span>REGISTRAR PRIMER ORDEÑO</span>
          </button>
        </div>
      </div>
    );
  }

  const displayOperator = activeRecord.operator || operatorName;

  const shareSummaryText = `Comprobante Normandía ${activeRecord.receiptCode}\nVaca: ${activeRecord.cowName} ${activeRecord.cowTag} (${activeRecord.lot})\nProducción: ${activeRecord.liters} Litros\nCalidad: ${activeRecord.quality}\nTurno: ${activeRecord.shift} (${activeRecord.timeFormatted})\nOrdeñador: ${displayOperator}`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col w-full pb-6 space-y-5">
      {/* 1. TOP STATUS & OFFLINE CERTAINTY BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onCloseToHome}
          className={`min-h-[48px] px-3.5 rounded-xl flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
            isNight
              ? 'bg-[#222222] text-white border-2 border-[#3A3A3A] shadow-[2px_2px_0px_#000000]'
              : 'bg-surface-container-high active:bg-surface-variant text-on-surface shadow-[2px_2px_0px_#1b1b1e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
          <span className="font-display text-[16px] font-semibold">Cerrar</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (activeRecord.syncStatus === 'offline') onSyncAll();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1e8642] text-white shadow-[2px_2px_0px_#1b1b1e] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] ms-filled">
            cloud_done
          </span>
          <span className="text-[14px] font-bold tracking-wide">
            {activeRecord.syncStatus === 'offline'
              ? 'Guardado en Memoria (Offline)'
              : 'Sincronizado con Oficina'}
          </span>
        </button>
      </div>

      {/* 2. COMPLETED 3-STEP PROGRESS BAR */}
      <div
        className={`p-3.5 rounded-xl flex flex-col gap-2 ${
          isNight
            ? 'bg-[#1A1A1A] border border-[#333333] shadow-[3px_3px_0px_#000000]'
            : 'bg-surface-container-lowest shadow-[3px_3px_0px_#1b1b1e]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[14px] font-bold flex items-center gap-1 ${
              isNight ? 'text-[#4AE176]' : 'text-[#006b2f]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] ms-filled">
              task_alt
            </span>
            Paso 3 de 3 • ¡Completado!
          </span>
          <span
            className={`text-[14px] font-semibold ${
              isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
            }`}
          >
            100% Listo
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 rounded-full bg-[#006b2f]" />
          <div className="h-3 rounded-full bg-[#006b2f]" />
          <div className="h-3 rounded-full bg-[#006b2f]" />
        </div>

        <div className="flex justify-between text-[13px] font-bold px-1">
          <span className={isNight ? 'text-[#4AE176]' : 'text-[#006b2f]'}>✓ 1. Vaca</span>
          <span className={isNight ? 'text-[#4AE176]' : 'text-[#006b2f]'}>✓ 2. Litros</span>
          <span className={isNight ? 'text-[#4AE176]' : 'text-[#006b2f]'}>✓ 3. Seguro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* 3. CELEBRATION & EMOTIONAL RELIEF HERO */}
          <div
            className={`p-5 rounded-2xl flex flex-col items-center text-center relative overflow-hidden ${neoShadow} ${
              isNight
                ? 'bg-[#132418] border-2 border-[#22C55E]'
                : 'bg-[#006b2f]/10'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-[#006b2f] text-white flex items-center justify-center shadow-[4px_4px_0px_#1b1b1e] mb-3">
              <span className="material-symbols-outlined text-[48px] ms-filled">
                verified
              </span>
            </div>

            <h1
              className={`font-display text-[30px] font-bold tracking-tight leading-tight ${
                isNight ? 'text-white' : 'text-on-surface'
              }`}
            >
              {justSaved ? '¡Registro Guardado con Éxito!' : 'Comprobante Verificado'}
            </h1>
            <p
              className={`text-[18px] font-semibold mt-2 ${
                isNight ? 'text-[#E5E7EB]' : 'text-on-surface'
              }`}
            >
              Bien hecho,{' '}
              <span className={isNight ? 'text-[#FFB784] font-bold' : 'text-primary font-bold'}>
                {displayOperator}
              </span>
              . La información ya quedó registrada y segura en este teléfono.
            </p>

            <div
              className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-semibold ${
                isNight
                  ? 'bg-[#1A1A1A] text-white border border-[#333333]'
                  : 'bg-surface-container text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isNight ? 'text-[#FFB784]' : 'text-primary'
                }`}
              >
                schedule
              </span>
              <span>
                {activeRecord.dateFormatted} a las {activeRecord.timeFormatted} • Turno{' '}
                {activeRecord.shift}
              </span>
            </div>
          </div>

          {/* 4. OFFICIAL FIELD RECEIPT CARD */}
          <div
            className={`rounded-2xl overflow-hidden flex flex-col ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333] shadow-[5px_5px_0px_#000000]'
                : 'bg-surface-container-lowest shadow-[5px_5px_0px_#1b1b1e]'
            }`}
          >
            <div
              className={`px-5 py-3 flex items-center justify-between gap-2 ${
                isNight ? 'bg-[#222222] border-b border-[#333333]' : 'bg-surface-container-high'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isNight ? 'text-[#FFB784]' : 'text-primary'
                  }`}
                >
                  receipt_long
                </span>
                <span
                  className={`font-display text-[20px] font-semibold ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  Comprobante de Ordeño
                </span>
              </div>
              <span
                className={`text-[14px] px-2.5 py-1 rounded font-mono font-bold tabular-nums ${
                  isNight
                    ? 'bg-[#121212] text-[#FFB784] border border-[#3A3A3A]'
                    : 'bg-surface-container-lowest text-on-surface shadow-[1px_1px_0px_#1b1b1e]'
                }`}
              >
                {activeRecord.receiptCode}
              </span>
            </div>

            <div className="p-5 flex flex-col space-y-4">
              <div
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isNight ? 'bg-[#222222] border border-[#333333]' : 'bg-surface-container-low'
                }`}
              >
                <SafeImage
                  src={activeRecord.imageUrl}
                  alt={`${activeRecord.cowName} ${activeRecord.cowTag}`}
                  className="w-20 h-20 rounded-lg object-cover shrink-0 shadow-[2px_2px_0px_#1b1b1e]"
                  fallbackIcon="pets"
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-[14px] font-bold uppercase tracking-wider ${
                      isNight ? 'text-[#FFB784]' : 'text-primary'
                    }`}
                  >
                    Vaca Identificada
                  </span>
                  <span
                    className={`font-display text-[24px] font-semibold truncate ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    {activeRecord.cowName} {activeRecord.cowTag}
                  </span>
                  <span
                    className={`text-[17px] ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    {activeRecord.breed} • {activeRecord.lot}
                  </span>
                </div>
              </div>

              <div
                className={`p-5 rounded-xl flex flex-col items-center justify-center text-center ${
                  isNight
                    ? 'bg-[#222222] border border-[#444444] shadow-[3px_3px_0px_#000000]'
                    : 'bg-surface-bright shadow-[3px_3px_0px_#1b1b1e]'
                }`}
              >
                <span
                  className={`font-display text-[16px] font-semibold uppercase tracking-wide ${
                    isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                  }`}
                >
                  Producción Pesada
                </span>
                <div className="flex items-baseline justify-center gap-2 my-1">
                  <span
                    className={`font-display text-[44px] font-black tracking-tight tabular-nums ${
                      isNight ? 'text-[#FFB784]' : 'text-primary'
                    }`}
                  >
                    {activeRecord.liters}
                  </span>
                  <span
                    className={`font-display text-[24px] font-bold ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    Litros
                  </span>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[14px] font-bold ${
                    activeRecord.quality === 'Limpia y Normal'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                      : 'bg-[#fd651e] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {activeRecord.quality === 'Limpia y Normal'
                      ? 'verified_user'
                      : 'report_problem'}
                  </span>
                  <span>
                    {activeRecord.quality === 'Limpia y Normal'
                      ? 'Leche Limpia y Normal'
                      : `Con Novedad${activeRecord.qualityNote ? `: ${activeRecord.qualityNote}` : ''}`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div
                  className={`flex flex-col p-3 rounded-lg ${
                    isNight ? 'bg-[#222222]' : 'bg-surface-container-low'
                  }`}
                >
                  <span
                    className={`text-[14px] font-semibold ${
                      isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                    }`}
                  >
                    Turno de Ordeño:
                  </span>
                  <span
                    className={`text-[18px] font-bold ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    {activeRecord.shift}
                  </span>
                </div>
                <div
                  className={`flex flex-col p-3 rounded-lg ${
                    isNight ? 'bg-[#222222]' : 'bg-surface-container-low'
                  }`}
                >
                  <span
                    className={`text-[14px] font-semibold ${
                      isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                    }`}
                  >
                    Ordeñador:
                  </span>
                  <span
                    className={`text-[18px] font-bold truncate ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    {displayOperator}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#1e8642] text-white shadow-[2px_2px_0px_#1b1b1e]">
                <span className="material-symbols-outlined text-[24px] shrink-0 mt-0.5 ms-filled">
                  {activeRecord.syncStatus === 'offline' ? 'wifi_off' : 'cloud_done'}
                </span>
                <div className="flex flex-col">
                  <span className="font-display text-[16px] font-bold">
                    {activeRecord.syncStatus === 'offline'
                      ? 'Respaldo seguro en el móvil'
                      : 'Sincronizado con la oficina'}
                  </span>
                  <span className="text-[14px] leading-snug">
                    {activeRecord.syncStatus === 'offline'
                      ? 'Se sincronizará con la oficina en cuanto el celular detecte señal o Bluetooth en la casa principal.'
                      : 'Este comprobante ya fue recibido y archivado en la oficina de la finca.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. ANTI-ANXIETY PEACE OF MIND MESSAGE */}
          <div
            className={`p-5 rounded-2xl flex items-center gap-3 ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333] shadow-[4px_4px_0px_#000000]'
                : 'bg-surface-container-lowest shadow-[4px_4px_0px_#1b1b1e]'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1b1b1e]">
              <span className="material-symbols-outlined text-[32px] ms-filled">lock</span>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-display text-[18px] font-bold ${
                  isNight ? 'text-white' : 'text-on-surface'
                }`}
              >
                ¡Tranquilo {operatorName}!
              </span>
              <p
                className={`text-[17px] leading-snug ${
                  isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                }`}
              >
                No necesita volver a anotarlo con lápiz en su libreta. Esta pesada ya quedó grabada y no se pierde aunque apague el celular.
              </p>
            </div>
          </div>

          {/* 6. GIANT ERGONOMIC ACTIONS */}
          <div className="flex flex-col gap-3 pt-1 no-print">
            <button
              type="button"
              onClick={onRegisterNextCow}
              className="w-full min-h-[68px] px-6 rounded-2xl bg-[#fd651e] hover:bg-[#e55512] text-white font-display text-[18px] shadow-[4px_4px_0px_#1b1b1e] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#1b1b1e] transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="tracking-wide uppercase font-black text-white">
                  REGISTRAR SIGUIENTE VACA
                </span>
                <span className="text-[14px] text-white/95 font-medium">
                  {remainingCows > 0
                    ? `Faltan ${remainingCows} ${remainingCows === 1 ? 'vaca' : 'vacas'} por registrar`
                    : 'Escoge otra vaca o agrega una nueva'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[32px] text-white group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowAllList((prev) => !prev)}
              className={`lg:hidden w-full min-h-[58px] px-5 rounded-xl font-display text-[18px] font-bold shadow-[4px_4px_0px_#1b1b1e] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1b1b1e] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isNight
                  ? 'bg-[#222222] border border-[#3A3A3A] text-white'
                  : 'bg-surface-container-lowest text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">list_alt</span>
              <span>
                {showAllList
                  ? 'Ocultar lista de hoy'
                  : `Ver Todos los Registros de Hoy (${records.length} ${records.length === 1 ? 'vaca' : 'vacas'})`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-6 pt-1">
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className={`flex items-center gap-1.5 font-display text-[16px] font-semibold py-2 cursor-pointer ${
                  isNight
                    ? 'text-[#D1D5DB] hover:text-white'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#15803D]">
                  share
                </span>
                <span>Compartir por WhatsApp</span>
              </button>
              <span className="text-outline-variant">•</span>
              <button
                type="button"
                onClick={() => window.print()}
                className={`flex items-center gap-1.5 font-display text-[16px] font-semibold py-2 cursor-pointer ${
                  isNight
                    ? 'text-[#D1D5DB] hover:text-white'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isNight ? 'text-[#FFB784]' : 'text-primary'
                  }`}
                >
                  print
                </span>
                <span>Imprimir Ticket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Records Log */}
        <div
          className={`lg:col-span-5 flex-col space-y-4 no-print ${
            showAllList ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div
            className={`rounded-2xl p-5 space-y-4 ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333] shadow-[4px_4px_0px_#000000]'
                : 'bg-surface-container-lowest shadow-[4px_4px_0px_#1b1b1e]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2
                  className={`font-display text-[22px] font-bold ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  Registros de Hoy
                </h2>
                <p
                  className={`text-[15px] tabular-nums ${
                    isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                  }`}
                >
                  {records.length} {records.length === 1 ? 'vaca' : 'vacas'} • {totalLitersToday.toFixed(1)} Litros totales
                </p>
              </div>
              {offlineRecordsCount > 0 && (
                <button
                  type="button"
                  onClick={onSyncAll}
                  className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[#15803D] text-white text-[14px] font-bold cursor-pointer shrink-0"
                >
                  Sincronizar ({offlineRecordsCount})
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {records.map((rec) => {
                const isActive = rec.id === activeRecord.id;
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => onSelectRecord(rec.id)}
                    className={`w-full rounded-xl p-3 flex items-center gap-3 text-left transition-all cursor-pointer border-2 ${
                      isActive
                        ? isNight
                          ? 'bg-[#2E2319] border-[#FFB784]'
                          : 'bg-primary-fixed border-[#18181B]'
                        : isNight
                          ? 'bg-[#222222] border-[#333333] hover:border-[#555555]'
                          : 'bg-surface-container-low border-transparent hover:border-[#18181B]/30'
                    }`}
                  >
                    <SafeImage
                      src={rec.imageUrl}
                      alt={`${rec.cowName} ${rec.cowTag}`}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                      fallbackIcon="pets"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-display text-[18px] font-bold truncate ${
                            isNight ? 'text-white' : 'text-on-surface'
                          }`}
                        >
                          {rec.cowName} {rec.cowTag}
                        </span>
                        <span
                          className={`font-display text-[18px] font-bold shrink-0 tabular-nums ${
                            isNight ? 'text-[#FFB784]' : 'text-primary'
                          }`}
                        >
                          {rec.liters} L
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[14px]">
                        <span
                          className={`truncate ${
                            isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                          }`}
                        >
                          {rec.lot} • {rec.shift} ({rec.timeFormatted})
                        </span>
                        <span
                          className={`font-bold shrink-0 ${
                            rec.syncStatus === 'synced'
                              ? isNight
                                ? 'text-[#4AE176]'
                                : 'text-[#15803D]'
                              : isNight
                                ? 'text-[#FFB784]'
                                : 'text-[#B85D19]'
                          }`}
                        >
                          {rec.syncStatus === 'synced' ? 'Enviado' : 'En móvil'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Share Modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-4 no-print"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
          onClick={() => setShareOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl p-5 ${neoBorder} shadow-[6px_6px_0px_#1b1b1e] space-y-4 ${
              isNight ? 'bg-[#1A1A1A] text-white' : 'bg-[#FFFDF8] text-[#18181B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 id="share-dialog-title" className="font-display text-[22px] font-bold">
                Resumen para WhatsApp
              </h2>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                aria-label="Cerrar compartir"
                className={`min-h-[44px] min-w-[44px] rounded-xl border-2 border-[#18181B] flex items-center justify-center cursor-pointer ${
                  isNight ? 'bg-[#2A2A2A] text-white' : 'bg-surface-container-high text-[#18181B]'
                }`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <pre
              className={`p-4 rounded-xl text-[15px] whitespace-pre-wrap font-sans leading-relaxed ${
                isNight
                  ? 'bg-[#222222] border border-[#333333] text-[#E5E7EB]'
                  : 'bg-surface-container-low text-[#18181B]'
              }`}
            >
              {shareSummaryText}
            </pre>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleCopyShare}
                className="w-full min-h-[58px] rounded-xl bg-[#15803D] text-white font-display text-[18px] font-bold border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Texto del Comprobante'}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareSummaryText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[54px] rounded-xl bg-[#B85D19] text-white font-display text-[17px] font-bold border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                <span>Abrir WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
