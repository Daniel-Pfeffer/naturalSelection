import express from 'express';
import {Simulation} from "./Entities/Simulation";
import fs from 'fs';
import formidable from 'formidable'
import {Fields, Files} from "formidable";
import {createServer, Server} from "http";
import socketIO = require("socket.io");
import {Socket} from "socket.io";
import {StartConfigs} from "./helper/startConfigs";
import * as bodyParser from "body-parser";
import {log} from "util";

export class SimulationServer {
    public static readonly PORT: number = 3000;
    // ts ignore because why not
    // @ts-ignore
    private app: express.Application;
    // @ts-ignore
    private server: Server;
    // @ts-ignore
    private io: socketIO.Server;
    // @ts-ignore
    private port: string | number;
    private socket: Socket | undefined;
    sim?: Simulation;

    constructor() {
        this.createApp();
        console.log("app start");
        this.config();
        this.createServer();
        this.sockets();
        this.mountRoutes();
    }

    /*
     * create express application
     */
    private createApp(): void {
        this.app = express();
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json())
    }

    /*
     * create http server because why not
     */
    private createServer(): void {
        this.server = createServer(this.app);
    }

    /*
     * set various configs
     */
    private config(): void {
        this.port = process.env.PORT || SimulationServer.PORT;
    }

    /*
    * create socket server
    */
    private sockets(): void {
        this.io = socketIO(this.server);
    }

    /*
     * mount all routes
     */
    public mountRoutes(): void {
        // Set server to listening mode
        this.server.listen(this.port, () => {
            console.log(`Running server on port ${this.port}`)
        });
        // define normal http routes
        const router = express.Router();
        /*
         * GET
         */
        router.get('/', (req, res) => {
            res.json({
                message: "server started"
            })
        });
        router.post('/start', (req, res) => {
            let body = <StartConfigs>req.body;
            this.sim = new Simulation(body);

            this.sim.socket = this.socket;
            res.json(JSON.parse(JSON.stringify(this.sim, this.replacer)));
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
            if (this.sim) {
                this.sim.run(cnt).then().catch(reason => {
                    console.log(reason);
                });
                res.json({
                    message: "Server can now listen to queries"
                });
            } else {
                res.json({
                    message: 'No Simulation started/loaded'
                })
            }
        });
        /*
         * POST
         */
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
        // set socketServer to listen
        this.io.on("connect", (socket: Socket) => {
            console.log('Connected client on port %s.', this.port);
            this.socket = socket;
        });


        // set the app to use the routes on default path
        this.app.use('/', router);

    }

    private replacer(key: string, value: any) {
        if (key === "socket") return undefined;
        else return value;
    }

}

