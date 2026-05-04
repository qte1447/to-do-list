import React, { useState } from 'react';

// так называемые Settings

const SECRET_WORD = 'WORLD'; // слово для угадывания (заглавными буквами)
const LANGUAGE    = 'en';    // на выбор 'ru' и'en' версии

const MAX_TRIES = 6;

const KEYBOARD = {
  ru: [
    ['Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х'],
    ['Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э'],
    ['Я','Ч','С','М','И','Т','Ь','Б','Ю','←'],
  ],
  en: [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M','←'],
  ],
};

const WORD_LEN = SECRET_WORD.length;

// проверяет попытку и возвращает массив статусов: 'correct' | 'present' | 'absent'
function checkGuess(guess, secret) {
  const result    = Array(WORD_LEN).fill('absent');
  const secretArr = secret.split('');
  const used      = Array(WORD_LEN).fill(false);

  // сначала точные совпадения (зелёные)
  guess.split('').forEach((ch, i) => {
    if (ch === secretArr[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  });

  // потом буквы не на своём месте (жёлтые)
  guess.split('').forEach((ch, i) => {
    if (result[i] === 'correct') return;
    const j = secretArr.findIndex((s, si) => s === ch && !used[si]);
    if (j !== -1) {
      result[i] = 'present';
      used[j] = true;
    }
  });

  return result;
}

export default function Wordle() {
  const [guesses, setGuesses]   = useState([]); // { word, result }[]
  const [current, setCurrent]   = useState('');
  const [finished, setFinished] = useState(false);
  const [won, setWon]           = useState(false);
  const [message, setMessage]   = useState('');

  const keys = KEYBOARD[LANGUAGE] || KEYBOARD.en;

  // лучший статус клавиши по всем попыткам
  const keyClass = (key) => {
    let best = null;
    guesses.forEach(({ word, result }) => {
      word.split('').forEach((ch, i) => {
        if (ch !== key) return;
        if (result[i] === 'correct') best = 'correct';
        else if (result[i] === 'present' && best !== 'correct') best = 'present';
        else if (!best) best = 'absent';
      });
    });
    return best || '';
  };

  // нажатие кнопки на клавиатуре
  const handleKey = (key) => {
    if (finished) return;
    if (key === '←') { setCurrent(c => c.slice(0, -1)); return; }
    if (current.length < WORD_LEN) setCurrent(c => c + key);
  };

  // подтверждение попытки
  const handleEnter = () => {
    if (finished) return;
    if (current.length !== WORD_LEN) { setMessage(`Введи ${WORD_LEN} букв`); return; }

    const result  = checkGuess(current, SECRET_WORD);
    const newList = [...guesses, { word: current, result }];
    setGuesses(newList);
    setCurrent('');
    setMessage('');

    if (current === SECRET_WORD) { setWon(true); setFinished(true); }
    else if (newList.length >= MAX_TRIES) { setFinished(true); setMessage(`Слово: ${SECRET_WORD}`); }
  };

  const reset = () => {
    setGuesses([]); setCurrent(''); setFinished(false); setWon(false); setMessage('');
  };

  return (
    <div className="wordle">
      <div className="wordle-header">
        <span className="wordle-title">Wordle</span>
        <button className="wordle-reset" onClick={reset}>Новая игра</button>
      </div>

      {/* сетка попыток */}
      <div className="wordle-grid">
        {Array(MAX_TRIES).fill(null).map((_, rowIdx) => {
          const guess     = guesses[rowIdx];
          const isCurrent = rowIdx === guesses.length;

          return (
            <div className="wordle-row" key={rowIdx}>
              {Array(WORD_LEN).fill(null).map((_, colIdx) => {
                let letter = '';
                let cls    = '';

                if (guess) {
                  letter = guess.word[colIdx];
                  cls    = guess.result[colIdx]; // 'correct' | 'present' | 'absent'
                } else if (isCurrent) {
                  letter = current[colIdx] || '';
                  cls    = 'active';
                }

                return (
                  <div key={colIdx} className={`wordle-cell ${cls}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* сообщения */}
      {message && <div className="wordle-msg">{message}</div>}
      {won && <div className="wordle-msg wordle-win">Угадал!🎉</div>}

      {/* клавиатура */}
      <div className="wordle-keyboard">
        {keys.map((row, ri) => (
          <div className="wordle-kb-row" key={ri}>
            {row.map(key => (
              <button
                key={key}
                className={`wordle-key ${keyClass(key)}`}
                onClick={() => handleKey(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        <div className="wordle-kb-row">
          <button className="wordle-key wordle-enter" onClick={handleEnter} disabled={finished}>
            Ввод
          </button>
        </div>
      </div>
    </div>
  );
}
