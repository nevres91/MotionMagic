import React from "react";

const Card = () => {
  return (
    <div className="card">
      <div className="card-overlay"></div>
      <div className="card-image">
        <div className="rating">
          <div className="about-overlay">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius,
              explicabo ipsum mollitia veniam rem inventore, voluptas reiciendis
              veritatis magni fugiat amet fugit dolor nisi nemo expedita debitis
              necessitatibus nobis nostrum laudantium consequuntur earum
              corporis minus. Culpa explicabo sed architecto blanditiis! Lorem
              ipsum dolor sit amet consectetur, adipisicing elit. Possimus eius
              tempora cupiditate earum voluptatum voluptas a aperiam vitae
              molestias iure? Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Voluptate reiciendis, quibusdam soluta molestias
              aliquid nisi fuga illo iusto deleniti delectus!
            </p>
          </div>
          <div></div>
          <span>7.5</span>
        </div>
        <span className="quality">HD</span>
      </div>
      <div className="card-details">
        <h3>Interstellar</h3>
        <p>English</p>
        <div className="release-date">
          <span>2020</span>
          <span>208min</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
