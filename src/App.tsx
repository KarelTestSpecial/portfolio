import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AthenaShowcase from './components/AthenaShowcase';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <AthenaShowcase />
      <Footer />
    </div>
  );
}

export default App;