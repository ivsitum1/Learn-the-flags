(function (global) {
  "use strict";

  var PREFIX = "ljeto1_";
  var KEY = PREFIX + "progress";
  var SEEN_KEY = PREFIX + "seen";

  function empty() {
    return { games: {}, totalStars: 0, wallet: 0, spent: [] };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return empty();
      if (!data.games) data.games = {};
      if (typeof data.totalStars !== "number") data.totalStars = 0;
      if (typeof data.wallet !== "number") data.wallet = data.totalStars || 0;
      if (!Array.isArray(data.spent)) data.spent = [];
      return data;
    } catch (e) {
      return empty();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function loadSeen() {
    try {
      var raw = localStorage.getItem(SEEN_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return {};
    }
  }

  function saveSeen(data) {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(data));
    } catch (e) {
      // Ako je storage pun, resetiraj povijest viđenih.
      localStorage.removeItem(SEEN_KEY);
    }
  }

  function getSeen(gameId) {
    var all = loadSeen();
    var entry = all[gameId];
    if (!entry) return [];
    if (Array.isArray(entry)) return entry;
    return Object.keys(entry);
  }

  function markSeen(gameId, ids) {
    var all = loadSeen();
    var map = all[gameId];
    if (!map || Array.isArray(map)) {
      map = {};
      if (Array.isArray(all[gameId])) {
        all[gameId].forEach(function (id) {
          map[String(id)] = 1;
        });
      }
    }
    (ids || []).forEach(function (id) {
      if (id == null) return;
      map[String(id)] = 1;
    });
    all[gameId] = map;
    saveSeen(all);
  }

  function clearSeen(gameId) {
    var all = loadSeen();
    if (gameId) delete all[gameId];
    else all = {};
    saveSeen(all);
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

  function wallet() {
    return load().wallet || 0;
  }

  function addToWallet(n) {
    var data = load();
    var add = Math.max(0, Math.floor(Number(n) || 0));
    data.wallet = (data.wallet || 0) + add;
    save(data);
    return data.wallet;
  }

  function spend(reward) {
    var data = load();
    var cost = reward && typeof reward.cost === "number" ? reward.cost : 0;
    if (cost <= 0 || (data.wallet || 0) < cost) {
      return { ok: false, wallet: data.wallet || 0 };
    }
    data.wallet -= cost;
    data.spent = data.spent || [];
    data.spent.push({
      id: reward.id,
      title: reward.title,
      cost: cost,
      at: new Date().toISOString()
    });
    save(data);
    return { ok: true, wallet: data.wallet };
  }

  function getSpent() {
    var list = load().spent || [];
    return list.slice().reverse();
  }

  global.Progress = {
    load: load,
    getStars: getStars,
    setStars: setStars,
    subjectStars: subjectStars,
    totalStars: totalStars,
    wallet: wallet,
    addToWallet: addToWallet,
    spend: spend,
    getSpent: getSpent,
    getSeen: getSeen,
    markSeen: markSeen,
    clearSeen: clearSeen
  };
})(window);
