import { UserRole, UserStatus } from '@bidnest/shared';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Normalised so email lookups stay case-insensitive.
  @Column({ unique: true, transformer: { to: (v: string) => v.toLowerCase().trim(), from: (v: string) => v } })
  email!: string;

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;

  // Promoted to Seller only after an admin approves the KYC application.
  @Column({ type: 'varchar', default: UserRole.Buyer })
  role!: UserRole;

  @Column({ type: 'varchar', default: UserStatus.Active })
  status!: UserStatus;

  @Column({ type: 'int', default: 0 })
  nonPaymentCount!: number;

  @Column({ type: 'datetime', nullable: true })
  emailVerifiedAt!: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
