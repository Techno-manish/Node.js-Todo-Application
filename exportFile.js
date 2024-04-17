function hasStatus(query) {
  return query.status !== undefined
}

function hasPriority(query) {
  return query.priority !== undefined
}

function hasCategory(query) {
  return query.category !== undefined
}

function hasSearch_q(query) {
  return query.search_q !== undefined
}

function hasTodo(query) {
  return query.todo !== undefined
}

function hasDueDate(query) {
  return query.dueDate !== undefined
}

function hasPriorityAndStatus(query) {
  return query.priority !== undefined && query.status !== undefined
}

function hasCategoryAndStatus(query) {
  return query.category !== undefined && query.status !== undefined
}

function hasCategoryAndPriority(query) {
  return query.category !== undefined && query.priority !== undefined
}

exports.hasStatus = hasStatus
exports.hasCategory = hasCategory
exports.hasPriority = hasPriority
exports.hasSearch_q = hasSearch_q
exports.hasTodo = hasTodo
exports.hasDueDate = hasDueDate
exports.hasPriorityAndStatus = hasPriorityAndStatus
exports.hasCategoryAndStatus = hasCategoryAndStatus
exports.hasCategoryAndPriority = hasCategoryAndPriority
