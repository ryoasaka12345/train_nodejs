import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
// import { AppRoutes } from "./routes";

const ormOptions: any = {
	type: "mysql",
	host: "localhost",
	port: "3306",
	username: "root",
	password: "12345",
	database: "test",
	timezone: "Z",
	logging: ["query", "error"],
	entities: ["entity/**/*.ts"],
	migrations: ["migration/**/*.ts"],
	migrationsRun: true,
};

createConnection(ormOptions)
	.then((value) => {
		console.log("3306: [SUECESS] Database connected!");
		// create express app
		const app = express();
		app.use(bodyParser.json());

		// Routes Definitions
		app.get("/", (req, res) => {
			res.status(200).send("Hi!. My name is Ryo");
		});

		// run app
		app.listen(3000);

		console.log("Express application is upp and runnnig on port 3000");
	})
	.catch((error) => {
		console.log("3306: [ERROR]　Database error");
		console.log(`ERROR: ${error}`);
	});
