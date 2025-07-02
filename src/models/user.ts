import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id!: number;

  @Column({
    unique: true,
    type: 'varchar'
  })
  username!: string;

  @Column({
    type: 'varchar'
  })
  password!: string;

  @Column({
    nullable: true,
    default: null,
    type: 'varchar'
  })
  refresh_uuid!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
