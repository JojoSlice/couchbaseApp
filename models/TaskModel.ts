class TaskModel {
	constructor({
		id = null,           // motsvarar "_id" i Couchbase
		text = "",
		completed = false,
		createdAt = new Date(),
	}) {
		this._id = id || this.generateId(); // Couchbase kräver ett _id
		this.type = "task";                // Typfält för att särskilja dokument
		this.text = text;
		this.completed = completed;
		this.createdAt = createdAt.toISOString(); // Datum i strängformat (ISO)
	}

	// Generera ett unikt ID (kan ersättas med UUID-lösning)
	generateId() {
		return `task_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
	}

	// Returnera JSON-format för att spara i databasen
	toJSON() {
		return {
			_id: this._id,
			type: this.type,
			text: this.text,
			completed: this.completed,
			createdAt: this.createdAt,
		};
	}

	// Skapa ett TaskModel från ett dokument från databasen
	static fromJSON(json) {
		return new TaskModel({
			id: json._id,
			text: json.text,
			completed: json.completed,
			createdAt: new Date(json.createdAt),
		});
	}
}

export default TaskModel;

