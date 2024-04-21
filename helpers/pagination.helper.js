module.exports = (objectPagination, query, countRecords) => {
  if(query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  if(query.limit) {
    objectPagination.limitedItem = parseInt(query.limit);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitedItem;

  // calculate total pages
  objectPagination.totalPage = Math.ceil(countRecords/objectPagination.limitedItem);

  return objectPagination;
};