import { Button } from "@mui/material";

export default function GetRepo({ token }) {
    return (
        <Button variant="contained" color="primary" onClick={() => {
            fetch("/api/getRepo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken: token,
                        githubUrl: "https://github.com/helloparthshah/resume-template"
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                })
        }}>
            Read Repository
        </Button>
    )
}