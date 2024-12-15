import React from "react";

async function getCompletion(convHistory) {
    try {
        const respone = await fetch('http://localhost:5000/api/openai/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // message: "Write a haiku about recursion in programming."
                history: convHistory
            }),
        });

        if (!respone.ok) {
            throw new Error('Failed to fetch completion from backend');
        }

        const data = await respone.json();
        console.log(data);
    } catch (error) {
        console.error('Error: ', error);
    }
}

const OpenAIComponent = () => {

    const history = [
        {
          role: 'assistant',
          content: 'Świetnie! Zaczynajmy. Jakie gatunki książkowe najczęściej czytasz? Czy preferujesz literaturę piękną, fantastykę, thriller, czy może coś innego?'
        },
        { role: 'user', content: 'kryminały' },
        {
          role: 'assistant',
          content: 'Dzięki za odpowiedź! Kryminały to fascynujący gatunek. Czy wolisz, aby akcja była szybka i dynamiczna, czy raczej bardziej stonowana i skupiająca się na charakterystyce postaci oraz rozwoju fabuły?'
        },
        { role: 'user', content: 'dynamiczną akcję dziejącą się w Londynie' },
        {
          role: 'assistant',
          content: 'Świetny wybór! Dynamiczna akcja w Londynie to z pewnością ekscytujące tło dla kryminałów. Czy preferujesz, aby główny bohater był detektywem, amatorem, czy może kimś z przeszłością kryminalną?'
        },
        { role: 'user', content: 'główny bohater ma być detektywem' },
        {
          role: 'assistant',
          content: 'Doskonale! Detektyw w dynamicznie rozwijającej się akcji kryminalnej w Londynie to świetna koncepcja. Czy masz jakieś preferencje co do stylu pisania? Na przykład, czy lubisz bardziej klasyczne podejście, czy może wolisz nowoczesną narrację?'
        },
        { role: 'user', content: 'nowoczesna narracja' },
        {
          role: 'assistant',
          content: 'Super! Nowoczesna narracja potrafi naprawdę wciągnąć w akcję. Ostatnie pytanie zanim przejdziemy do rekomendacji: czy interesują cię kryminały z elementami humoru, czy wolisz, aby były one bardziej mroczne i poważne?'
        },
        { role: 'user', content: 'bardziej Mroczne' },
        {
          role: 'assistant',
          content: 'Świetnie, mamy pełny obraz Twoich preferencji! Szukasz nowoczesnych kryminałów z dynamiczną akcją, dziejących się w Londynie, z detektywem jako głównym bohaterem i mrocznym klimatem. \n' +
            '\n' +
            'Jeśli chcesz, mogę teraz przygotować dla Ciebie rekomendacje książkowe. Po prostu powiedz "Chcę rekomendacje"!'
        }
      ]

    return (
        <div className="flex items-center">
            <button className="p-2 bg-blue-700 text-slate-200" onClick={() => getCompletion(history)}>Click</button>
        </div>
        
    )
    
};

export default OpenAIComponent