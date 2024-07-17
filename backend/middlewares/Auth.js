import AuthUser from "../lib/AuthUser.js";

const Auth = async (req, res, next) => {
    const auth = await AuthUser(req);

    if (auth.authenticated) {
        return next();
    }

    return res.status(401).json({
        success: false,
        ...auth
    })
}

export default Auth;