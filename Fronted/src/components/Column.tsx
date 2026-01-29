import React from "react";
import type { Task } from "../view/Layout";
import TaskCard from "./TaskCard";

interface ColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  styles: { [key: string]: React.CSSProperties };
}

export default function Column({ title, tasks, color, styles }: ColumnProps) {
  return (
    <section style={styles.column}>
      <h2 style={{ ...styles.columnTitle, borderColor: color }}>
        {title} <span style={styles.count}>{tasks.length}</span>
      </h2>

      <div style={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} styles={styles} />
        ))}
      </div>
    </section>
  );
}
