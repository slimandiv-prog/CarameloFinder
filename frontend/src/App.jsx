import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  return (
    <main className="construction-page">
      <div className="construction-content">
        <img
          src="/caramelofinder-logo.png"
          alt="CarameloFinder logo"
          className="construction-logo"
        />

        <h1>Em construção!</h1>

        <p>
          Estamos trabalhando para trazer CarameloFinder à vida.
        </p>

        <span className="construction-badge">
          Muito em breve!
        </span>
      </div>
    </main>
  );
}

export default App;
