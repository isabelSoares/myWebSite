import React from 'react';
import './NotFound.scss';

import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <main className="not-found">
            <div className="not-found-copy">
                <p className="section-kicker">404 / OFF THE CONTACT SHEET</p>
                <h1>This page is not in the album.</h1>
                <p className="not-found-lead">
                    The address may have changed, or the link may be missing a frame. The rest of the
                    portfolio is still here.
                </p>
                <Link className="primary-action" to="/">Back to the homepage</Link>
            </div>
        </main>
    );
};
