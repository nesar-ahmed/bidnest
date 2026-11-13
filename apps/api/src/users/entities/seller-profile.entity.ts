import { KycStatus, SellerType } from '@bidnest/shared';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('seller_profiles')
export class SellerProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @Column({ type: 'varchar', default: SellerType.Individual })
  sellerType!: SellerType;

  @Column({ type: 'varchar', nullable: true })
  businessName!: string | null;

  @Column({ type: 'varchar', default: KycStatus.Pending })
  kycStatus!: KycStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
