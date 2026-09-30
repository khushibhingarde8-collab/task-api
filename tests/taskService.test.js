const taskService = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('create', () => {
    test('should create a task with default values', () => {
      const task = taskService.create({
        title: 'Learn Jest',
      });

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Learn Jest');
      expect(task.description).toBe('');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
      expect(task.createdAt).toBeDefined();
    });
  });

  describe('findById', () => {
    test('should find a task by id', () => {
      const created = taskService.create({
        title: 'Find me',
      });

      const found = taskService.findById(created.id);

      expect(found).toEqual(created);
    });

    test('should return undefined for an unknown id', () => {
      const found = taskService.findById('unknown-id');

      expect(found).toBeUndefined();
    });
  });

  describe('getByStatus', () => {
    test('should return tasks with the requested status', () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'In progress task',
        status: 'in_progress',
      });

      const tasks = taskService.getByStatus('todo');

      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Todo task');
      expect(tasks[0].status).toBe('todo');
    });
  });

  describe('getPaginated', () => {
    test('should return the first page correctly', () => {
      for (let i = 1; i <= 15; i++) {
        taskService.create({
          title: `Task ${i}`,
        });
      }

      const tasks = taskService.getPaginated(1, 10);

      expect(tasks.length).toBe(10);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[9].title).toBe('Task 10');
    });
  });

  describe('update', () => {
    test('should update an existing task', () => {
      const task = taskService.create({
        title: 'Old title',
        status: 'todo',
      });

      const updated = taskService.update(task.id, {
        title: 'New title',
        status: 'in_progress',
      });

      expect(updated.id).toBe(task.id);
      expect(updated.title).toBe('New title');
      expect(updated.status).toBe('in_progress');
    });

    test('should return null for an unknown id', () => {
      const updated = taskService.update('unknown-id', {
        title: 'New title',
      });

      expect(updated).toBeNull();
    });
  });

  describe('remove', () => {
    test('should remove an existing task', () => {
      const task = taskService.create({
        title: 'Delete me',
      });

      const result = taskService.remove(task.id);

      expect(result).toBe(true);
      expect(taskService.findById(task.id)).toBeUndefined();
    });

    test('should return false for an unknown id', () => {
      const result = taskService.remove('unknown-id');

      expect(result).toBe(false);
    });
  });

  describe('completeTask', () => {
    test('should mark a task as completed', () => {
      const task = taskService.create({
        title: 'Complete me',
        status: 'todo',
      });

      const completed = taskService.completeTask(task.id);

      expect(completed.id).toBe(task.id);
      expect(completed.status).toBe('done');
      expect(completed.completedAt).toBeDefined();
    });

    test('should return null for an unknown id', () => {
      const completed = taskService.completeTask('unknown-id');

      expect(completed).toBeNull();
    });
  });

  describe('getStats', () => {
    test('should return task statistics', () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Progress task',
        status: 'in_progress',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const stats = taskService.getStats();

      expect(stats.todo).toBe(1);
      expect(stats.in_progress).toBe(1);
      expect(stats.done).toBe(1);
      expect(stats.overdue).toBe(0);
    });
  });

  describe('assignTask', () => {
    test('should assign a task to an employee', () => {
      const task = taskService.create({
        title: 'Assign me',
      });

      const updated = taskService.assignTask(task.id, 'John');

      expect(updated.id).toBe(task.id);
      expect(updated.assignee).toBe('John');
    });

    test('should return null for an unknown id', () => {
      const updated = taskService.assignTask('unknown-id', 'John');

      expect(updated).toBeNull();
    });
  });
});