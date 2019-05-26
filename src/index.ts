import app from "./app/app";


const port = process.env.Port || 3000;

app.listen(port, () => {
    return console.log(`Server is listenong on Port: ${port}`)
});

