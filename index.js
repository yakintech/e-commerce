const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;



app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get("/products", (req, res) => {
    let products = [
        {
            id: 1,
            name: "laptop"
        },
        {
            id: 2,
            name: "mobile"
        }
    ];

    return res.json(products);
});


 //


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 });



