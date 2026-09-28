import React from 'react';
import './ResumeCV.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUpRightFromSquare, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

interface Experience {
    company: string;
    role: string;
    period: string;
    summary: string;
    bullets: string[];
    accent: string;
}

const experience: Experience[] = [
    {
        company: 'Vodafone Portugal',
        role: 'AI Engineer',
        period: 'October 2025 — Current',
        summary: 'Building production AI solutions that turn large language models into dependable products and workflows.',
        bullets: [
            'Architected and deployed enterprise LLM features with Azure OpenAI, including end-to-end multi-agent systems and automated CI/CD pipelines.',
            'Designed DocGen, an AI system automating documentation across 30+ React components and 100+ microservices.',
            'Built the AI Governance Portal with real-time validation, automated error correction, and an interactive chatbot UI.',
            'Improved LLM reliability through prompt engineering, evaluation frameworks, and output validation guardrails.'
        ],
        accent: '01'
    },
    {
        company: 'Vodafone Portugal',
        role: 'Frontend Developer',
        period: 'February 2024 — October 2025',
        summary: 'Engineered user interfaces across consumer and business products during a large-scale frontend migration.',
        bullets: [
            'Built key interfaces in React and Vue.js for consumer and business web applications.',
            'Enhanced the TOBi chatbot interface with clearer conversational UX patterns for high-volume customer interactions.'
        ],
        accent: '02'
    },
    {
        company: 'Vodafone Portugal',
        role: 'Enterprise Application Integration Developer',
        period: 'December 2022 — February 2024',
        summary: 'Connected enterprise systems and supported reliable services across Vodafone CORE IT.',
        bullets: [
            'Developed and maintained integration services using webMethods Integration Server.',
            'Managed APIs through API Gateway and contributed to middleware solutions.'
        ],
        accent: '03'
    },
    {
        company: 'Instituto Superior Técnico',
        role: 'Invited Teaching Assistant',
        period: 'October 2021 — April 2022',
        summary: 'Supported Data Science course delivery and helped students with practical assignments.',
        bullets: [],
        accent: '04'
    },
    {
        company: 'Primavera Business Software Solutions / Cegid',
        role: 'Research Developer | Artificial Intelligence',
        period: 'July 2021 — September 2021',
        summary: 'Explored conversational AI and natural language processing for client-facing applications.',
        bullets: [
            'Developed a Python and Rasa chatbot to answer client queries.',
            'Authored a technical article about chatbot technologies.'
        ],
        accent: '05'
    }
];

const skills = [
    { label: 'AI & ML', values: 'Azure OpenAI · LLMs · Prompt Engineering · Multi-Agent Systems · NLP' },
    { label: 'Programming', values: 'Python · JavaScript · TypeScript' },
    { label: 'Frontend', values: 'React · Vue.js · HTML · CSS' },
    { label: 'Tools', values: 'Git · CI/CD · Azure' }
];

export const ResumeCV = () => {
    return (
        <main className="resume-cv">
            <header className="resume-heading">
                <div>
                    <p className="section-kicker">02 / EXPERIENCE</p>
                    <h1>A career in progress.</h1>
                </div>
                <a className="resume-contact" href="mailto:isabel.srsoares@gmail.com">isabel.srsoares@gmail.com <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>
            </header>

            <section className="experience-list" id="experience" aria-label="Professional experience">
                {experience.map((item) => (
                    <article className="experience-card" key={`${item.company}-${item.role}`}>
                        <div className="experience-index">{item.accent}</div>
                        <div className="experience-content">
                            <div className="experience-meta">
                                <span>{item.company}</span>
                                <span><FontAwesomeIcon icon={faCalendarDays} /> {item.period}</span>
                            </div>
                            <h2>{item.role}</h2>
                            <p className="experience-summary">{item.summary}</p>
                            {item.bullets.length > 0 && (
                                <ul>
                                    {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                                </ul>
                            )}
                        </div>
                    </article>
                ))}
            </section>

            <section className="resume-lower-grid">
                <div className="resume-panel">
                    <p className="section-kicker">03 / EDUCATION</p>
                    <h2>Instituto Superior Técnico</h2>
                    <p className="resume-period">September 2017 — November 2022</p>
                    <p>Bachelor&apos;s and master&apos;s degree in Computer Science and Engineering.</p>
                    <ul>
                        <li>ATHENS Network Programme at Technical University of Munich: Vehicular Crashworthiness, Very Good.</li>
                        <li>Academic Merit Award for the first year of the MSc.</li>
                        <li>Deloitte&apos;s award for the best student of the Data Science course in 2020/2021.</li>
                    </ul>
                </div>
                <div className="resume-panel skills-panel">
                    <p className="section-kicker">04 / TOOLKIT</p>
                    {skills.map((skill) => (
                        <div className="skill-row" key={skill.label}>
                            <strong>{skill.label}</strong>
                            <span>{skill.values}</span>
                        </div>
                    ))}
                    <div className="language-row"><strong>Languages</strong><span>Portuguese (Native) · English (Professional)</span></div>
                </div>
            </section>

            <a className="resume-scroll-note" href="#experience"><FontAwesomeIcon icon={faArrowDown} /> Scroll to explore</a>
        </main>
    );
};
