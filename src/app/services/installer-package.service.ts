import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { InstallerPackage } from '../models/installer-package.model';

@Injectable({
  providedIn: 'root'
})
export class InstallerPackageService {
  private packageCollection = collection(db, 'installerPackages');

  addPackage(item: InstallerPackage) {
    return addDoc(this.packageCollection, {
      ...item,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  updatePackage(packageId: string, item: Partial<InstallerPackage>) {
    const packageRef = doc(db, 'installerPackages', packageId);
    return updateDoc(packageRef, {
      ...item,
      updatedAt: Date.now()
    });
  }

  deletePackage(packageId: string) {
    const packageRef = doc(db, 'installerPackages', packageId);
    return deleteDoc(packageRef);
  }

  getActivePackagesStream(
    next: (items: InstallerPackage[]) => void,
    error?: (err: unknown) => void
  ) {
    const packageQuery = query(this.packageCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      packageQuery,
      snapshot => {
        const items = snapshot.docs
          .map(item => ({
            id: item.id,
            ...(item.data() as Omit<InstallerPackage, 'id'>)
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

  getAllPackagesStream(
    next: (items: InstallerPackage[]) => void,
    error?: (err: unknown) => void
  ) {
    const packageQuery = query(this.packageCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(
      packageQuery,
      snapshot => {
        const items = snapshot.docs.map(item => ({
          id: item.id,
          ...(item.data() as Omit<InstallerPackage, 'id'>)
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
