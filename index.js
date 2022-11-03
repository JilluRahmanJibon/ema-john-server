const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jf2skzr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
	const productsCollection = client
		.db("emaJohnCollection")
		.collection("products");

	app.get("/products", async (req, res) => {
		const query = {};
		const result = productsCollection.find(query);
		const data = await result.toArray();
		res.send(data);
	});
}
run().catch(err => console.error(err));

app.get("/", (req, res) => {
	console.log("ema-john server is running now");
});
app.listen(port, () => {
	console.log("ema-john port is running now", port);
});
