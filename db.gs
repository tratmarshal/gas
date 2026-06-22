/*// ========== db.gs ==========
// ฟังก์ชันเข้าถึง Google Sheets

function getWarrantDB() {
  return SpreadsheetApp.openById(WARRANT_DB_ID);
}

function getUpdateDB() {
  return SpreadsheetApp.openById(UPDATE_DB_ID);
}

function getOrCreateUpdateSheet_(name, headers) {
  const db = getUpdateDB();
  let sheet = db.getSheetByName(name);
  if (!sheet) sheet = db.insertSheet(name);
  if (headers && sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function ensureProcessingSheet_() {
  const sheet = getOrCreateUpdateSheet_(SHEET_PROCESSING, PROCESSING_HEADERS);
  const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), PROCESSING_HEADERS.length)).getValues()[0];
  const needsHeader = PROCESSING_HEADERS.some((h, i) => normalizeText_(current[i]) !== h);
  if (needsHeader) {
    sheet.getRange(1, 1, 1, PROCESSING_HEADERS.length).setValues([PROCESSING_HEADERS]);
  }
  return sheet;
}

function getWarrantColumnMap_(headers) {
  return {
    seq: indexOfHeader(headers, ["ลำดับ"], 0),
    type: indexOfHeader(headers, ["ประเภทหมายจับ"], 1),
    warrantNo: indexOfHeader(headers, ["เลขที่หมายจับ"], 2),
    issuedDate: indexOfHeader(headers, ["วันที่ออก"], 3),
    fullName: indexOfHeader(headers, ["ชื่อสกุล", "ชื่อ-สกุล"], 4),
    id13: indexOfHeader(headers, ["13 หลัก", "เลขบัตรประชาชน", "เลขประจำตัวประชาชน"], 5),
    blackCaseNo: indexOfHeader(headers, ["เลขคดีดำ"], 6),
    redCaseNo: indexOfHeader(headers, ["เลขคดีแดง"], 7),
    charge: indexOfHeader(headers, ["ความผิด"], 8),
    addressNo: indexOfHeader(headers, ["บ้านเลขที่"], 9),
    moo: indexOfHeader(headers, ["หมู่"], 10),
    tambon: indexOfHeader(headers, ["ตำบล"], 11),
    amphoe: indexOfHeader(headers, ["อำเภอ"], 12),
    province: indexOfHeader(headers, ["จังหวัด"], 13),
    limitation: indexOfHeader(headers, ["อายุความ"], 14),
    bail: indexOfHeader(headers, ["ประกัน"], 15),
    submitTo: indexOfHeader(headers, ["ท่าน"], 16),
    status: indexOfHeader(headers, ["สถานะ"], 17),
    note: indexOfHeader(headers, ["หมายเหตุ"], 18)
  };
}

function getWarrantSheets_() {
  const db = getWarrantDB();
  const sheets = [];
  for (let year = WARRANT_SHEET_START; year <= WARRANT_SHEET_END; year++) {
    const sheet = db.getSheetByName(String(year));
    if (sheet) sheets.push(sheet);
  }
  return sheets;
}

function findWarrantByNo_(warrantNo) {
  const target = normalizeText_(warrantNo);
  const matches = [];
  if (!target) return matches;

  const db = getWarrantDB();
  const cells = db.createTextFinder(target).findAll();

  cells.forEach(cell => {
    const sheet = cell.getSheet();
    const sheetName = sheet.getName();
    const year = Number(sheetName);

    if (year >= WARRANT_SHEET_START && year <= WARRANT_SHEET_END) {
      const rowNum = cell.getRow();
      const colNum = cell.getColumn();
      if (rowNum > 1) {
        const lastCol = sheet.getLastColumn();
        if (lastCol < 1) return;

        const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        const columns = getWarrantColumnMap_(headers);

        if (colNum === columns.warrantNo + 1) {
          const rowValues = sheet.getRange(rowNum, 1, 1, lastCol).getValues()[0];
          if (normalizeText_(rowValues[columns.warrantNo]) === target) {
            matches.push({ sheet, rowNumber: rowNum, row: rowValues, columns });
          }
        }
      }
    }
  });
  return matches;
}

// ========== Diagnostic Functions ==========
// ฟังก์ชันช่วยตรวจสอบปัญหาของระบบ (ใช้ใน Google Apps Script console)

function diagnoseSystem() {
  const report = {
    timestamp: nowText(),
    databases: {},
    sheets: {},
    errors: []
  };
  
  // ตรวจสอบ warrant database
  try {
    const warrantDb = getWarrantDB();
    report.databases.warrant = {
      id: WARRANT_DB_ID,
      accessible: true,
      sheets: warrantDb.getSheets().map(s => ({ name: s.getName(), rows: s.getLastRow() }))
    };
  } catch (err) {
    report.errors.push(`Warrant DB error: ${err.message}`);
    report.databases.warrant = { accessible: false, error: err.message };
  }
  
  // ตรวจสอบ update database
  try {
    const updateDb = getUpdateDB();
    report.databases.update = {
      id: UPDATE_DB_ID,
      accessible: true,
      sheets: updateDb.getSheets().map(s => ({ name: s.getName(), rows: s.getLastRow() }))
    };
  } catch (err) {
    report.errors.push(`Update DB error: ${err.message}`);
    report.databases.update = { accessible: false, error: err.message };
  }
  
  // ตรวจสอบ processing sheet
  try {
    const sheet = ensureProcessingSheet_();
    report.sheets.processing = {
      exists: true,
      lastRow: sheet.getLastRow(),
      lastColumn: sheet.getLastColumn(),
      headers: sheet.getRange(1, 1, 1, PROCESSING_HEADERS.length).getValues()[0]
    };
  } catch (err) {
    report.errors.push(`Processing sheet error: ${err.message}`);
    report.sheets.processing = { exists: false, error: err.message };
  }
  
  return report;
}

function testGetPendingProcess() {
  console.log("Testing getPendingProcess...");
  try {
    const result = getPendingProcess();
    console.log("Result:", JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    console.error("Test failed:", err);
    return { success: false, error: err.message };
  }
}*/