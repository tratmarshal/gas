/**
 * สร้างหรือปรับรายการดำเนินการ และบันทึกรายการแก้ไข (Processing) เข้าสู่ระบบ
 * @param {Object} updateData ข้อมูลการแก้ไขที่ส่งมาจาก Front-end
 * @return {Object} ผลลัพธ์การดำเนินการ
 */
function addProcessRecord(updateData) {
  const lock = LockService.getScriptLock();
  try {
    // ป้องกัน Race Condition ด้วยการ Lock 30 วินาที
    lock.waitLock(30000); 
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_UPDATE_ID);
    const processingSheet = spreadsheet.getSheetByName(CONFIG.SHEET_PROCESSING_NAME);
    
    // 1. สร้าง ลำดับรายการแก้ไข (ID) และเตรียมข้อมูล
    const lastRow = processingSheet.getLastRow();
    const nextId = lastRow === 1 ? 1 : Number(processingSheet.getRange(lastRow, 1).getValue()) + 1;
    const timestamp = new Date();
    
    // ค่าสถานะภายในเริ่มต้นเป็น pending เสมอ
    const internalStatus = "pending"; 
    
    // 2. บันทึกข้อมูลลงในแท็บ processing (รายการอัปเดต)
    // โครงสร้างแถว: [ลำดับรายการแก้ไข, เวลาบันทึก, เลขที่หมายจับ, สถานะหมายจับในพื้นที่ทำงาน, เหตุ, รายละเอียดเหตุ, สถานะสำนวน, สถานะภายใน]
    processingSheet.appendRow([
      nextId,
      timestamp,
      updateData.warrantNo,
      updateData.warrantStatus, // เช่น "รอเพิกถอน"
      updateData.reason,        // "มอบตัว", "ตำรวจจับ", "อยู่เรือนจำอื่น", "อื่น ๆ"
      updateData.reasonDetails || "",
      updateData.caseStatus,    // "รอดำเนินการ", "เสนอศาล", "รอส่งต่อ", "ส่งต่อแล้ว"
      internalStatus
    ]);
    
    logActivity('addProcessRecord', `สร้างรายการแก้ไขลำดับที่ ${nextId} สำหรับหมายจับเลขที่ ${updateData.warrantNo}`, 'หน้าบันทึกผล');
    
    // 3. เรียกงานอัปเดตอัตโนมัติ (หลังบ้านทำงานแบบ Real-time)
    // หมายเหตุ: ใน Google Apps Script การเรียกฟังก์ชันตรงๆ จะทำงานแบบ Synchronous เบื้องหลัง
    triggerAutoUpdate();
    
    return { success: true, editId: nextId };
  } catch (error) {
    return { success: false, error: error.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ดึงรายการที่ดำเนินอยู่ (รายการดำเนินการที่ยังทำงานธุรการไม่เสร็จ สถานะสำนวนยังไม่เป็น 'ส่งต่อแล้ว')
 */
function getPendingProcess() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_UPDATE_ID);
  const processingSheet = spreadsheet.getSheetByName(CONFIG.SHEET_PROCESSING_NAME);
  const data = processingSheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const items = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // ตรวจสอบสถานะสำนวน (สมมติว่าอยู่คอลัมน์ที่ 7 ดัชนีที่ 6)
    if (row[6] !== "ส่งต่อแล้ว") {
      items.push({
        editId: row[0],
        warrantNo: row[2],
        warrantStatus: row[3],
        caseStatus: row[6],
        internalSyncStatus: row[7] // ส่งกลับไปเพื่อให้ Front-end แสดงจุดสีเขียว/แดง เท่านั้น
      });
    }
  }
  return items;
}