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
    case "GET":
      try {
        const data = await todo.find();
        res.status(200).json({ success: true, data: data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const { id, condition } = req.body;
        const data = await (condition
          ? todo.findByIdAndDelete(id)
          : todo.deleteMany({
              condition: true,
            }));
        res.status(200).json({ success: true, deleted: data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PATCH":
      try {
        const data = await todo.updateOne(
          { _id: new Types.ObjectId(req.body.id) },
          {
            $set: {
              condition: req.body.condition,
            },
          }
        );
        res.status(201).json({ success: true, data: data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const data = await todo.create<Todo>({
          ...req.body,
          condition: false,
          _id: new Types.ObjectId(),
        });
        res.status(201).json({ success: true, created: data });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const createBack = await todo.insertMany(
          req.body.map((item: Todo) => {
            return { ...item, _id: new Types.ObjectId() };
          })
        );
        res.status(201).json({ success: true, created: createBack });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
