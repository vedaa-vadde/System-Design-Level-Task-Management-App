function CardItem({
  card,
  listId,
  handleDragStart,
  changeStatus,
  deleteCard,
  getCardColor,
  getCircleStyle,
}) {
  return (
    <div
      draggable
      onDragStart={() => handleDragStart(listId, card)}
      className={`border rounded-2xl p-4 cursor-grab hover:shadow-md transition ${getCardColor(
        card.status
      )}`}
    >
      <div className="flex justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <button
            onClick={() => changeStatus(listId, card.id)}
            className={`w-5 h-5 rounded-full border-2 mt-1 shrink-0 ${getCircleStyle(
              card.status
            )}`}
          ></button>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 break-words">
              {card.title}
            </h3>

            {card.desc && (
              <p className="text-sm text-slate-600 mt-1 break-words">
                {card.desc}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteCard(listId, card.id)}
          className="text-slate-400 hover:text-red-500 shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default CardItem;