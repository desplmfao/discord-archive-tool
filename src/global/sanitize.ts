export async function sanitize(input: string) {
    return input
        .replace(/\\/g, "")
        .replace(/\//g, "")
        .replace(/-/g, " ") || "";
}