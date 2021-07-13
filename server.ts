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
	})
	.catch((error) => {
		console.log("3306: [ERROR]　Database error");
		console.log(`ERROR: ${error}`);
	});
