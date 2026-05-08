import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/board/Sidebar";
import BoardNavbar from "../components/board/BoardNavbar";
import ActivityPopup from "../components/board/ActivityPopup";
import ListColumn from "../components/board/ListColumn";

function BoardPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const storageKey = `board-${id}`;
  const globalStorageKey = `global-cards-${id}`;
  const activityStorageKey = `activities-${id}`;

  const [draggedCard, setDraggedCard] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [globalTitle, setGlobalTitle] = useState("");
  const [globalDesc, setGlobalDesc] = useState("");
  const [showActivities, setShowActivities] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem(activityStorageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [globalCards, setGlobalCards] = useState(() => {
    const saved = localStorage.getItem(globalStorageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) return JSON.parse(saved);

    return [
      { id: 1, title: "Today", cards: [], inputTitle: "", inputDesc: "" },
      { id: 2, title: "This Week", cards: [], inputTitle: "", inputDesc: "" },
      { id: 3, title: "Later", cards: [], inputTitle: "", inputDesc: "" },
    ];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(lists));
  }, [lists, storageKey]);

  useEffect(() => {
    localStorage.setItem(globalStorageKey, JSON.stringify(globalCards));
  }, [globalCards, globalStorageKey]);

  useEffect(() => {
    localStorage.setItem(activityStorageKey, JSON.stringify(activities));
  }, [activities, activityStorageKey]);

  function addActivity(text) {
    setActivities((prev) => [
      {
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  }

  function addList() {
    if (!newListName.trim()) return;

    setLists([
      ...lists,
      {
        id: Date.now(),
        title: newListName,
        cards: [],
        inputTitle: "",
        inputDesc: "",
      },
    ]);

    addActivity(`Created list "${newListName}"`);
    setNewListName("");
  }

  function updateInput(listId, field, value) {
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, [field]: value } : list
      )
    );
  }

  function addCard(listId) {
    let addedCardTitle = "";

    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;
        if (!list.inputTitle.trim()) return list;

        addedCardTitle = list.inputTitle;

        return {
          ...list,
          cards: [
            ...list.cards,
            {
              id: Date.now(),
              title: list.inputTitle,
              desc: list.inputDesc,
              status: "pending",
            },
          ],
          inputTitle: "",
          inputDesc: "",
        };
      })
    );

    if (addedCardTitle) {
      addActivity(`Added card "${addedCardTitle}"`);
    }
  }

  function addGlobalCard() {
    if (!globalTitle.trim()) return;

    setGlobalCards([
      ...globalCards,
      {
        id: Date.now(),
        title: globalTitle,
        desc: globalDesc,
        status: "pending",
      },
    ]);

    addActivity(`Created unassigned card "${globalTitle}"`);
    setGlobalTitle("");
    setGlobalDesc("");
  }

  function deleteCard(listId, cardId) {
    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
          : list
      )
    );

    addActivity("Deleted a card");
  }

  function deleteGlobalCard(cardId) {
    setGlobalCards(globalCards.filter((card) => card.id !== cardId));
    addActivity("Deleted an unassigned card");
  }

  function deleteList(listId) {
    if ([1, 2, 3].includes(listId)) {
      alert("Default lists cannot be deleted");
      return;
    }

    setLists(lists.filter((list) => list.id !== listId));
    addActivity("Deleted a list");
  }

  function changeStatus(listId, cardId) {
    setLists(
      lists.map((list) => {
        if (list.id !== listId) return list;

        return {
          ...list,
          cards: list.cards.map((card) => {
            if (card.id !== cardId) return card;

            const nextStatus =
              card.status === "pending"
                ? "ongoing"
                : card.status === "ongoing"
                ? "done"
                : "pending";

            addActivity(`Changed "${card.title}" to ${nextStatus}`);

            return { ...card, status: nextStatus };
          }),
        };
      })
    );
  }

  function handleDragStart(listId, card, fromGlobal = false) {
    setDraggedCard({ listId, card, fromGlobal });
  }

  function handleDrop(targetListId) {
    if (!draggedCard) return;

    const { listId: sourceListId, card, fromGlobal } = draggedCard;

    let updatedLists = [...lists];

    if (fromGlobal) {
      setGlobalCards((prev) => prev.filter((c) => c.id !== card.id));
    } else {
      updatedLists = updatedLists.map((list) =>
        list.id === sourceListId
          ? { ...list, cards: list.cards.filter((c) => c.id !== card.id) }
          : list
      );
    }

    const targetList = lists.find((list) => list.id === targetListId);

    updatedLists = updatedLists.map((list) =>
      list.id === targetListId
        ? { ...list, cards: [...list.cards, card] }
        : list
    );

    setLists(updatedLists);
    setDraggedCard(null);

    addActivity(`Moved "${card.title}" to "${targetList?.title}"`);
  }

  function getCardColor(status) {
    if (status === "pending") return "bg-red-50 border-red-200";
    if (status === "ongoing") return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  }

  function getCircleStyle(status) {
    if (status === "pending") return "border-red-400 bg-white";
    if (status === "ongoing") return "border-yellow-500 border-dashed bg-white";
    return "border-green-500 bg-green-500";
  }

  const totalCards =
    globalCards.length + lists.reduce((sum, list) => sum + list.cards.length, 0);

  const filteredLists = lists
    .map((list) => {
      const search = searchText.toLowerCase();

      if (!searchText.trim()) return list;

      const listMatches = list.title.toLowerCase().includes(search);

      const filteredCards = list.cards.filter(
        (card) =>
          card.title.toLowerCase().includes(search) ||
          card.desc.toLowerCase().includes(search)
      );

      if (listMatches || filteredCards.length > 0) {
        return {
          ...list,
          cards: listMatches ? list.cards : filteredCards,
        };
      }

      return null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        newListName={newListName}
        setNewListName={setNewListName}
        addList={addList}
        globalTitle={globalTitle}
        setGlobalTitle={setGlobalTitle}
        globalDesc={globalDesc}
        setGlobalDesc={setGlobalDesc}
        addGlobalCard={addGlobalCard}
        globalCards={globalCards}
        deleteGlobalCard={deleteGlobalCard}
        handleDragStart={handleDragStart}
      />

      <main className="flex-1 min-w-0 relative">
        <BoardNavbar
          searchText={searchText}
          setSearchText={setSearchText}
          activities={activities}
          showActivities={showActivities}
          setShowActivities={setShowActivities}
          navigate={navigate}
        />

        {showActivities && (
          <ActivityPopup
            activities={activities}
            setShowActivities={setShowActivities}
          />
        )}

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800">
              Workspace Board
            </h2>

            <p className="text-slate-500 mt-1">
              {lists.length} lists · {totalCards} cards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {filteredLists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                handleDrop={handleDrop}
                handleDragStart={handleDragStart}
                changeStatus={changeStatus}
                deleteCard={deleteCard}
                deleteList={deleteList}
                updateInput={updateInput}
                addCard={addCard}
                getCardColor={getCardColor}
                getCircleStyle={getCircleStyle}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BoardPage;