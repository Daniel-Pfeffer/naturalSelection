import express, {Express} from 'express';

class App {
    express: Express;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    public mountRoutes(): void {
        const router = express.Router();
        router.get('/', ((req, res) => {
            res.json({
                message: "hello world"
            })
        }));
        router.get('/da', (req, res) => {
            res.json({
                message: "hello bitch"
            })

        });
        this.express.use('/', router)
    }
}

export default new App().express
