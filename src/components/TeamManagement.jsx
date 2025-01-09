import React, { useEffect, useState } from 'react';
import '../components/TeamManagement.css'; 
const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const [newMember, setNewMember] = useState('');
  const [currentMembers, setCurrentMembers] = useState([]);

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('teams')) || [];
    setTeams(storedTeams);
  }, []);
  const addMember = () => {
    if (newMember.trim() !== '') {
      setCurrentMembers([...currentMembers, newMember]);
      setNewMember('');
    }
  };

  const addTeam = () => {
    if (newTeam.trim() !== '') {
      const newTeamData = { name: newTeam, members: currentMembers };
      const updatedTeams = [...teams, newTeamData];
      setTeams(updatedTeams);
      localStorage.setItem('teams', JSON.stringify(updatedTeams)); // Save teams to localStorage
      setNewTeam('');
      setCurrentMembers([]);
    }
  };
  

  return (
    <div className="team-management">
      <h2 className="header">Manage Teams</h2>

      {/* Add Team Name */}
      <div className="input-group">
        <input
          type="text"
          className="input"
          placeholder="Enter team name"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
        />
      </div>

      {/* Add Members */}
      <div className="input-group">
        <input
          type="text"
          className="input"
          placeholder="Enter member name"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
        />
        <button className="btn add-btn" onClick={addMember}>
          Add Member
        </button>
      </div>

      {/* Current Members List */}
      <div className="members-section">
        <h4 className="sub-header">Current Members</h4>
        <ul className="list">
          {currentMembers.map((member, index) => (
            <li key={index} className="list-item">
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Team Button */}
      <button className="btn save-btn" onClick={addTeam}>
        Add Team
      </button>

      {/* Teams List */}
      <div className="teams-section">
        <h3 className="header">Teams</h3>
        {teams.map((team, index) => (
          <div key={index} className="team-card">
            <h4 className="team-name">{team.name}</h4>
            <ul className="list">
              {team.members.map((member, idx) => (
                <li key={idx} className="list-item">
                  {member}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;
