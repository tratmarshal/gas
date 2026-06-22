/*// ========== user.gs ==========
// จัดการข้อมูลและสิทธิ์ของเจ้าหน้าที่ตำรวจศาล


 * ดึงข้อมูลเจ้าหน้าที่ทั้งหมดที่ได้รับอนุญาต
 * @returns {Array} รายชื่อเจ้าหน้าที่ (LINEUSERID)
 
function getAllAuthorizedUsers() {
  return withScriptLock_(() => {
    const db = getUpdateDB();
    let sheet = db.getSheetByName(SHEET_USERS);
    if (!sheet) return { success: true, users: [] };
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return { success: true, users: [] };
    
    const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    const users = values.map(row => ({
      userId: normalizeText_(row[0]),
      displayName: normalizeText_(row[1]),
      status: normalizeText_(row[2])
    })).filter(user => user.userId);
    
    return { success: true, users };
  });
}


 * เพิ่มเจ้าหน้าที่ใหม่
 * @param {string} userId - LINEUSERID
 * @param {string} displayName - ชื่อแสดงผล
 * @returns {Object} ผลการทำงาน
 
function addAuthorizedUser(userId, displayName) {
  return withScriptLock_(() => {
    const cleanUserId = normalizeText_(userId);
    const cleanName = normalizeText_(displayName);
    
    if (!cleanUserId) throw new Error("ต้องระบุ LINEUSERID");
    if (!cleanName) throw new Error("ต้องระบุชื่อแสดงผล");
    
    // ตรวจสอบว่า userId มีอยู่แล้วหรือไม่
    const db = getUpdateDB();
    let sheet = db.getSheetByName(SHEET_USERS);
    if (!sheet) {
      sheet = db.insertSheet(SHEET_USERS);
      sheet.getRange(1, 1, 1, 3).setValues([["LINEUSERID", "ชื่อ", "สถานะ"]]);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      const exists = values.some(row => normalizeText_(row[0]) === cleanUserId);
      if (exists) throw new Error(`LINEUSERID ${cleanUserId} มีอยู่แล้ว`);
    }
    
    // เพิ่มแถวใหม่
    sheet.appendRow([cleanUserId, cleanName, "active"]);
    clearUserCache_();
    
    return { success: true, message: `เพิ่มเจ้าหน้าที่ ${cleanName} สำเร็จ` };
  });
}


 * แก้ไขข้อมูลเจ้าหน้าที่
 * @param {string} userId - LINEUSERID
 * @param {string} displayName - ชื่อแสดงผลใหม่
 * @param {string} status - สถานะใหม่ (active/inactive)
 * @returns {Object} ผลการทำงาน
 
function updateAuthorizedUser(userId, displayName, status) {
  return withScriptLock_(() => {
    const cleanUserId = normalizeText_(userId);
    if (!cleanUserId) throw new Error("ต้องระบุ LINEUSERID");
    
    const db = getUpdateDB();
    let sheet = db.getSheetByName(SHEET_USERS);
    if (!sheet) throw new Error("ไม่พบชีตผู้ใช้");
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) throw new Error("ไม่พบข้อมูลเจ้าหน้าที่");
    
    // ค้นหา userId
    const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    let foundRow = -1;
    for (let i = 0; i < values.length; i++) {
      if (normalizeText_(values[i][0]) === cleanUserId) {
        foundRow = i + 2;
        break;
      }
    }
    
    if (foundRow === -1) throw new Error(`ไม่พบ LINEUSERID ${cleanUserId}`);
    
    // อัปเดตข้อมูล
    if (displayName) {
      sheet.getRange(foundRow, 2).setValue(normalizeText_(displayName));
    }
    if (status) {
      sheet.getRange(foundRow, 3).setValue(normalizeText_(status));
    }
    
    clearUserCache_();
    return { success: true, message: `แก้ไขข้อมูลเจ้าหน้าที่ ${cleanUserId} สำเร็จ` };
  });
}


 * ลบเจ้าหน้าที่
 * @param {string} userId - LINEUSERID
 * @returns {Object} ผลการทำงาน
 
function removeAuthorizedUser(userId) {
  return withScriptLock_(() => {
    const cleanUserId = normalizeText_(userId);
    if (!cleanUserId) throw new Error("ต้องระบุ LINEUSERID");
    
    const db = getUpdateDB();
    let sheet = db.getSheetByName(SHEET_USERS);
    if (!sheet) throw new Error("ไม่พบชีตผู้ใช้");
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) throw new Error("ไม่พบข้อมูลเจ้าหน้าที่");
    
    // ค้นหา userId
    const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    let foundRow = -1;
    for (let i = 0; i < values.length; i++) {
      if (normalizeText_(values[i][0]) === cleanUserId) {
        foundRow = i + 2;
        break;
      }
    }
    
    if (foundRow === -1) throw new Error(`ไม่พบ LINEUSERID ${cleanUserId}`);
    
    // ลบแถว
    sheet.deleteRow(foundRow);
    clearUserCache_();
    
    return { success: true, message: `ลบเจ้าหน้าที่ ${cleanUserId} สำเร็จ` };
  });
}


 * ตรวจสอบสถานะผู้ใช้
 * @param {string} userId - LINEUSERID
 * @returns {Object} ข้อมูลผู้ใช้และสิทธิ์
 
function getUserStatus(userId) {
  const cleanUserId = normalizeText_(userId);
  const authStatus = getAuthorizationStatus(cleanUserId);
  
  return {
    success: true,
    userId: cleanUserId,
    authorized: authStatus === "authorized",
    status: authStatus
  };
}*/
