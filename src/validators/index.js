import { body } from "express-validator";
const userRegisterValidator = () => {

    return[
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invaid please enter a vaild email"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLowercase()
        .withMessage("username must be in lower case")
        .isLength({min:3})
        .withMessage("username must atleast 3 characters long"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
    body("Full Name")
    .optional()
    .trim()

    ];
}

const userLoginValidator = () => {
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage("email is invalid"),
        body("password")
        .notEmpty()
        .withMessage("password is required"),
    ];
}





export { userRegisterValidator, userLoginValidator };