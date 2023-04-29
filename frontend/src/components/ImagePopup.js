function ImagePopup(props) {
  const { card, onClose } = props;
  const data =
    card === null
      ? {
          visible: "",
          name: "#",
          link: "#",
        }
      : {
          visible: " popup_opened",
          name: card.name,
          link: card.link,
        };

  return (
    <section className={`popup popup_view-image${data.visible}`}>
      <figure className="popup__container popup__container_for-image">
        <button type="button" onClick={onClose} className="popup__close-btn" />
        <img className="popup__image" src={data.link} alt={data.name} />
        <figcaption className="popup__figcaption">{data.name}</figcaption>
      </figure>
    </section>
  );
}

export default ImagePopup;
