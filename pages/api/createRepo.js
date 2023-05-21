import { processLatexToAstViaUnified } from "@unified-latex/unified-latex";
import { toString } from "@unified-latex/unified-latex-util-to-string";

async function checkRepoStatus(repoName, user, token) {
    // get commits for the repo
    let status = await fetch(
        `https://api.github.com/repos/${user}/${repoName}/commits`,
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
            if (data.message) {
                return false;
            }
            return true;
        });
    return status;
}

function createListItem(example, item) {
    let template = JSON.parse(JSON.stringify(example))
    let keys = Object.keys(item)
    if (keys.length == 0) {
        return template;
    }
    for (let i = 0; i < template.length; i++) {
        if (template[i].type == "environment") {
            if (keys.includes(template[i].env)) {
                template[i].type = "string"
                template[i].content = item[template[i].env]
            }
        }
        switch (template[i].type) {
            case "whitespace":
            case "comment":
                break;
            case "environment":
            case "group":
            case "argument":
                template[i].content = createListItem(template[i].content, item)
            case "macro":
                if (template[i].args && template[i].args.length > 0) {
                    template[i].args = createListItem(template[i].args, item)
                }
            default:
                break;
        }
    }
    return template;
}

function replaceAst(ast, formData) {
    let keys = Object.keys(formData)
    if (keys.length == 0) {
        return ast;
    }
    if (ast.type == "environment") {
        if (keys.includes(ast.env)) {
            if (Array.isArray(formData[ast.env])) {
                let template = ast.content
                let newContent = formData[ast.env].map((item) => {
                    return createListItem(template, item)
                })
                // remove the environment and replace it with the new content
                // using root type breaks the latex parser
                // using group adds extra curly braces
                ast.content = newContent
            } else {
                ast.type = "string"
                ast.content = formData[ast.env]
            }
            return ast;
        }
    }
    switch (ast.type) {
        case "whitespace":
        case "comment":
            return ast;
        case "environment":
        case "root":
        case "group":
            for (let i = 0; i < ast.content.length; i++) {
                ast.content[i] = replaceAst(ast.content[i], formData)
            }
        default:
            return ast;
            break;
    }
}

export default async function handler(req, res) {
    const username = req.body.username;
    const token = req.body.accessToken;
    const config = req.body.config;
    const formData = req.body.formData
    const repoOwner = req.body.repoOwner;
    const repoName = req.body.repoName;
    const cloneName = req.body.cloneName;

    let repo = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                owner: username,
                name: cloneName,
                description: "Resume created using CVBuilder",
                include_all_branches: false,
                private: false,
            }),
        }
    )
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
    if (repo.message) {
        repo = await fetch(
            `https://api.github.com/repos/${username}/${cloneName}`,
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
    }
    while (!(await checkRepoStatus(cloneName, username, token))) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    let file = await fetch(
        `https://api.github.com/repos/${username}/${cloneName}/contents/${config.path}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json())
        .then((file) => {
            if (file.message) {
                return res.status(500).json({ error: file.message });
            }
            return file;
        });

    let content = Buffer.from(file.content, "base64").toString("ascii");
    let parser = processLatexToAstViaUnified();
    let ast = parser.parse(content);
    ast = replaceAst(ast, formData);
    ast = toString(ast);

    /* Object.keys(formData).forEach((key) => {
        ast = `\\newenvironment{${key}}{}{}\n` + ast;
    }); */

    await fetch(
        `https://api.github.com/repos/${username}/${cloneName}/contents/${config.path}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                message: "Update resume content",
                content: Buffer.from(ast).toString("base64"),
                sha: file.sha,
            }),
        }
    )
        .then((res) => res.json())
        .then((data) => { 
            console.log(data);
        });
    // return res.status(200).json(ast);
    return res.status(200).json({ status: "success" });
}