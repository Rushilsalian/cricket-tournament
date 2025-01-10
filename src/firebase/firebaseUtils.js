import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Add a new team
export const addTeam = async (teamData) => {
  try {
    const docRef = await addDoc(collection(db, "teams"), teamData);
    console.log("Team added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding team:", e);
  }
};

// Fetch all teams
export const fetchTeams = async () => {
  const querySnapshot = await getDocs(collection(db, "teams"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add a new match
export const addMatch = async (matchData) => {
  try {
    const docRef = await addDoc(collection(db, "matches"), matchData);
    console.log("Match added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding match:", e);
  }
};

// Fetch all matches
export const fetchMatches = async () => {
  const querySnapshot = await getDocs(collection(db, "matches"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
