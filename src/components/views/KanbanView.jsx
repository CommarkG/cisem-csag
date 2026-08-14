import React, { useMemo } from 'react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useUIStore } from '../../stores/useUIStore';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { getTasksUnder } from '../../utils/treeHelpers';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/seedData';
import { Plus, GripVertical, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { translations, tValue } from '../../utils/translations';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const LANES = ['backlog', 'todo', 'in_progress', 'review', 'done'];

function KanbanCard({ task, t }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task }
  });
  
  const { openDetailPanel, language } = useUIStore();
  const { getMember } = useCollabStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignee = task.assigneeId ? getMember(task.assigneeId) : null;
  const initials = assignee ? tValue(assignee.name, language).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      onClick={() => openDetailPanel(task.id)}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-1 cursor-grab text-muted" onClick={e => e.stopPropagation()}>
          <GripVertical size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="kanban-card-title">{tValue(task.title, language)}</div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {task.priority && task.priority !== 'none' && (
              <span className={`badge badge-priority-${task.priority}`}>
                {t[task.priority] || PRIORITY_CONFIG[task.priority]?.label}
              </span>
            )}
            {task.labels?.map(label => (
              <span key={label} className="label-tag">
                <Tag size={10} className="mr-1" />
                {tValue(label, language)}
              </span>
            ))}
          </div>

          <div className="kanban-card-meta">
            {task.dueDate ? (
              <div className="flex items-center gap-1 text-xs text-muted">
                <Clock size={12} />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            ) : <div></div>}
            
            {assignee && (
              <div className="avatar avatar-sm" style={{ backgroundColor: assignee.avatar }} title={tValue(assignee.name, language)}>
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanLane({ laneKey, config, tasks, t }) {
  const { setNodeRef } = useDroppable({
    id: laneKey,
    data: {
      type: 'Lane',
      laneKey
    }
  });
  
  const { openAddItemModal, selectedNodeId } = useUIStore();

  return (
    <div className="kanban-lane" ref={setNodeRef}>
      <div className="kanban-lane-header">
        <div className="kanban-lane-title">
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: config.color, display: 'inline-block', marginRight: 6 }} />
          {t[laneKey] || config.label}
        </div>
        <div className="kanban-lane-count">{tasks.length}</div>
      </div>
      
      <SortableContext 
        id={laneKey}
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="kanban-cards">
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} t={t} />
          ))}
        </div>
      </SortableContext>
      
      <button 
        className="btn btn-ghost btn-sm w-full mt-2"
        onClick={() => openAddItemModal(selectedNodeId, 'task')}
      >
        <Plus size={16} /> {t.quickAdd}
      </button>
    </div>
  );
}

export default function KanbanView() {
  const { items, changeStatus } = useTaskStore();
  const { selectedNodeId, filters, language } = useUIStore();
  const { fireEvent } = useNotificationStore();

  const t = translations[language] || translations.en;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const tasks = useMemo(() => {
    let tmp = getTasksUnder(items, selectedNodeId);
    if (filters.status) tmp = tmp.filter(x => x.status === filters.status);
    if (filters.priority) tmp = tmp.filter(x => x.priority === filters.priority);
    if (filters.assigneeId) tmp = tmp.filter(x => x.assigneeId === filters.assigneeId);
    if (filters.label) tmp = tmp.filter(x => x.labels.includes(filters.label));
    return tmp;
  }, [items, selectedNodeId, filters]);

  const [activeTask, setActiveTask] = React.useState(null);

  const handleDragStart = (event) => {
    const { active } = event;
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTaskData = active.data.current?.task;
    if (!activeTaskData) return;

    const isLane = LANES.includes(overId);
    let newStatus = activeTaskData.status;

    if (isLane) {
      newStatus = overId;
    } else {
      const overTaskData = over.data.current?.task;
      if (overTaskData) {
        newStatus = overTaskData.status;
      }
    }

    if (newStatus !== activeTaskData.status) {
      changeStatus(activeId, newStatus);
      fireEvent('status_change', {
        title: 'Task updated',
        message: `Moved to ${STATUS_CONFIG[newStatus]?.label}`,
        taskId: activeId
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <PageGreetingBanner view="kanban" />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {LANES.map(laneKey => {
            const laneTasks = tasks.filter(x => x.status === laneKey);
            return (
              <KanbanLane
                key={laneKey}
                laneKey={laneKey}
                config={STATUS_CONFIG[laneKey]}
                tasks={laneTasks}
                t={t}
              />
            );
          })}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="kanban-card dragging" style={{ width: 280 }}>
              <div className="kanban-card-title">{tValue(activeTask.title, language)}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
