// ========== auth.gs ==========
// ตรวจสอบสิทธิ์เจ้าหน้าที่ตำรวจศาล (อ่านจากชีต users ในฐานข้อมูลอัปเดต)

function getAuthorizedUserIds_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(USER_CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { cache.remove(USER_CACHE_KEY); }
  }

  const db = getUpdateDB();
  let sheet = db.getSheetByName(SHEET_USERS);
  if (!sheet) {
    sheet = db.insertSheet(SHEET_USERS);
    sheet.getRange(1, 1, 1, 3).setValues([["LINEUSERID", "ชื่อ", "สถานะ"]]);
    return [];
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const ids = values.map(r => normalizeText_(r[0])).filter(id => id);

  try {
    cache.put(USER_CACHE_KEY, JSON.stringify(ids), USER_CACHE_TTL_SECONDS);
  } catch (e) {
    console.warn("user cache skipped", e);
  }
  return ids;
}

function getAuthorizationStatus(userId) {
  const cleanUserId = normalizeText_(userId);
  if (!cleanUserId) return "unauthorized";
  const ids = getAuthorizedUserIds_();
  return ids.indexOf(cleanUserId) !== -1 ? "authorized" : "unauthorized";
}

function isAuthorizedUser(userId) {
  return getAuthorizationStatus(userId) === "authorized";
}

function clearUserCache_() {
  try {
    CacheService.getScriptCache().remove(USER_CACHE_KEY);
  } catch (e) {
    console.warn("failed to clear user cache", e);
  }
}
