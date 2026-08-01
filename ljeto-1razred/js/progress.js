(function (global) {
  "use strict";

  var PREFIX = "ljeto1_";
  var KEY = PREFIX + "progress";
  var SEEN_KEY = PREFIX + "seen";

  // Tablet/iPad: u privatnom pregledavanju (i kad su kolačići blokirani)
  // localStorage zna baciti iznimku. Bez ovih omotača jedna takva iznimka
  // sruši cijeli app.js i onda se nijedna stanica ne može otvoriti.
  var memoryStore = {};

  function readRaw(key) {
    try {
      // Ako je čitanje uspjelo, vrijedi ono što piše u spremniku — i kad je
      // prazno (npr. roditelj je obrisao podatke stranice).
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStore[key] == null ? null : memoryStore[key];
    }
  }

  function writeRaw(key, value) {
    memoryStore[key] = value;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function removeRaw(key) {
    delete memoryStore[key];
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // nema što raditi — ostajemo na memorijskoj kopiji
    }
  }

  function empty() {
    return { games: {}, totalStars: 0, wallet: 0, spent: [], unlocked: {} };
  }

  function load() {
    try {
      var raw = readRaw(KEY);
      if (!raw) return empty();
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return empty();
      if (!data.games || typeof data.games !== "object") data.games = {};
      if (typeof data.totalStars !== "number") data.totalStars = 0;
      if (typeof data.wallet !== "number") data.wallet = data.totalStars || 0;
      if (!Array.isArray(data.spent)) data.spent = [];
      if (!data.unlocked || typeof data.unlocked !== "object") data.unlocked = {};
      return data;
    } catch (e) {
      return empty();
    }
  }

  function save(data) {
    try {
      writeRaw(KEY, JSON.stringify(data));
    } catch (e) {
      // JSON.stringify ne bi smio pasti, ali app ne smije stati ni tada.
    }
  }

  function loadSeen() {
    try {
      var raw = readRaw(SEEN_KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return {};
    }
  }

  function saveSeen(data) {
    if (!writeRaw(SEEN_KEY, JSON.stringify(data))) {
      // Ako je storage pun, resetiraj povijest viđenih.
      removeRaw(SEEN_KEY);
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

  /**
   * Popravi i osvježi popis otključanih stanica.
   *
   * `stationOrder` = { predmet: [id stanice, ...] } — trenutačno važeći redoslijed.
   * Kad se stanice preimenuju ili prošire (npr. „hrv-slova" → „hrv-prvo-zadnje"),
   * u spremniku ostanu stari ID-evi koji više ne postoje. Prije se tada popis
   * činio „popunjenim" pa se prva stanica nikad nije otključala i cijeli je
   * predmet ostajao zaključan. Zato ovdje odbacimo nepoznate ID-eve i uvijek
   * jamčimo da je prva stanica otvorena.
   */
  function ensureUnlockedDefaults(stationOrder) {
    var data = load();
    var changed = false;
    Object.keys(stationOrder || {}).forEach(function (sid) {
      var order = stationOrder[sid];
      if (typeof order === "string") order = [order];
      if (!Array.isArray(order) || !order.length) return;

      var known = {};
      order.forEach(function (gid) {
        known[gid] = true;
      });

      var current = Array.isArray(data.unlocked[sid]) ? data.unlocked[sid] : [];
      var seen = {};
      var cleaned = current.filter(function (gid) {
        if (!known[gid] || seen[gid]) return false;
        seen[gid] = true;
        return true;
      });

      // Prva stanica je uvijek otvorena — ona je ulaz u predmet.
      if (cleaned.indexOf(order[0]) === -1) cleaned.unshift(order[0]);

      // Ako je stanica već osvojena, njezina sljedeća mora biti otvorena
      // (inače se staza prekine nakon migracije ili djelomično spremljenog stanja).
      order.forEach(function (gid, i) {
        if (i >= order.length - 1) return;
        var g = data.games[gid];
        var stars = g && typeof g.stars === "number" ? g.stars : 0;
        if (stars >= 1 && cleaned.indexOf(order[i + 1]) === -1) {
          cleaned.push(order[i + 1]);
        }
      });

      if (
        cleaned.length !== current.length ||
        cleaned.some(function (gid, i) {
          return gid !== current[i];
        })
      ) {
        data.unlocked[sid] = cleaned;
        changed = true;
      }
    });
    if (changed) save(data);
  }

  function isUnlocked(subjectId, gameId) {
    var data = load();
    var list = data.unlocked && data.unlocked[subjectId];
    return Array.isArray(list) && list.indexOf(gameId) !== -1;
  }

  function unlockGame(subjectId, gameId) {
    var data = load();
    if (!data.unlocked[subjectId]) data.unlocked[subjectId] = [];
    var list = data.unlocked[subjectId];
    if (list.indexOf(gameId) === -1) {
      list.unshift(gameId);
      save(data);
    }
  }

  function unlockNext(subjectId, gameIdsInOrder, completedGameId) {
    var data = load();
    if (!data.unlocked[subjectId]) data.unlocked[subjectId] = [];
    var list = data.unlocked[subjectId];
    if (list.indexOf(completedGameId) === -1) list.push(completedGameId);
    var idx = gameIdsInOrder.indexOf(completedGameId);
    if (idx >= 0 && idx < gameIdsInOrder.length - 1) {
      var nextId = gameIdsInOrder[idx + 1];
      if (list.indexOf(nextId) === -1) list.push(nextId);
    }
    save(data);
  }

  function gusarUnlocked(subjectGameIds) {
    return ["matematika", "hrvatski", "priroda"].every(function (sid) {
      var ids = subjectGameIds[sid] || [];
      return ids.some(function (gid) {
        return getStars(gid) >= 1;
      });
    });
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
    clearSeen: clearSeen,
    ensureUnlockedDefaults: ensureUnlockedDefaults,
    isUnlocked: isUnlocked,
    unlockGame: unlockGame,
    unlockNext: unlockNext,
    gusarUnlocked: gusarUnlocked
  };
})(window);
