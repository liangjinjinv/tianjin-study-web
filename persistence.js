"use strict";
(() => {
  const STORE = "snapshots";
  const SLOT = "study";
  const READ_ISSUE = "本机记录暂时无法读取。请关掉其他同一网页的标签页，再重新打开；不要重复录入。";
  const TEMP_ISSUE = "当前浏览器无法在本机保存。请用常用浏览器打开，避免在这里录入重要资料。";
  const CONFLICT = "另一个标签页刚更新了记录。请重新打开网页再操作，避免覆盖。";
  const FAILED = "未能保存到本机。请检查浏览器存储空间后重试。";
  function open(factory, name, timeout) {
    return new Promise((resolve, reject) => {
      const request = factory.open(name, 1);
      let done = false;
      const fail = error => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(error);
      };
      const timer = setTimeout(() => fail(Error("open timeout")), timeout);
      request.onupgradeneeded = () => {
        if (done) { request.transaction.abort(); return; }
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
      };
      request.onerror = () => fail(request.error || Error("open error"));
      request.onblocked = () => fail(Error("open blocked"));
      request.onsuccess = () => {
        if (done) { request.result.close(); return; }
        done = true;
        clearTimeout(timer);
        resolve(request.result);
      };
    });
  }
  // Await the transaction, not the success event of the put request.
  function transaction(db, mode, fn) {
    return new Promise((resolve, reject) => {
      const tx = mode === "readwrite" ? writable(db) : db.transaction(STORE, "readonly");
      const store = tx.objectStore(STORE);
      const request = store.get(SLOT);
      let result, failure;
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => { failure ??= tx.error; };
      tx.onabort = () => reject(failure || tx.error || Error("transaction aborted"));
      request.onsuccess = () => {
        try { result = fn(request.result, store); }
        catch (error) { failure = error; tx.abort(); }
      };
    });
  }
  function writable(db) {
    try { return db.transaction(STORE, "readwrite", {durability:"strict"}); }
    catch (e) { if (!(e instanceof TypeError)) throw e; return db.transaction(STORE,"readwrite"); }
  }
  function create({legacyKey = "tianjin-study-compass-v1", dbName = "tianjin-study-compass", timeout = 2600} = {}) {
    const marker = legacyKey + ":idb";
    let db, mode = "unavailable", revision = 0, previousLegacy = null, saveError = "";
    let init;
    let queue = Promise.resolve();
    function legacy() {
      try {
        const storage = window.localStorage;
        const raw = storage.getItem(legacyKey);
        let data;
        try { data = raw === null ? null : JSON.parse(raw); } catch { return {storage, raw, bad:true}; }
        if (raw !== null && (!data || typeof data !== "object" || Array.isArray(data))) return {storage,raw,bad:true};
        return {storage,raw,data,marked:storage.getItem(marker) === "1"};
      } catch { return {}; }
    }
    function fallback(old) {
      if (!old.storage) return {raw:null,mode,issue:TEMP_ISSUE};
      if (old.bad || old.marked) return {raw:null,mode,issue:READ_ISSUE};
      previousLegacy = old.raw;
      mode = "localStorage";
      return {raw:old.data,mode,issue:"当前使用兼容保存，仍只存在此浏览器。照片较多时可能存不下。"};
    }
    async function initialize() {
      const old = legacy();
      let factory;
      try { factory = window.indexedDB; } catch {}
      if (!factory) return fallback(old);
      try { db = await open(factory, dbName, timeout); }
      catch {
        // A hosted page must not write into a stale v1 record if the main DB is busy or inaccessible.
        if (window.location?.protocol === "file:") return fallback(old);
        return {raw:null,mode,issue:READ_ISSUE};
      }
      db.onversionchange = () => { db.close(); };
      try {
        const snapshot = await transaction(db, old.data ? "readwrite" : "readonly", (current, store) => {
          if (current !== undefined) return current;
          if (!old.data) return null;
          const seed = {revision:1,text:old.raw};
          store.put(seed, SLOT);
          return seed;
        });
        if (!snapshot && old.bad) return {raw:null,mode,issue:READ_ISSUE};
        let raw = null;
        if (snapshot) {
          if (!Number.isSafeInteger(snapshot.revision) || snapshot.revision < 1 || typeof snapshot.text !== "string") throw Error("invalid snapshot");
          raw = JSON.parse(snapshot.text);
          if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw Error("invalid state");
          revision = snapshot.revision;
        }
        mode = "indexedDB";
        try { old.storage?.setItem(marker, "1"); } catch {}
        return {raw,mode,issue:""};
      } catch { return {raw:null,mode,issue:READ_ISSUE}; }
    }
    function load() { return init ||= initialize(); }
    function save(state) {
      let text;
      try {
        text = JSON.stringify(state);
        if (!text) throw Error("invalid state");
      } catch { saveError = FAILED; return Promise.resolve(false); }
      const job = queue.then(async () => {
        await load();
        saveError = "";
        try {
          if (mode === "indexedDB") {
            const committed = await transaction(db, "readwrite", (current, store) => {
              if ((current?.revision ?? 0) !== revision) return false;
              store.put({revision:revision+1,text}, SLOT);
              return true;
            });
            if (!committed) { saveError = CONFLICT; return false; }
            revision++;
            return true;
          }
          if (mode === "localStorage") {
            const old = legacy();
            if (!old.storage || old.bad || old.marked || old.raw !== previousLegacy) {
              saveError = CONFLICT;
              return false;
            }
            old.storage.setItem(legacyKey, text);
            previousLegacy = text;
            return true;
          }
          saveError = TEMP_ISSUE;
          return false;
        } catch { saveError = FAILED; return false; }
      });
      queue = job.catch(() => {});
      return job;
    }
    return Object.freeze({load,save,get mode(){return mode;},get error(){return saveError;}});
  }
  window.StudyPersistence = Object.freeze({create});
})();
