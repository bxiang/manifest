import { DatabaseSaveService } from './database-save.service';

describe('DatabaseSaveService', () => {
  let service: DatabaseSaveService;
  let mockSaveDatabase: jest.Mock;

  describe('with sqljs datasource (file-backed)', () => {
    beforeEach(() => {
      mockSaveDatabase = jest.fn().mockResolvedValue(undefined);
      const mockDataSource = {
        options: { type: 'sqljs', location: '/tmp/test.db' },
        manager: { saveDatabase: mockSaveDatabase },
      };
      service = new DatabaseSaveService(mockDataSource as never);
    });

    it('calls saveDatabase on sqljs manager', async () => {
      await service.save();
      expect(mockSaveDatabase).toHaveBeenCalledTimes(1);
    });

    it('flushes on application shutdown', async () => {
      await service.onApplicationShutdown();
      expect(mockSaveDatabase).toHaveBeenCalledTimes(1);
    });
  });

  describe('with sqljs datasource (in-memory)', () => {
    beforeEach(() => {
      mockSaveDatabase = jest.fn().mockResolvedValue(undefined);
      const mockDataSource = {
        options: { type: 'sqljs' },
        manager: { saveDatabase: mockSaveDatabase },
      };
      service = new DatabaseSaveService(mockDataSource as never);
    });

    it('skips save when no location is set', async () => {
      await service.save();
      expect(mockSaveDatabase).not.toHaveBeenCalled();
    });
  });

  describe('with postgres datasource', () => {
    beforeEach(() => {
      const mockDataSource = {
        options: { type: 'postgres' },
        manager: {},
      };
      service = new DatabaseSaveService(mockDataSource as never);
    });

    it('no-ops for postgres', async () => {
      await expect(service.save()).resolves.toBeUndefined();
    });

    it('no-ops on shutdown for postgres', async () => {
      await expect(service.onApplicationShutdown()).resolves.toBeUndefined();
    });
  });
});
