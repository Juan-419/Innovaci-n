import { FormEvent, useState } from 'react';
import { NORMANDIA_LOGO_URL } from '../data/mockNormandia';
import { ThemeMode } from '../types/normandia';
import { SafeImage } from './SafeImage';

interface WelcomeRegistrationScreenProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  initialName?: string;
  authLoading: boolean;
  onRegisterName: (name: string) => void;
  onSignInGoogle: () => void;
}

export function WelcomeRegistrationScreen({
  theme,
  onToggleTheme,
  initialName = '',
  authLoading,
  onRegisterName,
  onSignInGoogle,
}: WelcomeRegistrationScreenProps) {
  const isNight = theme === 'noche';
  const [nameInput, setNameInput] = useState(initialName);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = nameInput.trim();
    if (cleaned.length < 2) {
      setErrorMsg('Por favor escribe tu nombre (al menos 2 letras).');
      return;
    }
    setErrorMsg(null);
    onRegisterName(cleaned);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 antialiased transition-colors ${
        isNight ? 'bg-[#121212] text-white' : 'bg-[#F7F4EB] text-[#18181B]'
      }`}
    >
      {/* Top Bar */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <SafeImage
            src={NORMANDIA_LOGO_URL}
            alt="Logo Normandía"
            className="h-9 w-9 rounded-lg object-contain"
            fallbackIcon="agriculture"
          />
          <span className="font-display text-[22px] font-bold">Normandía</span>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={
            isNight ? 'Cambiar a Modo Cálido' : 'Cambiar a Modo Noche Alto Contraste'
          }
          className={`min-h-[44px] px-3 rounded-xl flex items-center gap-1.5 border-2 border-[#18181B] cursor-pointer ${
            isNight
              ? 'bg-[#222222] text-white border-[#3A3A3A]'
              : 'bg-[#FFFDF8] text-[#18181B] shadow-[2px_2px_0px_#18181B]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${
              isNight ? 'text-[#FFB784]' : 'text-[#B85D19]'
            }`}
          >
            {isNight ? 'dark_mode' : 'light_mode'}
          </span>
          <span className="font-display text-[14px] font-bold">
            {isNight ? 'Noche' : 'Cálido'}
          </span>
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-lg mx-auto my-auto py-6">
        <div
          className={`rounded-2xl p-6 sm:p-8 border-2 space-y-6 ${
            isNight
              ? 'bg-[#1A1A1A] border-[#3A3A3A] shadow-[6px_6px_0px_#000000]'
              : 'bg-[#FFFDF8] border-[#18181B] shadow-[6px_6px_0px_#18181B]'
          }`}
        >
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#B85D19] text-white border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px] ms-filled">
                waving_hand
              </span>
            </div>

            <h1 className="font-display text-[30px] font-bold leading-tight pt-2">
              ¡Bienvenido a Normandía!
            </h1>
            <p
              className={`text-[18px] leading-relaxed ${
                isNight ? 'text-[#D1D5DB]' : 'text-[#27272A]'
              }`}
            >
              Regístrate con tu nombre para que tus comprobantes de ordeño salgan a tu nombre y puedas guardar tus vacas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="operator-name-input"
                className="font-display text-[17px] font-bold block"
              >
                Tu nombre completo o como te conocen:
              </label>
              <input
                id="operator-name-input"
                type="text"
                autoComplete="name"
                maxLength={60}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Ej: Don Carlos, María, Juan..."
                className={`w-full min-h-[64px] px-4 rounded-xl border-2 text-[18px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B85D19] ${
                  isNight
                    ? 'bg-[#222222] border-[#444444] text-white placeholder:text-[#9CA3AF]'
                    : 'bg-[#FFFDF8] border-[#18181B] text-[#18181B] placeholder:text-[#71717A]'
                }`}
              />
              {errorMsg && (
                <p className="text-[15px] font-bold text-[#dc2626]" role="alert">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full min-h-[64px] px-6 rounded-xl bg-[#15803D] hover:bg-[#116932] text-white font-display text-[20px] font-bold border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#18181B] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Entrar a la Finca</span>
              <span className="material-symbols-outlined text-[28px]">arrow_forward</span>
            </button>
          </form>

          <div
            className={`pt-4 border-t space-y-3 ${
              isNight ? 'border-[#333333]' : 'border-[#18181B]/15'
            }`}
          >
            <p
              className={`text-[15px] text-center ${
                isNight ? 'text-[#9CA3AF]' : 'text-[#554336]'
              }`}
            >
              ¿Ya tienes cuenta en la oficina? Puedes entrar directo con Google:
            </p>
            <button
              type="button"
              disabled={authLoading}
              onClick={onSignInGoogle}
              className={`w-full min-h-[56px] px-4 rounded-xl font-display text-[17px] font-bold border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                isNight ? 'bg-[#222222] text-white' : 'bg-[#FFFDF8] text-[#18181B]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] text-[#B85D19]">
                account_circle
              </span>
              <span>
                {authLoading ? 'Conectando...' : 'Registrarme / Entrar con Google'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Reassurance */}
      <div className="w-full max-w-lg mx-auto pb-2 flex items-center justify-center gap-2 text-[14px] opacity-85">
        <span className="material-symbols-outlined text-[18px] text-[#15803D]">lock</span>
        <span>Tus registros se guardan incluso sin internet en el potrero.</span>
      </div>
    </div>
  );
}
