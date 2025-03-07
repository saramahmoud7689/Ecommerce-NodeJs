import productValidationSchema from "../Utiles/proudctValidation";
export const validateProudct = (req, res, next) => {
    const validation = productValidationSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        return res.status(400).json({
            errors: validation.error.details.map((err) => err.message)
        })
    }
    next()
}