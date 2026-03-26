const Joi=require('joi');

const createExpenseSchema = Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().positive().required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    date: Joi.date().optional()
});

const updateExpenseSchema = Joi.object({
    title: Joi.string().optional(),
    amount: Joi.number().positive().optional(),
    category: Joi.string().optional(),
    description: Joi.string().optional(),
    date: Joi.date().optional()
});

module.exports = {
    createExpenseSchema,
    updateExpenseSchema
};