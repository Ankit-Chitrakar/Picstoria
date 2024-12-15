const validateSortingOrder = (sort) => {
    const errors = [];
    const validOrders = ['ASC', 'DESC'];

    if (!validOrders.includes(sort.toUpperCase())) {
        errors.push({ msg: `Invalid sort order. Use 'ASC' or 'DESC'.` });
    }

    return errors;
};

module.exports = {
    validateSortingOrder,
};
