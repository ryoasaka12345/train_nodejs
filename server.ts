import { createConnection } from "typeorm";

const ormOptions: any = {
	type: "mysql",
	host: "localhost",
	port: "3306",
	username: "root",
	password: "root",
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
