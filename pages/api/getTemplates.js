import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("TexquisiteCV");
    const collection = db.collection("templates");

    const templates = await collection.find({}).toArray();
    res.json(templates);
}