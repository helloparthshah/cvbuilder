import { AppBar, Button, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function LoginBar() {
    const router = useRouter()
    const [accessToken, setAccessToken] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setAccessToken(localStorage.getItem("accessToken"))
            setUser(JSON.parse(localStorage.getItem("user")))
            window.dispatchEvent(new Event('storage'))
        }
        if (!router.isReady) return
        if (router.query.code) {
            const code = router.query.code
            console.log(code)
            fetch("/api/github", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    code: code
                })
            })
                .then(res => res.json())
                .then(data => {
                    setAccessToken(data.accessToken)
                    setUser(data.user)
                    localStorage.setItem("accessToken", data.accessToken)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    window.dispatchEvent(new Event('storage'))
                    // set the url to the current url without the code
                    router.replace(router.pathname, router.pathname, { shallow: true })
                })
        }
    }, [router.isReady])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "rgba(0, 0, 0, 0.08) 0px 3px 14px",
                    borderRadius: "50px",
                    transform: "translateY(10px)",
                }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                        <div style={{ width: "fit-content" }}>
                            <Link href="/" style={{ textDecoration: "none", color: "black" }}>
                                <h2>
                                    TexquisiteCV
                                </h2>
                            </Link>
                        </div>
                    </Box>
                    {accessToken ?
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Button variant="contained" color="secondary" onClick={() => {
                                localStorage.removeItem("accessToken")
                                localStorage.removeItem("user")
                                setAccessToken(null)
                                setUser(null)
                                window.dispatchEvent(new Event('storage'))
                            }}>
                                Logout
                            </Button>
                            {user &&
                                <Link
                                    href={`https://github.com/${user.login}`}
                                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                >
                                    <Image src={user.avatar_url} alt={user.login} width={60} height={60} style={{ padding: "5px", cursor: "pointer" }} />
                                </Link>
                            }
                        </div>
                        :
                        <Button variant="contained" color="secondary"
                            href={"https://github.com/login/oauth/authorize?" + new URLSearchParams({
                                client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
                                redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URL,
                                scope: "public_repo actions:read",
                                state: "1234567890"
                            }).toString()}
                        >
                            Login
                        </Button>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    )
}