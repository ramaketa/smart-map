import {Coorditate} from "./field";
import {UserDTO} from "./userDTO";

export class CreateFieldModel {
  name: string;
  backUser: {
    backUserId: number
  };
  coordinateList: Coorditate[];

  constructor(name: string, backUser: UserDTO, coordinateList: Coorditate[]) {
    this.name = name;
    this.backUser = {
      // @ts-ignore
      backUserId: backUser.backUserId,
    };
    this.coordinateList = coordinateList;
  }
}
