import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsItem } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  // Hero hirdoboz elemei kulon Firestore kollekcioban.
  private newsCollection = collection(db, 'news');

  addNews(item: NewsItem) {
    // Uj hir mentese idobelyeggel.
    return addDoc(this.newsCollection, {
      ...item,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  updateNews(newsId: string, item: Partial<NewsItem>) {
    // Szerkesztesnel csak a valtozott mezok mennek, plusz frissul az updatedAt mezo.
    const newsRef = doc(db, 'news', newsId);
    return updateDoc(newsRef, {
      ...item,
      updatedAt: Date.now()
    });
  }

  deleteNews(newsId: string) {
    const newsRef = doc(db, 'news', newsId);
    return deleteDoc(newsRef);
  }

  getActiveNewsStream(
    next: (items: NewsItem[]) => void,
    error?: (err: unknown) => void
  ) {
    // Itt direkt kliens oldalon szurok aktivra, hogy ne kelljen kulon Firestore index.
    const newsQuery = query(this.newsCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      newsQuery,
      snapshot => {
        const items = snapshot.docs
          .map(item => ({
            id: item.id,
            ...(item.data() as Omit<NewsItem, 'id'>)
          }))
          .filter(item => item.isActive !== false);

        next(items);
      },
      err => {
        if (error) {
          error(err);
        }
      }
    );
  }

  getAllNewsStream(
    next: (items: NewsItem[]) => void,
    error?: (err: unknown) => void
  ) {
    // Admin listahoz minden hir idorendben jelenik meg.
    const newsQuery = query(this.newsCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      newsQuery,
      snapshot => {
        const items = snapshot.docs.map(item => ({
          id: item.id,
          ...(item.data() as Omit<NewsItem, 'id'>)
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
