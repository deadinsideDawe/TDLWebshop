import { Injectable } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { auth } from '../firebase';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Auth user stream: minden oldal innen olvassa a bejelentkezett usert.
  private userSubject = new BehaviorSubject<User | null>(auth.currentUser);
  user$ = this.userSubject.asObservable();
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject.asObservable();
  private initializedResolver?: () => void;
  private initializedPromise = new Promise<void>(resolve => {
    this.initializedResolver = resolve;
  });
  private initialized = false;

  constructor(private userService: UserService) {
    // Firebase auth allapot figyelese az app teljes eletciklusa alatt.
    onAuthStateChanged(auth, async user => {
      this.userSubject.next(user);
      await this.refreshCurrentUserProfile(user);

      if (!this.initialized) {
        this.initialized = true;
        this.initializedResolver?.();
      }
    });
  }

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // Elso/kovetkezo belepesnel mindig frissitjuk a Firestore user profilt.
    if (credential.user.email) {
      await this.userService.upsertUserProfile(credential.user.uid, credential.user.email);
    }

    const profile = await this.userService.getUserProfile(credential.user.uid);
    if (profile?.disabled) {
      await signOut(auth);
      const disabledError = new Error('user-disabled');
      (disabledError as Error & { code?: string }).code = 'auth/user-disabled';
      throw disabledError;
    }

    return credential;
  }

  async register(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // Regisztracio utan azonnal letrehozzuk a user profilt.
    if (credential.user.email) {
      await this.userService.upsertUserProfile(credential.user.uid, credential.user.email);
    }

    const profile = await this.userService.getUserProfile(credential.user.uid);
    if (profile?.disabled) {
      await signOut(auth);
      const disabledError = new Error('user-disabled');
      (disabledError as Error & { code?: string }).code = 'auth/user-disabled';
      throw disabledError;
    }

    return credential;
  }

  logout() {
    return signOut(auth);
  }

  getUser() {
    return this.userSubject.value;
  }

  getProfile() {
    return this.profileSubject.value;
  }

  waitForAuthReady() {
    // Guard-ok innen varjak meg, hogy biztosan lefusson az auth init.
    return this.initializedPromise;
  }

  isAdminEmail(email?: string | null) {
    if (!email) {
      return false;
    }

    return environment.adminEmails.includes(email.toLowerCase());
  }

  isCurrentUserAdmin() {
    return this.isAdminEmail(this.getUser()?.email) || this.getProfile()?.role === 'admin';
  }

  isCurrentUserDisabled() {
    return this.getProfile()?.disabled === true;
  }

  private async refreshCurrentUserProfile(user: User | null): Promise<void> {
    if (!user?.uid) {
      this.profileSubject.next(null);
      return;
    }

    try {
      const profile = await this.userService.getUserProfile(user.uid);
      this.profileSubject.next(profile);

      if (profile?.disabled) {
        await signOut(auth);
      }
    } catch {
      this.profileSubject.next(null);
    }
  }
}
