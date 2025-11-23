import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="jumbotron text-center">
      <div className="container">
        <h1 className="display-4">Welcome to My Portfolio</h1>
        <p className="lead text-muted text-readable-shadow">A showcase of my projects and skills.</p>
      </div>
    </section>
  );
};

export default Hero;
