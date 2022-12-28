import { EntityRepository } from '@mikro-orm/mysql';
import { Worker } from './entities/worker.entity';

export class WorkerRepository extends EntityRepository<Worker> {}
