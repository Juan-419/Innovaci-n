import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { ConfirmationHistoryScreen } from './components/ConfirmationHistoryScreen';
import { GuidedRegisterScreen } from './components/GuidedRegisterScreen';
import { HomeScreen } from './components/HomeScreen';
import { INITIAL_RECORDS } from './data/mockNormandia';
import { auth, googleAuthProvider } from './lib/firebase';
import {
  AppScreen,
  CowProfile,
  DraftRecord,
  MilkQuality,
  MilkingRecord,
  ShiftType,
  ThemeMode,
} from './types/normandia';

const STORAGE_THEME_KEY = 'normandia_theme_v1';
const STORAGE_RECORDS_KEY = 'normandia_records_v1';
const STORAGE_DRAFT_KEY = 'normandia_draft_v1';

function loadInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'calido' || saved === 'noche') return saved;
  } catch {
    // ignore storage errors
  }
  return 'calido';
}

function loadInitialRecords(): MilkingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return INITIAL_RECORDS;
}

function loadInitialDraft(): DraftRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (raw) return JSON.parse(raw) as DraftRecord;
  } catch {
    // ignore storage errors
  }
  return null;
}

function mergeRecords(
  localList: MilkingRecord[],
  serverList: MilkingRecord[]
): MilkingRecord[] {
  const byId = new Map<string, MilkingRecord>();
  for (const rec of serverList) {
    byId.set(rec.id, { ...rec, syncStatus: 'synced' });
  }
  for (const rec of localList) {
    if (!byId.has(rec.id)) {
      byId.set(rec.id, rec);
    }
  }
  return Array.from(byId.values());
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(loadInitialTheme);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('inicio');
  const [registerInitialStep, setRegisterInitialStep] = useState<1 | 2>(2);
  const [records, setRecords] = useState<MilkingRecord[]>(loadInitialRecords);
  const [draft, setDraft] = useState<DraftRecord | null>(loadInitialDraft);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    () => loadInitialRecords()[0]?.id ?? INITIAL_RECORDS[0].id
  );
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // ignore
    }
    if (theme === 'noche') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  useEffect(() => {
    try {
      if (draft) {
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
      } else {
        localStorage.removeItem(STORAGE_DRAFT_KEY);
      }
    } catch {
      // ignore
    }
  }, [draft]);

  const syncRecordsWithServer = useCallback(
    async (user: User, recordsToPush: MilkingRecord[], notify = false) => {
      if (!navigator.onLine) return;
      setIsSyncing(true);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/records/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            records: recordsToPush.map((r) => ({
              clientId: r.id,
              receiptCode: r.receiptCode,
              cowId: r.cowId,
              cowName: r.cowName,
              cowTag: r.cowTag,
              lot: r.lot,
              breed: r.breed,
              imageUrl: r.imageUrl,
              liters: r.liters,
              shift: r.shift,
              shiftTime: r.shiftTime,
              quality: r.quality,
              qualityNote: r.qualityNote,
              timeFormatted: r.timeFormatted,
              dateFormatted: r.dateFormatted,
              operator: r.operator,
            })),
          }),
        });

        if (!res.ok) throw new Error('Sync error');
        const data = (await res.json()) as { records: MilkingRecord[] };
        setRecords((prev) => mergeRecords(prev, data.records));
        if (notify) {
          showToast('Registros respaldados correctamente.');
        }
      } catch {
        if (notify) {
          showToast('Se mantienen guardados en su celular.');
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [showToast]
  );

  // Bootstrap PostgreSQL data when user signs in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user || !navigator.onLine) return;

      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/bootstrap', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          user: { themePreference: ThemeMode; seededSampleData: boolean };
          records: MilkingRecord[];
        };

        if (data.user.themePreference === 'calido' || data.user.themePreference === 'noche') {
          setTheme(data.user.themePreference);
        }

        const currentLocal = loadInitialRecords();
        if (!data.user.seededSampleData && data.records.length === 0) {
          await syncRecordsWithServer(user, currentLocal, false);
        } else {
          const pendingOffline = currentLocal.filter(
            (r) => r.syncStatus === 'offline'
          );
          if (pendingOffline.length > 0) {
            await syncRecordsWithServer(user, pendingOffline, false);
          } else if (data.records.length > 0) {
            setRecords(data.records);
            setSelectedRecordId(data.records[0].id);
          }
        }
      } catch {
        // Offline-first: keep working seamlessly with local records
      }
    });

    return () => unsubscribe();
  }, [syncRecordsWithServer]);

  // Auto-sync queued offline records when connectivity returns
  useEffect(() => {
    if (!isOnline || !firebaseUser) return;
    const pending = records.filter((r) => r.syncStatus === 'offline');
    if (pending.length > 0) {
      syncRecordsWithServer(firebaseUser, pending, true);
    }
  }, [isOnline, firebaseUser, records, syncRecordsWithServer]);

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
      showToast('Cuenta conectada con éxito.');
    } catch {
      showToast('No se pudo conectar la cuenta en este momento.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast('Sesión cerrada.');
    } catch {
      // ignore
    }
  };

  const handleToggleTheme = async () => {
    const nextTheme: ThemeMode = theme === 'calido' ? 'noche' : 'calido';
    setTheme(nextTheme);
    if (firebaseUser && navigator.onLine) {
      try {
        const token = await firebaseUser.getIdToken();
        await fetch('/api/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ themePreference: nextTheme }),
        });
      } catch {
        // ignore network failures on preference sync
      }
    }
  };

  const handleNavigate = (screen: AppScreen) => {
    if (screen === 'registrar') {
      setRegisterInitialStep(2);
    }
    if (screen === 'historial') {
      setJustSaved(false);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewRegistration = () => {
    setDraft(null);
    setRegisterInitialStep(2);
    setActiveScreen('registrar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterNextCow = () => {
    setDraft(null);
    setRegisterInitialStep(1);
    setActiveScreen('registrar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeDraft = () => {
    setRegisterInitialStep(draft?.step ?? 2);
    setActiveScreen('registrar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = (newDraft: DraftRecord) => {
    setDraft(newDraft);
    setActiveScreen('inicio');
    showToast('Borrador guardado en su teléfono.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteRecord = async (payload: {
    cow: CowProfile;
    liters: number;
    shift: ShiftType;
    quality: MilkQuality;
    qualityNote?: string;
  }) => {
    const nextNum = 842 + records.length + 1;
    const nowTime = new Date().toLocaleTimeString('es-CO', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const newRecord: MilkingRecord = {
      id: `rec-${Date.now()}`,
      receiptCode: `#REG-2025-0${nextNum}`,
      cowId: payload.cow.id,
      cowName: payload.cow.name,
      cowTag: payload.cow.tagNumber,
      lot: payload.cow.lot,
      breed: payload.cow.breed,
      imageUrl: payload.cow.imageUrl,
      liters: payload.liters,
      shift: payload.shift,
      shiftTime: payload.shift === 'Mañana' ? '6:00 AM' : '4:30 PM',
      quality: payload.quality,
      qualityNote: payload.qualityNote,
      timeFormatted: nowTime,
      dateFormatted: 'Hoy',
      operator: firebaseUser?.displayName || 'Don Carlos',
      syncStatus: 'offline',
    };

    setRecords((prev) => [newRecord, ...prev]);
    setDraft(null);
    setSelectedRecordId(newRecord.id);
    setJustSaved(true);
    setActiveScreen('historial');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (firebaseUser && navigator.onLine) {
      await syncRecordsWithServer(firebaseUser, [newRecord], false);
    }
  };

  const handleSyncAll = async () => {
    if (!firebaseUser) {
      await handleSignIn();
      return;
    }
    const pending = records.filter((r) => r.syncStatus === 'offline');
    if (pending.length === 0) {
      showToast('Todo está al día.');
      return;
    }
    await syncRecordsWithServer(firebaseUser, pending, true);
  };

  const offlineCount = records.filter((r) => r.syncStatus === 'offline').length;

  return (
    <AppShell
      theme={theme}
      onToggleTheme={handleToggleTheme}
      activeScreen={activeScreen}
      onNavigate={handleNavigate}
      offlineCount={offlineCount}
      onSyncAll={handleSyncAll}
      authUser={
        firebaseUser
          ? {
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName,
            }
          : null
      }
      authLoading={authLoading}
      isSyncing={isSyncing}
      isOnline={isOnline}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
    >
      {toastMessage && (
        <div
          role="status"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] px-4 py-3 rounded-xl bg-[#15803D] text-white font-display text-[16px] font-bold border-2 border-[#18181B] shadow-[4px_4px_0px_#18181B] flex items-center gap-2 max-w-[92vw]"
        >
          <span className="material-symbols-outlined text-[22px] ms-filled">
            check_circle
          </span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {activeScreen === 'inicio' && (
        <HomeScreen
          theme={theme}
          onToggleTheme={handleToggleTheme}
          records={records}
          draft={draft}
          onStartNewRegistration={handleStartNewRegistration}
          onResumeDraft={handleResumeDraft}
          onViewTodayRecords={() => handleNavigate('historial')}
          onSyncAll={handleSyncAll}
        />
      )}

      {activeScreen === 'registrar' && (
        <GuidedRegisterScreen
          theme={theme}
          initialStep={registerInitialStep}
          initialDraft={draft}
          todayRecords={records}
          onBackHome={() => handleNavigate('inicio')}
          onSaveDraft={handleSaveDraft}
          onCompleteRecord={handleCompleteRecord}
        />
      )}

      {activeScreen === 'historial' && (
        <ConfirmationHistoryScreen
          theme={theme}
          records={records}
          selectedRecordId={selectedRecordId}
          justSaved={justSaved}
          onSelectRecord={(id) => {
            setSelectedRecordId(id);
            setJustSaved(false);
          }}
          onCloseToHome={() => handleNavigate('inicio')}
          onRegisterNextCow={handleRegisterNextCow}
          onSyncAll={handleSyncAll}
        />
      )}
    </AppShell>
  );
}
