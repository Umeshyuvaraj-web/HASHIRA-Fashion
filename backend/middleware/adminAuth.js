const jwt =
    require("jsonwebtoken");


function adminAuth(
    req,
    res,
    next
) {

    try {

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                message:
                    "Admin authentication required."

            });

        }


        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                message:
                    "Invalid token."

            });

        }


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        if (
            decoded.role !==
            "admin"
        ) {

            return res.status(403).json({

                message:
                    "Admin access only."

            });

        }


        req.admin =
            decoded;


        next();

    }

    catch (error) {

        return res.status(401).json({

            message:
                "Invalid or expired admin token."

        });

    }

}


module.exports =
    adminAuth;