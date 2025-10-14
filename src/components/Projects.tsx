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
            <div className="row">
              {chromeExtensions.map((project, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text">{project.description}</p>
                      {project.liveLink && project.status === 'active' && (
                        <a href={project.liveLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer">View Extension</a>
                      )}
                      {project.githubLink && (
                        <a href={project.githubLink} className="btn btn-secondary ms-2" target="_blank" rel="noopener noreferrer">GitHub</a>
                      )}
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
            <div className="row">
              {githubProjects.map((project, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text">{project.description}</p>
                      {project.githubLink && (
                        <a href={project.githubLink} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">GitHub</a>
                      )}
                      {project.liveLink && project.status === 'active' && (
                        <a href={project.liveLink} className="btn btn-primary ms-2" target="_blank" rel="noopener noreferrer">Live Demo</a>
                      )}
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
            <div className="row">
              {websites.map((website, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{website.name}</h5>
                      <p className="card-text">{website.description}</p>
                      {website.liveLink && website.status === 'active' && (
                        <a href={website.liveLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Visit Website</a>
                      )}
                      {website.githubLink && (
                        <a href={website.githubLink} className="btn btn-secondary ms-2" target="_blank" rel="noopener noreferrer">GitHub</a>
                      )}
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