import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getAllTasks, updateTaskStatus } from "../services/taskService";

import "../styles/layout.css";
import "../styles/KanbanBoard.css";

const STATUSES = [
  { id: "TODO",        label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "COMPLETED",   label: "Completed" },
];

const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const getPriorityClass = (priority) => {
  if (priority === "HIGH")   return "priority-high";
  if (priority === "MEDIUM") return "priority-medium";
  return "priority-low";
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const taskId   = Number(draggableId);
    const newStatus = destination.droppableId;

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success("Task moved");
    } catch {
      toast.error("Failed to update task");
      loadTasks(); // revert on failure
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <h1>Kanban Board</h1>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
              {STATUSES.map(({ id, label }) => {
                const columnTasks = tasks.filter((t) => t.status === id);

                return (
                  <Droppable droppableId={id} key={id}>
                    {(provided, snapshot) => (
                      <div
                        className={`kanban-column${snapshot.isDraggingOver ? " dragging-over" : ""}`}
                        data-status={id}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {/* Column header */}
                        <div className="kanban-column-header">
                          <div className="kanban-column-title">
                            <span className="kanban-column-dot" />
                            {label}
                          </div>
                          <span className="kanban-count">{columnTasks.length}</span>
                        </div>

                        {/* Empty state */}
                        {columnTasks.length === 0 && (
                          <div className="kanban-empty">
                            <span className="kanban-empty-icon">○</span>
                            Drop tasks here
                          </div>
                        )}

                        {/* Task cards */}
                        {columnTasks.map((task, index) => (
                          <Draggable
                            draggableId={task.id.toString()}
                            index={index}
                            key={task.id}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`kanban-card${snapshot.isDragging ? " dragging" : ""}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h3>{task.title}</h3>

                                {task.description && (
                                  <p>{task.description}</p>
                                )}

                                <div className="kanban-card-footer">
                                  {/* Assignee */}
                                  <div className="kanban-assignee">
                                    <div className="kanban-assignee-avatar">
                                      {getInitials(task.assignedToName || task.assignedTo)}
                                    </div>
                                    <span>
                                      {task.assignedToName || task.assignedTo || "Unassigned"}
                                    </span>
                                  </div>

                                  {/* Priority */}
                                  <span className={getPriorityClass(task.priority)}>
                                    {task.priority}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </main>
      </div>
    </>
  );
};

export default KanbanBoard;