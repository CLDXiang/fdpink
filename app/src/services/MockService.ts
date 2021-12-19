import BaseService from './BaseService';

export class MockService extends BaseService {
  constructor() {
    super('mock');
  }

  /** 在 `timeout` 毫秒后返回 `data` */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getMockData(data: any, timeout = 1000) {
    this.logger.log('getMockData::req');
    await new Promise((r) => window.setTimeout(r, timeout));
    this.logger.log('getMockData::resp', data);
    return data;
  }
}
