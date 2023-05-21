import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("TexquisiteCV");
    const collection = db.collection("templates");
    const newTemplate = await collection.insertOne(req.body);
    res.json(newTemplate);
}