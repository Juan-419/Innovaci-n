import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCowsForUser, upsertCowsForUser } from './src/db/cows.ts';
import type { IncomingCowProfile } from './src/db/cows.ts';
import {
  getMilkingRecordsForUser,
  upsertMilkingRecordsForUser,
} from './src/db/records.ts';
import type { IncomingMilkingRecord } from './src/db/records.ts';
import {
  getOrCreateUser,
  markUserSampleSeeded,
  updateUserPreferences,
} from './src/db/users.ts';
import { requireAuth } from './src/middleware/auth.ts';
import type { AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sanitizeString(value: unknown, maxLen: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  return trimmed;
}

function isSafeImageUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 1000) return false;
  return trimmed.startsWith('https://') || trimmed.startsWith('/');
}

function validateIncomingRecord(raw: unknown): IncomingMilkingRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const clientId = sanitizeString(r.clientId ?? r.id, 120);
  const receiptCode = sanitizeString(r.receiptCode, 40);
  const cowId = sanitizeString(r.cowId, 80);
  const cowName = sanitizeString(r.cowName, 80);
  const cowTag = sanitizeString(r.cowTag, 30);
  const lot = sanitizeString(r.lot, 40);
  const breed = sanitizeString(r.breed, 80);
  const shiftTime = sanitizeString(r.shiftTime, 30);
  const timeFormatted = sanitizeString(r.timeFormatted, 40);
  const dateFormatted = sanitizeString(r.dateFormatted, 40);
  const operator = sanitizeString(r.operator, 80);

  if (
    !clientId ||
    !receiptCode ||
    !cowId ||
    !cowName ||
    !cowTag ||
    !lot ||
    !breed ||
    !shiftTime ||
    !timeFormatted ||
    !dateFormatted ||
    !operator
  ) {
    return null;
  }

  if (!isSafeImageUrl(r.imageUrl)) return null;

  const litersNum = Number(r.liters);
  if (!Number.isFinite(litersNum) || litersNum < 0 || litersNum > 200) {
    return null;
  }

  if (r.shift !== 'Mañana' && r.shift !== 'Tarde') return null;
  if (r.quality !== 'Limpia y Normal' && r.quality !== 'Con Novedad') return null;

  let qualityNote: string | undefined;
  if (typeof r.qualityNote === 'string' && r.qualityNote.trim().length > 0) {
    qualityNote = r.qualityNote.trim().slice(0, 140);
  }

  return {
    clientId,
    receiptCode,
    cowId,
    cowName,
    cowTag,
    lot,
    breed,
    imageUrl: r.imageUrl.trim(),
    liters: Math.round(litersNum * 10) / 10,
    shift: r.shift,
    shiftTime,
    quality: r.quality,
    qualityNote,
    timeFormatted,
    dateFormatted,
    operator,
  };
}

