import React from 'react';
import './PersonalProjects.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import PhotoAssistant from './PhotoAssistant';
import { AI_ASSISTANT_URL } from '../../config/assistant';

const moreProjects = [
    {
        kicker: 'COMPUTER VISION',
        title: 'CV Photo AI',
        description:
            'A local-first gallery toolkit for detecting people, visualizing results, and finding similar photos without sending the collection to a server.',
        tags: 'Python · YOLOv8 · CLIP',
        href: 'https://github.com/isabelSoares/cv-detect-people-my-gallery',
    },
];

export const PersonalProjects = () => {
    return (
        <main className="personal-projects-page">
            <section className="projects-intro" aria-labelledby="projects-intro-title">
                <p className="section-kicker">PERSONAL PROJECTS</p>
                <h1 id="projects-intro-title">Things I build outside work.</h1>
                <p className="projects-intro-lead">
                    I&apos;m curious by default. When a topic catches my attention, I learn best by
                    building something with it — usually starting from a problem I actually have or
                    a concept I want to understand better. Computer vision has been that kind of
                    rabbit hole for me: one idea leads to a prototype, and the prototype leads to a
                    deeper question. These projects are where I play, break things, and figure it
                    out as I go.
                </p>
            </section>

            <section className="assistant-section" aria-labelledby="assistant-title">
                <div className="assistant-heading">
                    <p className="section-kicker">TRY IT OUT</p>
                    <h2 id="assistant-title">AI Photographer Assistant</h2>
                    <p className="assistant-description">
                        Upload a photo and get practical suggestions for composition, lighting, and
                        framing. The analysis runs in real time and your photo is not stored.
                    </p>
                </div>

                <PhotoAssistant workerUrl={AI_ASSISTANT_URL} hideTitle />

                <a
                    className="assistant-repo-link"
                    href="https://github.com/isabelSoares/ai-photographer-assistant"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View project on GitHub <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
            </section>

            <section className="project-list" aria-labelledby="project-list-title">
                <div className="project-list-heading">
                    <p className="section-kicker">ALL PROJECTS</p>
                    <h2 id="project-list-title">More things I&apos;ve been exploring.</h2>
                </div>
                <div className="project-grid">
                    {moreProjects.map((project) => (
                        <article className="project-card" key={project.title}>
                            <p className="project-card-kicker">{project.kicker}</p>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-card-footer">
                                <span>{project.tags}</span>
                                <a href={project.href} target="_blank" rel="noopener noreferrer">
                                    View project <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};
