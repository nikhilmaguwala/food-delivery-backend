exports.permit = (...permittedRoles) => {

    return (request, response, next) => {
        const { role } = request
        if (role && permittedRoles.includes(role)) {
            next(); // role is allowed, so continue on the next middleware
        } else {
            response.status(403).json({message: "Forbidden"}); // user is forbidden
        }
    }
}
