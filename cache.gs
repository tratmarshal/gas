/*// ========== cache.gs ==========
// ชั้นอ่านข้อมูลเร็วภายใน backend

const PENDING_PROCESS_CACHE_KEY = "pendingProcess:v1";
const PENDING_PROCESS_CACHE_TTL_SECONDS = 600; // 10 minutes

const WARRANT_SEARCH_CACHE_KEY = "warrantSearch:v1";
const WARRANT_SEARCH_CACHE_TTL_SECONDS = 300; // 5 minutes

function getCachedPendingProcess_() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(PENDING_PROCESS_CACHE_KEY);
    
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {
        console.warn("Cache parse error, clearing and reloading", err);
        cache.remove(PENDING_PROCESS_CACHE_KEY);
      }
    }

    const results = loadPendingProcessFromSheets_();
    try {
      cache.put(PENDING_PROCESS_CACHE_KEY, JSON.stringify(results), PENDING_PROCESS_CACHE_TTL_SECONDS);
    } catch (err) {
      console.warn("pending process cache skipped", err);
    }
    return results;
  } catch (err) {
    console.error("getCachedPendingProcess_ failed", err);
    throw new Error(`ไม่สามารถโหลดรายการรอดำเนินการได้: ${err.message}`);
  }
}

function clearPendingProcessCache_() {
  try {
    const cache = CacheService.getScriptCache();
    cache.remove(PENDING_PROCESS_CACHE_KEY);
  } catch (err) {
    console.warn("failed to clear pending process cache", err);
  }
}

function clearWarrantCache_() {
  try {
    const cache = CacheService.getScriptCache();
    cache.remove(WARRANT_SEARCH_CACHE_KEY);
  } catch (err) {
    console.warn("failed to clear warrant search cache", err);
  }
}

function getCachedWarrantSearch_(searchType, term) {
  // ไม่ cache ถ้า term ว่าง
  if (!term) {
    return loadWarrantSearchFromSheets_(searchType, term);
  }
  
  const cache = CacheService.getScriptCache();
  const cacheKey = WARRANT_SEARCH_CACHE_KEY + ":" + searchType + ":" + term;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (err) {
      cache.remove(cacheKey);
    }
  }
  
  const results = loadWarrantSearchFromSheets_(searchType, term);
  try {
    cache.put(cacheKey, JSON.stringify(results), WARRANT_SEARCH_CACHE_TTL_SECONDS);
  } catch (err) {
    console.warn("warrant search cache skipped", err);
  }
  return results;
}

function loadPendingProcessFromSheets_() {
  try {
    const sheet = ensureProcessingSheet_();
    
    // ✅ ตรวจสอบว่า sheet มีข้อมูลหรือไม่
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      // sheet ยังไม่มีข้อมูล (มีแค่ header)
      return [];
    }
    
    // ✅ อ่านข้อมูลจากแถว 2 เป็นต้นไป (ข้ามหัวตาราง)
    const values = sheet.getRange(2, 1, lastRow - 1, PROCESSING_HEADERS.length).getValues();
    const list = [];
    
    for (let r = 0; r < values.length; r++) {
      const row = values[r];
      // ✅ ข้าม row ที่ว่างเปล่า
      if (!row || !row[0]) continue;
      
      try {
        list.push({
          rowId: r + 2,  // +2 เพราะ header อยู่ row 1
          timestamp: row[0],
          userId: row[1],
          warrantNumber: row[2],
          defendantName: row[3],
          bail: row[4],
          proposedTo: row[5],
          caseStatus: row[6],
          endReason: row[7],
          reasonDetail: row[8],
          warrantStatus: row[9],
          syncStatus: row[10] || SYNC_STATUS_PENDING,
          syncedAt: row[11],
          syncError: row[12],
          processSeq: row[13]
        });
      } catch (rowErr) {
        console.warn(`Warning: skipped row ${r + 2}: ${rowErr.message}`);
      }
    }
    
    list.reverse();
    return list;
  } catch (err) {
    console.error("loadPendingProcessFromSheets_ failed", err);
    throw new Error(`ล้มเหลวในการโหลดรายการรอดำเนินการ: ${err.message}`);
  }
}

function loadWarrantSearchFromSheets_(searchType, term) {
  const results = [];
  if (!term) return results;

  const db = getWarrantDB();
  const cells = db.createTextFinder(term).findAll();

  cells.forEach(cell => {
    const sheet = cell.getSheet();
    const sheetName = sheet.getName();
    const year = Number(sheetName);

    if (year >= WARRANT_SHEET_START && year <= WARRANT_SHEET_END) {
      const rowNum = cell.getRow();
      if (rowNum <= 1) return;

      const lastCol = sheet.getLastColumn();
      if (lastCol < 1) return;

      const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      const columns = getWarrantColumnMap_(headers);
      const colNum = cell.getColumn();

      const isTargetColumn = searchType === "id13"
        ? colNum === columns.id13 + 1
        : colNum === columns.fullName + 1;

      if (isTargetColumn) {
        const row = sheet.getRange(rowNum, 1, 1, lastCol).getValues()[0];
        const rowId13 = normalizeText_(row[columns.id13]);
        const rowName = normalizeText_(row[columns.fullName]);

        const lowerTerm = term.toLowerCase();
        const confirmed = searchType === "id13"
          ? rowId13 === term
          : rowName.toLowerCase().indexOf(lowerTerm) !== -1;

        if (confirmed) {
          results.push({
            sheetName: sheetName,
            rowNumber: rowNum,
            warrantNumber: normalizeText_(row[columns.warrantNo]),
            no: normalizeText_(row[columns.warrantNo]),
            defendantName: rowName,
            id13: rowId13,
            bail: normalizeText_(row[columns.bail]),
            submitTo: normalizeText_(row[columns.submitTo]),
            status: normalizeText_(row[columns.status]) || WARRANT_STATUS_WANTED,
            charge: normalizeText_(row[columns.charge]),
            blackCaseNo: normalizeText_(row[columns.blackCaseNo]),
            redCaseNo: normalizeText_(row[columns.redCaseNo])
          });
        }
      }
    }
  });
  return results;
}*/