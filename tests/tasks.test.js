const request = require('supertest');
const app = require('../src/app');

describe('POST /tasks', () => {
  test('should create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Learn Node.js',
        description: 'Study Express and Jest',
        status: 'todo',
        priority: 'high',
        dueDate: null,
      });

    expect(response.status).toBe(201);

    expect(response.body.title).toBe('Learn Node.js');
    expect(response.body.description).toBe('Study Express and Jest');
    expect(response.body.status).toBe('todo');
    expect(response.body.priority).toBe('high');

    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.completedAt).toBeNull();
  });
});

describe('GET /tasks', () => {
  test('should return all tasks', async () => {
    const response = await request(app)
      .get('/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should filter tasks by status', async () => {
    const response = await request(app)
      .get('/tasks?status=todo');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((task) => {
      expect(task.status).toBe('todo');
    });
  });
});

describe('GET /tasks pagination', () => {
  test('should return paginated tasks', async () => {
    const response = await request(app)
      .get('/tasks?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(10);
  });
});

describe('GET /tasks/:id', () => {
  test('should return a task by id', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        description: 'Task for GET by ID',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      });

    const taskId = createResponse.body.id;

    const response = await request(app)
      .get(`/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe('Test Task');
  });

  test('should return 404 when task does not exist', async () => {
    const response = await request(app)
      .get('/tasks/99999');

    expect(response.status).toBe(404);
  });
});

describe('PUT /tasks/:id', () => {
  test('should update an existing task', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Original Task',
        description: 'Original description',
        status: 'todo',
        priority: 'low',
        dueDate: null,
      });

    const taskId = createResponse.body.id;

    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        status: 'in_progress',
        priority: 'high',
        dueDate: null,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.title).toBe('Updated Task');
    expect(response.body.description).toBe('Updated description');
    expect(response.body.status).toBe('in_progress');
    expect(response.body.priority).toBe('high');
  });

  test('should return 404 when updating a nonexistent task', async () => {
    const response = await request(app)
      .put('/tasks/99999')
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  test('should delete an existing task', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Task to Delete',
        description: 'This task will be deleted',
        status: 'todo',
        priority: 'low',
        dueDate: null,
      });

    const taskId = createResponse.body.id;

    const response = await request(app)
      .delete(`/tasks/${taskId}`);

    expect(response.status).toBe(204);
  });

  test('should return 404 when deleting a nonexistent task', async () => {
    const response = await request(app)
      .delete('/tasks/99999');

    expect(response.status).toBe(404);
  });
});

describe('PATCH /tasks/:id/complete', () => {
  test('should mark an existing task as completed', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Task to Complete',
        description: 'This task will be completed',
        status: 'todo',
        priority: 'high',
        dueDate: null,
      });

    const taskId = createResponse.body.id;

    const response = await request(app)
      .patch(`/tasks/${taskId}/complete`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.status).toBe('done');
    expect(response.body.completedAt).toBeDefined();
  });

  test('should return 404 when completing a nonexistent task', async () => {
    const response = await request(app)
      .patch('/tasks/99999/complete');

    expect(response.status).toBe(404);
  });
});

describe('GET /tasks/stats', () => {
  test('should return task statistics', async () => {
    const response = await request(app)
      .get('/tasks/stats');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe('object');
  });
});

describe('PATCH /tasks/:id/assign', () => {
  test('should assign a task to an employee', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Assignment Task',
        description: 'Test assignment',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      });

    const taskId = createResponse.body.id;

    const response = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: 'John',
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(taskId);
    expect(response.body.assignee).toBe('John');
  });

  test('should return 400 for an empty assignee', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Assignment Task',
        description: 'Test assignment',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      });

    const taskId = createResponse.body.id;

    const response = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: '',
      });

    expect(response.status).toBe(400);
  });

  test('should return 404 for a nonexistent task', async () => {
    const response = await request(app)
      .patch('/tasks/99999/assign')
      .send({
        assignee: 'John',
      });

    expect(response.status).toBe(404);
  });

  test('should return 400 when task is already assigned', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Already Assigned Task',
        description: 'Test existing assignment',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      });

    const taskId = createResponse.body.id;

    // First assignment should succeed
    const firstResponse = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: 'John',
      });

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body.assignee).toBe('John');

    // Second assignment should fail
    const secondResponse = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: 'Jane',
      });

    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body.error).toBe('Task already assigned');
  });
});