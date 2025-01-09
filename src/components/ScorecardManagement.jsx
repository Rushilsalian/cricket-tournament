import React, { useState, useEffect } from 'react';
import '../components/ScorecardManagement.css';

const ScorecardManagement = () => {
  const [matches, setMatches] = useState([]);
  const [matchDetails, setMatchDetails] = useState({ team1: '', team2: '' });
  const [teams, setTeams] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [ballDetails, setBallDetails] = useState({ runs: '', event: '' });

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('teams')) || [];
    const storedMatches = JSON.parse(localStorage.getItem('matches')) || [];
    setTeams(storedTeams);
    setMatches(storedMatches);
  }, []);

  const addMatch = () => {
    if (matchDetails.team1 && matchDetails.team2) {
      const newMatch = {
        ...matchDetails,
        id: matches.length + 1,
        balls: [],
        totalRuns: 0,
        totalWickets: 0,
        currentOver: 0,
        currentBall: 0,
      };
      const updatedMatches = [...matches, newMatch];
      setMatches(updatedMatches);
      localStorage.setItem('matches', JSON.stringify(updatedMatches)); 
      setMatchDetails({ team1: '', team2: '' });
    }
  };

  const addBallDetails = () => {
    if (currentMatch !== null) {
      const updatedMatches = matches.map((match) => {
        if (match.id === currentMatch) {
          let { currentOver, currentBall, totalRuns, totalWickets } = match;
  
          if (ballDetails.event === 'WD' || ballDetails.event === 'N') {
            totalRuns += parseInt(ballDetails.runs || 0);
            currentBall += 1;
          } else {
            currentBall += 1;
            totalRuns += parseInt(ballDetails.runs || 0);
  
            if (ballDetails.event === 'wicket') {
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
              },
            ],
            currentOver,
            currentBall,
            totalRuns,
            totalWickets,
          };
          return updatedMatch;
        }
        return match;
      });
  
      setMatches(updatedMatches);
      localStorage.setItem('matches', JSON.stringify(updatedMatches)); 
      setBallDetails({ runs: '', event: '' });
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
          onChange={(e) => setCurrentMatch(parseInt(e.target.value))}
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
            <option key={team.name} value={team.name}>
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
            <option key={team.name} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <button className="btn add-btn" onClick={addMatch}>
        Add Match
      </button>
      {currentMatch !== null && (
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
          <button className="btn add-btn" onClick={addBallDetails}>
            Add Ball
          </button>
        </div>
      )}
      <div className="matches-list">
        <h3>Matches</h3>
        {matches.map((match) => (
          <div key={match.id} className="match-card">
            <h4>{match.team1} vs {match.team2}</h4>
            <p>Total Runs: {match.totalRuns}</p>
            <p>Total Wickets: {match.totalWickets}</p>
            <ul className="ball-list">
              {match.balls.map((ball, index) => (
                <li key={index} className="list-item">
                  Over {ball.over}: {ball.runs} runs ({ball.event || 'normal'})
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
