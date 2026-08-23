/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PRE-RATIFICATION-LEGACY
# governor_signature: GOV-LEGACY-BASELINE
# status: PRE_RATIFICATION_LEGACY
# reasoning: |
#   File created prior to formal plan ratification governance. Preserved as legacy baseline.
*/
import React from 'react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useUIStore } from '../../stores/useUIStore';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import { getTasksUnder } from '../../utils/treeHelpers';
import { format, addDays, isWeekend, isToday, differenceInDays } from 'date-fns';
import { ru, he } from 'date-fns/locale';
import { translations, tValue } from '../../utils/translations';

const localeMap = { ru, he };

export default function GanttView() {
  const { items } = useTaskStore();
  const { selectedNodeId, openDetailPanel, filters, language } = useUIStore();
  
  const t = translations[language] || translations.en;
  const activeLocale = localeMap[language];

  const tasks = getTasksUnder(items, selectedNodeId).filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
    if (filters.label && !task.labels.includes(filters.label)) return false;
    return true;
  });

  const today = new Date();
  const startDate = addDays(today, -5);
  const days = Array.from({ length: 30 }).map((_, i) => addDays(startDate, i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <PageGreetingBanner view="gantt" />
      
      <div className="gantt-container" style={{ direction: language === 'he' ? 'rtl' : 'ltr' }}>
        <div className="gantt-header">
          <div className="gantt-task-list-header">{t.title}</div>
          <div className="gantt-timeline-header">
            {days.map(day => (
              <div 
                key={day.toISOString()} 
                className={`gantt-day-header ${isWeekend(day) ? 'weekend' : ''} ${isToday(day) ? 'today' : ''}`}
              >
                {format(day, 'dd')}
                <br/>
                <span style={{ textTransform: 'capitalize' }}>
                  {format(day, 'EEEEE', { locale: activeLocale })}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="gantt-body">
          {tasks.length > 0 ? tasks.map(task => {
            let left = 0;
            let width = 0;
            let showBar = false;

            if (task.startDate && task.dueDate) {
              const tStart = new Date(task.startDate);
              const tEnd = new Date(task.dueDate);
              
              const startDiff = differenceInDays(tStart, startDate);
              const duration = differenceInDays(tEnd, tStart) + 1;

              if (startDiff + duration > 0 && startDiff < 30) {
                showBar = true;
                const actualStart = Math.max(0, startDiff);
                const actualEnd = Math.min(30, startDiff + duration);
                
                left = (actualStart / 30) * 100;
                width = ((actualEnd - actualStart) / 30) * 100;
              }
            }

            return (
              <div key={task.id} className="gantt-row">
                <div 
                  className="gantt-task-name cursor-pointer"
                  onClick={() => openDetailPanel(task.id)}
                >
                  {tValue(task.title, language)}
                </div>
                <div className="gantt-timeline">
                  {showBar && (
                    <div 
                      className={`gantt-bar ${task.status === 'done' ? 'done' : ''} ${task.status === 'blocked' ? 'blocked' : ''}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      onClick={() => openDetailPanel(task.id)}
                    >
                      {tValue(task.title, language)}
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="empty-state p-8">
              <div className="empty-state-title">{t.noTasksYet}</div>
              <div className="empty-state-text">{t.createFirstTask}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
