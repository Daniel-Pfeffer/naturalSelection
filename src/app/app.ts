import express, {Express} from 'express';
import {Simulation} from "./Entities/Simulation";
import fs from 'fs';
import formidable from 'formidable'
import {Fields, Files} from "formidable";

class App {
    express: Express;
    sim?: Simulation;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    public mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: "server started"
            })
        });
        router.get('/start', (req, res) => {
            this.sim = new Simulation();
            res.json(this.sim);
        });
        router.get('/save', (req, res) => {
            fs.writeFile('save.json', JSON.stringify(this.sim), (err => {
                if (err) {
                    res.json({
                        status: 400
                    });
                } else {
                    res.download('save.json');
                }
            }));
        });

        router.get('/run/:cnt', (req, res) => {
            let cnt = req.params.cnt;
            console.log(cnt);
            if (this.sim) {
                this.sim.run(cnt).then(() => {
                    res.json({
                        message: `${cnt} generations finished`
                    })
                }, () => {
                    res.json({
                        message: 'Rejected because of error'
                    })
                });
            } else {
                res.json({
                    message: 'No Simulation started/loaded'
                })
            }
        });
        router.post('/load', (req, res) => {
            let incomingForm = new formidable.IncomingForm;
            incomingForm.parse(req, (err: any, fields: Fields, files: Files) => {
                fs.readFile(files.json.path, (err1, data) => {
                    if (!err1) {
                        this.sim = JSON.parse(data.toString('utf-8'));
                        res.json({
                            message: "Simulation loaded. Please consider socketforking"
                        })
                    } else {
                        res.json({
                            message: "Simulation loading failed. Please consider Toasterbath"
                        })
                    }
                })
            })
        });
        this.express.use('/', router)
    }
}

export default new App().express
