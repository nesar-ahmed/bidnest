import { KycStatus, SellerType, UserRole, UserStatus } from '@bidnest/shared';

// Dev fixtures only: passwords are deliberately guessable; seeding is explicit.
export interface SellerSeed {
  sellerType: SellerType;
  businessName?: string;
  kycStatus: KycStatus;
  rejectionReason?: string;
}

export interface AccountSeed {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  nonPaymentCount?: number;
  seller?: SellerSeed;
}

export const ADMIN_ACCOUNTS: AccountSeed[] = [
  { email: 'admin@bidnest.com', name: 'Dana Whitfield', password: 'Admin!2345', role: UserRole.Admin },
  {
    email: 'riley@bidnest.com',
    name: 'Riley Okafor',
    password: 'Mod!2345',
    role: UserRole.Moderator,
  },
];

export const SELLER_ACCOUNTS: AccountSeed[] = [
  {
    email: 'studio@bidnest.com',
    name: 'Victor Hausmann',
    password: 'Seller!2345',
    role: UserRole.Seller,
    seller: { sellerType: SellerType.Business, businessName: 'Studio Volt Auctions', kycStatus: KycStatus.Verified },
  },
  {
    email: 'klaus@bidnest.com',
    name: 'Klaus-Dieter Weber',
    password: 'Seller!2345',
    role: UserRole.Seller,
    seller: { sellerType: SellerType.Individual, kycStatus: KycStatus.Verified },
  },
  {
    email: 'meridian@bidnest.com',
    name: 'Priya Raman',
    password: 'Seller!2345',
    role: UserRole.Seller,
    seller: { sellerType: SellerType.Business, businessName: 'Meridian Collectibles', kycStatus: KycStatus.Verified },
  },
  {
    email: 'groove@bidnest.com',
    name: 'Marcus Bell',
    password: 'Seller!2345',
    role: UserRole.Buyer,
    seller: { sellerType: SellerType.Business, businessName: 'Groove Merchant', kycStatus: KycStatus.Pending },
  },
  {
    email: 'yunaseo@bidnest.com',
    name: 'Yuna Seo',
    password: 'Seller!2345',
    role: UserRole.Buyer,
    seller: { sellerType: SellerType.Individual, kycStatus: KycStatus.Pending },
  },
  {
    email: 'quickflip@bidnest.com',
    name: 'Kevin Doyle',
    password: 'Seller!2345',
    role: UserRole.Buyer,
    seller: {
      sellerType: SellerType.Business,
      businessName: 'QuickFlip Factory',
      kycStatus: KycStatus.Rejected,
      rejectionReason: 'Repeated counterfeit complaints from linked accounts',
    },
  },
];

export const BUYER_ACCOUNTS: AccountSeed[] = [
  { email: 'alex@bidnest.com', name: 'Alex Rivera', password: 'Buyer!2345', role: UserRole.Buyer },
  {
    email: 'amara@bidnest.com',
    name: 'Amara Okafor',
    password: 'Buyer!2345',
    role: UserRole.Buyer,
    nonPaymentCount: 1,
  },
  { email: 'theo.k@bidnest.com', name: 'Theo Keller', password: 'Buyer!2345', role: UserRole.Buyer },
  {
    email: 'sofia@bidnest.com',
    name: 'Sofia Lindqvist',
    password: 'Buyer!2345',
    role: UserRole.Buyer,
    nonPaymentCount: 2,
  },
];

export const ALL_ACCOUNTS: AccountSeed[] = [...ADMIN_ACCOUNTS, ...SELLER_ACCOUNTS, ...BUYER_ACCOUNTS];
