// src/commands/services/entity-command.service.ts
import { Injectable } from '@nestjs/common';
import { getConnection, EntityTarget, Repository } from 'typeorm';

@Injectable()
export class EntityCommandService {
  getRepository<T>(entity: EntityTarget<T>): Repository<T> {
    return getConnection().getRepository(entity);
  }

  async listEntities(): Promise<string[]> {
    const connection = getConnection();
    return connection.entityMetadatas.map((metadata) => metadata.name);
  }

  async getEntityByName(name: string): Promise<any> {
    const connection = getConnection();
    const metadata = connection.entityMetadatas.find(
      (m) => m.name.toLowerCase() === name.toLowerCase(),
    );

    if (!metadata) {
      throw new Error(`Entity "${name}" not found`);
    }

    return metadata.target;
  }
}
