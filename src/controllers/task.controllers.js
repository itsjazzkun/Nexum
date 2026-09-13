import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!isValidObjectId(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  })
    .populate("assignedTo", "avatar username fullName")
    .populate("assignedBy", "avatar username fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  if (!isValidObjectId(projectId)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (!title?.trim()) {
    throw new ApiError(400, "Task title is required");
  }

  if (assignedTo && !isValidObjectId(assignedTo)) {
    throw new ApiError(400, "Invalid assigned user ID");
  }

  const files = req.files || [];

  const attachments = files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.filename || file.originalname}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  const task = await Task.create({
    title: title.trim(),
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo:
      assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "avatar username fullName")
    .populate("assignedBy", "avatar username fullName");

  return res
    .status(201)
    .json(new ApiResponse(201, populatedTask, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "assignedBy",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
        assignedBy: {
          $arrayElemAt: ["$assignedBy", 0],
        },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;

  if (!isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const updateData = {};

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, "Task title cannot be empty");
    }

    updateData.title = title.trim();
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  if (assignedTo !== undefined) {
    if (assignedTo === null || assignedTo === "") {
      updateData.assignedTo = null;
    } else {
      if (!isValidObjectId(assignedTo)) {
        throw new ApiError(400, "Invalid assigned user ID");
      }

      const user = await User.findById(assignedTo);

      if (!user) {
        throw new ApiError(404, "Assigned user not found");
      }

      updateData.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    }
  }

  if (req.files?.length) {
    const newAttachments = req.files.map((file) => ({
      url: `${process.env.SERVER_URL}/images/${file.filename || file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    }));

    updateData.attachments = [...(task.attachments || []), ...newAttachments];
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("assignedTo", "avatar username fullName")
    .populate("assignedBy", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Delete all subtasks belonging to the task first.
  await Subtask.deleteMany({
    task: new mongoose.Types.ObjectId(taskId),
  });

  await Task.findByIdAndDelete(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const { taskId } = req.params;

  if (!isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (!title?.trim()) {
    throw new ApiError(400, "Subtask title is required");
  }

  const subtask = await Subtask.create({
    title: title.trim(),
    description,
    task: new mongoose.Types.ObjectId(taskId),
    status,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  const populatedSubtask = await Subtask.findById(subtask._id).populate(
    "createdBy",
    "avatar username fullName",
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedSubtask, "Subtask created successfully"),
    );
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const { title, description, status } = req.body;

  if (!isValidObjectId(subtaskId)) {
    throw new ApiError(400, "Invalid subtask ID");
  }

  const subtask = await Subtask.findById(subtaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const updateData = {};

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, "Subtask title cannot be empty");
    }

    updateData.title = title.trim();
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  const updatedSubtask = await Subtask.findByIdAndUpdate(
    subtaskId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate("createdBy", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubtask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;

  if (!isValidObjectId(subtaskId)) {
    throw new ApiError(400, "Invalid subtask ID");
  }

  const subtask = await Subtask.findById(subtaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  await Subtask.findByIdAndDelete(subtaskId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subtask deleted successfully"));
});

export {
  createSubTask,
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
