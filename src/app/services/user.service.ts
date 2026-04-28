import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../models/user-profile.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection = collection(db, 'users');

  async upsertUserProfile(uid: string, email: string): Promise<void> {
    // User profil letrehozas/frissites belepeskor-regisztraciokor.
    const normalizedEmail = email.toLowerCase();
    const userRef = doc(db, 'users', uid);
    const existingProfile = await getDoc(userRef);

    if (existingProfile.exists()) {
      await setDoc(
        userRef,
        {
          email: normalizedEmail,
          lastLoginAt: Date.now()
        },
        { merge: true }
      );
      return;
    }

    const managedProfileQuery = query(this.usersCollection, where('email', '==', normalizedEmail), limit(1));
    const managedProfileSnapshot = await getDocs(managedProfileQuery);
    if (!managedProfileSnapshot.empty) {
      const managedProfile = managedProfileSnapshot.docs[0].data() as UserProfile;
      await setDoc(
        userRef,
        {
          ...managedProfile,
          email: normalizedEmail,
          createdAt: managedProfile.createdAt || Date.now(),
          lastLoginAt: Date.now()
        },
        { merge: true }
      );
      return;
    }

    await setDoc(userRef, {
      email: normalizedEmail,
      role: environment.adminEmails.includes(normalizedEmail) ? 'admin' : 'customer',
      disabled: false,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    });
  }

  async attachOrderToUser(uid: string, orderId: string): Promise<void> {
    // Felhasznaloi statisztika novelese minden sikeres rendelesnel.
    const userRef = doc(db, 'users', uid);

    await setDoc(
      userRef,
      {
        orderCount: increment(1),
        lastOrderId: orderId,
        lastOrderAt: Date.now()
      },
      { merge: true }
    );
  }

  async touchLastLogin(uid: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: Date.now()
    });
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<UserProfile, 'id'>)
    };
  }

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  }

  async createOrUpdateAdminManagedUser(data: {
    email: string;
    role: 'admin' | 'employee' | 'customer';
    disabled?: boolean;
    accountType?: 'private' | 'company';
    displayName?: string;
    phone?: string;
    companyName?: string;
    taxNumber?: string;
    note?: string;
    employeePermissions?: UserProfile['employeePermissions'];
  }): Promise<string> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const matchQuery = query(this.usersCollection, where('email', '==', normalizedEmail), limit(1));
    const snapshot = await getDocs(matchQuery);

    const payload: Partial<UserProfile> = {
      email: normalizedEmail,
      role: data.role,
      disabled: !!data.disabled,
      accountType: data.accountType || 'private',
      displayName: (data.displayName || '').trim(),
      phone: (data.phone || '').trim(),
      companyName: (data.companyName || '').trim(),
      taxNumber: (data.taxNumber || '').trim(),
      note: (data.note || '').trim(),
      employeePermissions: data.role === 'employee'
        ? (data.employeePermissions || this.getDefaultEmployeePermissions())
        : this.getEmptyEmployeePermissions()
    };

    if (!snapshot.empty) {
      const existing = snapshot.docs[0];
      await updateDoc(existing.ref, payload);
      return existing.id;
    }

    const created = await addDoc(this.usersCollection, {
      ...payload,
      createdAt: Date.now(),
      lastLoginAt: 0,
      orderCount: 0
    });

    return created.id;
  }

  getUsersStream(
    next: (users: UserProfile[]) => void,
    error?: (err: unknown) => void
  ) {
    // Realtime admin felhasznalo lista.
    const usersQuery = query(this.usersCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      usersQuery,
      snapshot => {
        const users = snapshot.docs.map(userDoc => ({
          id: userDoc.id,
          ...(userDoc.data() as Omit<UserProfile, 'id'>)
        }));

        next(users);
      },
      err => {
        if (error) {
          error(err);
        }
      }
    );
  }

  private getDefaultEmployeePermissions(): NonNullable<UserProfile['employeePermissions']> {
    return {
      canRecordSales: true,
      canViewInventory: true,
      canManageProducts: true,
      canManageCustomers: true,
      canDisableCustomers: true
    };
  }

  private getEmptyEmployeePermissions(): NonNullable<UserProfile['employeePermissions']> {
    return {
      canRecordSales: false,
      canViewInventory: false,
      canManageProducts: false,
      canManageCustomers: false,
      canDisableCustomers: false
    };
  }
}
