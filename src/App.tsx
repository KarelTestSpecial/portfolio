import React from 'react';
import './App.css';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { useScrollReveal } from './hooks/useScrollReveal';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AthenaShowcase from './components/AthenaShowcase';
import Footer from './components/Footer';

function App() {
  useScrollReveal();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="app-shell" id="top">
          <Header />
          <main>
            <Hero />
            <About />
            <Projects />
            <AthenaShowcase />
            <Contact />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
