export async function GET(req: any) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const fileName = searchParams.get("fileName");
    return Response.json({ message: "Hello World" });
}
