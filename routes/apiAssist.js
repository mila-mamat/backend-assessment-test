const fetch = require("node-fetch");

function fetchData(tags) {
  //fetch data for each tags, and return an array of results
  return Promise.all(
    tags.map((tag) =>
      fetch(`https://hatchways.io/api/assessment/blog/posts?tag=${tag}`)
        .then((response) => response.json())
        .then((data) => {
          return data.posts;
        })
        .catch((error) => error)
    ));}

function removeDuplicate(arr) {
  return [...new Map(arr.map((item) => [item["id"], item])).values()];
}

function sortByAsc(arr, key) {
  return arr.sort((a, b) => a[key] - b[key]);
}

function sortByDesc(arr, key) {
  return arr.sort((a, b) => b[key] - a[key]);
}

module.exports = {fetchData, removeDuplicate, sortByAsc, sortByDesc};