function validateIncomingCow(raw: unknown): IncomingCowProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;

  const clientId = sanitizeString(c.clientId ?? c.id, 120);
  const name = sanitizeString(c.name, 80);
  const tagNumber = sanitizeString(c.tagNumber, 30);
  const lot = sanitizeString(c.lot, 40);
  const breed = sanitizeString(c.breed, 80);
  const paddock = sanitizeString(c.paddock, 80);

  if (!clientId || !name || !tagNumber || !lot || !breed || !paddock) {
    return null;
  }
  if (!isSafeImageUrl(c.imageUrl)) return null;

  const litersNum = Number(c.defaultLiters ?? 16);
  const defaultLiters =
    Number.isFinite(litersNum) && litersNum >= 0 && litersNum <= 200
      ? Math.round(litersNum * 10) / 10
      : 16;

  return {
    clientId,
    name,
    tagNumber,
    lot,
    breed,
    paddock,
    imageUrl: c.imageUrl.trim(),
    defaultLiters,
  };
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/bootstrap', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email ?? 'usuario@normandia.local';
      const name = typeof req.user!.name === 'string' ? req.user!.name : null;

      const user = await getOrCreateUser(uid, email, name);
      const [records, customCows] = await Promise.all([
        getMilkingRecordsForUser(uid),
        getCowsForUser(uid),
      ]);

      res.json({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          themePreference: user.themePreference,
          seededSampleData: user.seededSampleData,
        },
        cows: customCows.map((cow) => ({
          id: cow.clientId,
          name: cow.name,
          tagNumber: cow.tagNumber,
          lot: cow.lot,
          breed: cow.breed,
          paddock: cow.paddock,
          imageUrl: cow.imageUrl,
          defaultLiters: cow.defaultLiters,
          isCustom: true,
        })),
        records: records.map((rec) => ({
          id: rec.clientId,
          receiptCode: rec.receiptCode,
          cowId: rec.cowId,
          cowName: rec.cowName,
          cowTag: rec.cowTag,
          lot: rec.lot,
          breed: rec.breed,
          imageUrl: rec.imageUrl,
          liters: rec.liters,
          shift: rec.shift,
          shiftTime: rec.shiftTime,
          quality: rec.quality,
          qualityNote: rec.qualityNote ?? undefined,
          timeFormatted: rec.timeFormatted,
          dateFormatted: rec.dateFormatted,
          operator: rec.operator,
          syncStatus: 'synced' as const,
        })),
      });
    } catch (error) {
      console.error('Failed to bootstrap user data:', error);
      res.status(500).json({ error: 'No se pudieron cargar los datos de la cuenta.' });
    }
  });

  app.post('/api/cows/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email ?? 'usuario@normandia.local';
      const name = typeof req.user!.name === 'string' ? req.user!.name : null;

      const rawCows = req.body?.cows;
      if (!Array.isArray(rawCows) || rawCows.length > 100) {
        return res.status(400).json({ error: 'Lista de vacas inválida.' });
      }

      const validCows: IncomingCowProfile[] = [];
      for (const item of rawCows) {
        const parsed = validateIncomingCow(item);
        if (!parsed) {
          return res.status(400).json({ error: 'Datos de vaca inválidos.' });
        }
        validCows.push(parsed);
      }

      await getOrCreateUser(uid, email, name);
      const saved = await upsertCowsForUser(uid, validCows);

      res.json({
        cows: saved.map((cow) => ({
          id: cow.clientId,
          name: cow.name,
          tagNumber: cow.tagNumber,
          lot: cow.lot,
          breed: cow.breed,
          paddock: cow.paddock,
          imageUrl: cow.imageUrl,
          defaultLiters: cow.defaultLiters,
          isCustom: true,
        })),
      });
    } catch (error) {
      console.error('Failed to sync cows:', error);
      res.status(500).json({ error: 'No se pudieron guardar las vacas.' });
    }
  });

  app.post('/api/records/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email ?? 'usuario@normandia.local';
      const name = typeof req.user!.name === 'string' ? req.user!.name : null;

      const rawRecords = req.body?.records;
      if (!Array.isArray(rawRecords) || rawRecords.length > 100) {
        return res.status(400).json({ error: 'Lista de registros inválida.' });
      }

      const validRecords: IncomingMilkingRecord[] = [];
      for (const item of rawRecords) {
        const parsed = validateIncomingRecord(item);
        if (!parsed) {
          return res.status(400).json({ error: 'Formato de registro inválido.' });
        }
        validRecords.push(parsed);
      }

      await getOrCreateUser(uid, email, name);
      const saved = await upsertMilkingRecordsForUser(uid, validRecords);
      if (validRecords.length > 0) {
        await markUserSampleSeeded(uid);
      }

      res.json({
        records: saved.map((rec) => ({
          id: rec.clientId,
          receiptCode: rec.receiptCode,
          cowId: rec.cowId,
          cowName: rec.cowName,
          cowTag: rec.cowTag,
          lot: rec.lot,
          breed: rec.breed,
          imageUrl: rec.imageUrl,
          liters: rec.liters,
          shift: rec.shift,
          shiftTime: rec.shiftTime,
          quality: rec.quality,
          qualityNote: rec.qualityNote ?? undefined,
          timeFormatted: rec.timeFormatted,
          dateFormatted: rec.dateFormatted,
          operator: rec.operator,
          syncStatus: 'synced' as const,
        })),
      });
    } catch (error) {
      console.error('Failed to sync records:', error);
      res.status(500).json({ error: 'No se pudieron guardar los registros.' });
    }
  });

  app.patch('/api/preferences', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email ?? 'usuario@normandia.local';
      const tokenName = typeof req.user!.name === 'string' ? req.user!.name : null;
      const themePreference = req.body?.themePreference;
      const displayName = req.body?.displayName;

      const updates: { themePreference?: 'calido' | 'noche'; displayName?: string } = {};
      if (themePreference !== undefined) {
        if (themePreference !== 'calido' && themePreference !== 'noche') {
          return res.status(400).json({ error: 'Preferencia visual inválida.' });
        }
        updates.themePreference = themePreference;
      }

      if (displayName !== undefined) {
        const cleanName = sanitizeString(displayName, 60);
        if (!cleanName) {
          return res.status(400).json({ error: 'Nombre inválido.' });
        }
        updates.displayName = cleanName;
      }

      await getOrCreateUser(uid, email, updates.displayName ?? tokenName);
      await updateUserPreferences(uid, updates);
      res.json(updates);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      res.status(500).json({ error: 'No se pudieron actualizar las preferencias.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
