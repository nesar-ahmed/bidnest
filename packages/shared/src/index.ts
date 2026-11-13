/**
 * @bidnest/shared
 *
 * Single source of truth for types shared between the API (apps/api)
 * and the web app (apps/web). Keep DTOs and enums here so the
 * frontend and backend can never drift apart.
 */

// ---------------------------------------------------------------------------
// Roles & users
// ---------------------------------------------------------------------------

export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  Seller = 'seller',
  Buyer = 'buyer',
}

export enum UserStatus {
  Active = 'active',
  Suspended = 'suspended',
  Banned = 'banned',
}

// ---------------------------------------------------------------------------
// Auction & order lifecycles (see guide.md section 2)
// ---------------------------------------------------------------------------

export enum AuctionStatus {
  Draft = 'draft',
  Pending = 'pending',
  Scheduled = 'scheduled',
  Active = 'active',
  EndedSold = 'ended_sold',
  EndedUnsold = 'ended_unsold',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
}

export enum OrderStatus {
  PendingPayment = 'pending_payment',
  Paid = 'paid',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Disputed = 'disputed',
  Resolved = 'resolved',
  Refunded = 'refunded',
}

// ---------------------------------------------------------------------------
// Socket.IO event names (guide.md section 9)
// ---------------------------------------------------------------------------

export const SocketEvents = {
  AuctionJoin: 'auction:join',
  AuctionLeave: 'auction:leave',
  BidPlaced: 'bid:placed',
  AuctionExtended: 'auction:extended',
  AuctionEnded: 'auction:ended',
  NotificationNew: 'notification:new',
  OrderUpdated: 'order:updated',
} as const;

export type SocketEventName = (typeof SocketEvents)[keyof typeof SocketEvents];

// ---------------------------------------------------------------------------
// Shared DTO types
// Money rule (guide.md section 8): amounts are integers in the smallest
// currency unit (cents), never floating point. Dates are ISO-8601 strings.
// ---------------------------------------------------------------------------

export interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}

export interface AuctionSummaryDto {
  id: string;
  title: string;
  status: AuctionStatus;
  currentPriceCents: number;
  bidCount: number;
  startTime: string;
  endTime: string;
}

export interface ApiError {
  code: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Auth & users contracts (AuthModule / UsersModule)
// ---------------------------------------------------------------------------

export enum KycStatus {
  Pending = 'pending',
  Verified = 'verified',
  Rejected = 'rejected',
}

/** A seller can be a private person or a business. */
export enum SellerType {
  Individual = 'individual',
  Business = 'business',
}

export interface SellerApplicationRequestDto {
  sellerType: SellerType;
  /** Required when sellerType is Business. */
  businessName?: string;
}

export interface SellerApplicationResponseDto {
  kycStatus: KycStatus;
  sellerType: SellerType;
  businessName: string | null;
}

/** What the API returns for GET /auth/me, /auth/login, /auth/register. */
export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  /** Present for users with a seller profile; drives the /seller dashboard. */
  sellerKyc?: KycStatus;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

/** Socket events for auth lifecycle (later realtime phase). */
export const AuthEvents = {
  UserBanned: 'user:banned',
} as const;
