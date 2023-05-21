import '@/styles/globals.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginBar from '@/components/loginBar';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const darkTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

export default function App({ Component, pageProps }) {
    const [token, setToken] = useState("")
    const [user, setUser] = useState({})
    const router = useRouter()

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
            <LoginBar />
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Container sx={{ mb: 10, mt: 10 }}>
                    <Component {...pageProps} token={token} user={user} />
                </Container>
            </ThemeProvider>
        </>
    );
}