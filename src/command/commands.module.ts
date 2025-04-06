// src/commands/commands.module.ts
import { Module } from '@nestjs/common';
import { EntityCommand } from './entity.command';
import { EntityCommandService } from './services/entity-command.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [EntityCommand, EntityCommandService],
})
export class CommandsModule {}
