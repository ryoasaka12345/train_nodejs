import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
// import { AppRoutes } from "./routes";
import { getManager } from "typeorm";
import { User } from "./entity/User";
import * as jwt from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";
import { isDataView } from "util/types";
import { URLSearchParams } from "url";
import { PassThrough } from "stream";

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
		const TOKEN_SECRET =
			"5f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4";
		app.use(bodyParser.json());
		function generateAccessToken(email) {
			return jwt.sign(email, TOKEN_SECRET, { expiresIn: "1800s" });
		}
		function authenticateToken(req, res, next) {
			const authHeader = req.headers["authorization"];
			const token = authHeader && authHeader.split(" ")[1];

			if (token == null) return res.sendStatus(401);

			jwt.verify(token, TOKEN_SECRET as string, (err: any, user: any) => {
				console.log(err);

				if (err) return res.sendStatus(403);

				req.user = user;

				next();
			});
		}

		// Routes Definitions
		app.post("/login", async (req, res) => {
			const userRepository = getManager().getRepository(User);

			// load a user by email and password
			const user = await userRepository.find({
				where: {
					email: req.body.email,
					password: req.body.password,
				},
			});
			// return 403 if user is not wxisting
			if (!user || user.length === 0) {
				res.sendStatus(403);
			}

			// generate token and return to client
			const token = generateAccessToken({ email: req.body.email });
			res.json(token);
		});

		app.get("/", (req, res) => {
			res.status(200).send("Hi!. My name is Ryo");
		});

		app.get("/listUsers", authenticateToken, async function (req, res) {
			// get a user repository to perform operations with user
			const userRepository = getManager().getRepository(User);

			const users = await userRepository.find(); // wait for process until results are returned.

			// return loaded users
			res.send(users);
		});

		app.post("/addUser", async function (req, res) {
			// Prepare output in JSON format
			const user = {
				email: req.body.email,
				name: req.body.name,
				password: req.body.password,
				profession: req.body.profession,
			};

			// get a user repository to perform operations with user
			const userRepository = getManager().getRepository(User);
			// load a user by email and password
			const existingUser = await userRepository.find({
				where: {
					email: req.body.email,
					password: req.body.password,
				},
			});
			// return msg if user is existing
			if (existingUser && existingUser.length > 0) {
				res.send("Email is existing. Prease input another email!");
				return;
			}
			const users = await userRepository.save(user);

			// return loaded users
			res.send(users);
		});

		app.get("/:id", async function (req, res) {
			// First read existing users.
			// get a user repository to perform operations with user
			const userRepository = getManager().getRepository(User);

			// load a user by a given user id
			const user = await userRepository.findOne(+req.params.id);

			// if user was not found return 404 to the client
			if (!user) {
				res.status(404);
				res.end();
				return;
			}

			// return loaded user
			res.send(user);
		});

		app.delete("/:id", async function (req, res) {
			// First read existing users.
			// get a user repository to perform operations with user
			const userRepository = getManager().getRepository(User);

			const existingUser = await userRepository.find({
				where: {
					id: req.params.id,
				},
			});
			console.log("exisstingUser:", existingUser);
			if (existingUser && existingUser.length == 0) {
				res.send("User is not existing");
				return;
			}

			userRepository.delete(req.params.id);
			res.end();
			return;
		});

		// update user data
		app.put("/:id", async function (req, res) {
			const userRepository = getManager().getRepository(User);

			const existingUser = await userRepository.find({
				where: {
					id: req.params.id,
				},
			});
			if (existingUser && existingUser.length == 0) {
				res.send("User is not existing");
				return;
			}

			const user = {
				email: req.body.email,
				name: req.body.name,
				password: req.body.password,
				profession: req.body.profession,
			};

			const updatedUser = await userRepository.update(req.params.id, user);
			res.send(updatedUser);
		});

		// partial update user data
		app.patch("/:id", async function (req, res) {
			const userRepository = getManager().getRepository(User);

			const existingUser = await userRepository.find({
				where: {
					id: req.params.id,
				},
			});
			if (existingUser && existingUser.length == 0) {
				res.send("User is not existing");
				return;
			}
			console.log(Object.assign({ id: Number(req.params.id) }, req.body));
			const result = await userRepository.save(
				Object.assign({ id: Number(req.params.id) }, req.body)
			);
			res.send(result);
		});

		// run app
		app.listen(3000);

		console.log("Express application is upp and runnnig on port 3000");
	})
	.catch((error) => {
		console.log("3306: [ERROR]???Database error");
		console.log(`ERROR: ${error}`);
	});
