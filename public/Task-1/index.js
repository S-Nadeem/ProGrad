const similarities = (firstPerson, secondPerson) => {
  const firstUser = firstPerson[0],
    secondUser = secondPerson[0];

  const firstPJobs = firstPerson[1],
    secondPJobs = secondPerson[1];

  let fLength = firstPJobs.length;
  let sLength = secondPJobs.length;

  let simailarityScore = 0;

  if (fLength > sLength) {
    firstPJobs.map((ele) => secondPJobs.includes(ele) && simailarityScore++);
  } else {
    secondPJobs.map((ele) => firstPJobs.includes(ele) && simailarityScore++);
  }

  return { firstUser, secondUser, simailarityScore };
};

const getCsvData = async () => {
  document.getElementById("task1").innerHTML = "<h1>loading...</h1>";
  const response = await fetch("../../data/reactions.csv");
  const responseText = await response.text();

  const data = responseText.split("\n").slice(1);
  let userEntries = new Set();
  for (let ele of data) {
    const elements = ele.split(",");
    if (
      elements[2] === "true" &&
      (userEntries[elements[0]] === undefined ||
        !userEntries[elements[0]].includes(elements[1]))
    ) {
      userEntries = {
        ...userEntries,
        [elements[0]]: userEntries[elements[0]]
          ? [...userEntries[elements[0]], elements[1]]
          : [elements[1]],
      };
    }
  }

  let resultArray = [];
  const entries = Object.entries(userEntries);
  for (let i = 0; i < entries.length - 1; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const result = similarities(entries[i], entries[j]);
      resultArray.push(result);
    }
  }
  resultArray = resultArray.sort((a, b) => {
    if (a.simailarityScore === b.simailarityScore) return 0;
    else if (a.simailarityScore > b.simailarityScore) return -1;
    else return 1;
  });
  return resultArray[0];
};
getCsvData().then((result) => {
  console.log("User 1:", result["firstUser"], " User 2:", result["secondUser"]);
  console.log("highest similarity score: ", result["simailarityScore"]);
  document.getElementById("task1").innerHTML = `<div>
      <h2> User 1: <span>${result["firstUser"]}</span> </h2><br />
      <h2> User 2: <span>${result["secondUser"]}</span> </h2><br />
      <h2> Highest Similarity Score: <span>${result["simailarityScore"]}</span> </h2>
</div>`;
});
// Result:  {firstUser: '1791', secondUser: '5193', simailarityScore: 181}
// Output:  User 1: 1791  User 2: 5193
//          highest similarity score:  181
