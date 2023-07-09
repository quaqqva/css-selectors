import { PetElement } from '../app/model/level-data';
import BaseComponent from '../components/base-component';
import Furniture from '../components/furniture/furniture';
import Pet from '../components/pet/pet';
import { Tags } from '../types/dom-types';

describe('furniture', () => {
  const furnitureParams = {
    tag: Tags.Div,
    classes: ['table'],
    name: 'table',
    parent: document.body,
  };

  const pet1: PetElement = {
    tag: 'pig',
    children: [
      {
        tag: 'elephant',
      },
    ],
  };

  const pet2: PetElement = {
    tag: 'giraffe',
  };

  it('adds element to the DOM', () => {
    const furniture = new Furniture(furnitureParams);
    furniture.append(new Pet(pet1));
    furniture.append(new Pet(pet2));

    expect(document.querySelector('.table')).toBeTruthy();
    expect(document.querySelector('.pig')).toBeTruthy();
    expect(document.querySelector('.giraffe')).toBeTruthy();
  });

  it('highlights targets by selector, recreates DOM environment correctly', () => {
    const furniture = new Furniture(furnitureParams);
    furniture.append(new Pet(pet1));
    furniture.append(new Pet(pet2));
    furniture.highlightTargets({ selector: '*', body: new BaseComponent<HTMLElement>({ tag: Tags.Body }) });

    expect(document.querySelector('.table.target')).toBeTruthy();
    expect(document.querySelector('.pig.target')).toBeTruthy();
    expect(document.querySelector('.giraffe.target')).toBeTruthy();
  });
});
