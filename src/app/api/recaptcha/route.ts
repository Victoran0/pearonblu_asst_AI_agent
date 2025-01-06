import axios from "axios";

export async function POST(req: Request) {
    const data = await req.json();
    // console.log("The data: ", data)
    const { token } = data;
    // console.log("The token: ", token)

    const secretKey: string | undefined = process.env.RECAPTCHA_SECRET_KEY;

    if (!token) {
        return new Response(JSON.stringify({ message: "Token not found" }), {
        status: 405,
        });
    }

    try {
        const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
        );

        // console.log("The captcha response: ", response)

        if (response.data.success) {
            return new Response(JSON.stringify({ message: "Success" }), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ message: "Failed to verify" }), {
                status: 405,
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}