import React, { useState } from 'react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useUIStore } from '../../stores/useUIStore';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import { getTasksUnder } from '../../utils/treeHelpers';
import { STATUS_CONFIG } from '../../utils/seedData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { ru, he } from 'date-fns/locale';
import { translations, tValue } from '../../utils/translations';

const localeMap = { ru, he };

export default function CalendarView() {
  const { items } = useTaskStore();
  const { selectedNodeId, openDetailPanel, filters, language } = useUIStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const t = translations[language] || translations.en;
  const activeLocale = localeMap[language];

  const tasks = getTasksUnder(items, selectedNodeId).filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
    if (filters.label && !task.labels.includes(filters.label)) return false;
    return true;
  });

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Get week days names dynamically based on locale
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = startOfWeek(new Date());
    day.setDate(day.getDate() + i);
    return format(day, 'ccc', { locale: activeLocale });
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  return (
    <div className="flex flex-col h-full gap-4">
      <PageGreetingBanner view="calendar" />
      
      <div className="flex items-center justify-between animate-fade-in" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          {format(currentDate, 'MMMM yyyy', { locale: activeLocale })}
        </h2>
        <div className="flex items-center gap-2" style={{ flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
          <button className="btn btn-secondary btn-sm" onClick={goToday}>
            {language === 'he' ? 'היום' : language === 'ru' ? 'Сегодня' : 'Today'}
          </button>
          <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={20} /></button>
          <button className="btn-icon" onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>
      
      <div className="calendar-grid flex-1">
        {weekDays.map(day => (
          <div key={day} className="calendar-day-header" style={{ textTransform: 'capitalize' }}>{day}</div>
        ))}
        {days.map(day => {
          const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
          return (
            <div 
              key={day.toISOString()} 
              className={`calendar-day ${isSameMonth(day, currentDate) ? '' : 'other-month'} ${isToday(day) ? 'today' : ''}`}
              onClick={() => {}}
            >
              <div className="calendar-day-number">{format(day, 'd')}</div>
              <div className="flex flex-col gap-1">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="calendar-task-dot"
                    style={{ backgroundColor: STATUS_CONFIG[task.status]?.color + '20', color: STATUS_CONFIG[task.status]?.color }}
                    onClick={(e) => { e.stopPropagation(); openDetailPanel(task.id); }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_CONFIG[task.status]?.color }} />
                    <span className="truncate">{tValue(task.title, language)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
