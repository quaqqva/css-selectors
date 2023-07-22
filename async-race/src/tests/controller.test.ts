/**
 * @jest-environment node
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fetch from 'node-fetch';
import Controller from '../app/controller/controller';
import { EngineStatus } from '../app/model/drive';

describe('controller', () => {
  const url = 'http://127.0.0.1:3000';
  const controller = new Controller(url);

  describe('garage', () => {
    it('gets entities count from server', async () => {
      const count = await controller.getCarsCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    describe('gets entities array from server', () => {
      describe('when no params specified', () => {
        it('returns full array of entities', async () => {
          const cars = await controller.getCars({});
          const count = await controller.getCarsCount();
          expect(cars.length).toBe(count);
        });
      });

      describe('when numbers of page and entities per page are specified', () => {
        it('returns correct page', async () => {
          const carsPerPage = 2;
          const carsLimited = await controller.getCars({ pageNum: 1, carsPerPage });
          expect(carsLimited.length).toBeLessThanOrEqual(carsPerPage);
        });
      });
    });

    it('can create entities', async () => {
      const newCar = {
        name: 'GAZ 21',
        color: '#ffffff',
      };
      const cars = await controller.getCars({});
      controller.createCar(newCar);
      const newCount = await controller.getCarsCount();
      expect(newCount).toBe(cars.length + 1);
    });

    it('can update entities', async () => {
      const car = (await controller.getCars({}))[0];
      car.name = 'BMW X5';
      controller.updateCar(car);
      const updatedCar = await controller.getCar(car.id);
      expect(car).toEqual(updatedCar);
    });

    it('can delete entities', async () => {
      const cars = await controller.getCars({});
      const deleted = cars.at(-1);
      if (deleted) {
        controller.deleteCar(deleted.id);
        const newCarsCount = await controller.getCarsCount();
        expect(newCarsCount).toBe(cars.length - 1);
      }
    });
  });

  describe('engine', () => {
    it('can start engine and return velocity data', async () => {
      const currentCar = (await controller.getCars({}))[0];
      const velocityData = await controller.toggleEngine({ carId: currentCar.id, engineStatus: EngineStatus.Started });
      expect(velocityData).toBeDefined();
    });
    it('can switch car to drive mode', async () => {
      const currentCar = (await controller.getCars({}))[0];
      const success = await controller.switchToDrive(currentCar.id);
      expect(typeof success).toBe('boolean');
    });
    it('can stop engine', async () => {
      const currentCar = (await controller.getCars({}))[0];
      const velocityData = await controller.toggleEngine({ carId: currentCar.id, engineStatus: EngineStatus.Stopped });
      expect(velocityData).toBeDefined();
    });
  });

  describe('winners', () => {
    it('gets entities count from server', async () => {
      const count = await controller.getWinnersCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    describe('gets entities array from server', () => {
      describe('when no params specified', () => {
        it('returns full array of entities', async () => {
          const winners = await controller.getWinners({});
          const count = await controller.getWinnersCount();
          expect(winners.length).toBe(count);
        });
      });

      describe('when numbers of page and entities per page are specified', () => {
        it('returns correct page', async () => {
          const winnersPerPage = 2;
          const winnersLimited = await controller.getWinners({ pageNum: 1, winnersPerPage });
          expect(winnersLimited.length).toBeLessThanOrEqual(winnersPerPage);
        });
      });
    });
    it('can create entities', async () => {
      const newCar = {
        id: 20,
        wins: 10,
        time: 500,
      };
      const winners = await controller.getWinners({});
      controller.createWinner(newCar);
      const newCount = await controller.getWinnersCount();
      expect(newCount).toBe(winners.length + 1);
    });

    it('can update entities', async () => {
      const car = (await controller.getWinners({}))[0];
      car.wins = 99;
      controller.updateWinner(car);
      const updatedCar = await controller.getWinner(car.id);
      expect(car).toEqual(updatedCar);
    });

    it('can delete entities', async () => {
      const winners = await controller.getWinners({});
      const deleted = winners.at(-1);
      if (deleted) {
        controller.deleteWinner(deleted.id);
        const newCount = await controller.getWinnersCount();
        expect(newCount).toBe(winners.length - 1);
      }
    });
  });
});
