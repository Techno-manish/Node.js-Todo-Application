const express = require('express')
const path = require('path')
const format = require('date-fns/format')
const isValid = require('date-fns/isValid')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const {
  hasStatus,
  hasPriority,
  hasCategory,
  hasSearch_q,
  hasDueDate,
  hasTodo,
  hasPriorityAndStatus,
  hasCategoryAndStatus,
  hasCategoryAndPriority,
} = require('./exportFile.js')
const {
  checkStatusValue,
  checkPriorityValue,
  checkCategoryValue,
  checkPriorityAndStatusValue,
  checkStatusAndCategoryValue,
  checkPriorityAndCategoryValue,
  checkStatusPriorityCategoryValue,
} = require('./checkValue.js')
const convertDBtoResponse = require('./DBobjectToResponse')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'todoApplication.db')

db = null
const PORT = 3000
const initializeDBabdServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`)
    })
  } catch (e) {
    console.log(`ERROR: ${e}`)
    process.exit(1)
  }
}
initializeDBabdServer()

//API 1
app.get('/todos/', async (request, response) => {
  let data = null
  let getTodosQuery = ''
  const {search_q = '', priority, status, category} = request.query
  switch (true) {
    case hasStatus(request.query):
      if (checkStatusValue(status)) {
        getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%'
          AND status = '${status}';`
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
        return
      }
      break
    case hasPriority(request.query):
      if (checkPriorityValue(priority)) {
        getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%'
          AND priority = '${priority}';`
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
        return
      }
      break
    case hasCategory(request.query):
      if (checkCategoryValue(category)) {
        getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%'
          AND category = '${category}';`
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
        return
      }
      break
    case hasSearch_q(request.query):
      getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%';`
      break
    case hasPriorityAndStatus(request.query):
      if (checkPriorityAndStatusValue(priority, status)) {
        getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%
          AND priority = '${priority} AND status = "${status}"`
      } else {
        if (!checkPriorityValue(priority)) {
          response.status(400)
          response.send('Invalid Todo Priority')
          return
        }
        if (!checkStatusValue(status)) {
          response.status(400)
          response.send('Invalid Todo Status')
          return
        }
      }
      break
    case hasCategoryAndPriority(request.query):
      if (checkPriorityAndCategoryValue(priority, category)) {
        getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%
          AND priority = '${priority} AND category = "${category}"`
      } else {
        if (!checkPriorityValue(priority)) {
          response.status(400)
          response.send('Invalid Todo Priority')
          return
        }
        if (!checkCategoryValue(status)) {
          response.status(400)
          response.send('Invalid Todo Category')
          return
        }
      }
      break
    case hasCategoryAndStatus(request.query):
      if (checkStatusAndCategoryValue(status, category)) {
        getTodosQuery = `
        SELECT
          *
        FROM
          todo 
        WHERE
          todo LIKE '%${search_q}%
          AND status = '${status} AND category = "${category}"`
      } else {
        if (!checkStatusValue(status)) {
          response.status(400)
          response.send('Invalid Todo Status')
          return
        }
        if (!checkCategoryValue(status)) {
          response.status(400)
          response.send('Invalid Todo Category')
          return
        }
      }
  }
  data = await db.all(getTodosQuery)
  response.send(data.map(each => convertDBtoResponse(each)))
})

//API 2 Returns a specific todo based on the todo ID
app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getTodoQuery = `
  SELECT
    *
  FROM
    todo
  WHERE
    id = ${todoId};
  `
  const data = await db.get(getTodoQuery)
  response.send(convertDBtoResponse(data))
})

//API 3 Returns a list of all todos with a specific due date in the query parameter /agenda/?date=2021-12-12
app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  if (isValid(new Date(date))) {
    const newDate = format(new Date(date), 'yyyy-MM-dd')
    // console.log(newDate)
    const getTodoQuery = `
    SELECT 
      *
    FROM
      todo
    WHERE
      due_Date = '${newDate}';
    `
    const data = await db.all(getTodoQuery)
    response.send(data.map(each => convertDBtoResponse(each)))
  } else {
    response.status(400)
    response.send('Invalid Due Date')
  }
})

//API 4 Create a todo in the todo table
app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body
  // Validate status
  if (!checkStatusValue(status)) {
    response.status(400)
    response.send('Invalid Todo Status')
    return
  }
  // Validate priority
  if (!checkPriorityValue(priority)) {
    response.status(400)
    response.send('Invalid Todo Priority')
    return
  }
  // Validate category
  if (!checkCategoryValue(category)) {
    response.status(400)
    response.send('Invalid Todo Category')
    return
  }
  // Validate due date
  if (!isValid(new Date(dueDate))) {
    response.status(400)
    response.send('Invalid Due Date')
    return
  }
  // Insert into the database
  try {
    const newDate = format(new Date(dueDate), 'yyyy-MM-dd')
    const createTodoQuery = `
      INSERT INTO
        todo(id, todo, category, priority, status, due_date)
      VALUES
        (${id}, '${todo}', '${category}', '${priority}', '${status}', '${newDate}');
    `
    await db.run(createTodoQuery)
    response.send('Todo Successfully Added')
  } catch (error) {
    response.status(500)
    response.send('Internal Server Error')
  }
})

//API 5 Updates the details of a specific todo based on the todo ID
app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const todoDetails = request.body
  const {status, priority, todo, category, dueDate} = todoDetails
  let updateTodoQuery = ''
  switch (true) {
    case hasStatus(todoDetails):
      console.log(status)
      if (checkStatusValue(status)) {
        updateTodoQuery = `
        UPDATE 
          todo
        SET
          status = '${status}'
        WHERE
          id = ${todoId};
      `
        await db.run(updateTodoQuery)
        response.send('Status Updated')
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break
    case hasPriority(todoDetails):
      if (checkPriorityValue(priority)) {
        updateTodoQuery = `
        UPDATE 
          todo
        SET
          priority = '${priority}'
        WHERE
          id = ${todoId};
      `
        await db.run(updateTodoQuery)
        response.send('Priority Updated')
      } else {
        response.status(400)
        response.send('Invalid Todo Priority')
      }
      break
    case hasTodo(todoDetails):
      updateTodoQuery = `
        UPDATE 
          todo
        SET
          todo = '${todo}'
        WHERE
          id = ${todoId};
      `
      await db.run(updateTodoQuery)
      response.send('Todo Updated')
      break
    case hasCategory(todoDetails):
      if (checkCategoryValue(category)) {
        updateTodoQuery = `
        UPDATE 
          todo
        SET
          category = '${category}'
        WHERE
          id = ${todoId};
      `
        await db.run(updateTodoQuery)
        response.send('Category Updated')
      } else {
        response.status(400)
        response.send('Invalid Todo Category')
      }
      break
    case hasDueDate(todoDetails):
      if (isValid(new Date(dueDate))) {
        const newDate = format(new Date(dueDate), 'yyyy-MM-dd')
        updateTodoQuery = `
        UPDATE 
          todo
        SET
          due_date = '${newDate}'
        WHERE
          id = ${todoId};
      `
        await db.run(updateTodoQuery)
        response.send('Due Date Updated')
      } else {
        response.status(400)
        response.send('Invalid Due Date')
      }
  }
})

//API 6 Deletes a todo from the todo table based on the todo ID
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId}
  `
  await db.run(deleteTodoQuery)
  response.send('Todo Deleted')
})

module.exports = app
