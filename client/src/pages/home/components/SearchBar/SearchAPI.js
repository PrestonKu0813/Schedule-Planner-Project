import { courseSearch, subjectSearch, subjectCourseSearch } from "../api";

export async function SearchAPI(searchValue, selectedTag) {
  // empty input
  if (searchValue === "" && selectedTag === "all") {
    return [];
  }

  // Choose which fetch function and its arguments
  let fetchFunction;
  let args;
  if (selectedTag === "all") {
    // search all subjects
    fetchFunction = courseSearch;
    args = [searchValue];
  } else if (searchValue === "") {
    // no input, filtering by subject
    fetchFunction = subjectSearch;
    args = [selectedTag];
  } else {
    // both a subject filter and a keyword
    fetchFunction = subjectCourseSearch;
    args = [selectedTag, searchValue];
  }

  const json = await fetchFunction(...args);

  if (json.message === "no result") {
    return [];
  }

  return Object.values(json).map((course) => ({
    ...course,
    selected_sections: [],
  }));
}
