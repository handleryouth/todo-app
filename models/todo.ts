import { Schema, models, model, Types } from "mongoose";
import { Todo } from "types";

const todoSchema = new Schema<Todo>({
  title: {
    type: String,
    required: true,
  },
  condition: {
    type: Boolean,
    required: true,
  },
  _id: {
    type: Types.ObjectId,
    required: true,
  },
});

export default models.Todo || model("Todo", todoSchema);
