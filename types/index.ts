import { ObjectId } from "mongoose";

export interface Todo {
  title: string;
  condition: boolean;
  _id: ObjectId;
  index: number;
  position: number;
  moveCard: Function;
}
