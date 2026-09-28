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
                    <p className="eyebrow">AI ENGINEER / FRONTEND DEVELOPER</p>
                    <h1 id="intro-title">Building useful AI experiences, one thoughtful interface at a time.</h1>
                    <p className="about-me-lead">
                        I&apos;m Isabel Soares, an AI Engineer in Lisbon working at the intersection of
                        large language models, automation, and modern web development.
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
                        src="https://my-website-gallery.s3.eu-west-2.amazonaws.com/general/meMyselfAndI.JPG"
                        alt="Isabel Soares"
                        className="about-me-portrait"
                    />
                    <span className="about-me-stamp">IS<br />26</span>
                </div>
            </section>

            <section className="about-me-details" aria-label="Profile details">
                <div>
                    <p className="section-kicker">01 / PROFILE</p>
                    <h2>Technical depth with a human focus.</h2>
                </div>
                <div className="about-me-details-copy">
                    <p>
                        I build production AI systems that make complex work feel simpler. At Vodafone,
                        I design multi-agent workflows, validation guardrails, and interfaces that help
                        teams use AI with confidence.
                    </p>
                    <p>
                        My background in frontend development keeps me close to the people using what I
                        build. I care about clear interactions, reliable systems, and the details that make
                        technology feel natural.
                    </p>
                    <div className="social-links">
                        <a href="mailto:isabel.srsoares@gmail.com"><FontAwesomeIcon icon={faEnvelope} /> Email</a>
                        <a href="https://www.linkedin.com/in/isabel-soares-58116b1a4" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a>
                        <a href="https://github.com/isabelSoares" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} /> GitHub</a>
                    </div>
                </div>
            </section>
        </main>
    );
};
