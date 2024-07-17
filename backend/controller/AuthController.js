import { body, matchedData, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import asyncHandler from 'express-async-handler';
import jwtToken from 'jsonwebtoken'
import expressAsyncHandler from "express-async-handler";
import AuthUser from "../lib/AuthUser.js";

export const registerUser = {
    // validate request body for valid inputs
    validator: () => [
        body('name').notEmpty(),
        body('email')
            .isEmail()
            .custom(async (email) => {
                const user = await User.findOne({ email });

                if (user) {
                    throw new Error('E-mail is already taken!');
                }
            }),
        body('password')
            .notEmpty()
            .isLength({ min: 8 }),
        body('passwordConfirmation').custom((value, { req }) => {
            if(value !== req.body.password){
                throw new Error('Password does not match!');
            }
            else{
                return true;
            }
        }),
    ],
    // handler of the request
    handler: expressAsyncHandler(async (req, res) => {
        const result = validationResult(req);

        // if no validation error, proceed to create user
        if (result.isEmpty()) {
            const { name, email, password } = matchedData(req);
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt)

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });
            //save new user to db
            await newUser.save();
            // generate token
            const token = jwtToken.sign({ id: newUser._id }, process.env.JWT_TOKEN_SECRET);
            // set token as cookie
            res.cookie(process.env.TOKEN_NAME, token, {
                withCredentials: true,
                httpOnly: false,
            });

            return res.json({
                token,
                user: newUser
            })
        }

        return res.status(400).send({ errors: result.mapped() });
    })
}


export const login = {
    validator: () => [
        body('email').notEmpty().isEmail(),
        body('password').notEmpty().trim(),
    ],
    handler: asyncHandler(async (req, res) => {
        const result = validationResult(req);

        if (result.isEmpty()) {
            const { email, password } = matchedData(req)
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Sorry no matching account is found!'
                })
            }

            const passwordMatched = await bcrypt.compare(password, user.password);
            if (passwordMatched) {
                const token = jwtToken.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET);
                // set token as cookie
                res.cookie(process.env.TOKEN_NAME, token, {
                    withCredentials: true,
                    httpOnly: false,
                });

                return res.json({
                    token,
                    user
                })
            }

            // send message that password is incorrect
            return res.status(401).json({
                message: 'Sorry you entered an incorrect password!'
            })
        }

        return res.status(400).send({ errors: result.mapped() });
    })
}

export const getAccount = async (req, res) => {
    const auth = await AuthUser(req);

    if (auth.authenticated) {
        return res.json(auth);
    }

    return res.status(401).json(auth);
}