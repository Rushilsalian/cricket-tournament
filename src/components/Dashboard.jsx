import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const matchesCollection = collection(db, 'matches');
      const matchSnapshot = await getDocs(matchesCollection);
      const matchData = matchSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMatches(matchData);
    };

    fetchMatches();
  }, []);

  const getTopPerformers = (balls) => {
    const playerStats = {};

    balls.forEach((ball) => {
      if (ball.batter) {
        if (!playerStats[ball.batter]) {
          playerStats[ball.batter] = { runs: 0, wickets: 0 };
        }
        playerStats[ball.batter].runs += parseInt(ball.runs || 0);
      }

      if (ball.event === 'wicket' && ball.bowler) {
        if (!playerStats[ball.bowler]) {
          playerStats[ball.bowler] = { runs: 0, wickets: 0 };
        }
        playerStats[ball.bowler].wickets += 1;
      }
    });

    const topScorer = Object.entries(playerStats).reduce((top, [player, stats]) =>
      stats.runs > (top?.stats.runs || 0) ? { player, stats } : top,
      null
    );

    const topWicketTaker = Object.entries(playerStats).reduce((top, [player, stats]) =>
      stats.wickets > (top?.stats.wickets || 0) ? { player, stats } : top,
      null
    );

    return {
      topScorer: topScorer ? `${topScorer.player} (${topScorer.stats.runs} runs)` : 'No data',
      topWicketTaker: topWicketTaker
        ? `${topWicketTaker.player} (${topWicketTaker.stats.wickets} wickets)`
        : 'No data',
    };
  };

  return (
    <div className="container">
      <h1>Cricket Tournament Management</h1>
      <p>Welcome to the cricket tournament management app. Below is an overview of match data.</p>

      {matches.length > 0 ? (
        <div>
          {matches.map((match) => {
            const { topScorer, topWicketTaker } = getTopPerformers(match.balls);

            return (
              <div key={match.id} className="match-card">
                <h2>
                  {match.team1} vs {match.team2}
                </h2>
                <p><strong>Total Runs:</strong> {match.totalRuns}</p>
                <p><strong>Total Wickets:</strong> {match.totalWickets}</p>
                <p><strong>Top Scorer:</strong> {topScorer}</p>
                <p><strong>Top Wicket-Taker:</strong> {topWicketTaker}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading match data...</p>
      )}
    </div>
  );
};

export default Dashboard;
