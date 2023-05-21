import GetRepo from "@/components/getRepo"
import LoginBar from "@/components/loginBar"
import { Container } from "@mui/material"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Home() {
    const [token, setToken] = useState("")
    const [user, setUser] = useState({})
    const router = useRouter()
    const [update, setUpdate] = useState(false)

    function getToken() {
        let token = localStorage.getItem("accessToken")
        let user = JSON.parse(localStorage.getItem("user"))
        if (token) {
            setToken(token)
        } else {
            if (!window.location.search.includes("code")) {
                router.push("/404")
            }
        }
        if (user) {
            setUser(user)
        }
    }

    useEffect(() => {
        if (window != undefined) {
            window.addEventListener("storage", () => {
                getToken()
            })
            getToken()
        }
    }, [])
    return (
        <>
            <Head>
                <title>TexquisiteCV</title>
                <meta name="description" content="Create your own portfolio website in minutes" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <LoginBar />
            <Container sx={{ mb: 10, mt: 10 }}>
                <GetRepo token={token} user={user} setUpdate={setUpdate} />
            </Container >
        </>
    )
}
