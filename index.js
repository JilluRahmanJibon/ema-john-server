const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jf2skzr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
	try {
		const productsCollection = client
			.db("emaJohnCollection")
			.collection("products");

		app.get("/products", async (req, res) => {
			const page = parseInt(req.query.page);
			const size = parseInt(req.query.size);

			const query = {};
			const cursor = productsCollection.find(query);
			const products = await cursor
				.skip(page * size)
				.limit(size)
				.toArray();
			const count = await productsCollection.count();
			res.send({ count, products });
		});
		app.post("/productsByIds", async (req, res) => {
			const ids = req.body;
			const objectId = ids.map(id => ObjectId(id));
			const query = { _id: { $in: objectId } };
			const cursor = productsCollection.find(query);
			const products = await cursor.toArray();
			res.send(products);
		});
	} finally {
	}
}
run().catch(err => console.error(err));

app.get("/", (req, res) => {
	console.log("ema-john server is running now");
});
app.listen(port, () => {
	console.log("ema-john port is running now", port);
});
