import { PetElement } from '../app/model/level-data';

type InputParams = {
  couchPets?: PetElement[];
  tablePets?: PetElement[];
  floorPets?: PetElement[];
  selector: string;
  solution: string;
};

export default function validateSelector({
  couchPets,
  tablePets,
  floorPets,
  selector,
  solution,
}: InputParams): boolean {
  return true;
}
