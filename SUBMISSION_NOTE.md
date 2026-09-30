# Submission Note

## What I would test next

- Validation for invalid status and priority values.
- Validation for missing or empty task titles.
- Pagination edge cases such as page 0, negative values, and very large limits.
- Concurrent task updates and assignments.
- Task behavior after restarting the application.

## Surprises

- The API was missing the GET /tasks/:id endpoint.
- The pagination logic originally skipped the first page.
- Task data is stored in memory, so it does not persist after the application restarts.

## Production Questions

- What database should be used for persistent task storage?
- What authentication and authorization requirements are expected?
- Should an already-assigned task be allowed to be reassigned?
- What should be the maximum allowed pagination limit?
- Should the valid task status and priority values be documented and standardized?