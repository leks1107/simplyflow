const validateRequest = (data) => {
    const { email, city, interest } = data;

    if (!email || !city || !interest) {
        return { valid: false, reason: 'Missing required fields' };
    }

    if (city !== 'New York') {
        return { valid: false, reason: 'City is not New York' };
    }

    return { valid: true };
};

module.exports = {
    validateRequest,
};