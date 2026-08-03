
import React, { useState, useEffect } from 'react';
import './App.css';
import ToDoForm from './AddTask';
import ToDo from './Task';
import Wordle from './Wordle';
import axios from 'axios';

const TASKS_KEY = 'todo-tasks';
const WEATHER_KEY = 'c7616da4b68205c2f3ae73df2c31d177';

const CITIES = [
  { name: 'Москва',          lat: 55.7558, lon: 37.6176 },
  { name: 'Санкт-Петербург', lat: 59.9343, lon: 30.3351 },
  { name: 'Краснодар',       lat: 45.0355, lon: 38.9753 },
  { name: 'Усинск',          lat: 65.9942, lon: 57.5311 },
  { name: 'Сыктывкар',       lat: 61.6688, lon: 50.8357 },
];

const CURRENCY_SOURCES = [
  { name: 'ЦБ РФ (через proxy)', id: 'cbr' },
  { name: 'ExchangeRate-API',    id: 'era' },
];

function App() {
  const [rates, setRates]     = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [cityIndex, setCityIndex]   = useState(0);
  const [currencyId, setCurrencyId] = useState('era');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(TASKS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setTodos(parsed);
      } catch { console.error('ошибка чтения задач'); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    setLoading(true);
    setError('');
    async function fetchData() {
      try {
        let usd, eur;
        if (currencyId === 'cbr') {
          const res = await axios.get(
            'https://corsproxy.io/?' + encodeURIComponent('https://www.cbr-xml-daily.ru/daily_json.js')
          );
          usd = res.data.Valute.USD.Value.toFixed(2);
          eur = res.data.Valute.EUR.Value.toFixed(2);
        } else {
          const res = await axios.get('https://open.er-api.com/v6/latest/RUB');
          usd = (1 / res.data.rates.USD).toFixed(2);
          eur = (1 / res.data.rates.EUR).toFixed(2);
        }
        setRates({ usd, eur });
        const city = CITIES[cityIndex];
        const wRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${WEATHER_KEY}`
        );
        setWeather(wRes.data);
      } catch (err) {
        console.error(err);
        setError('ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [cityIndex, currencyId]);

  const addTask    = (text) => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Math.random().toString(36).substr(2, 9), task: text, complete: false }]);
  };
  const removeTask = (id) => setTodos(todos.filter(t => t.id !== id));
  const toggleTask = (id) => setTodos(todos.map(t =>
    t.id === id ? { ...t, complete: !t.complete } : t
  ));
  const toCelsius  = (k) => (k - 273.15).toFixed(1);

  return (
    <div className="app">

      {/* 1. api-панель */}
      <div className="api-panel">
        <div className="api-block">
          <div className="api-block-label">Курс валют</div>
          <select className="api-select" value={currencyId} onChange={e => setCurrencyId(e.target.value)}>
            {CURRENCY_SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {loading && <span className="api-loading">загрузка…</span>}
          {!loading && error && <span className="api-error">недоступно</span>}
          {!loading && !error && rates && (
            <div className="api-values">
              <span>$ {rates.usd} ₽</span>
              <span>€ {rates.eur} ₽</span>
            </div>
          )}
        </div>
        <div className="api-divider" />
        <div className="api-block">
          <div className="api-block-label">Погода</div>
          <select className="api-select" value={cityIndex} onChange={e => setCityIndex(Number(e.target.value))}>
            {CITIES.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
          </select>
          {loading && <span className="api-loading">загрузка…</span>}
          {!loading && error && <span className="api-error">недоступно</span>}
          {!loading && !error && weather && (
            <div className="api-values">
              <span>🌡 {toCelsius(weather.main.temp)}°C</span>
              <span>💨 {weather.wind.speed} м/с</span>
              <span>☁️ {weather.clouds.all}%</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. задачи */}
      <div className="todo-section">
        <h1 className="todo-title">
          Задачи
          <span className="todo-count">{todos.length}</span>
        </h1>
        <ToDoForm addTask={addTask} />
        <div className="todo-list">
          {todos.length === 0 && <p className="todo-empty">Нет задач. Добавь первую.</p>}
          {todos.map(todo => (
            <ToDo key={todo.id} todo={todo} toggleTask={toggleTask} removeTask={removeTask} />
          ))}
        </div>
      </div>

      {/* 3. wordle — фиксирован в правом нижнем углу экрана */}
      <Wordle />
    </div>
  );
}

export default App;


