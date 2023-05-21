import GetRepo from "@/components/getRepo"
import Templates from "@/components/templates"
import UserRepos from "@/components/userRepos"
import Head from "next/head"

export default function Home({ token, user }) {
    return (
        <>
            <Head>
                <title>TexquisiteCV</title>
                <meta name="description" content="Create your own portfolio website in minutes" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <GetRepo token={token} user={user} />
            <Templates token={token} user={user} />
            <UserRepos token={token} user={user} />
        </>
    )
}
