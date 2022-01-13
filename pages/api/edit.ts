import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import todo from "models/todo";
import { Types } from "mongoose";
import { Todo } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const data = await todo.deleteMany({});
        res.status(200).json({ success: true, deleted: data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        for (let i = 0; i < req.body.data.length; i++) {
          await todo.create<Todo>({
            ...req.body.data[i],
            condition: false,
            _id: new Types.ObjectId(),
          });
        }
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
