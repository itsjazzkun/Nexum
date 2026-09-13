import { body } from "express-validator";
import {AvailableUserRole} from "../utils/constants.js";        
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


const userChangeCurrentPasswordValidator = () => {
    return [
      body("oldPassword").notEmpty().withMessage("Old password is required"),
      body("newPassword").notEmpty().withMessage("New password is required"),
    ];
}

const userForgotPasswordValidator = () =>{
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invaild"),
    ];
};

const userResetForgotPasswordValidator = () => {
   return [
    body("NewPassword").notEmpty().withMessage("Password is required")
    ];
};

const createProjectValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Project name is required"),
            body("description")
            .optional()
            .trim()
    ];
};
const addMemberToProjectValidator = () => {
    return [
        body("email")
            .trim() 
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
            body ("role")
            .trim()
            .notEmpty()
            .withMessage("Role is required")
            .isIn(AvailableUserRole)
            .withMessage(`Role must be one of the following: ${AvailableUserRole.join(", ")}`)

    ];
};
export {
    userRegisterValidator, 
    userLoginValidator ,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator
};