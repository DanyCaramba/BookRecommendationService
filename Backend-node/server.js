// server.js (Backend)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');


dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000' // Allow only this origin
}));

app.use(express.json());

app.post('/api/openai/start', async (req, res) => {
  
  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Jesteś pomocnym asystentem. Twoim zadaniem jest zadawanie użytkownikowi pytań dotyczących jego preferencji książkowych i dostosowywanie każdego pytania na podstawie jego poprzednich odpowiedzi. Śledź ich odpowiedzi, aby zebrać wystarczającą ilość informacji do przedstawienia rekomendacji książkowych." },
            {
                role: "assistant",
                content: "W oparciu o poprzednie odpowiedzi użytkownika, zadaj kolejne najbardziej odpowiednie pytanie dotyczące jego preferencji książkowych. Dostosuj pytanie do tego, co już udostępnił.",
            },
        ],
    });

    res.json(completion.choices[0].message);
    console.log(completion.choices[0].message);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Error communicating with OpenAI');
  }
});

app.post('/api/openai/continue', async (req, res) => {
  const { message, history } = req.body;

  console.log(message)
  console.log(history)
  
  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { 
                role: "system",
                content: "Jesteś pomocnym asystentem. Twoim zadaniem jest zadawanie użytkownikowi pytań dotyczących jego preferencji książkowych i dostosowywanie każdego pytania na podstawie jego poprzednich odpowiedzi. Śledź ich odpowiedzi, aby zebrać wystarczającą ilość informacji do przedstawienia rekomendacji książkowych. Jeśli uważasz, że użytkownik dostarczył już wystarczająco informacji na przykład podał gatunek, dynamikę akcji, jaki ma być głownym bohater lub miejsce akcji zaproponuj aby powiedział \"Chce rekomendacje\" aby przyjeść do procesu rekomendacji"
            },
            {
                role: "assistant",
                content: "W oparciu o poprzednie odpowiedzi użytkownika, zadaj kolejne najbardziej odpowiednie pytanie dotyczące jego preferencji książkowych. Dostosuj pytanie do tego, co już udostępnił.",
            },
            ...history,
            {
                role: "user",
                content: message
            },
        ],
    });

    res.json(completion.choices[0].message);
    console.log(completion.choices[0].message);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Error communicating with OpenAI');
  }
});

app.post('/api/openai/summarize', async (req, res) => {
  const { history } = req.body;
  console.log(history)
  
  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { 
                role: "system",
                content: "Jesteś asystentem podsumowującym konstruując dobrą odpowiedż do wyszukiwania wektorowego, dodaj pasujące słowa kluczowe dla lepszego znalezienia podobieństw. Twoim zadaniem jest zebranie odpowiedzi użytkownika oraz pytań asystenta i wygenerowanie dobrze skonstruowanego podsumowania. Odpowiedź ma być w posatci jednego ciągu znaków."
            },
            ...history,
        ],
    });

    res.json(completion.choices[0].message);
    console.log(completion.choices[0].message);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send('Error communicating with OpenAI');
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
