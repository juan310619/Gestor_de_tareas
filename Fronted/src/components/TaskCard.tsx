import React from "react";
import type { Task } from "../view/Layout";

interface TaskCardProps {
  task: Task;
  styles: { [key: string]: React.CSSProperties };
}

export default function TaskCard({ task, styles }: TaskCardProps) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{task.title}</h3>
      <p style={styles.cardDescription}>{task.description}</p>

      <div style={styles.cardFooter}>
        <span style={styles.category}>{task.category}</span>
      </div>
    </div>
  );
}
