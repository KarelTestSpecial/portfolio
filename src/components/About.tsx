import React from 'react';
import cvData from '../data/cv.json';

const About: React.FC = () => {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2>Curriculum Vitae</h2>
        <div className="row">
          <div className="col-md-12">
            <p>{cvData.profile}</p>
            <p><em>{cvData.notice}</em></p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h4>Contactgegevens</h4>
            <ul className="list-unstyled">
              <li><strong>Naam:</strong> {cvData.name}</li>
              <li><strong>Adres:</strong> {cvData.contact.address}</li>
              <li><strong>Email:</strong> <a href={`mailto:${cvData.contact.email}`}>{cvData.contact.email}</a></li>
              <li><strong>LinkedIn:</strong> <a href={`https://${cvData.contact.linkedin}`} target="_blank" rel="noopener noreferrer">{cvData.contact.linkedin}</a></li>
              <li><strong>GitHub:</strong> <a href={`https://${cvData.contact.github}`} target="_blank" rel="noopener noreferrer">{cvData.contact.github}</a></li>
            </ul>
          </div>
          <div className="col-md-6">
            <h4>Werkervaring</h4>
            <ul className="list-unstyled">
              {cvData.workExperience.map((job, index) => (
                <li key={index}>
                  <strong>{job.period}: {job.role}</strong> - {job.company}
                  {job.description && <p>{job.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <h4>Opleidingen</h4>
            <ul className="list-unstyled">
              {cvData.education.map((edu, index) => (
                <li key={index}>
                  <strong>{edu.year}: {edu.degree}</strong> - {edu.institution}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <h4>Skills</h4>
            {Object.entries(cvData.skills).map(([category, skills]) => (
              <p key={category}>
                <strong>{category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {skills}
              </p>
            ))}
            <h4>Talen</h4>
            <ul className="list-unstyled">
              {cvData.languages.map((lang, index) => (
                <li key={index}><strong>{lang.language}:</strong> {lang.proficiency}</li>
              ))}
            </ul>
            <h4>Vervoer</h4>
            <p>{cvData.transport}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
