export function createListResult(resource, req, count, items) {
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);

  items.forEach((it, index) => {
    items[index] = {
      data: it
    }
  });

  if (page) {
    let totalPage = Math.ceil(count / pageSize);
    page = page < 1 ? 1 : page > totalPage ? totalPage : page;

    return {
      items: items,
      meta: {
        type: "collection",
        totalItems: count || 0,
        totalPages: totalPage,
        currentPage: page,
        resource,
      }
    }
  } else {
    return {
      items: items,
      meta: {
        type: "collection",
        totalItems: count || 0,
        resource,
      }
    }
  }
}
