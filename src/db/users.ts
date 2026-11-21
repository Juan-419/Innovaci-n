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

export async function updateUserThemePreference(
  uid: string,
  themePreference: 'calido' | 'noche'
) {
  try {
    await db
      .update(users)
      .set({ themePreference })
      .where(eq(users.uid, uid));
  } catch (error) {
    console.error('Database theme update failed:', error);
    throw new Error('No se pudo guardar la preferencia visual.', { cause: error });
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
