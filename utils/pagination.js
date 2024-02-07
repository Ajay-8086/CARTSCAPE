async function paginations(model,req){
    const totalProductsCount =     await  model.countDocuments()
    const totalPage = Math.ceil(totalProductsCount / 10); 
    return {
        page: req.pagination.page,
        limit: req.pagination.limit,
        startIndex: req.pagination.startIndex,
        endIndex: req.pagination.endIndex,
        totalPage: totalPage
    };
     }


     module.exports = paginations