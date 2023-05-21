import GetRepo from "@/components/getRepo"
import Templates from "@/components/templates"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Home({ token, user }) {
    const [update, setUpdate] = useState(false)
    return (
        <>
            <Head>
                <title>TexquisiteCV</title>
                <meta name="description" content="Create your own portfolio website in minutes" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <GetRepo token={token} user={user} setUpdate={setUpdate} />
            <Templates token={token} user={user} />
        </>
    )
}
