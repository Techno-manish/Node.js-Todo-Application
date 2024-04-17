const statusArray = ['TO DO', 'IN PROGRESS', 'DONE']
const priorityArray = ['HIGH', 'MEDIUM', 'LOW']
const categoryArray = ['WORK', 'HOME', 'LEARNING']

function checkStatusValue(value) {
  return statusArray.includes(value)
}

function checkPriorityValue(value) {
  return priorityArray.includes(value)
}

function checkCategoryValue(value) {
  return categoryArray.includes(value)
}

function checkPriorityAndStatusValue(priority, status) {
  let val1 = checkPriorityValue(priority)
  let val2 = checkStatusValue(status)
  return val1 === val2
}
function checkPriorityAndCategoryValue(priority, category) {
  let val1 = checkPriorityValue(priority)
  let val2 = checkCategoryValue(category)
  return val1 === val2
}
function checkStatusAndCategoryValue(status, category) {
  let val1 = checkStatusValue(status)
  let val2 = checkCategoryValue(category)
  return val1 === val2
}
function checkStatusPriorityCategoryValue(status, priority, category) {
  let val1 = checkPriorityValue(priority)
  let val2 = checkCategoryValue(category)
  let val3 = checkStatusValue(status)

  return (val1 === val2) === val3
}
// console.log(checkPriorityAndStatusValue("HIGH","TO DO"))
// console.log(checkPriorityAndCategoryValue("HIGH","WORK"))
// console.log(checkStatusAndCategoryValue("DONE","WORK"))
// console.log(checkStatusPriorityCategoryValue("TO DO","HIGH","WORK"))

exports.checkStatusValue = checkStatusValue
exports.checkPriorityValue = checkPriorityValue
exports.checkCategoryValue = checkCategoryValue
exports.checkPriorityAndStatusValue = checkPriorityAndStatusValue
exports.checkPriorityAndCategoryValue = checkPriorityAndCategoryValue
exports.checkStatusAndCategoryValue = checkStatusAndCategoryValue
exports.checkStatusPriorityCategoryValue = checkStatusPriorityCategoryValue
