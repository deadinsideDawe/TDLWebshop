import { Injectable } from '@angular/core';
import { addDoc, collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface ClientLogItem {
  id: string;
  event: string;
  message: string;
  createdAt: number;
  userId: string;
  userEmail: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private logsCollection = collection(db, 'clientLogs');

  capture(event: string, error: unknown, context: Record<string, unknown> = {}): void {
    // Kliens oldali hibákat Firestore-ba mentjük admin diagnosztikához.
    const user = auth.currentUser;
    const payload = {
      event,
      message: this.stringifyError(error),
      context: this.sanitizeContext(context),
      createdAt: Date.now(),
      userId: user?.uid || '',
      userEmail: user?.email || '',
      source: 'web-client'
    };

    addDoc(this.logsCollection, payload).catch(logError => {
      // A monitorozás nem ronthatja el a fő felhasználói folyamatot.
      console.error('[monitoring] log write failed', logError);
    });
  }

  private stringifyError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }

    if (typeof error === 'string') {
      return error;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return 'unknown-error';
    }
  }

  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const safe: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(context)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === 'string') {
        safe[key] = value.slice(0, 300);
        continue;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        safe[key] = value;
        continue;
      }

      safe[key] = String(value).slice(0, 300);
    }

    return safe;
  }

  getRecentLogsStream(
    next: (items: ClientLogItem[]) => void,
    error?: (err: unknown) => void
  ) {
    // Az admin oldalon csak a legfrissebb kliens hibákat mutatjuk.
    const logsQuery = query(this.logsCollection, orderBy('createdAt', 'desc'), limit(8));

    return onSnapshot(
      logsQuery,
      snapshot => {
        const items = snapshot.docs.map(item => ({
          id: item.id,
          ...(item.data() as Omit<ClientLogItem, 'id'>)
        }));

        next(items);
      },
      err => {
        if (error) {
          error(err);
        }
      }
    );
  }
}
