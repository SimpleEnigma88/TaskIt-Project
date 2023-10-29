export interface KanbanCard {
  id?: number;
  name: string;
  dueDate: Date;
  priority: string;
  status: string;
  description?: string;
}
