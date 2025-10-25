import React from 'react';
import projectsData from '../data/projects.json';

const Projects: React.FC = () => {
  const { chromeExtensions, githubProjects, websites } = projectsData;

  return (
    <section id="projects" className="py-5 bg-light">
      <div className="container">
        <h2>My Projects</h2>
        <hr />

        {chromeExtensions.length > 0 && (
          <>
            <h3>Chrome Extensions</h3>
            <div className="row g-4 row-cols-1 row-cols-md-3">
              {chromeExtensions.map((project, index) => (
                <div className="col d-flex align-items-stretch" key={index}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text">{project.description}</p>
                      <div className="mt-auto">
                        {project.liveLink && project.status === 'active' && (
                          <a href={project.liveLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer">View Extension</a>
                        )}
                        {project.githubLink && (
                          <a href={project.githubLink} className="btn btn-success ms-2" target="_blank" rel="noopener noreferrer">GitHub</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
          </>
        )}

        {githubProjects.length > 0 && (
          <>
            <h3>GitHub Projects</h3>
            <div className="row g-4 row-cols-1 row-cols-md-3">
              {githubProjects.map((project, index) => (
                <div className="col d-flex align-items-stretch" key={index}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text">{project.description}</p>
                      <div className="mt-auto">
                        {project.githubLink && (
                          <a href={project.githubLink} className="btn btn-success" target="_blank" rel="noopener noreferrer">GitHub</a>
                        )}
                        {project.liveLink && project.status === 'active' && (
                          <a href={project.liveLink} className="btn btn-primary ms-2" target="_blank" rel="noopener noreferrer">Live Demo</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
          </>
        )}

        {websites.length > 0 && (
          <>
            <h3>Websites</h3>
            <div className="row g-4 row-cols-1 row-cols-md-3">
              {websites.map((website, index) => (
                <div className="col d-flex align-items-stretch" key={index}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{website.name}</h5>
                      <p className="card-text">{website.description}</p>
                      <div className="mt-auto">
                        {website.liveLink && website.status === 'active' && (
                          <a href={website.liveLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Visit Website</a>
                        )}
                        {website.githubLink && (
                          <a href={website.githubLink} className="btn btn-success ms-2" target="_blank" rel="noopener noreferrer">GitHub</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default Projects;