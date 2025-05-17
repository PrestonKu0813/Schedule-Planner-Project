import rmp from "ratemyprofessor-api";

async function fetchProfessorsByName(profName) {
  try {
    const schools = await rmp.searchSchool(
      "Rutgers - State University of New Jersey"
    );
    if (!Array.isArray(schools) || schools.length === 0) {
      throw new Error("School not found");
    }
    const schoolId = schools[0].node.id;
    const ProfSearchResults = await rmp.searchProfessorsAtSchoolId(
      profName,
      schoolId
    );
    return ProfSearchResults;
  } catch (err) {
    console.error("Error fetching professor data:", err.message);
    throw err;
  }
}

(async () => {

  const savedProfData = await fetchProfessorsByName("Corey Stone");


  if (savedProfData.length > 0) {
    const firstProf = savedProfData;
    console.log(firstProf);
    //console.log("Name:", firstProf.node.firstName, firstProf.node.lastName);
    //console.log("Rating:", firstProf.node.avgRating);
  }
})();