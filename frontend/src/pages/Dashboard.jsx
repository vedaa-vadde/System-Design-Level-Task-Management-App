import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem("boards");

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 1,
        name: "Professional Tasks",
      },
      {
        id: 2,
        name: "Personal Tasks",
      },
    ];
  });

  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  function createBoard(e) {
    e.preventDefault();

    if (!boardName.trim()) return;

    const newBoard = {
      id: Date.now(),
      name: boardName,
    };

    setBoards([...boards, newBoard]);
    setBoardName("");
  }

  function deleteBoard(id) {
    if (id === 1 || id === 2) {
      alert("Default boards cannot be deleted");
      return;
    }

    const updated = boards.filter((board) => board.id !== id);
    setBoards(updated);
  }

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <div className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          TaskFlow
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-800">
            My Boards
          </h2>

          <p className="text-slate-500 mt-2">
            Manage all your project workspaces
          </p>
        </div>

        {/* Create Board */}
        <form
          onSubmit={createBoard}
          className="bg-white p-5 rounded-2xl shadow-sm flex gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="Enter board name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl"
          >
            Create Board
          </button>
        </form>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {boards.map((board) => (
            <div
              key={board.id}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
            >

              <Link to={`/board/${board.id}`}>
                <h3 className="text-2xl font-bold text-slate-800 hover:text-blue-600">
                  {board.name}
                </h3>
              </Link>

              <p className="text-slate-500 mt-3">
                Project workspace board
              </p>

              <button
                onClick={() => deleteBoard(board.id)}
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
              >
                Delete Board
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;