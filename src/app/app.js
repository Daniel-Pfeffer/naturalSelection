"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Simulation_1 = require("./Entities/Simulation");
const fs_1 = __importDefault(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
class App {
    constructor() {
        this.express = express_1.default();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express_1.default.Router();
        router.get('/', (req, res) => {
            res.json({
                message: "server started"
            });
        });
        router.get('/start', (req, res) => {
            this.sim = new Simulation_1.Simulation();
            res.json(this.sim);
        });
        router.get('/save', (req, res) => {
            fs_1.default.writeFile('save.json', JSON.stringify(this.sim), (err => {
                if (err) {
                    res.json({
                        status: 400
                    });
                }
                else {
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
                    });
                }, () => {
                    res.json({
                        message: 'Rejected because of error'
                    });
                });
            }
            else {
                res.json({
                    message: 'No Simulation started/loaded'
                });
            }
        });
        router.post('/load', (req, res) => {
            let incomingForm = new formidable_1.default.IncomingForm;
            incomingForm.parse(req, (err, fields, files) => {
                fs_1.default.readFile(files.json.path, (err1, data) => {
                    if (!err1) {
                        this.sim = JSON.parse(data.toString('utf-8'));
                        res.json({
                            message: "Simulation loaded. Please consider socketforking"
                        });
                    }
                    else {
                        res.json({
                            message: "Simulation loading failed. Please consider Toasterbath"
                        });
                    }
                });
            });
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;
