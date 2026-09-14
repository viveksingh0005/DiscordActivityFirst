const PlayerList = ({ members }) => {
  if (!members || members.length === 0) {
    return <p className="empty-state">No one here yet.</p>;
  }

  return (
    <ul className="player-list">
      {members.map((member) => (
        <li key={member.discordId} className="player-item">
          <img
            src={
              member.avatar
                ? `https://cdn.discordapp.com/avatars/${member.discordId}/${member.avatar}.png`
                : "/default-avatar.png"
            }
            alt={member.username}
            className="player-avatar"
          />
          <span className="player-name">{member.username}</span>
          {member.isHost && <span className="host-badge">Host</span>}
        </li>
      ))}
    </ul>
  );
};

export default PlayerList;