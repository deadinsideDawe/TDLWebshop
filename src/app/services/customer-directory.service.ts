import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CustomerProfile } from '../models/customer-profile.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerDirectoryService {
  // Mentett vasarlo/ceg adatok (webes + helyszini folyamatok gyorsitasara).
  private customerProfilesCollection = collection(db, 'customerProfiles');

  async createProfile(profile: Omit<CustomerProfile, 'id' | 'createdAt' | 'lastUsedAt'>): Promise<string> {
    const ref = await addDoc(this.customerProfilesCollection, {
      disabled: false,
      paymentTermDays: 10,
      paymentTermApproved: true,
      note: '',
      ...profile,
      createdAt: Date.now(),
      lastUsedAt: Date.now()
    });

    return ref.id;
  }

  async updateProfile(
    id: string,
    profile: Partial<Omit<CustomerProfile, 'id' | 'createdAt' | 'lastUsedAt'>>
  ): Promise<void> {
    const profileRef = doc(db, 'customerProfiles', id);
    await updateDoc(profileRef, {
      ...profile,
      lastUsedAt: Date.now()
    });
  }

  async touchProfile(id: string): Promise<void> {
    const profileRef = doc(db, 'customerProfiles', id);
    await updateDoc(profileRef, {
      lastUsedAt: Date.now()
    });
  }

  async deleteProfile(id: string): Promise<void> {
    const profileRef = doc(db, 'customerProfiles', id);
    await deleteDoc(profileRef);
  }

  async upsertProfileForUser(
    uid: string,
    email: string,
    profile: {
      type: 'private' | 'company';
      name: string;
      phone: string;
      companyName?: string;
      taxNumber?: string;
    }
  ): Promise<void> {
    // Bejelentkezett userhez fix document id = uid.
    const profileRef = doc(db, 'customerProfiles', uid);
    const normalizedEmail = email.trim().toLowerCase();

    await setDoc(
      profileRef,
      {
        type: profile.type,
        name: profile.name,
        email: normalizedEmail,
        phone: profile.phone,
        companyName: profile.companyName || '',
        taxNumber: profile.taxNumber || '',
        disabled: false,
        paymentTermDays: 10,
        paymentTermApproved: true,
        note: '',
        source: 'web-user',
        isGuest: false,
        createdAt: Date.now(),
        lastUsedAt: Date.now()
      },
      { merge: true }
    );
  }

  async upsertGuestProfileByEmail(profile: {
    type: 'private' | 'company';
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    taxNumber?: string;
  }): Promise<string> {
    // Vendeg vasarlonak determinisztikus, de nem olvashato email-alapu id-t adunk.
    const normalizedEmail = profile.email.trim().toLowerCase();
    const guestId = `guest_${await this.hashIdentifier(normalizedEmail)}`;
    const profileRef = doc(db, 'customerProfiles', guestId);

    await setDoc(
      profileRef,
      {
        type: profile.type,
        name: profile.name,
        email: normalizedEmail,
        phone: profile.phone,
        companyName: profile.companyName || '',
        taxNumber: profile.taxNumber || '',
        disabled: false,
        paymentTermDays: 10,
        paymentTermApproved: true,
        note: '',
        source: 'web-guest',
        isGuest: true,
        createdAt: Date.now(),
        lastUsedAt: Date.now()
      },
      { merge: true }
    );

    return guestId;
  }

  async upsertAdminProfileByEmail(profile: {
    type: 'private' | 'company';
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    taxNumber?: string;
  }): Promise<string> {
    // Admin kezelesnel email alapu determinisztikus azonosito.
    const normalizedEmail = profile.email.trim().toLowerCase();
    const profileId = `admin_${this.slugifyEmail(normalizedEmail)}`;
    const profileRef = doc(db, 'customerProfiles', profileId);

    await setDoc(
      profileRef,
      {
        type: profile.type,
        name: profile.name,
        email: normalizedEmail,
        phone: profile.phone,
        companyName: profile.companyName || '',
        taxNumber: profile.taxNumber || '',
        disabled: false,
        paymentTermDays: 10,
        paymentTermApproved: true,
        note: '',
        source: 'admin-local',
        isGuest: false,
        createdAt: Date.now(),
        lastUsedAt: Date.now()
      },
      { merge: true }
    );

    return profileId;
  }

  private slugifyEmail(email: string): string {
    // Firestore doc id-ben csak biztonsagos karakterek maradjanak.
    return email
      .replace(/@/g, '_at_')
      .replace(/[^a-z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 80);
  }

  private async hashIdentifier(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);

    if (globalThis.crypto?.subtle) {
      const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 32);
    }

    let hash = 2166136261;
    for (const byte of data) {
      hash ^= byte;
      hash = Math.imul(hash, 16777619);
    }

    return Math.abs(hash).toString(36);
  }

  getProfilesStream(
    next: (profiles: CustomerProfile[]) => void,
    error?: (err: unknown) => void
  ) {
    // Admin oldalon realtime lista a mentett profilokrol.
    const profilesQuery = query(this.customerProfilesCollection, orderBy('lastUsedAt', 'desc'));

    return onSnapshot(
      profilesQuery,
      snapshot => {
        const profiles = snapshot.docs.map(item => ({
          id: item.id,
          ...(item.data() as Omit<CustomerProfile, 'id'>)
        }));

        next(profiles);
      },
      err => {
        if (error) {
          error(err);
        }
      }
    );
  }
}
