import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase"; 
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import "../components/ScorecardManagement.css";

const ScorecardManagement = () => {
  const [matches, setMatches] = useState([]);
  const [matchDetails, setMatchDetails] = useState({ team1: "", team2: "" });
  const [teams, setTeams] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [ballDetails, setBallDetails] = useState({
    runs: "",
    event: "",
    batter: "",
    bowler: "",
  });

  useEffect(() => {
    // Fetch teams from Firebase
    const fetchTeams = async () => {
      const teamSnapshot = await getDocs(collection(db, "teams"));
      const teamList = teamSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamList);
    };

    // Fetch matches from Firebase
    const fetchMatches = async () => {
      const matchSnapshot = await getDocs(collection(db, "matches"));
      const matchList = matchSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(matchList);
    };

    fetchTeams();
    fetchMatches();
  }, []);

  const addMatch = async () => {
    if (matchDetails.team1 && matchDetails.team2) {
      const team1Members =
        teams.find((team) => team.name === matchDetails.team1)?.members || [];
      const team2Members =
        teams.find((team) => team.name === matchDetails.team2)?.members || [];
      const newMatch = {
        ...matchDetails,
        balls: [],
        totalRuns: 0,
        totalWickets: 0,
        currentOver: 0,
        currentBall: 0,
        team1Members,
        team2Members,
      };

      try {
        const docRef = await addDoc(collection(db, "matches"), newMatch);
        setMatches([...matches, { id: docRef.id, ...newMatch }]);
        setMatchDetails({ team1: "", team2: "" });
      } catch (error) {
        console.error("Error adding match:", error);
      }
    }
  };

  const addBallDetails = async () => {
    if (currentMatch !== null && ballDetails.batter && ballDetails.bowler) {
      const matchRef = doc(db, "matches", currentMatch);
      const updatedMatches = matches.map((match) => {
        if (match.id === currentMatch) {
          let { currentOver, currentBall, totalRuns, totalWickets } = match;

          if (ballDetails.event === "WD" || ballDetails.event === "NO") {
            totalRuns += parseInt(ballDetails.runs || 0);
            currentBall += 1;
          } else {
            currentBall += 1;
            totalRuns += parseInt(ballDetails.runs || 0);

            if (ballDetails.event === "wicket" || ballDetails.event === "Wicket") {
              totalWickets += 1;
            }

            if (currentBall === 6) {
              currentOver += 1;
              currentBall = 0;
            }
          }

          const updatedMatch = {
            ...match,
            balls: [
              ...match.balls,
              {
                over: `${currentOver}.${currentBall}`,
                runs: ballDetails.runs,
                event: ballDetails.event,
                batter: ballDetails.batter,
                bowler: ballDetails.bowler,
              },
            ],
            currentOver,
            currentBall,
            totalRuns,
            totalWickets,
          };

          // Update Firebase
          updateDoc(matchRef, updatedMatch);

          return updatedMatch;
        }
        return match;
      });

      setMatches(updatedMatches);
      setBallDetails({ runs: "", event: "", batter: "", bowler: "" });
    }
  };

  return (
    <div className="scorecard-management">
      <h2 className="header">Manage Scorecards</h2>
      <div className="current-match">
        <label htmlFor="current-match-select">Select Match:</label>
        <select
          id="current-match-select"
          className="input"
          onChange={(e) => setCurrentMatch(e.target.value)}
        >
          <option value="">-- Select Match --</option>
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.team1} vs {match.team2}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="team1">Select Team 1:</label>
        <select
          id="team1"
          className="input"
          value={matchDetails.team1}
          onChange={(e) => setMatchDetails({ ...matchDetails, team1: e.target.value })}
        >
          <option value="">-- Select Team 1 --</option>
          {teams.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>

        <label htmlFor="team2">Select Team 2:</label>
        <select
          id="team2"
          className="input"
          value={matchDetails.team2}
          onChange={(e) => setMatchDetails({ ...matchDetails, team2: e.target.value })}
        >
          <option value="">-- Select Team 2 --</option>
          {teams.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <button className="btn add-btn" onClick={addMatch}>
        Add Match
      </button>
      {currentMatch && (
        <div className="ball-details">
          <h4>Add Ball Details</h4>
          <input
            type="number"
            className="input small-input"
            placeholder="Runs"
            value={ballDetails.runs}
            onChange={(e) => setBallDetails({ ...ballDetails, runs: e.target.value })}
          />
          <input
            type="text"
            className="input small-input"
            placeholder="Event (e.g., wicket, wide, no-ball)"
            value={ballDetails.event}
            onChange={(e) => setBallDetails({ ...ballDetails, event: e.target.value })}
          />
          <label>Batter:</label>
          <select
            value={ballDetails.batter}
            onChange={(e) => setBallDetails({ ...ballDetails, batter: e.target.value })}
          >
            <option value="">-- Select Batter --</option>
            {matches
              .find((match) => match.id === currentMatch)
              ?.team1Members.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
          </select>
          <label>Bowler:</label>
          <select
            value={ballDetails.bowler}
            onChange={(e) => setBallDetails({ ...ballDetails, bowler: e.target.value })}
          >
            <option value="">-- Select Bowler --</option>
            {matches
              .find((match) => match.id === currentMatch)
              ?.team2Members.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
          </select>
          <button className="btn add-btn" onClick={addBallDetails}>
            Add Ball
          </button>
        </div>
      )}
      <div className="matches-list">
        <h3>Matches</h3>
        {matches.map((match) => (
          <div key={match.id} className="match-card">
            <h4>
              {match.team1} vs {match.team2}
            </h4>
            <p>Total Runs: {match.totalRuns}</p>
            <p>Total Wickets: {match.totalWickets}</p>
            <ul className="ball-list">
              {match.balls.map((ball, index) => (
                <li key={index} className="list-item">
                  Over {ball.over}: {ball.runs} runs ({ball.event || "normal"})
                  <br />
                  Batter: {ball.batter}, Bowler: {ball.bowler}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScorecardManagement;
