export default async function handler(req, res) {
    let token = req.body.accessToken
    let username = req.body.username
    let repos = await fetch(`https://api.github.com/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: `query {
                user(login: "${username}") {
                    repositories(first: 100) {
                        nodes {
                            name
                            description
                            url
                            homepageUrl
                            templateRepository {
                                name
                                owner {
                                    login
                                }
                            }
                        }
                    }
                }
            }`
        })
    }).then(res => res.json())
        .then(data => {
            console.log(data)
            return data.data.user.repositories.nodes
        })
    let templateRepos = []
    for (let repo in repos) {
        if (repos[repo].templateRepository) {
            if (repos[repo].description !== null && repos[repo].description === "Resume created using CVBuilder") {
                templateRepos.push(repos[repo])
            }
        }
    }
    res.status(200).json(templateRepos)
}