export async function fetch_attachments_from_message(messages: string[]) {
    console.log(messages.forEach(async (message) => {
        const url: string[] = (JSON.parse(JSON.stringify(message["attachments"]))[0]["url"]).toString().replace("https://cdn.discordapp.com/attachments/", "").split("/") // very retarded lmao

        console.log(url)
    }))
}