export interface InstallerPackageLine {
  productSku: string;
  quantity: number;
  label: string;
}

export interface InstallerPackage {
  id?: string;
  name: string;
  subtitle: string;
  description: string;
  isActive: boolean;
  items: InstallerPackageLine[];
  createdAt?: number;
  updatedAt?: number;
}
