const setQueryByIdListener = (table, router) => {
    router.param('id', async (req, res, next, id) => {
        try {
            req.result = await table.findById(id);
            next();
        } catch(e) {
            res.send(e.message);
        }
    });
}

module.exports = setQueryByIdListener;