import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserState } from 'src/features/user/user.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(count: number = 1) {
    // Check if users already exist
    const usersCount = await this.userRepository.count();
    if (usersCount > 0) {
      return console.info(`🌝 User already seeded (${usersCount} found)`);
    }

    console.info('\n🚀 Seeding users');
    const users = [];

    // Create admin user
    users.push(
      this.userRepository.create({
        email: 'admin@example.com',
        phone: '1234567890',
        password: await this.hashPassword('adminPassword123'),
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        state: UserState.ACTIVE,
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      }),
    );

    // Create regular user
    users.push(
      this.userRepository.create({
        email: 'user@example.com',
        phone: '0987654321',
        password: await this.hashPassword('userPassword123'),
        firstName: 'Regular',
        lastName: 'User',
        username: 'regular_user',
        state: UserState.ACTIVE,
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: false,
      }),
    );

    // Create pending user
    users.push(
      this.userRepository.create({
        email: 'pending@example.com',
        password: await this.hashPassword('pendingPassword123'),
        firstName: 'Pending',
        lastName: 'User',
        username: 'pending_user',
        state: UserState.PENDING,
        isVerified: false,
        isEmailVerified: false,
      }),
    );

    // Create 7 more users with varied states
    const states = [UserState.ACTIVE, UserState.PENDING];
    const verificationStates = [
      { isVerified: true, isEmailVerified: true, isPhoneVerified: true },
      { isVerified: true, isEmailVerified: true, isPhoneVerified: false },
      { isVerified: false, isEmailVerified: false, isPhoneVerified: false },
    ];

    for (let i = 0; i < count - 2; i++) {
      const state = states[Math.floor(Math.random() * states.length)];
      const verification =
        verificationStates[
          Math.floor(Math.random() * verificationStates.length)
        ];

      users.push(
        this.userRepository.create({
          email: `user${i + 1}@example.com`,
          phone: `555${String(i + 1).padStart(7, '0')}`,
          password: await this.hashPassword(`userPassword${i + 1}`),
          firstName: `User`,
          lastName: `${i + 1}`,
          username: `user_${i + 1}`,
          state,
          ...verification,
        }),
      );
    }

    await this.userRepository.save(users);
    console.info('🌿 Users seeded successfully');
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
