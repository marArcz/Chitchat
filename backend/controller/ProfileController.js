import { body, matchedData, validationResult } from "express-validator";
import AuthUser from "../lib/AuthUser.js";
import User from "../models/User.js";

export const Edit = {
    validator: () => [
        body('_id').notEmpty(),
        body('name').notEmpty(),
        body('username')
            .notEmpty()
            .custom(async (username, { req }) => {
                const existingUser = await User.findOne({ username, _id: { $ne: req.body._id } });

                if (existingUser) {
                    throw new Error('Username is already taken!');
                }
            }),
        body('email')
            .isEmail()


    ],
    handler: async (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const { user } = await AuthUser(req);
            // get validated data
            const { name, username } = matchedData(req);

            user.name = name;
            user.username = username;

            user.save();

            return res.status(200).send(user);
        }
        return res.status(400).send({ errors: errors.mapped() });
    }
}