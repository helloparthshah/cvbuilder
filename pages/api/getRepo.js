export default async function handler(req, res) {
    let token = req.body.accessToken;
    let githubUrl = req.body.githubUrl;
    const repoOwner = githubUrl.split("/")[3];
    const repoName = githubUrl.split("/")[4];
    // fetch repo with repoOwner and repoName if it contains config.json
    let repo = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json()).then((data) => {
        return data;
    });

    if (repo.message || !repo.is_template) {
        return res.status(400).json({ message: "Invalid repo" });
    }

    let config = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/config.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                return res.status(500).json({ error: data.message })
            }
            let config = Buffer.from(data.content, 'base64').toString('ascii')
            config = JSON.parse(config)
            return config
        })
    repo.config = config
    return res.status(200).json(repo);
}