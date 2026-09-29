import React from 'react';
import './AboutMe.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

export const AboutMe = () => {
    return (
        <main className="about-me">
            <section className="about-me-hero" aria-labelledby="intro-title">
                <div className="about-me-copy">
                    <p className="eyebrow">HELLO, I&apos;M ISABEL</p>
                    <h1 id="intro-title">I work with AI, build interfaces, and take too many photos.</h1>
                    <p className="about-me-lead">
                        I&apos;m an AI Engineer in Lisbon. At Vodafone, I work with Azure OpenAI and
                        automation workflows. Before that, I spent a few years building frontend products.
                    </p>
                    <div className="about-me-actions">
                        <Link className="primary-action" to="/resume">Explore my experience <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></Link>
                        <a className="text-action" href="mailto:isabel.srsoares@gmail.com">Let&apos;s connect</a>
                    </div>
                    <div className="about-me-facts">
                        <span><FontAwesomeIcon icon={faLocationDot} /> Lisbon, Portugal</span>
                        <span>Azure OpenAI · LLMs · React</span>
                    </div>
                </div>
                <div className="about-me-portrait-wrap">
                    <div className="about-me-portrait-label">CURIOUS BY DEFAULT</div>
                    <img
                        src="photos/IMG_7833.webp"
                        alt="Isabel Soares"
                        className="about-me-portrait"
                    />
                    <span className="about-me-stamp">IS<br />26</span>
                </div>
            </section>

            <section className="about-me-details" aria-label="Profile details">
                <div>
                    <p className="section-kicker">01 / PROFILE</p>
                    <h2>The short version.</h2>
                </div>
                <div className="about-me-details-copy">
                    <p>
                        I like understanding how things work, then making them easier for someone else to
                        use. These days that means multi-agent workflows, validation guardrails, and AI
                        tools at Vodafone.
                    </p>
                    <p>
                        I still think about the interface, not just the model behind it. A good solution
                        should be useful, understandable, and reliable on a normal Tuesday.
                    </p>
                    <div className="social-links">
                        <a href="mailto:isabel.srsoares@gmail.com"><FontAwesomeIcon icon={faEnvelope} /> Email</a>
                        <a href="https://www.linkedin.com/in/isabel-soares-58116b1a4" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a>
                        <a href="https://github.com/isabelSoares" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} /> GitHub</a>
                    </div>
                </div>
            </section>

            <section className="impact-strip" aria-label="Selected impact">
                <div className="impact-item">
                    <strong>30+</strong>
                    <span>React components supported by DocGen</span>
                </div>
                <div className="impact-item">
                    <strong>100+</strong>
                    <span>microservices kept consistent</span>
                </div>
                <div className="impact-item">
                    <strong>5</strong>
                    <span>chapters across my career so far</span>
                </div>
            </section>

            <section className="personal-note" aria-labelledby="personal-title">
                <div className="personal-note-heading">
                    <p className="section-kicker">THE NON-CV VERSION</p>
                    <h2 id="personal-title">The part that does not fit on one page.</h2>
                </div>
                <div className="personal-note-copy">
                    <p>
                        Outside work, I take photographs when I travel, go boxing and running, build LEGO,
                        listen to music, and do Pilates. None of that needs to be on a CV, but it is a much
                        better introduction to how I spend an ordinary week.
                    </p>
                    <Link className="personal-note-link" to="/hobbies">Meet me off the clock <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></Link>
                </div>
            </section>
        </main>
    );
};
