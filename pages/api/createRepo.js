import { processLatexToAstViaUnified } from "@unified-latex/unified-latex";
import { toString } from "@unified-latex/unified-latex-util-to-string";

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
                // console.log(JSON.stringify(template[i], null, 2))
                // let content = template[i].content[0]
                // content.content = [item[template[i].env]]
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
                let newContent = []
                template[i].content = createListItem(template[i].content, item)
            /* for (let j = 0; j < template[i].content.length; j++) {
                newContent[j] = createListItem(template[i].content[j], item)
            }
            template[i].content = newContent */
            case "macro":
                if (template[i].args && template[i].args.length > 0) {
                    console.log(template[i].args[3])
                    template[i].args = createListItem(template[i].args, item)
                }
            /* if (template[i].args && template[i].args.length > 0) {
                for (let j = 0; j < template[i].args.length; j++) {
                    template[i].args[j] = createListItem(template[i].args[j].content, item)
                }
            } */
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
                ast.content = formData[ast.env].map((item) => {
                    return createListItem(template, item)
                })
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
    let username = req.body.username;
    let token = req.body.accessToken;
    let config = req.body.config;
    let formData = req.body.formData

    let newAst = await fetch(
        `https://api.github.com/repos/${username}/${formData.repo_name}/contents/${config.path}`,
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
            let content = Buffer.from(file.content, "base64").toString("ascii");
            let parser = processLatexToAstViaUnified();
            // print this ast using pretty print
            let ast = parser.parse(content);
            ast = replaceAst(ast, formData);
            ast = toString(ast);
            Object.keys(formData).forEach((key) => {
                ast = `\\newenvironment{${key}}{}{}\n` + ast;
            });
            return ast;
        });
    return res.status(200).json(newAst);
}