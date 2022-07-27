const { groupStoredMessagesByYearAndMonth } = require("./index");

groupStoredMessagesByYearAndMonth()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.log(err);
  });
