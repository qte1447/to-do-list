import React, { useState, useEffect } from 'react';
import './App.css';
import ToDoForm from "./AddTask";
import ToDo from "./Task";
import axios from 'axios';
import ApiDocs from "./ApiDocs";
import Clock from "./Clock"; // ← импорт часов

const TASKS_STORAGE_KEY = 'tasks-list-project-web';

function getWeatherIcon(code) {
  if (code <= 3) return '01d';
  if (code <= 48) return '03d';
  if (code <= 57) return '09d';
  if (code <= 67) return '10d';
  if (code <= 77) return '13d';
  if (code <= 82) return '09d';
  return '11d';
}

function App() {
  const [rates, setRates] = useState({});
  const [crypto, setCrypto] = useState({});
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
      } catch (e) {
        console.error('Ошибка при чтении задач из localStorage:', e.message);
      }
    }
    return [];
  });

  useEffect(() => {
    async function fetchAllData() {
      try {
        const currencyResponse = await axios.get(
          'https://www.cbr-xml-daily.ru/daily_json.js'
        );

        if (!currencyResponse.data || !currencyResponse.data.Valute) {
          throw new Error('Нет данных о валюте.');
        }

        const USDrate = currencyResponse.data.Valute.USD.Value.toFixed(4).replace('.', ',');
        const EURrate = currencyResponse.data.Valute.EUR.Value.toFixed(4).replace('.', ',');

        setRates({ USDrate, EURrate });

        // Криптовалюты
        const cryptoResponse = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=rub'
        );
        setCrypto({
          BTC: cryptoResponse.data.bitcoin.rub,
          ETH: cryptoResponse.data.ethereum.rub
        });

        const lat = 45.0448;
        const lon = 38.9760;

        const weatherResponse = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,cloud_cover,weather_code`
        );

        if (!weatherResponse.data || !weatherResponse.data.current) {
          throw new Error('Нет данных о погоде.');
        }

        const current = weatherResponse.data.current;
        setWeatherData({
          main: {
            temp: current.temperature_2m + 273.15,
          },
          wind: {
            speed: current.wind_speed_10m,
          },
          clouds: {
            all: current.cloud_cover,
          },
          weather: [
            {
              icon: getWeatherIcon(current.weather_code),
            }
          ],
        });
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки данных: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Ошибка при сохранении задач в localStorage:', error.message);
    }
  }, [todos]);

  const addTask = (userInput) => {
    if (userInput) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        task: userInput,
        complete: false
      };
      setTodos([...todos, newItem]);
    }
  };

  const removeTask = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)]);
  };

  const handleToggle = (id) => {
    setTodos([
      ...todos.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : { ...task }
      )
    ]);
  };

  // --- Вот здесь добавляем часы ---
  // Они всегда отображаются в правом верхнем углу

  return (
    <>
      {/* Часы в фиксированном положении */}
      <div className="weather-clock">
        <Clock />
      </div>

      <div className="App">
        {loading && <p>Загрузка...</p>}
        {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
            <div className='info'>
              <div className='money'>
                <div id="USD">
                  Доллар США $ — {rates.USDrate} руб.
                </div>
                <div id="EUR">
                  Евро € — {rates.EURrate} руб.
                </div>
              </div>
              <div className='money'>
                <div>₿ Bitcoin — {crypto.BTC?.toLocaleString()} ₽</div>
                <div>Ξ Ethereum — {crypto.ETH?.toLocaleString()} ₽</div>
              </div>
              {weatherData && (
                <div className="weather-info">
                  <p>Погода сегодня: <br />
                    🌡️ {(weatherData.main.temp - 273.15).toFixed(1)}°C {' '}
                    ༄.° {weatherData.wind.speed} м/с {' '}
                    ☁️ {weatherData.clouds.all}%</p>
                  <img
                    className='weather-icon'
                    src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                    alt="Иконка погоды"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <header>
          <h1 className='list-header'>Список задач: {todos.length}</h1>
        </header>
        <ToDoForm addTask={addTask} />
        {todos.map((todo) => (
          <ToDo
            todo={todo}
            key={todo.id}
            toggleTask={handleToggle}
            removeTask={removeTask}
          />
        ))}
      </div>
      <ApiDocs />
    </>
  );
}

export default App;
