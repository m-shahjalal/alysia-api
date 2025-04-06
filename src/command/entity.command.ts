// src/commands/entity.command.ts
import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { EntityCommandService } from './services/entity-command.service';

@Injectable()
@Command({ name: 'entity', description: 'Manage entities' })
export class EntityCommand extends CommandRunner {
  constructor(private entityService: EntityCommandService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const action = options?.action || 'list';
    const entityName = options?.entity;

    if (action === 'list') {
      const entities = await this.entityService.listEntities();
      console.log('Available entities:');
      entities.forEach((entity) => console.log(`- ${entity}`));
      return;
    }

    if (!entityName) {
      console.error('Entity name is required for this action');
      return;
    }

    try {
      const entityClass = await this.entityService.getEntityByName(entityName);
      const repository = this.entityService.getRepository(entityClass);

      switch (action) {
        case 'count':
          const count = await repository.count();
          console.log(`Count of ${entityName}: ${count}`);
          break;
        case 'truncate':
          await repository.clear();
          console.log(`Truncated ${entityName}`);
          break;
        // Add more actions as needed
        default:
          console.log(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  @Option({
    flags: '-a, --action [action]',
    description: 'Action to perform (list, count, truncate)',
    defaultValue: 'list',
  })
  parseAction(val: string): string {
    return val;
  }

  @Option({
    flags: '-e, --entity [entity]',
    description: 'Entity name to operate on',
  })
  parseEntity(val: string): string {
    return val;
  }
}
