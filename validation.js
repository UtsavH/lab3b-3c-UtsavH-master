import Joi from 'joi';

export function validatePerson(person) {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(30).required(),
        last_name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        job_title: Joi.string().valid('Structural Engineer', 'Chief Design Engineer', 'Desktop Support Technician', 'Sales Associate').optional()
    });

    return schema.validate(person,{abortEarly: false});
}
