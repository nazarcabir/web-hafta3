import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--card-bg)',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto'
        }}>
            <div className="container">
                <p style={{ color: 'var(--text-secondary)' }}>
                    © {new Date().getFullYear()} BEUBlog. Tüm hakları saklıdır.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
