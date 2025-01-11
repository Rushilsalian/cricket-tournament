import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./TeamManagement.css";

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [newMember, setNewMember] = useState("");
  const [currentMembers, setCurrentMembers] = useState([]);
  const [editTeamId, setEditTeamId] = useState(null);

  const teamsCollection = collection(db, "teams");

  // Fetch all teams from Firestore
  const fetchTeams = async () => {
    try {
      const querySnapshot = await getDocs(teamsCollection);
      const teamsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsList);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Add a new member to the team
  const addMember = () => {
    if (newMember.trim() !== "" && !currentMembers.includes(newMember)) {
      setCurrentMembers([...currentMembers, newMember]);
      setNewMember("");
    } else {
      alert("Member name cannot be empty or duplicate.");
    }
  };

  // Remove a member from the current list
  const removeMember = (index) => {
    const updatedMembers = currentMembers.filter((_, i) => i !== index);
    setCurrentMembers(updatedMembers);
  };

  // Save or update a team
  const saveTeam = async () => {
    if (newTeam.trim() !== "" && currentMembers.length > 0) {
      const teamData = { name: newTeam, members: currentMembers };

      try {
        if (editTeamId) {
          // Update existing team
          const teamDoc = doc(db, "teams", editTeamId);
          await updateDoc(teamDoc, teamData);
        } else {
          // Add new team
          await addDoc(teamsCollection, teamData);
        }

        // Refresh the team list
        fetchTeams();

        // Reset inputs
        resetForm();
      } catch (error) {
        console.error("Error saving team:", error);
      }
    } else {
      alert("Please enter a team name and add at least one member.");
    }
  };

  // Delete a team
  const deleteTeam = async (teamId) => {
    try {
      const teamDoc = doc(db, "teams", teamId);
      await deleteDoc(teamDoc);
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  // Edit an existing team
  const editTeam = (team) => {
    setNewTeam(team.name);
    setCurrentMembers(team.members);
    setEditTeamId(team.id);
  };

  // Reset the form
  const resetForm = () => {
    setNewTeam("");
    setNewMember("");
    setCurrentMembers([]);
    setEditTeamId(null);
  };

  return (
    <div className="team-management">
      <h2 className="header">Manage Teams</h2>

      {/* Input for team name */}
      <div className="input-group">
        <input
          type="text"
          className="input"
          placeholder="Enter team name"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
        />
      </div>

      {/* Input for adding members */}
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

      {/* Display current members */}
      <div className="members-section">
        <h4 className="sub-header">Current Members</h4>
        <ul className="list">
          {currentMembers.map((member, index) => (
            <li key={index} className="list-item">
              {member}
              <button
                className="btn delete-btn"
                onClick={() => removeMember(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Save or Update button */}
      <button className="btn save-btn" onClick={saveTeam}>
        {editTeamId ? "Update Team" : "Add Team"}
      </button>

      {/* List of teams */}
      <div className="teams-section">
        <h3 className="header">Teams</h3>
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h4 className="team-name">{team.name}</h4>
            <ul className="list">
              {team.members.map((member, idx) => (
                <li key={idx} className="list-item">
                  {member}
                </li>
              ))}
            </ul>
            <div className="team-actions">
              <button className="btn edit-btn" onClick={() => editTeam(team)}>
                Edit
              </button>
              <button
                className="btn delete-btn"
                onClick={() => deleteTeam(team.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagement;
