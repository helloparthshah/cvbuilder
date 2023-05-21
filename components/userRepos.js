import { Box, Button, Card, Grid } from "@mui/material";
import { useEffect, useState } from "react"

export default function UserRepos({ token, user }) {
    const [repos, setRepos] = useState([])

    useEffect(() => {
        fetch(
            `/api/getUserRepos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    accessToken: token,
                    username: user.login,
                }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setRepos(data)
            });
    }, [token, user])
    return (
        <div>
            <h1>Your Resumes</h1>
            <Grid container spacing={2}>
                {repos.map((repo) => {
                    return (
                        <Grid item xs={12} sm={6} md={4} key={repo.id}>
                            <Card sx={{ p: 2 }} variant="outlined">
                                <h2>{repo.name}</h2>
                                <p>{repo.description}</p>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button variant="contained" onClick={async () => {
                                        await fetch(
                                            `/api/getArtifact`,
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    Accept: "application/json",
                                                },
                                                body: JSON.stringify({
                                                    accessToken: token,
                                                    repoOwner: user.login,
                                                    repoName: repo.name,
                                                }),
                                            }
                                        )
                                            .then((res) => res.json())
                                            .then((data) => {
                                                location.href = data.archive_download_url;
                                            });
                                    }}>Download</Button>
                                    <Button variant="outlined" href={repo.url} target="_blank">
                                        View on GitHub
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
}