import { useState } from 'react';

const ApiDocs = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cbr');

  const tabs = [
    {
      id: 'cbr',
      title: 'ЦБ РФ',
      content: (
        <div>
          <h3>API Центробанка России</h3>
          <p><strong>Источник:</strong> <a href="https://www.cbr-xml-daily.ru/" target="_blank">cbr-xml-daily.ru</a></p>
          <p><strong>Формат:</strong> JSON</p>
          <p><strong>Бесплатно:</strong> Да, ключ API не требуется</p>
          <p><strong>Эндпоинт:</strong> <code>GET https://www.cbr-xml-daily.ru/daily_json.js</code></p>
        </div>
      )
    },
    {
      id: 'coingecko',
      title: 'Криптовалюта',
      content: (
        <div>
          <h3>CoinGecko API</h3>
          <p><strong>Документация:</strong> <a href="https://docs.coingecko.com/reference/introduction" target="_blank">docs.coingecko.com</a></p>
          <p><strong>Формат:</strong> JSON</p>
          <p><strong>Бесплатно:</strong> Да, ключ API не требуется</p>
          <p><strong>Эндпоинт:</strong> <code>GET https://api.coingecko.com/api/v3/simple/price</code></p>
        </div>
      )
    },
    {
      id: 'weather',
      title: 'Погода',
      content: (
        <div>
          <h3>Open-Meteo API</h3>
          <p><strong>Документация:</strong> <a href="https://open-meteo.com/en/docs" target="_blank">open-meteo.com</a></p>
          <p><strong>Формат:</strong> JSON</p>
          <p><strong>Бесплатно:</strong> Да, ключ API не требуется</p>
          <p><strong>Эндпоинт:</strong> <code>GET https://api.open-meteo.com/v1/forecast</code></p>
        </div>
      )
    },
    {
      id: 'localstorage',
      title: 'Хранилище',
      content: (
        <div>
          <h3>LocalStorage API</h3>
          <p><strong>Документация:</strong> <a href="https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage" target="_blank">MDN Web Docs</a></p>
          <p><strong>Тип:</strong> Встроенный API в браузере</p>
        </div>
      )
    }
  ];

  return (
    <>
      <button className="docs-button" onClick={() => setOpen(true)}>
        Документация API
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)}>X</button>
            
            <div className="modal-header">
              <h2>Документация API</h2>
              <p className="modal-subtitle">Используемые источники данных</p>
            </div>
            
            <div className="tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {tabs.find(t => t.id === activeTab)?.content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiDocs;
