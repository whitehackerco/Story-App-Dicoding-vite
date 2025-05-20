const DB_NAME = "share-app-db";
const DB_VERSION = 1;
const STORE_NAME = "bookmarks";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addBookmark(story) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = (e) => {
      db.close();
      reject(e);
    };
    tx.objectStore(STORE_NAME).put(story);
  });
}

export async function getAllBookmarks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = (e) => {
      db.close();
      reject(e);
    };
  });
}

export async function deleteBookmark(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = (e) => {
      db.close();
      reject(e);
    };
    tx.objectStore(STORE_NAME).delete(id);
  });
}

export async function getBookmark(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("bookmarks", "readonly");
    const store = tx.objectStore("bookmarks");
    const request = store.get(id);
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = (e) => {
      db.close();
      reject(e);
    };
  });
}
