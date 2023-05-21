import { useEffect, useState } from "react"

export default function Templates() {
    const [templates, setTemplates] = useState([])
    useEffect(() => {
        fetch("/api/getTemplates")
            .then(res => res.json())
            .then(data => setTemplates(data))
    }, [])

    return (
        <>
            <h1>Premade Templates</h1>
            <div className="grid grid-cols-3 gap-4">
                {templates.map(template => (
                    <div key={template._id} className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-xl font-bold">{template.name}</h2>
                        <p>{template.description}</p>
                        <p>Created by {template.username}</p>
                    </div>
                ))}
            </div>
        </>
    )
}