(function (global) {
  "use strict";

  var PREFIX = "ljeto1_";
  var KEY = PREFIX + "progress";

  function empty() {
    return { games: {}, totalStars: 0 };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return empty();
      if (!data.games) data.games = {};
      if (typeof data.totalStars !== "number") data.totalStars = 0;
      return data;
    } catch (e) {
      return empty();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function getStars(gameId) {
    var data = load();
    var g = data.games[gameId];
    return g && typeof g.stars === "number" ? g.stars : 0;
  }

  function setStars(gameId, stars) {
    var data = load();
    var prev = data.games[gameId] && data.games[gameId].stars
      ? data.games[gameId].stars
      : 0;
    var next = Math.max(prev, Math.min(3, Math.max(0, stars)));
    data.games[gameId] = {
      stars: next,
      bestCorrect: Math.max(
        (data.games[gameId] && data.games[gameId].bestCorrect) || 0,
        arguments[2] || 0
      ),
      played: ((data.games[gameId] && data.games[gameId].played) || 0) + 1
    };
    var total = 0;
    Object.keys(data.games).forEach(function (id) {
      total += data.games[id].stars || 0;
    });
    data.totalStars = total;
    save(data);
    return next;
  }

  function subjectStars(gameIds) {
    var sum = 0;
    gameIds.forEach(function (id) {
      sum += getStars(id);
    });
    return sum;
  }

  function totalStars() {
    return load().totalStars || 0;
  }

  global.Progress = {
    load: load,
    getStars: getStars,
    setStars: setStars,
    subjectStars: subjectStars,
    totalStars: totalStars
  };
})(window);
