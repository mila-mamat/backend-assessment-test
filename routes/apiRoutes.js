const apiAssist = require("./apiAssist");

module.exports = function (app) {

  app.get("/api/ping", function (req, res) {
    res.status(200).json({
      success: true,
    });
  });

  app.get("/api/posts/:tags?/:sortBy?/:direction?", async function (req, res) {
    // ===============================================================
    //declare the parameters and valid options
    // ===============================================================
    const tags = req.params.tags ? req.params.tags.split(",") : null;
    const sortBy = req.params.sortBy ? req.params.sortBy.toLowerCase() : null;
    const direction = req.params.direction ?
      req.params.direction.toLowerCase() :
      null;
    const sortOption = ["id", "reads", "likes", "popularity"];
    const directionOption = ["asc", "desc"];


    // ===============================================================
    //check if the tags are valid, if not send back status(400)
    // ===============================================================

    if (!tags) {
      res.status(400).json({error: "Tags parameter is required"});
      return;
    }

    if (sortBy && !sortOption.includes(sortBy)){
      res.status(400).json({error: "sortBy parameter is invalid"});
      return
    }

    if (direction && !directionOption.includes(direction)){
      res.status(400).json({error: "direction parameter is invalid"});
      return
    }

    // ===============================================================
    // if all parameters are correct
    // ===============================================================
    let result = await apiAssist.fetchData(tags);

    // deconstruct the results received from fetchData into one array of objects
    result = result.length == 1 ? result[0] : result.flat();

    //filter out duplicated posts
    let filteredResult = apiAssist.removeDuplicate(result);

    // sort the posts if requested
    if (sortBy) apiAssist.sortByAsc(filteredResult, sortBy);
    if (direction === "desc") apiAssist.sortByDesc(filteredResult, sortBy);

    res.status(200).json({
      posts: filteredResult,
    });
  });
};