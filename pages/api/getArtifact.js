export default async function handler(req, res) {
    const token = req.body.accessToken;
    const repoOwner = req.body.repoOwner;
    const repoName = req.body.repoName;

    let artifacts = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/actions/artifacts`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
    if (artifacts.total_count === 0) {
        res.json({ error: "No artifacts found" });
        return;
    }
    let artifact = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/actions/artifacts/${artifacts.artifacts[0].id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
    // https://api.github.com/repos/OWNER/REPO/actions/artifacts/ARTIFACT_ID/ARCHIVE_FORMAT
    // headers.location in response gives the download url
    let archive = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/actions/artifacts/${artifacts.artifacts[0].id}/zip`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    ).then((res) => {
        return res;
    });
    artifact.archive_download_url = archive.url;
    res.json(artifact);
}