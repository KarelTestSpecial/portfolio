import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import projectsData from '../data/projects.json';
import { useLanguage } from '../i18n/LanguageContext';
import {
  IconArrowRight,
  IconCode,
  IconExternal,
  IconGithub,
  IconGlobe,
  IconPuzzle,
} from './Icons';

type ProjectType = 'website' | 'chrome' | 'github';

interface Project {
  name: string;
  description: string;
  descriptionEn?: string;
  liveLink?: string;
  githubLink?: string;
  status?: string;
}

const typeLabels: Record<ProjectType, string> = {
  website: 'projects.websites',
  chrome: 'projects.chromeExtensions',
  github: 'projects.githubProjects',
};

const typeIcons: Record<ProjectType, React.ReactNode> = {
  website: <IconGlobe size={18} />,
  chrome: <IconPuzzle size={18} />,
  github: <IconCode size={18} />,
};

const Projects: React.FC = () => {
  const { chromeExtensions, githubProjects, websites } = projectsData;
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedType, setSelectedType] = useState<ProjectType>('website');
  const { t, language } = useLanguage();

  /**
   * Project descriptions come from `projects/projects.tsv` (or the Google Sheet).
   * The English text is optional: without it the Dutch description is shown.
   */
  const describe = (project: Project) =>
    language === 'en' && project.descriptionEn
      ? project.descriptionEn
      : project.description;

  const handleShowModal = (project: Project, type: ProjectType) => {
    setSelectedProject(project);
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  /** Soft spotlight that follows the cursor inside a card. */
  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    element.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  const isActive = (project: Project) => project.status === 'active';

  const renderCard = (project: Project, type: ProjectType) => {
    const active = isActive(project);

    return (
      <article
        className="project-card"
        key={`${type}-${project.name}`}
        onMouseMove={handlePointerMove}
        onClick={() => handleShowModal(project, type)}
      >
        <span className="project-card__topbar" aria-hidden="true" />

        <div className="project-card__head">
          <span className={`badge-soft badge-soft--${type}`}>
            {typeIcons[type]}
            {t(typeLabels[type])}
          </span>
          {project.status && (
            <span className={`status-dot ${active ? '' : 'status-dot--inactive'}`}>
              {active ? t('projects.status.active') : t('projects.status.inactive')}
            </span>
          )}
        </div>

        <h5 className="project-card__title">{project.name}</h5>
        <p className="project-card__text">{describe(project)}</p>

        <div className="project-card__actions">
          {type === 'chrome' && project.liveLink && active && (
            <a
              href={project.liveLink}
              className="btn btn-brand"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {t('projects.viewExtension')}
            </a>
          )}

          {type === 'website' && project.liveLink && active && (
            <a
              href={project.liveLink}
              className="btn btn-brand"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {t('projects.visitWebsite')}
            </a>
          )}

          {type === 'github' && project.liveLink && active && (
            <a
              href={project.liveLink}
              className="btn btn-brand"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {t('projects.liveDemo')}
            </a>
          )}

          {project.githubLink && (
            <a
              href={project.githubLink}
              className="btn btn-github"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <IconGithub size={15} className="me-2" />
              {t('projects.github')}
            </a>
          )}

          <button
            type="button"
            className="project-card__details"
            onClick={(e) => {
              e.stopPropagation();
              handleShowModal(project, type);
            }}
          >
            {t('projects.details')}
            <IconArrowRight size={15} />
          </button>
        </div>
      </article>
    );
  };

  const renderGroup = (title: string, projects: Project[], type: ProjectType) => {
    if (projects.length === 0) return null;

    return (
      <React.Fragment key={type}>
        <h3 data-reveal>
          {title}
          <span className="count-pill">
            {projects.length} {t('projects.items')}
          </span>
        </h3>
        <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
          {projects.map((project) => (
            <div className="col d-flex align-items-stretch" key={project.name} data-reveal>
              {renderCard(project, type)}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  return (
    <section id="projects">
      <div className="container">
        <h2 data-reveal>{t('projects.title')}</h2>

        {renderGroup(t('projects.websites'), websites, 'website')}
        {renderGroup(t('projects.chromeExtensions'), chromeExtensions, 'chrome')}
        {renderGroup(t('projects.githubProjects'), githubProjects, 'github')}
      </div>

      {selectedProject && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <div>
              <span className={`badge-soft badge-soft--${selectedType} mb-2`}>
                {typeIcons[selectedType]}
                {t(typeLabels[selectedType])}
              </span>
              <Modal.Title>{selectedProject.name}</Modal.Title>
            </div>
          </Modal.Header>

          <Modal.Body>
            {selectedProject.status && (
              <p className="mb-2">
                <span
                  className={`status-dot ${
                    isActive(selectedProject) ? '' : 'status-dot--inactive'
                  }`}
                >
                  {isActive(selectedProject)
                    ? t('projects.status.active')
                    : t('projects.status.inactive')}
                </span>
              </p>
            )}
            <p className="mb-0">{describe(selectedProject)}</p>

            <div className="d-flex flex-wrap gap-2 mt-4">
              {selectedProject.liveLink && isActive(selectedProject) && (
                <a
                  className="btn btn-brand"
                  href={selectedProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconExternal size={15} className="me-2" />
                  {t('projects.visitWebsite')}
                </a>
              )}
              {selectedProject.githubLink && (
                <a
                  className="btn btn-github"
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconGithub size={15} className="me-2" />
                  {t('projects.github')}
                </a>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-secondary" className="btn-outline-ink" onClick={handleCloseModal}>
              {t('projects.close')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </section>
  );
};

export default Projects;
