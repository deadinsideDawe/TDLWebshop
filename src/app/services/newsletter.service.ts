import { Injectable } from '@angular/core';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsletterSubscriber } from '../models/newsletter-subscriber.model';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private subscribersCollection = collection(db, 'newsletterSubscribers');

  subscribe(email: string) {
    return addDoc(this.subscribersCollection, {
      email: email.trim().toLowerCase(),
      source: 'homepage',
      status: 'active',
      createdAt: Date.now()
    });
  }

  getSubscribersStream(
    next: (items: NewsletterSubscriber[]) => void,
    error?: (err: unknown) => void
  ) {
    const subscribersQuery = query(this.subscribersCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      subscribersQuery,
      snapshot => {
        const items = snapshot.docs.map(item => ({
          id: item.id,
          ...(item.data() as Omit<NewsletterSubscriber, 'id'>)
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
