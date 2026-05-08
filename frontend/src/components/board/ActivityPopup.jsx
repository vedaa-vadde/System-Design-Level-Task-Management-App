function ActivityPopup({ activities, setShowActivities }) {
  return (
    <div className="absolute right-6 top-20 w-[360px] bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-800">Activity Logs</h2>

        <button
          onClick={() => setShowActivities(false)}
          className="text-slate-400 hover:text-red-500 text-xl"
        >
          ×
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">No activity yet</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3"
            >
              <p className="text-sm text-slate-700 break-words">
                {activity.text}
              </p>

              <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivityPopup;