const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "bloodwave_secret_key";

//////////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////////

app.post("/register", async (req, res) => {

    console.log(req.body);

    const {
        name,
        email,
        password,
        role,
        blood,
        city,
        pincode
    } = req.body;

    try {

        db.query(

            "SELECT * FROM users WHERE email=?",

            [email],

            async (err, result) => {

                if (err) {

                    console.log(err);

                    return res.json({
                        message: "Server Error"
                    });

                }

                if (result.length > 0) {

                    return res.json({
                        message:
                        "Email Already Exists"
                    });

                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                db.query(

                    `INSERT INTO users
                    (name,email,password,role,blood,city,pincode)
                    VALUES (?,?,?,?,?,?,?)`,

                    [
                        name,
                        email,
                        hashedPassword,
                        role,
                        blood,
                        city,
                        pincode
                    ],

                    (err, result) => {

                        if (err) {

                            console.log(err);

                            return res.json({
                                message:
                                "Registration Failed"
                            });

                        }

                        res.json({
                            message:
                            "Registered Successfully"
                        });

                    }

                );

            }

        );

    }

    catch (error) {

        console.log(error);

        res.json({
            message: "Server Error"
        });

    }

});

//////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////

app.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    db.query(

        "SELECT * FROM users WHERE email=?",

        [email],

        async (err, result) => {

            if (err) {

                console.log(err);

                return res.json({
                    message: "Server Error"
                });

            }

            if (result.length === 0) {

                return res.json({
                    message: "User Not Found"
                });

            }

            const user = result[0];

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isMatch) {

                return res.json({
                    message:
                    "Invalid Password"
                });

            }

            const token = jwt.sign(

                {
                    id: user.id,
                    email: user.email
                },

                SECRET_KEY,

                {
                    expiresIn: "1d"
                }

            );

            res.json({

                message:
                "Login Successful",

                token: token,

                user: user

            });

        }

    );

});

//////////////////////////////////////////////////////
// SEARCH DONORS
//////////////////////////////////////////////////////

app.get("/donors", (req, res) => {

    const blood =
        req.query.blood;

    const city =
        req.query.city;

    const pincode =
        req.query.pincode;

    db.query(

        `SELECT * FROM users
         WHERE role='donor'
         AND blood=?
         AND city=?
         AND pincode=?`,

        [blood, city, pincode],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.json({
                    message:
                    "Error fetching donors"
                });

            }

            res.json(result);

        }

    );

});

//////////////////////////////////////////////////////
// FORGOT PASSWORD
//////////////////////////////////////////////////////

app.post("/forgot-password", (req, res) => {

    const { email } = req.body;

    const resetToken =
        Math.random().toString(36).substring(2);

    db.query(

        "UPDATE users SET reset_token=? WHERE email=?",

        [resetToken, email],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.json({
                    message: "Error"
                });

            }

            const transporter =
                nodemailer.createTransport({

                    service: "gmail",

                    auth: {

                        user:
                        "--enter the mail that you wanted to use for bloodwave project private limited--",

                        pass:
                        "--include the google app password you created--from google--"

                    }

                });

            const mailOptions = {

                from:
                "--enter the mail that you wanted to use for bloodwave project private limited--",

                to: email,

                subject:
                "Blood Wave Password Reset",

                text:
`Reset Link:
http://127.0.0.1:5500/reset.html?token=${resetToken}`

            };

            transporter.sendMail(

                mailOptions,

                (error, info) => {

                    if (error) {

                        console.log(error);

                        return res.json({
                            message:
                            "Email Failed"
                        });

                    }

                    res.json({
                        message:
                        "Reset Mail Sent"
                    });

                }

            );

        }

    );

});

//////////////////////////////////////////////////////
// RESET PASSWORD
//////////////////////////////////////////////////////

app.post("/reset-password", async (req, res) => {

    const {
        token,
        password
    } = req.body;

    try {

        const hashedPassword =
            await bcrypt.hash(password, 10);

        db.query(

            `UPDATE users
             SET password=?,
             reset_token=NULL
             WHERE reset_token=?`,

            [hashedPassword, token],

            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.json({
                        message:
                        "Reset Failed"
                    });

                }

                res.json({
                    message:
                    "Password Reset Successful"
                });

            }

        );

    }

    catch (error) {

        console.log(error);

        res.json({
            message:
            "Server Error"
        });

    }

});

//////////////////////////////////////////////////////
// START SERVER
//////////////////////////////////////////////////////

app.listen(3000, () => {

    console.log(
        "Server running on port 3000"
    );

});