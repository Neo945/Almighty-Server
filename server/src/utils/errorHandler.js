module.exports = {
    errorHandler: async function (req, res, cb) {
        try {
            await cb();
        } catch (err) {
            if (err.errors) {
                const data = Object.values(err.errors);
                const error = [];
                data.forEach((ele) => {
                    error.push(ele.message);
                });
                res.status(403).json({ message: error });
            } else {
                res.status(403).json({ message: err.message });
            }
        }
    },
    errorOHandler: async function (cb) {
        try {
            await cb();
        } catch (err) {
            console.log({ message: err.message });
        }
    },
};
