export default async (input: string) => {
    try {
        return input
        .replace(/\\/g, "")
        .replace(/\//g, "")
        .replace(/-/g, " ");
    } 
    catch (err) {
        return ""
    }
}