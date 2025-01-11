import { collection, addDoc, getDocs,doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Add a new team
export const addTeam = async (teamData, teamId = null) => {
  try {
    const teamDoc = teamId ? doc(db, "teams", teamId) : doc(db, "teams"); // Use teamId or auto-generate
    await setDoc(teamDoc, teamData); // Overwrite existing document if it exists
    console.log("Team added with ID:", teamDoc.id);
  } catch (e) {
    console.error("Error adding team:", e.message);
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
