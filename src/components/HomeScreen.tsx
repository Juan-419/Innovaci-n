import { useState } from 'react';
import { CowProfile, DraftRecord, MilkingRecord, ThemeMode } from '../types/normandia';
import { SafeImage } from './SafeImage';

interface HomeScreenProps {
  theme: ThemeMode;
  operatorName: string;
  cows: CowProfile[];
  onToggleTheme: () => void;
  records: MilkingRecord[];
  draft: DraftRecord | null;
  onStartNewRegistration: () => void;
  onResumeDraft: () => void;
  onViewTodayRecords: () => void;
  onEditOperatorName: () => void;
  onSyncAll: () => void;
}

export function HomeScreen({
  theme,
  operatorName,
  cows,
  onToggleTheme,
  records,
  draft,
  onStartNewRegistration,
  onResumeDraft,
  onViewTodayRecords,
  onEditOperatorName,
  onSyncAll,
}: HomeScreenProps) {
  const isNight = theme === 'noche';
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const totalLotsSet = new Set(cows.map((c) => c.lot));
  const totalLots = totalLotsSet.size;
  const completedLotsSet = new Set(records.map((r) => r.lot));
  const completedLots = Math.min(totalLots, completedLotsSet.size);
  const pendingLots = Math.max(0, totalLots - completedLots);
  const progressPercent =
    totalLots > 0 ? Math.round((completedLots / totalLots) * 100) : 0;

  const latestRecord = records[0];
  const offlineCount = records.filter((r) => r.syncStatus === 'offline').length;

  return (
    <div className="flex flex-col w-full pb-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col space-y-5">
          {/* THEME SWITCH BANNER */}
          <div
            className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
              isNight
                ? 'bg-[#1C1B1B] border border-[#333333] shadow-md'
                : 'bg-surface-container shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isNight ? 'bg-[#2A2A2A]' : 'bg-surface-container-high'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isNight ? 'text-[#FFB784]' : 'text-primary'
                  }`}
                >
                  {isNight ? 'dark_mode' : 'wb_sunny'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-display text-[16px] font-semibold truncate leading-tight ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  Apariencia visual
                </span>
                <span
                  className={`text-[14px] font-semibold truncate ${
                    isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                  }`}
                >
                  {isNight ? 'Modo Noche Alto Contraste' : 'Modo Cálido Marfil'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isNight
                  ? 'Cambiar a Modo Cálido'
                  : 'Cambiar a Modo Noche de Alto Contraste'
              }
              className={`min-h-[48px] px-4 py-2 rounded-xl font-display text-[16px] font-semibold flex items-center gap-1.5 shadow-md transition-all active:translate-y-0.5 active:shadow-none shrink-0 cursor-pointer ${
                isNight
                  ? 'bg-[#2A2A2A] border border-[#444444] text-white hover:bg-[#333333]'
                  : 'bg-[#B85D19] text-white hover:bg-[#a24f12]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isNight ? 'text-[#FFB784]' : 'text-white'
                }`}
              >
                {isNight ? 'wb_sunny' : 'contrast'}
              </span>
              <span>{isNight ? 'Ver Cálido' : 'Cambiar Modo'}</span>
            </button>
          </div>

          {/* PSYCHOLOGICAL REASSURANCE HERO CARD */}
          <div
            className={`w-full rounded-xl p-5 shadow-md flex flex-col gap-3 ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333]'
                : 'bg-surface-container-lowest'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[14px] font-bold tracking-wider uppercase ${
                    isNight ? 'text-[#FFB784]' : 'text-on-surface-variant'
                  }`}
                >
                  Panel Normandía
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h1
                    className={`font-display text-[26px] font-bold truncate ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    ¡Hola, {operatorName}!
                  </h1>
                  <button
                    type="button"
                    onClick={onEditOperatorName}
                    aria-label="Cambiar mi nombre"
                    className={`min-h-[36px] px-2.5 rounded-lg text-[13px] font-bold flex items-center gap-1 cursor-pointer shrink-0 ${
                      isNight
                        ? 'bg-[#2A2A2A] text-[#FFB784] hover:bg-[#333333]'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>Editar</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#15803D] text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span className="text-[14px] font-bold">Al día</span>
              </div>
            </div>

            <div
              className={`p-3 rounded-lg flex items-center gap-3 border-2 ${
                isNight
                  ? 'bg-[#132418] border-[#22C55E] text-[#E5E7EB]'
                  : 'bg-white border-[#15803D] text-[#15803D]'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[26px]">task_alt</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-display text-[20px] font-bold leading-tight ${
                    isNight ? 'text-[#4AE176]' : 'text-[#15803D]'
                  }`}
                >
                  Todo está en orden
                </span>
                <span
                  className={`text-[17px] leading-snug ${
                    isNight ? 'text-[#D1D5DB]' : 'text-[#1C1917]'
                  }`}
                >
                  {cows.length === 0
                    ? 'Todo listo. Registra tu primera vaca en Nuevo Registro.'
                    : records.length === 0
                      ? 'Tus vacas están listas. Toca Nuevo Registro para anotar hoy.'
                      : pendingLots === 0
                        ? 'Ya completaste todos los lotes de hoy.'
                        : 'No tienes alertas pendientes para hoy.'}
                </span>
              </div>
            </div>
          </div>

          {draft && (
            <button
              type="button"
              onClick={onResumeDraft}
              className={`w-full rounded-xl p-4 flex items-center justify-between gap-3 border-2 transition-all active:translate-y-0.5 cursor-pointer text-left ${
                isNight
                  ? 'bg-[#2E2319] border-[#FFB784] text-white'
                  : 'bg-primary-fixed border-[#18181B] text-on-primary-fixed shadow-[3px_3px_0px_#18181B]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-[28px] text-[#B85D19] shrink-0">
                  edit_note
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-[17px] font-bold truncate">
                    Tienes un borrador guardado ({draft.liters} L)
                  </span>
                  <span className="text-[14px] opacity-85 truncate">
                    Toca aquí para continuar donde lo dejaste
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[24px] shrink-0">
                arrow_forward
              </span>
            </button>
          )}

          {/* PRIMARY CALL TO ACTION */}
          <div className="w-full flex flex-col gap-2">
            <span
              className={`font-display text-[16px] font-bold px-1 ${
                isNight ? 'text-[#E5E7EB]' : 'text-on-surface-variant'
              }`}
            >
              Acción principal del día
            </span>
            <button
              type="button"
              onClick={onStartNewRegistration}
              className={`w-full rounded-xl p-5 flex items-center justify-between gap-4 transition-all active:translate-y-1 cursor-pointer text-left ${
                isNight
                  ? 'bg-[#B85D19] border-[1.5px] border-[#D7782A] text-white shadow-[0_8px_20px_rgba(184,93,25,0.45)]'
                  : 'bg-[#B85D19] text-white shadow-[0_6px_16px_rgba(184,93,25,0.35)] hover:bg-[#a65214]'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-16 h-16 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[40px] ms-filled">
                    add_circle
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-[24px] font-bold tracking-tight text-white">
                    NUEVO REGISTRO
                  </span>
                  <span className="text-[17px] font-medium text-white/90 mt-0.5">
                    Escoge o agrega tu vaca • 2 min
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">
                  arrow_forward
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-6 flex flex-col space-y-5">
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span
                className={`font-display text-[20px] font-bold ${
                  isNight ? 'text-white' : 'text-on-surface'
                }`}
              >
                Resumen de Hoy
              </span>
              <span
                className={`text-[14px] font-bold ${
                  isNight ? 'text-[#FFB784]' : 'text-primary'
                }`}
              >
                {cows.length === 0
                  ? 'Sin vacas aún'
                  : `${cows.length} ${cows.length === 1 ? 'vaca' : 'vacas'} en finca`}
              </span>
            </div>

            {/* Estado de la Jornada */}
            <div
              className={`w-full rounded-xl p-5 shadow-md flex flex-col gap-3 ${
                isNight
                  ? 'bg-[#1A1A1A] border border-[#333333]'
                  : 'bg-surface-container-lowest'
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-2.5 ${
                  isNight ? 'border-[#2E2E2E]' : 'border-[#1b1b1e]/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isNight ? 'text-[#FFB784]' : 'text-primary'
                    }`}
                  >
                    calendar_today
                  </span>
                  <span
                    className={`font-display text-[20px] font-bold ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    Estado de la Jornada
                  </span>
                </div>
                <span
                  className={`text-[14px] px-2.5 py-0.5 rounded-md font-bold ${
                    isNight
                      ? 'bg-[#35261A] border border-[#8D4B00] text-[#FFDCC3]'
                      : 'bg-primary-fixed text-on-primary-fixed'
                  }`}
                >
                  {totalLots} Lotes
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div
                  className={`rounded-lg p-3 flex flex-col items-center justify-center text-center ${
                    isNight
                      ? 'bg-[#222222] border border-[#333333]'
                      : 'bg-surface-container'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 mb-1 ${
                      isNight ? 'text-[#22C55E]' : 'text-[#15803D]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px] ms-filled">
                      check_circle
                    </span>
                    <span className="font-display text-[24px] font-bold tabular-nums">
                      {completedLots}
                    </span>
                  </div>
                  <span
                    className={`text-[14px] font-semibold ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    Completados
                  </span>
                </div>

                <div
                  className={`rounded-lg p-3 flex flex-col items-center justify-center text-center ${
                    isNight
                      ? 'bg-[#222222] border border-[#333333]'
                      : 'bg-surface-container'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 mb-1 ${
                      isNight ? 'text-[#FFB784]' : 'text-[#B85D19]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      pending
                    </span>
                    <span className="font-display text-[24px] font-bold tabular-nums">
                      {pendingLots}
                    </span>
                  </div>
                  <span
                    className={`text-[14px] font-semibold ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    Por Registrar
                  </span>
                </div>
              </div>

              <div
                className={`w-full rounded-full h-3.5 overflow-hidden p-0.5 mt-1 ${
                  isNight ? 'bg-[#2A2A2A]' : 'bg-surface-container-high'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isNight ? 'bg-[#22C55E]' : 'bg-[#15803D]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[14px]">
                <span className={isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'}>
                  Progreso general
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  {progressPercent}% completado
                </span>
              </div>
            </div>

            {/* Última Actividad */}
            {latestRecord ? (
              <button
                type="button"
                onClick={onViewTodayRecords}
                className={`w-full rounded-xl p-5 shadow-md flex flex-col gap-3 text-left transition-transform active:translate-y-0.5 cursor-pointer ${
                  isNight
                    ? 'bg-[#1A1A1A] border border-[#333333] hover:border-[#555555]'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-[24px] ${
                        isNight ? 'text-[#FFB784]' : 'text-secondary'
                      }`}
                    >
                      history
                    </span>
                    <span
                      className={`font-display text-[20px] font-bold ${
                        isNight ? 'text-white' : 'text-on-surface'
                      }`}
                    >
                      Última Actividad
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                    }`}
                  >
                    chevron_right
                  </span>
                </div>

                <div
                  className={`flex items-center gap-3 p-3 rounded-lg w-full ${
                    isNight
                      ? 'bg-[#222222] border border-[#333333]'
                      : 'bg-surface-container-low'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${
                      isNight ? 'bg-[#2E2E2E]' : 'bg-surface-container-highest'
                    }`}
                  >
                    <SafeImage
                      src={latestRecord.imageUrl}
                      alt={`${latestRecord.cowName} en ${latestRecord.lot}`}
                      className="w-full h-full object-cover"
                      fallbackIcon="pets"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-display text-[18px] font-bold truncate ${
                          isNight ? 'text-white' : 'text-on-surface'
                        }`}
                      >
                        {latestRecord.cowName} {latestRecord.cowTag}
                      </span>
                      <span
                        className={`text-[14px] font-bold shrink-0 tabular-nums ${
                          isNight ? 'text-[#FFB784]' : 'text-primary'
                        }`}
                      >
                        {latestRecord.timeFormatted}
                      </span>
                    </div>
                    <span
                      className={`text-[16px] truncate ${
                        isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                      }`}
                    >
                      Ordeño {latestRecord.shift.toLowerCase()} • {latestRecord.liters} Litros
                    </span>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isNight ? 'text-[#22C55E]' : 'text-[#15803D]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {latestRecord.syncStatus === 'synced' ? 'cloud_done' : 'save'}
                      </span>
                      <span className="text-[14px] font-semibold">
                        {latestRecord.syncStatus === 'synced'
                          ? 'Sincronizado'
                          : 'Guardado en teléfono'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ) : (
              <div
                className={`w-full rounded-xl p-5 shadow-md flex items-center gap-3.5 ${
                  isNight
                    ? 'bg-[#1A1A1A] border border-[#333333]'
                    : 'bg-surface-container-lowest'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isNight
                      ? 'bg-[#2A2A2A] text-[#FFB784]'
                      : 'bg-surface-container text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[26px]">
                    edit_calendar
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-display text-[18px] font-bold ${
                      isNight ? 'text-white' : 'text-on-surface'
                    }`}
                  >
                    Aún no hay ordeños hoy
                  </span>
                  <span
                    className={`text-[15px] leading-snug ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    Toca «NUEVO REGISTRO» para agregar tu vaca y anotar los litros.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="w-full flex flex-col gap-3">
            <button
              type="button"
              onClick={onViewTodayRecords}
              className={`w-full min-h-[60px] px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-md transition-all active:translate-y-0.5 cursor-pointer ${
                isNight
                  ? 'bg-[#1A1A1A] border border-[#333333] text-white hover:bg-[#222222]'
                  : 'bg-surface-container-lowest hover:bg-surface-container-high text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isNight
                      ? 'bg-[#2A2A2A] text-[#FFB784]'
                      : 'bg-surface-container text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">list_alt</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display text-[19px] font-bold">
                    Ver mis registros de hoy
                  </span>
                  <span
                    className={`text-[14px] font-semibold ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    {records.length === 0
                      ? 'Todavía no hay registros hoy'
                      : `${records.length} ${records.length === 1 ? 'guardado correctamente' : 'guardados correctamente'}`}
                  </span>
                </div>
              </div>
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                }`}
              >
                chevron_right
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSupportModalOpen(true)}
              className={`w-full min-h-[60px] px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-sm transition-all active:translate-y-0.5 cursor-pointer ${
                isNight
                  ? 'bg-[#1A1A1A] border border-[#333333] text-white hover:bg-[#222222]'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#B85D19] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">
                    phone_in_talk
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display text-[19px] font-bold">
                    Llamar a Asistencia
                  </span>
                  <span
                    className={`text-[14px] font-semibold ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    Atención humana inmediata
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#B85D19] border border-[#D7782A] text-white text-[14px] font-bold shrink-0">
                Llamar Gratis
              </span>
            </button>
          </div>

          {/* Peace-of-Mind Banner */}
          <div
            className={`w-full rounded-xl shadow-md p-3.5 flex items-center justify-between gap-3 ${
              isNight
                ? 'bg-[#1A1A1A] border border-[#333333]'
                : 'bg-surface-container-lowest'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  isNight
                    ? 'bg-[#2E2319] border border-[#8D4B00] text-[#FFB784]'
                    : 'bg-primary-fixed text-on-primary-fixed'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`font-display text-[16px] font-bold ${
                    isNight ? 'text-white' : 'text-on-surface'
                  }`}
                >
                  Datos respaldados de forma segura
                </span>
                <span
                  className={`text-[14px] leading-snug ${
                    isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                  }`}
                >
                  Tus registros quedan guardados incluso sin señal de internet.
                </span>
              </div>
            </div>

            {offlineCount > 0 && (
              <button
                type="button"
                onClick={onSyncAll}
                className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[#15803D] text-white text-[14px] font-bold shrink-0 cursor-pointer"
              >
                Sincronizar ({offlineCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Support Dialog */}
      {supportModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-dialog-title"
          onClick={() => setSupportModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl p-5 border-2 border-[#18181B] shadow-[6px_6px_0px_#18181B] space-y-4 ${
              isNight ? 'bg-[#1A1A1A] text-white' : 'bg-[#FFFDF8] text-[#18181B]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="support-dialog-title" className="font-display text-[22px] font-bold">
                  Asistencia Humana Normandía
                </h2>
                <p className={`text-[16px] mt-1 ${isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'}`}>
                  Si tiene dudas en el corral, llame gratis al equipo técnico de la finca.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                aria-label="Cerrar ayuda"
                className={`min-h-[44px] min-w-[44px] rounded-xl border-2 border-[#18181B] flex items-center justify-center cursor-pointer ${
                  isNight ? 'bg-[#2A2A2A] text-white' : 'bg-surface-container-high text-[#18181B]'
                }`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isNight ? 'bg-[#222222] border-[#333333]' : 'bg-surface-container-low border-[#18181B]/15'
              }`}
            >
              <p className="font-display text-[17px] font-bold">
                Ingeniero Mateo Rincón (Soporte Finca)
              </p>
              <p className={`text-[16px] mt-0.5 tabular-nums ${isNight ? 'text-[#FFB784]' : 'text-primary font-semibold'}`}>
                Línea gratuita: 01 8000 123 456
              </p>
              <p className={`text-[14px] mt-1 ${isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'}`}>
                Horario: Todos los días de 4:30 AM a 8:00 PM
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="tel:018000123456"
                className="w-full min-h-[58px] rounded-xl bg-[#15803D] text-white font-display text-[18px] font-bold border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[24px]">call</span>
                <span>Llamar Ahora</span>
              </a>
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className={`w-full min-h-[52px] rounded-xl font-display text-[17px] font-semibold border-2 border-[#18181B] cursor-pointer ${
                  isNight ? 'bg-[#2A2A2A] text-white' : 'bg-white text-[#18181B]'
                }`}
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
