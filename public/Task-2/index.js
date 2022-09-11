const reactionsData = (data) => {
  let arrayMap = new Set();
  for (let ele of data) {
    const elements = ele.split(",");

    if (
      elements[2] === "true" &&
      (arrayMap[elements[0]] === undefined ||
        !arrayMap[elements[0]].includes(elements[1]))
    ) {
      arrayMap = {
        ...arrayMap,
        [elements[0]]: arrayMap[elements[0]]
          ? [...arrayMap[elements[0]], elements[1]]
          : [elements[1]],
      };
    }
  }
  return arrayMap;
};

const jobsData = (data) => {
  let arrayMap = new Set();
  for (let ele of data) {
    const elements = ele.split(",");
    if (elements[0]) {
      elements[1] = elements[1].slice(0, elements[1].length - 1);
      arrayMap = {
        ...arrayMap,
        [elements[1]]: arrayMap[elements[1]]
          ? [...arrayMap[elements[1]], elements[0]]
          : [elements[0]],
      };
    }
  }
  return arrayMap;
};

const similaritiesScore = (firstCompany, SecondCompany, users) => {
  const firstCompanyName = firstCompany[0],
    SecondCompanyName = SecondCompany[0];
  const fJobs = firstCompany[1],
    sJobs = SecondCompany[1];
  let simailarityScore = 0;

  users.map((curUser, i) => {
    let userLikedCount = 0;
    if (curUser[1].length > 1) {
      for (let k = 0; k < curUser[1].length; k++) {
        const currJob = curUser[1][k];
        if (fJobs.includes(currJob) || sJobs.includes(currJob)) {
          if (fJobs.includes(currJob)) {
            for (let Job of curUser[1]) {
              if (sJobs.includes(Job)) {
                userLikedCount++;
                break;
              }
            }
            break;
          } else if (sJobs.includes(currJob)) {
            for (let Job of curUser[1]) {
              if (fJobs.includes(Job)) {
                userLikedCount++;
                break;
              }
            }
            break;
          }
        }
      }

      if (userLikedCount !== 0) simailarityScore++;
    }
  });
  return { firstCompanyName, SecondCompanyName, simailarityScore };
};

const taskTwo = async () => {
  document.getElementById("task2").innerHTML = "<h1>loading...</h1>";

  //   for fetching ths reactions.csv data and converting them into reacable format
  const reactionRes = await fetch("../../data/reactions.csv");
  const ReactionResText = await reactionRes.text();
  const rData = ReactionResText.split("\n").slice(1);

  const userData = reactionsData(rData);
  const userEntries = Object.entries(userData);

  //   for fetching ths jobs.csv data and converting them into reacable format
  const jobsRes = await fetch("../../data/jobs.csv");
  const jobsResText = await jobsRes.text();
  const jData = jobsResText.split("\n").slice(1);

  const companyData = jobsData(jData);
  const companyEntries = Object.entries(companyData);

  let resultArray = [];

  document.getElementById("task2").innerHTML = "<h1>Comparing Data...</h1>";

  for (let i = 0; i < companyEntries.length - 1; i++) {
    for (let j = i + 1; j < companyEntries.length; j++) {
      const newObj = similaritiesScore(
        companyEntries[i],
        companyEntries[j],
        userEntries
      );
      resultArray.push(newObj);
    }
  }
  return resultArray.sort((a, b) => {
    if (a.simailarityScore === b.simailarityScore) return 0;
    else if (a.simailarityScore > b.simailarityScore) return -1;
    else return 1;
  })[0];
};

taskTwo().then((result) => {
  console.log(
    "Company 1:",
    result["firstCompanyName"],
    " Company 2:",
    result["SecondCompanyName"]
  );
  console.log("highest similarity score: ", result["simailarityScore"]);

  document.getElementById("task2").innerHTML = `<div>
      <h2> Company 1: <span>${result["firstCompanyName"]}</span> </h2><br />
      <h2> Company 2: <span>${result["SecondCompanyName"]}</span> </h2><br />
      <h2> Highest Similarity Score: <span>${result["simailarityScore"]}</span> </h2>
</div>`;
});

// Result: {firstCompanyName: '46', SecondCompanyName: '92', simailarityScore: 104}
// Output : Company 1: 46  Company 2: 92
//          highest similarity score:  104
