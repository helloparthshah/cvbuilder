import { Button } from "@mui/material"
import { useState } from "react"

export default function ResumeForm({ token, user, template }) {
    const [latex, setLatex] = useState("")
    const [formState, setFormState] = useState({
        "repo_owner": "helloparthshah",
        "repo_name": "resume-template",
        "name": "Parth Shah",
        "education": [
            {
                "university": "Test University",
                "degree": "Test Degree",
            },
            {
                "university": "Bababhai",
                "degree": "Nahi hai",
            }
        ]
    })

    return (
        <>
            <Button variant="contained" color="primary" onClick={() => {
                fetch("/api/createRepo",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify({
                            accessToken: token,
                            username: user.login,
                            config: template.config,
                            formData: formState,
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        setLatex(data)
                    })
            }}>
                Create Repository
            </Button>
            <textarea value={latex} >
            </textarea>
        </>
    )
}