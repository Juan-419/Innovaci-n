import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { milkingRecords } from './schema.ts';

export interface IncomingMilkingRecord {
  clientId: string;
  receiptCode: string;
  cowId: string;
  cowName: string;
  cowTag: string;
  lot: string;
  breed: string;
  imageUrl: string;
  liters: number;
  shift: 'Mañana' | 'Tarde';
  shiftTime: string;
  quality: 'Limpia y Normal' | 'Con Novedad';
  qualityNote?: string;
  timeFormatted: string;
  dateFormatted: string;
  operator: string;
}

export async function getMilkingRecordsForUser(userUid: string) {
  try {
    return await db
      .select()
      .from(milkingRecords)
      .where(eq(milkingRecords.userUid, userUid))
      .orderBy(desc(milkingRecords.recordedAt), desc(milkingRecords.id));
  } catch (error) {
    console.error('Database records fetch failed:', error);
    throw new Error('No se pudieron consultar los registros.', { cause: error });
  }
}

export async function upsertMilkingRecordsForUser(
  userUid: string,
  items: IncomingMilkingRecord[]
) {
  if (items.length === 0) {
    return await getMilkingRecordsForUser(userUid);
  }

  try {
    await db
      .insert(milkingRecords)
      .values(
        items.map((item) => ({
          clientId: item.clientId,
          userUid,
          receiptCode: item.receiptCode,
          cowId: item.cowId,
          cowName: item.cowName,
          cowTag: item.cowTag,
          lot: item.lot,
          breed: item.breed,
          imageUrl: item.imageUrl,
          liters: item.liters,
          shift: item.shift,
          shiftTime: item.shiftTime,
          quality: item.quality,
          qualityNote: item.qualityNote ?? null,
          timeFormatted: item.timeFormatted,
          dateFormatted: item.dateFormatted,
          operator: item.operator,
        }))
      )
      .onConflictDoNothing({ target: milkingRecords.clientId });

    return await getMilkingRecordsForUser(userUid);
  } catch (error) {
    console.error('Database records upsert failed:', error);
    throw new Error('No se pudieron sincronizar los registros.', { cause: error });
  }
}
