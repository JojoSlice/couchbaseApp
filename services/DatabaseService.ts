import { CblReactNativeEngine, Database, Replicator } from 'cbl-reactnative';
import TaskModel from "../models/TaskModel";

export class DatabaseService {
	private static instance: DatabaseService;
	private engine: CblReactNativeEngine;
	private database?: Database;
	private replicator?: Replicator;

	private constructor() {
		this.engine = new CblReactNativeEngine();
	}

	public static getInstance(): DatabaseService {
		if (!DatabaseService.instance) {
			DatabaseService.instance = new DatabaseService();
		}
		return DatabaseService.instance;
	}


	async initializeDatabase() {
		this.database = await Database.open("my-database");

		this.database.addChangeListener(() => {
			console.log("Database changed, syncing UI...");
			// Kan skickas ut som event eller via en callback – se nedan
		});

		await this.startReplication();
	}


	getDatabase() {
		return this.database;
	}

	// ➕ Lägg till en uppgift
	async addTask(task: TaskModel): Promise<void> {
		if (!this.database) throw new Error("Database not initialized");
		await this.database.save(task.toJSON());
	}

	// 🗑️ Ta bort en uppgift
	async deleteTask(taskId: string): Promise<void> {
		if (!this.database) throw new Error("Database not initialized");
		await this.database.delete(taskId);
	}

	// 📄 Hämta alla uppgifter
	async getAllTasks(): Promise<TaskModel[]> {
		if (!this.database) throw new Error("Database not initialized");

		const result = await this.database.query({
			where: [{ property: "type", value: "task" }],
		});

		return result.map((doc: any) => TaskModel.fromJSON(doc));
	}

	// ✏️ Uppdatera en uppgift
	async updateTask(task: TaskModel): Promise<void> {
		if (!this.database) throw new Error("Database not initialized");
		await this.database.save(task.toJSON());
	}

	// 🔁 Replikering till/från Sync Gateway
	async startReplication() {
		if (!this.database) throw new Error("Database not initialized");

		const replicatorConfig = {
			database: this.database,
			target: "wss://s43dqjp7iquyroau.apps.cloud.couchbase.com:4984/task_default",
			continuous: true,
			replicatorType: "pushAndPull", // push, pull eller pushAndPull
			authenticator: {
				type: "basic",
				username: "TodoAdmin",   // <-- Ditt användarnamn
				password: "Super12345!",   // <-- Ditt lösenord
			},
		};

		this.replicator = await Replicator.create(replicatorConfig);
		await this.replicator.start();

		this.replicator.addChangeListener((status) => {
			console.log("Replication status changed:", status);
		});
	}
}
