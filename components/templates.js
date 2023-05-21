import { Button, Card, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import ResumeForm from "./ResumeForm"

export default function Templates({ user, token }) {
    const [templates, setTemplates] = useState([])
    const [currentTemplate, setCurrentTemplate] = useState({})
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetch("/api/getTemplates")
            .then(res => res.json())
            .then(data => setTemplates(data))
    }, [])

    return (
        <>
            <h1>Premade Templates</h1>
            <Grid container spacing={2}>
                {templates.map(template => (
                    <Grid item xs={12} sm={6} md={4} key={template._id}>
                        <Card sx={{ p: 2 }} variant="outlined">
                            <h2>{template.name}</h2>
                            <p>{template.description}</p>
                            <Button variant="contained" color="secondary" onClick={() => {
                                console.log(template)
                                fetch("/api/getRepo", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                    },
                                    body: JSON.stringify({
                                        accessToken: token,
                                        githubUrl: template.url
                                    })
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        console.log(data)
                                        if (data.error) {
                                            alert(data.error)
                                            return
                                        }
                                        if (data.message) {
                                            alert(data.message)
                                            return
                                        }
                                        setCurrentTemplate(data)
                                        setOpen(true)
                                    })
                            }}>
                                Use Template
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <ResumeForm
                template={currentTemplate}
                open={open}
                setOpen={setOpen}
                form={{}}
                accessToken={token}
                user={user}
            />
        </>
    )
}