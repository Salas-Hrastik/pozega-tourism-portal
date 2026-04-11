import { OpenAI } from "openai";
import { searchContext } from "@/lib/rag";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Ti si AI turistički informator grada Požege. Tvoj cilj je pružiti točne, korisne i ljubazne informacije posjetiteljima o Požegi i Zlatnoj dolini.
Odgovaraj na hrvatskom jeziku. Budi jasan i informativan.

Koristi sljedeći kontekst (ako je dostupan) za odgovaranje na pitanja korisnika:
{context}

Ako u kontekstu nema traženih informacija, odgovori na temelju svog općeg znanja o Požegi, ali naglasi da su to opće informacije.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Nema poruka." }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    // Retrieve context from Markdown files
    let context = "";
    try {
      context = searchContext(lastMessage);
    } catch (e) {
      console.error("Greška pri pretraživanju konteksta:", e);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT.replace("{context}", context) },
        ...messages,
      ],
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content;

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error("Chat error details:", error);
    return NextResponse.json({ 
      error: "Pogreška u komunikaciji s Barunom.",
      details: error.message 
    }, { status: 500 });
  }
}
