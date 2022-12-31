import message_attachment from "./checks/channel_name_and_id_message_attachment"
import message_attachment_id from "./checks/channel_name_and_id_message_attachment_id"


export async function fetch_attachments_from_message(parent_name: string, messages: string[], channel: string[]) {
    let id: string = ""
    let url: string = ""
    let array_url: string[] = []
    let name: string = ""
    let messaged: string[] = []

    console.log(messages.forEach(async (message: any) => {
        messaged = message
        id = message["id"] || ""
        url = (JSON.parse(JSON.stringify(message["attachments"]))[0]["url"]).toString()
        array_url = url.toString().replace("https://cdn.discordapp.com/attachments/", "").split("/")
        name = array_url.toString().split(/[, ]+/).pop()?.toString() || "";

        await message_attachment_id(parent_name, messaged, {
            id: id, 
            name: name,
            root_id: await channel["id"], 
            root_name: await channel["name"]
        })
    }))

    await message_attachment(parent_name, messaged, {
        id: id, 
        name: name,
        root_id: await channel["id"], 
        root_name: await channel["name"]
    })
}