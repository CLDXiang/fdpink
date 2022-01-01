import { Logger } from '@/utils'

export default abstract class BaseService {
  logger: Logger

  constructor(protected name: string) {
    this.logger = new Logger(`[services/${this.name}]`)
  }
}
