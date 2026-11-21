import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName ?? null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(displayName ? { displayName } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database user upsert failed:', error);
    throw new Error('No se pudo verificar el perfil de usuario.', { cause: error });
  }
}

export async function updateUserPreferences(
  uid: string,
  updates: { themePreference?: 'calido' | 'noche'; displayName?: string }
) {
  try {
    const setPayload: { themePreference?: string; displayName?: string } = {};
    if (updates.themePreference) {
      setPayload.themePreference = updates.themePreference;
    }
    if (updates.displayName) {
      setPayload.displayName = updates.displayName;
    }
    if (Object.keys(setPayload).length === 0) return;

    await db.update(users).set(setPayload).where(eq(users.uid, uid));
  } catch (error) {
    console.error('Database user preferences update failed:', error);
    throw new Error('No se pudieron guardar las preferencias.', { cause: error });
  }
}

export async function markUserSampleSeeded(uid: string) {
  try {
    await db
      .update(users)
      .set({ seededSampleData: true })
      .where(eq(users.uid, uid));
  } catch (error) {
    console.error('Database seed flag update failed:', error);
    throw new Error('No se pudo actualizar el estado inicial.', { cause: error });
  }
}
