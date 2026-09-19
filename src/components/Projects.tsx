import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import projectsData from '../data/projects.json';
import { useLanguage } from '../i18n/LanguageContext';

interface Project {
  name: string;
  description: string;
  liveLink?: string;
  githubLink?: string;
  status?: string;
}

const Projects: React.FC = () => {
  const { chromeExtensions, githubProjects, websites } = projectsData;
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t } = useLanguage();

  const handleShowModal = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };


  const renderProjectCard = (project: Project, index: number, type: string) => (
    <div className="col d-flex align-items-stretch" key={index}>
      <div className="card shadow-sm" onClick={() => handleShowModal(project)}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{project.name}</h5>
          <p className="card-text">{project.description}</p>
          <div className="mt-auto">
            {type === 'chrome' && project.liveLink && project.status === 'active' && (
              <a href={project.liveLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{t('projects.viewExtension')}</a>
            )}
            {type === 'github' && project.githubLink && (
              <a href={project.githubLink} className="btn btn-success" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{t('projects.github')}</a>
            )}
            {type === 'github' && project.liveLink && project.status === 'active' && (
              <a href={project.liveLink} className="btn btn-primary ms-2" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{t('projects.liveDemo')}</a>
            )}
            {type === 'website' && project.liveLink && project.status === 'active' && (
              <a href={project.liveLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{t('projects.visitWebsite')}</a>
            )}
            {project.githubLink && (type === 'chrome' || type === 'website') && (
              <a href={project.githubLink} className="btn btn-success ms-2" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{t('projects.github')}</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="projects">
      <div className="container">
        <h2>{t('projects.title')}</h2>
        <hr />

        {websites.length > 0 && (
          <>
            <h3>{t('projects.websites')}</h3>
            <div className="row g-4 row-cols-1 row-cols-md-3">
              {websites.map((project, index) => renderProjectCard(project, index, 'website'))}
            </div>
            <hr />
          </>
        )}

        {chromeExtensions.length > 0 && (
          <>
            <h3>{t('projects.chromeExtensions')}</h3>
            <div className="row g-4 row-cols-1 row-cols-md-3">
              {chromeExtensions.map((project, index) => renderProjectCard(project, index, 'chrome'))}
            </div>
            <hr />
          </>
        )}

        {githubProjects.length > 0 && (
          <>
            <h3>{t('projects.githubProjects')}</h3>
            <div className="row g-4 row-cols-1 row-cols-md-3">
              {githubProjects.map((project, index) => renderProjectCard(project, index, 'github'))}
            </div>
            <hr />
          </>
        )}
      </div>

      {selectedProject && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProject.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedProject.description}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              {t('projects.close')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </section>
  );
};

export default Projects;
