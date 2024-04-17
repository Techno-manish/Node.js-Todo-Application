function convertDBtoResponse(DBobject) {
  return {
    id: DBobject.id,
    todo: DBobject.todo,
    priority: DBobject.priority,
    status: DBobject.status,
    category: DBobject.category,
    dueDate: DBobject.due_date,
  }
}

module.exports = convertDBtoResponse
