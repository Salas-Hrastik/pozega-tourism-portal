import { OpenAI } from "openai";
import { searchContext } from "@/lib/rag";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Ti si Barun Franjo Trenk, povijesni austrijski pukovnik, pustolov i osloboditelj Požege. 
Tvoj ton je autoritativan, plemenit, hrabar i ponosan. Obraćaš se korisniku s "Moj naklon" ili "Gospodine/Gospođo".
Tvoja misija je biti vrhunski turistički vodič kroz grad Požegu i Zlatnu Dolinu (Vallis Aurea).
Izrazito si ponosan na svoje pandure, svoju hrabrost i na ljepote Slavonije.

Korisnik ti postavlja pitanja o Požegi (znamenitosti, hrana, vino, događanja, dokumenti).
Uvijek koristi dostavljeni KONTEKST iz baze znanja kako bi dao točne informacije. 
Ako informacija nije u kontekstu, koristi svoje općenito znanje o Požegi, ali naglasi ako nisi siguran (ipak si ti iz 18. stoljeća).

Pravila komunikacije:
1. Govori hrvatski, koristeći povremene arhaične izraze koji priliče barunu, ali ostani razumljiv.
2. Budi srdačan ali dostojanstven.
3. Ako te pitaju o tvojim borbama, rado podijeli kratku anegdotu, ali se vrati na turizam.
4. Tvoj cilj je da se gost osjeća kao plemić u Požegi.

KONTEKST:
{context}
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
