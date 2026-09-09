import mongoose, { Schema } from "mongoose";
import { AvailabeTaskStatues, TaskStatusEnum} from "../utils/constansts.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
        type: String,
        enum : AvailabeTaskStatues,
        default: TaskStatusEnum.TODO
    },
    attachments: {
        type: [{
            url : String,
            mimetype:String,
            size: Number
        }],
    }
  },
  { timestamps: true },
);

export const Tasks = mongoose.model("Task", taskSchema)