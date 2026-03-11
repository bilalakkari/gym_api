require("dotenv").config();
const fs = require("fs")
const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const { sendPortalEmail } = require("./services/emailService");

app.get("/api/subscriptions", async (req, res) => {
    const subscriptions = await stripe.subscriptions.list({ expand: ["data.customer"] });
    res.json(subscriptions.data);
})

app.post("/api/portal_link", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const customers = await stripe.customers.list({
            email: email,
            limit: 1
        });

        const customer = customers.data[0];

        if (!customer) {
            return res.status(404).json({ message: "Not found" });
        }

        const portal = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: process.env.APP_URL
        });

        // Send email
        await sendPortalEmail(email, portal.url);

        return res.json({ url: portal.url, message: "Email sent with portal link!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT = ${PORT}`);
});

// // (async () => {
// //     const jsonObj = JSON.stringify(subscriptions.data, null, 2);

// //     writeFile(jsonObj);


// // })()

// // const writeFile = (data) => {
// //     fs.writeFile("subscriptions.json", data, (err) => {
// //         if (err) {
// //             console.error("Error writing file: ", file);
// //         }
// //         else {
// //             console.log("subscriptions.json file has been created");
// //         }
// //     })
// // }

// (async () => {


//     // const subscription = await stripe.subscriptions.retrieve('sub_1T9m4KGEbUPRSeVEwRA3atBq');

//     // const customerId = subscription.customer;

//     // const portal = await stripe.billingPortal.sessions.create({
//     //     customer: customerId,
//     //     return_url: "http://localhost:5173"
//     // });

//     const email = 'bilal.akkari101@gmail.com';

//     const customers = await stripe.customers.list({
//         email: email,
//         limit: 1
//     })

//     const customer = customers.data[0];

//     const portal = await stripe.billingPortal.sessions.create({
//         customer: customer.id,
//     });

//     console.log(portal);
// })()