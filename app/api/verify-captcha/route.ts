export async function POST(req: Request) {
  const { token } = await req.json();

  const secret = process.env.TURNSTILE_SECRET_KEY;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        response: token,
      }),
    },
  );

  const data = await res.json();

  return Response.json(data);
}
