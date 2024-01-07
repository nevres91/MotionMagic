import React from "react";

const SocialMedia = () => {
  return (
    <div className="social-container">
      <div className="social-media">
        <a href="https://github.com/nevres91" target="_blank" rel="noreferrer">
          <button className="github"></button>
        </a>
        <a
          href="https://www.facebook.com/nevres.muratovic"
          target="_blank"
          rel="noreferrer"
        >
          <button className="facebook"></button>
        </a>
        <a
          href="https://www.linkedin.com/in/nevres-muratovic-83861a264/"
          target="_blank"
          rel="noreferrer"
        >
          <button className="linkedin"></button>
        </a>
      </div>
      <footer>
        <p>
          Built with React and TypeScript. Explore our collection of movies.
        </p>
        <p>
          By using Motion Magic, you agree to our Privacy Policy and Terms of
          Service.
        </p>
        <p>
          <span>© 2024 Motion Magic</span>
        </p>
      </footer>
    </div>
  );
};

export default SocialMedia;
