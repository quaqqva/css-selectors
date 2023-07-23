import { RequestMethod, ResponseStatus } from '../../types/request-types';
import buildURL from '../../utils/build-url';
import { Car, CarViewData } from '../model/car';
import { CarFullData } from '../model/car-full';
import { DriveData, EngineStatus } from '../model/drive';
import { Winner, WinnersSortCriteria, WinnersSortOrder } from '../model/winner';

export default class Controller {
  private static ENDPOINTS = {
    garage: 'garage',
    winners: 'winners',
    engine: 'engine',
  };

  private baseUrl: string;

  public constructor(url: string) {
    this.baseUrl = url;
  }

  public async createCar(carData: CarViewData): Promise<Car> {
    const car = await this.createEntity<CarViewData, Car>(Controller.ENDPOINTS.garage, carData);
    return car;
  }

  public async getCar(carId: number): Promise<Car> {
    const car = await this.getEntity<Car>(Controller.ENDPOINTS.garage, carId);
    return car;
  }

  public async getCars({ pageNum, carsPerPage }: { pageNum?: number; carsPerPage?: number }): Promise<Car[]> {
    let queryParams;
    if (pageNum && carsPerPage) {
      queryParams = {
        _page: pageNum.toString(),
        _limit: carsPerPage.toString(),
      };
    }
    const cars = await this.getEntities<Car>(Controller.ENDPOINTS.garage, queryParams);
    return cars;
  }

  public async getCarsCount(): Promise<number> {
    const count = await this.getEntitiesCount(Controller.ENDPOINTS.garage);
    return count;
  }

  public async updateCar(carData: Car): Promise<Car> {
    const car = await this.updateEntity(Controller.ENDPOINTS.garage, carData);
    return car;
  }

  public deleteCar(carId: number): void {
    this.deleteEntity(Controller.ENDPOINTS.garage, carId);
  }

  public async toggleEngine({
    carId,
    engineStatus,
  }: {
    carId: number;
    engineStatus: EngineStatus.Started | EngineStatus.Stopped;
  }): Promise<DriveData> {
    const queryParams = {
      id: carId.toString(),
      status: engineStatus,
    };
    const url = buildURL([this.baseUrl, Controller.ENDPOINTS.engine], queryParams);

    const response = await fetch(url, {
      method: RequestMethod.PATCH,
    });
    if (response.status === ResponseStatus.BadRequest) throw Error('Invalid parameters passed');
    if (response.status === ResponseStatus.NotFound) throw Error('Car not found');

    const driveData: DriveData = await response.json();
    return driveData;
  }

  public async switchToDrive(carId: number): Promise<boolean> {
    const queryParams = {
      id: carId.toString(),
      status: EngineStatus.Drive,
    };
    const url = buildURL([this.baseUrl, Controller.ENDPOINTS.engine], queryParams);

    const response = await fetch(url, {
      method: RequestMethod.PATCH,
    });
    return response.status === ResponseStatus.OK;
  }

  public async createWinner(winnerData: Winner): Promise<Winner> {
    const winner = await this.createEntity<Winner, Winner>(Controller.ENDPOINTS.winners, winnerData);
    return winner;
  }

  public async getWinner(winnerId: number): Promise<Winner> {
    const winner = await this.getEntity<Winner>(Controller.ENDPOINTS.winners, winnerId);
    return winner;
  }

  public async getWinners({
    pageNum,
    winnersPerPage,
    sortBy = WinnersSortCriteria.Wins,
    sortOrder = WinnersSortOrder.Ascending,
  }: {
    pageNum?: number;
    winnersPerPage?: number;
    sortBy?: WinnersSortCriteria;
    sortOrder?: WinnersSortOrder;
  }): Promise<CarFullData[]> {
    type WinnersQueryParams = {
      _page?: string;
      _limit?: string;
      _sort: string;
      _order: string;
    };
    const queryParams: WinnersQueryParams = {
      _sort: sortBy,
      _order: sortOrder,
    };
    if (pageNum && winnersPerPage) {
      // eslint-disable-next-line no-underscore-dangle
      queryParams._page = pageNum.toString();
      // eslint-disable-next-line no-underscore-dangle
      queryParams._limit = winnersPerPage.toString();
    }
    const winners = (await this.getEntities(Controller.ENDPOINTS.winners, queryParams)) as Winner[];
    const carsPromise = winners.map(async (winner) => {
      const carInfo = await this.getCar(winner.id);
      return { ...carInfo, ...winner };
    });
    return Promise.all(carsPromise);
  }

  public async getWinnersCount(): Promise<number> {
    const count = await this.getEntitiesCount(Controller.ENDPOINTS.winners);
    return count;
  }

  public async updateWinner(winnerData: Omit<Winner, 'wins'>): Promise<Winner> {
    const winner = await this.getWinner(winnerData.id);
    winner.time = Math.min(winner.time, winnerData.time);
    winner.wins += 1;

    try {
      const result = await this.updateEntity<Winner>(Controller.ENDPOINTS.winners, winner);
      return result;
    } catch {
      const result = await this.createWinner(winner);
      return result;
    }
  }

  public deleteWinner(winnerId: number) {
    this.deleteEntity(Controller.ENDPOINTS.winners, winnerId);
  }

  private async createEntity<T, V>(endpoint: string, viewData: T): Promise<V> {
    const url = buildURL([this.baseUrl, endpoint]);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: RequestMethod.POST,
      body: JSON.stringify(viewData),
    });
    const entity = (await response.json()) as V;
    return entity;
  }

  private async getEntity<T>(endpoint: string, id: number): Promise<T> {
    const url = buildURL([this.baseUrl, endpoint, id.toString()]);
    const response = await fetch(url, {
      method: RequestMethod.GET,
    });
    if (response.status === ResponseStatus.OK) {
      const entity = (await response.json()) as T;
      return entity;
    }
    throw Error('Entity not found');
  }

  private async getEntities<T>(endpoint: string, queryParams?: { [query: string]: string }): Promise<T[]> {
    const url = buildURL([this.baseUrl, endpoint], queryParams);

    const response = await fetch(url, {
      method: RequestMethod.GET,
    });
    const entities = (await response.json()) as T[];

    return entities;
  }

  private async updateEntity<T extends { id: number }>(endpoint: string, data: T): Promise<T> {
    const url = buildURL([this.baseUrl, endpoint, data.id.toString()]);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: RequestMethod.PUT,
      body: JSON.stringify(data),
    });
    if (response.status === ResponseStatus.NotFound) throw Error('Entity not found');
    return (await response.json()) as T;
  }

  private async deleteEntity(endpoint: string, id: number): Promise<void> {
    const url = buildURL([this.baseUrl, endpoint, id.toString()]);
    const response = await fetch(url, {
      method: RequestMethod.DELETE,
    });
    if (response.status === ResponseStatus.NotFound) throw Error('Entity not found');
  }

  private async getEntitiesCount(endpoint: string): Promise<number> {
    const queryParams = {
      _limit: '1',
    };
    const url = buildURL([this.baseUrl, endpoint], queryParams);
    const response = await fetch(url, {
      method: RequestMethod.GET,
    });
    return Number(response.headers.get('X-Total-Count'));
  }
}
