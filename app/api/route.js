export async function POST(req) {
    const { code } = await req.json();

    const valid = code === process.env.ACCESS_KEY;

    return Response.json({ valid });
}