import "../styles/filterbar.css";

interface FilterBarProps {
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onDateChange: (startDate: string, endDate: string) => void;
  selectedStatus: string;
  selectedPriority: string;
  selectedStartDate: string;
  selectedEndDate: string;
}

export default function FilterBar({
  onStatusChange,
  onPriorityChange,
  onDateChange,
  selectedStatus,
  selectedPriority,
  selectedStartDate,
  selectedEndDate,
}: FilterBarProps) {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onDateChange(newStartDate, selectedEndDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    onDateChange(selectedStartDate, newEndDate);
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="status-filter">Estado:</label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
        >
          <option value="todos">Todos</option>
          <option value="pending">Por hacer</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completado</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Prioridad:</label>
        <select
          id="priority-filter"
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filter-select"
        >
          <option value="todas">Todas</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="start-date-filter">Desde:</label>
        <input
          type="date"
          id="start-date-filter"
          value={selectedStartDate}
          onChange={handleStartDateChange}
          className="filter-input-date"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="end-date-filter">Hasta:</label>
        <input
          type="date"
          id="end-date-filter"
          value={selectedEndDate}
          onChange={handleEndDateChange}
          className="filter-input-date"
        />
      </div>
    </div>
  );
}
