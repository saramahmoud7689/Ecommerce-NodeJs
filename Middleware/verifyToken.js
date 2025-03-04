import jwt from "jsonwebtoken"

const verifyToken  = (req, res, next) => {

    let authHeader = req.headers["authorization"];
    console.log(authHeader)
    const token = authHeader.split(" ")[1];
    // console.log("token is ", token)
    // console.log(token)
    jwt.verify(token, "secret", async(err, decoaded) => {
        if (err) {
            res.status(401).json({ message: "Invalid token" })
        }else{
            // console.log(decoaded)
            req.user = decoaded
            next()
        }

    })


}

export default verifyToken;