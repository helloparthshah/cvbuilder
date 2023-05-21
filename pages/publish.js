import { Button, FormControl, FormHelperText, Input, InputLabel, TextField } from "@mui/material";

export default function Publish({ user }) {
    function handleSubmit(e) {
        e.preventDefault()
        // get form data
        let formData = {}
        let formElements = e.target.elements
        for (let i = 0; i < formElements.length; i++) {
            let element = formElements[i]
            if (element.id) {
                formData[element.id] = element.value
            }
        }
        console.log(formData)
        fetch("/api/addTemplate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user.login,
                ...formData
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                // clear form
                e.target.reset()
            })
    }
    return (
        <div>
            <h1>Publish New Template</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="id"
                    label="Template ID"
                    variant="outlined"
                    required
                    color="secondary"
                    type="text"
                    sx={{ mb: 3 }}
                    fullWidth
                />
                <TextField
                    id="name"
                    label="Template Name"
                    required
                    variant="outlined"
                    color="secondary"
                    type="name"
                    sx={{ mb: 3 }}
                    fullWidth
                />
                <TextField
                    id="description"
                    label="Description"
                    variant="outlined"
                    color="secondary"
                    type="text"
                    sx={{ mb: 3 }}
                    fullWidth
                />
                <TextField
                    id="url"
                    label="Repo URL"
                    variant="outlined"
                    color="secondary"
                    required
                    type="url"
                    sx={{ mb: 3 }}
                    fullWidth
                />
                <Button type="submit" variant="contained">Publish</Button>
            </form>
        </div>
    )
}