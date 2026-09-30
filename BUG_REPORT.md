# BUG_REPORT

# BUG 1 — missing endpoint for getting one task

# Description

There is no endpoint for getting one task via GET /tasks/:id .

# Expected behavior

When sending GET /tasks/:id , it should return the task with the given id and status code 200 if it exists.

# Actual behavior

It returned status code 404 because this route was not implemented.

# Fix

We added a route to handle GET /tasks/:id requests with taskService.findById() .

---

# BUG 2 — incorrect pagination offset

# Description

When implementing pagination, we used page limit as an offset.

# Expected behavior

Page 1 should return the first set of records.

# Actual behavior

Page 1 skipped the first limit records.

# Fix

We changed the offset to (page - 1) limit so that the pages are numbered correctly from 1.