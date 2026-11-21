import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { NORMANDIA_LOGO_URL } from '../data/mockNormandia';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppScreen, ThemeMode } from '../types/normandia';
import { SafeImage } from './SafeImage';

interface AppShellProps {
  theme: ThemeMode;
  operatorName: string;
  onUpdateOperatorName: (name: string) => void;
  profileModalOpen: boolean;
  onSetProfileModalOpen: (open: boolean) => void;
  onToggleTheme: () => void;
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  offlineCount: number;
  onSyncAll: () => void;
  authUser: { email: string; displayName: string | null } | null;
  authLoading: boolean;
  isSyncing: boolean;
  isOnline: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  children: ReactNode;
}

const SCREEN_SUBTITLE: Record<AppScreen, string> = {
  inicio: 'Inicio',
  registrar: 'Registro Guiado',
  historial: 'Comprobantes y Hoy',
};

export function AppShell({
  theme,
  operatorName,
  onUpdateOperatorName,
  profileModalOpen,
  onSetProfileModalOpen,
  onToggleTheme,
  activeScreen,
  onNavigate,
  offlineCount,
  onSyncAll,
  authUser,
  authLoading,
  isSyncing,
  isOnline,
  onSignIn,
  onSignOut,
  children,
}: AppShellProps) {
  const isNight = theme === 'noche';
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [nameDraft, setNameDraft] = useState(operatorName);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  useEffect(() => {
    setNameDraft(operatorName);
  }, [operatorName, profileModalOpen]);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowInstallGuide(true);
    }
  };

  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nameDraft.trim();
    if (trimmed.length >= 2) {
      onUpdateOperatorName(trimmed);
      onSetProfileModalOpen(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col antialiased transition-colors duration-200 ${
        isNight ? 'bg-[#121212] text-white' : 'bg-surface text-on-surface'
      }`}
    >
      {/* Top Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 pt-safe backdrop-blur-xl transition-colors ${
          isNight
            ? 'bg-[#121212]/92 border-b border-[#2A2A2A]'
            : 'bg-surface/90 border-b border-[#1b1b1e]/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="max-w-5xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate('inicio')}
            className="flex items-center gap-2.5 min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg cursor-pointer"
          >
            <SafeImage
              src={NORMANDIA_LOGO_URL}
              alt="Logo Normandía"
              className="h-8 w-8 rounded-md object-contain shrink-0"
              fallbackIcon="agriculture"
            />
            <div className="flex flex-col min-w-0">
              <span
                className={`font-display text-[20px] font-bold leading-tight truncate whitespace-nowrap ${
                  isNight ? 'text-white' : 'text-on-surface'
                }`}
              >
                Normandía
              </span>
              <span
                className={`text-[13px] font-semibold truncate whitespace-nowrap ${
                  isNight ? 'text-[#9CA3AF]' : 'text-on-surface-variant'
                }`}
              >
                {SCREEN_SUBTITLE[activeScreen]}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isNight
                  ? 'Cambiar a Modo Cálido Marfil'
                  : 'Cambiar a Modo Noche Alto Contraste'
              }
              className={`min-h-[44px] px-3 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isNight
                  ? 'bg-[#222222] border border-[#3A3A3A] text-white hover:bg-[#2C2C2C]'
                  : 'bg-surface-container-high hover:bg-surface-variant text-on-surface shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isNight ? 'text-[#FFB784]' : 'text-primary'
                }`}
              >
                {isNight ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="font-display text-[14px] font-bold">
                {isNight ? 'Noche' : 'Cálido'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSetProfileModalOpen(true)}
              aria-label="Mi nombre, cuenta e instalación"
              className={`relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                authUser
                  ? 'bg-[#15803D] hover:bg-[#116932] text-white'
                  : 'bg-[#8d4b00] hover:bg-[#b15f00] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        {!isOnline && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#B85D19] text-white flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[20px] shrink-0">
                wifi_off
              </span>
              <span className="font-display text-[15px] font-bold truncate">
                Sin señal — Sus registros se guardan seguros en este celular
              </span>
            </div>
          </div>
        )}

        {children}
      </main>

      {/* Bottom Fixed Navigation */}
      <nav
        aria-label="Navegación principal"
        className={`fixed bottom-0 left-0 right-0 z-50 pb-safe backdrop-blur-xl transition-colors ${
          isNight
            ? 'bg-[#121212]/95 border-t border-[#2A2A2A] shadow-[0_-1px_12px_rgba(0,0,0,0.4)]'
            : 'bg-surface/95 border-t border-[#1b1b1e]/10 shadow-[0_-1px_12px_rgba(0,0,0,0.06)]'
        }`}
      >
        <div className="max-w-5xl mx-auto h-[68px] px-4 sm:px-6 flex items-center justify-around gap-3">
          <button
            type="button"
            onClick={() => onNavigate('inicio')}
            aria-current={activeScreen === 'inicio' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-h-[52px] min-w-[82px] px-3 py-1 rounded-xl transition-colors cursor-pointer ${
              activeScreen === 'inicio'
                ? isNight
                  ? 'bg-[#2E2319] border border-[#8D4B00] text-[#FFB784] font-bold'
                  : 'bg-primary-fixed text-on-primary-fixed font-bold'
                : isNight
                  ? 'text-[#9CA3AF] hover:text-white'
                  : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">home</span>
            <span className="font-display text-[15px] leading-tight mt-0.5 whitespace-nowrap">
              Inicio
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('registrar')}
            aria-current={activeScreen === 'registrar' ? 'page' : undefined}
            className="flex items-center justify-center gap-2 min-h-[52px] px-5 sm:px-7 rounded-xl bg-[#B85D19] hover:bg-[#a24f12] border border-[#D7782A] text-white shadow-[0_4px_12px_rgba(184,93,25,0.35)] active:translate-y-0.5 transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px] ms-filled">
              add_circle
            </span>
            <span className="font-display text-[18px] font-bold whitespace-nowrap">
              Registrar
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('historial')}
            aria-current={activeScreen === 'historial' ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center min-h-[52px] min-w-[82px] px-3 py-1 rounded-xl transition-colors cursor-pointer ${
              activeScreen === 'historial'
                ? isNight
                  ? 'bg-[#2E2319] border border-[#8D4B00] text-[#FFB784] font-bold'
                  : 'bg-primary-fixed text-on-primary-fixed font-bold'
                : isNight
                  ? 'text-[#9CA3AF] hover:text-white'
                  : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">
              format_list_bulleted
            </span>
            <span className="font-display text-[15px] leading-tight mt-0.5 whitespace-nowrap">
              Historial
            </span>
            {offlineCount > 0 && (
              <span
                aria-label={`${offlineCount} registros pendientes por sincronizar`}
                className="absolute -top-1 right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#15803D] text-white text-[12px] font-bold flex items-center justify-center border border-[#18181B]"
              >
                {offlineCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Profile, Name Edit, Cloud Sync & Install Sheet */}
      {profileModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-dialog-title"
          onClick={() => onSetProfileModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl p-5 border-2 border-[#18181B] shadow-[6px_6px_0px_#18181B] space-y-4 my-auto ${
              isNight ? 'bg-[#1A1A1A] text-white' : 'bg-[#FFFDF8] text-[#18181B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-12 h-12 rounded-full text-white flex items-center justify-center shrink-0 ${
                    authUser ? 'bg-[#15803D]' : 'bg-[#8d4b00]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px]">person</span>
                </div>
                <div className="min-w-0">
                  <h2
                    id="profile-dialog-title"
                    className="font-display text-[22px] font-bold truncate"
                  >
                    {operatorName}
                  </h2>
                  <p
                    className={`text-[14px] truncate ${
                      isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                    }`}
                  >
                    {authUser ? authUser.email : 'Finca Normandía • En este celular'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSetProfileModalOpen(false)}
                className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center border-2 border-[#18181B] cursor-pointer shrink-0 ${
                  isNight
                    ? 'bg-[#2A2A2A] text-white'
                    : 'bg-surface-container-high text-[#18181B]'
                }`}
                aria-label="Cerrar menú"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Edit Operator Name */}
            <form
              onSubmit={handleNameSubmit}
              className={`p-4 rounded-xl border space-y-2.5 ${
                isNight
                  ? 'bg-[#222222] border-[#333333]'
                  : 'bg-surface-container-low border-[#18181B]/15'
              }`}
            >
              <label
                htmlFor="profile-operator-name"
                className="font-display text-[16px] font-bold block"
              >
                Cambiar tu nombre:
              </label>
              <div className="flex gap-2">
                <input
                  id="profile-operator-name"
                  type="text"
                  maxLength={60}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  className={`flex-1 min-h-[52px] px-3.5 rounded-xl border-2 text-[17px] ${
                    isNight
                      ? 'bg-[#1A1A1A] border-[#444444] text-white'
                      : 'bg-white border-[#18181B] text-[#18181B]'
                  }`}
                />
                <button
                  type="submit"
                  disabled={nameDraft.trim().length < 2}
                  className="min-h-[52px] px-4 rounded-xl bg-[#B85D19] text-white font-display text-[16px] font-bold border-2 border-[#18181B] disabled:opacity-50 cursor-pointer shrink-0"
                >
                  Guardar
                </button>
              </div>
            </form>

            {/* Cloud Account & Sync Card */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isNight
                  ? 'bg-[#222222] border-[#333333]'
                  : 'bg-surface-container-low border-[#18181B]/15'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-[17px] font-bold">
                  Respaldo con la Oficina
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[13px] font-bold ${
                    authUser ? 'bg-[#15803D] text-white' : 'bg-[#B85D19] text-white'
                  }`}
                >
                  {authUser ? 'Cuenta conectada' : 'Solo en teléfono'}
                </span>
              </div>

              <p
                className={`text-[15px] leading-snug ${
                  isNight ? 'text-[#D1D5DB]' : 'text-on-surface-variant'
                }`}
              >
                {authUser
                  ? offlineCount > 0
                    ? `Tiene ${offlineCount} ${offlineCount === 1 ? 'registro guardado' : 'registros guardados'} en el celular listos para enviar.`
                    : 'Todos sus registros y vacas están respaldados en la cuenta de la finca.'
                  : 'Conecte su cuenta de Google para respaldar sus registros y vacas en la oficina.'}
              </p>

              {!authUser ? (
                <button
                  type="button"
                  disabled={authLoading}
                  onClick={onSignIn}
                  className="w-full min-h-[54px] rounded-xl bg-[#15803D] text-white font-display text-[17px] font-bold border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    account_circle
                  </span>
                  <span>
                    {authLoading ? 'Conectando...' : 'Conectar cuenta (Google)'}
                  </span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {offlineCount > 0 && (
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={() => {
                        onSyncAll();
                        onSetProfileModalOpen(false);
                      }}
                      className="w-full min-h-[52px] rounded-xl bg-[#15803D] text-white font-display text-[17px] font-bold border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        cloud_upload
                      </span>
                      <span>
                        {isSyncing
                          ? 'Enviando...'
                          : `Sincronizar ahora (${offlineCount})`}
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onSignOut();
                      onSetProfileModalOpen(false);
                    }}
                    className={`w-full min-h-[48px] rounded-xl font-display text-[16px] font-semibold border-2 border-[#18181B] cursor-pointer ${
                      isNight ? 'bg-[#2A2A2A] text-white' : 'bg-white text-[#18181B]'
                    }`}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {!isInstalled && (
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isNight
                    ? 'bg-[#222222] border-[#333333]'
                    : 'bg-surface-container-low border-[#18181B]/15'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isNight ? 'text-[#FFB784]' : 'text-primary'
                    }`}
                  >
                    install_mobile
                  </span>
                  <span className="font-display text-[17px] font-bold">
                    Instalar en el celular
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full min-h-[52px] rounded-xl bg-[#B85D19] text-white font-display text-[17px] font-bold border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[22px]">download</span>
                  <span>
                    {isInstallable
                      ? 'Instalar App Ahora'
                      : isIOS
                        ? 'Cómo instalar en iPhone'
                        : 'Cómo instalar en Android'}
                  </span>
                </button>
              </div>
            )}

            <a
              href="tel:018000123456"
              className={`w-full min-h-[52px] rounded-xl font-display text-[16px] font-bold border-2 border-[#18181B] flex items-center justify-center gap-2 ${
                isNight ? 'bg-[#2A2A2A] text-white' : 'bg-white text-[#18181B]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-[#B85D19]">
                phone_in_talk
              </span>
              <span>Llamar a Asistencia (01 8000 123 456)</span>
            </a>
          </div>
        </div>
      )}

      {showInstallGuide && (
        <div
          className="fixed inset-0 z-[70] bg-black/65 flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowInstallGuide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl p-5 border-2 border-[#18181B] shadow-[6px_6px_0px_#18181B] space-y-4 ${
              isNight ? 'bg-[#1A1A1A] text-white' : 'bg-[#FFFDF8] text-[#18181B]'
            }`}
          >
            <h3 className="font-display text-[22px] font-bold">
              {isIOS ? 'Instalar en iPhone / iPad' : 'Instalar en Android'}
            </h3>
            {isIOS ? (
              <ol className="space-y-2 text-[17px] leading-snug list-decimal pl-5">
                <li>Abre esta página en Safari.</li>
                <li>Toca el botón <strong>Compartir</strong> abajo en la barra.</li>
                <li>Elige <strong>Agregar a inicio</strong> y presiona <strong>Agregar</strong>.</li>
              </ol>
            ) : (
              <ol className="space-y-2 text-[17px] leading-snug list-decimal pl-5">
                <li>Abre esta URL en <strong>Google Chrome</strong> en tu celular.</li>
                <li>Toca los tres puntos <strong>⋮</strong> arriba a la derecha.</li>
                <li>Toca <strong>Instalar aplicación</strong> o <strong>Agregar a la pantalla principal</strong>.</li>
              </ol>
            )}
            <button
              type="button"
              onClick={() => setShowInstallGuide(false)}
              className="w-full min-h-[54px] rounded-xl bg-[#B85D19] text-white font-display text-[18px] font-bold border-2 border-[#18181B] cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
