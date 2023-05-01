import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  const handleClick = function () {
    onCardClick(card);
  };

  const handleLikeClick = function () {
    onCardLike(card);
  };

  const handleDeleteClick = function () {
    onCardDelete(card);
  };

  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((item) => item._id === currentUser._id);

  return (
    <li className="element">
      <article className="element__image-holder">
        {isOwn && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="element__delete"
          />
        )}
        <img
          className="element__image"
          onClick={handleClick}
          src={card.link}
          alt={card.name}
        />
        <div className="element__caption">
          <h2 className="element__title">{card.name}</h2>
          <div className="element__heart-container">
            <button
              type="button"
              onClick={handleLikeClick}
              className={`element__heart ${
                isLiked && "element__heart_clicked"
              }`}
            />
            <span className="element__heart_counter">{card.likes.length}</span>
          </div>
        </div>
      </article>
    </li>
  );
}

export default Card;
