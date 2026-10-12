const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

function requireBrowserId(req, res, next) {
  const browserId = req.get("x-browser-id");

  if (!browserId || browserId.length > 100) {
    return res.status(400).json({
      message: "A valid browser ID is required.",
    });
  }

  req.browserId = browserId;
  next();
}

router.use(requireBrowserId);

// GET: Only this browser's tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      browserId: req.browserId,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
});

// POST: Create a task for this browser
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, category, dueDate, completed } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      priority,
      category,
      dueDate: dueDate || null,
      completed,
      browserId: req.browserId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task." });
  }
});

// PATCH: Update only a task owned by this browser
router.patch("/:id", async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      "title",
      "description",
      "priority",
      "category",
      "dueDate",
      "completed",
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (typeof updates.title === "string") {
      updates.title = updates.title.trim();
      if (!updates.title) {
        return res.status(400).json({ message: "Task title is required." });
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, browserId: req.browserId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(task);
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: "Failed to update task." });
  }
});

// DELETE: Delete only a task owned by this browser
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      browserId: req.browserId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
  }  catch (error) {
  console.error("Task creation failed:", error);

  res.status(500).json({
    message: "Failed to create task.",
  });
}
});

module.exports = router;