import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

const ActivityCalendar = ({ selectedYear, setSelectedYear, heatmapValues }) => {
  return (
    <div className="activity-calendar">
      <h3>Tevékenység naptár</h3>

      <div className="calendar-fullwidth">
        <CalendarHeatmap
          startDate={new Date(`${selectedYear}-01-01`)}
          endDate={new Date(`${selectedYear}-12-31`)}
          values={heatmapValues}
          classForValue={(value) => {
            if (!value || !value.count) return 'color-empty';
            const count = Math.floor(value.count * 100);
            return count > 20 ? 'color-scale-4' :
              count > 15 ? 'color-scale-3' :
                count > 10 ? 'color-scale-2' :
                  count > 5 ? 'color-scale-1' : 'color-scale-0';
          }}
          tooltipDataAttrs={value => ({
            'data-tip': value.date ?
              `${value.date.toISOString().slice(0, 10)}: ${Math.round(value.count * 100)}%` : ''
          })}
          showWeekdayLabels={true}
          weekdayLabels={['', 'H', '', 'Sze', '', 'P', '']}
          monthLabels={['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec']}
          horizontal={true}
          gutterSize={2}
        />
        <Tooltip />
      </div>

      <div className="year-selector">
        {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).reverse().map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={selectedYear === year ? 'active' : ''}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityCalendar; 