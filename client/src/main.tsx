import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux' // <--- Імпорт
import { store } from './app/store'   // <--- Імпорт

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* Обгортка */}
      <App />
    </Provider>
  </React.StrictMode>,
)