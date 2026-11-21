import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { cows } from './schema.ts';

export interface IncomingCowProfile {
  clientId: string;
  name: string;
  tagNumber: string;
  lot: string;
  breed: string;
  paddock: string;
  imageUrl: string;
  defaultLiters: number;
}

export async function getCowsForUser(userUid: string) {
  try {
    return await db
      .select()
      .from(cows)
      .where(eq(cows.userUid, userUid))
      .orderBy(desc(cows.createdAt), desc(cows.id));
  } catch (error) {
    console.error('Database cows fetch failed:', error);
    throw new Error('No se pudieron consultar las vacas registradas.', {
      cause: error,
    });
  }
}

export async function upsertCowsForUser(
  userUid: string,
  items: IncomingCowProfile[]
) {
  if (items.length === 0) {
    return await getCowsForUser(userUid);
  }

  try {
    await db
      .insert(cows)
      .values(
        items.map((item) => ({
          clientId: item.clientId,
          userUid,
          name: item.name,
          tagNumber: item.tagNumber,
          lot: item.lot,
          breed: item.breed,
          paddock: item.paddock,
          imageUrl: item.imageUrl,
          defaultLiters: item.defaultLiters,
        }))
      )
      .onConflictDoNothing({ target: cows.clientId });

    return await getCowsForUser(userUid);
  } catch (error) {
    console.error('Database cows upsert failed:', error);
    throw new Error('No se pudieron guardar las vacas registradas.', {
      cause: error,
    });
  }
}
