/*// ========== config.gs ==========
// 🔧 ตั้งค่าระบบ (System Configuration)
// 
// ไฟล์นี้เป็นจุดรวมการตั้งค่าระบบทั้งหมด
// - Google Sheets Database IDs
// - Cache TTLs (Time To Live)
// - Sheet names
// - LIFF Configuration
// 
// หมายเหตุ: 
// - ค่าคงที่โดเมน (statuses, reasons) ไปใน var.gs
// - ฟังก์ชันช่วยเหลือไปใน utils.gs

// ═════════════════════════════════════════════════════════════════════════
// 📋 SHEET CONFIGURATION - ID ของ Google Sheets แต่ละฐานข้อมูล
// ═════════════════════════════════════════════════════════════════════════

// ✅ WARRANT_DB_ID: ฐานข้อมูลหมายจับหลัก
//    เก็บแผ่นข้อมูลหมายจับตามปี (55, 56, 57, ... 69)
const WARRANT_DB_ID = "1sq8GyDDiqS2U989TpcTlMyJ5P9gtrRTgbJjcQHtEOB4";

// ✅ UPDATE_DB_ID: ฐานข้อมูลการอัปเดต
//    เก็บแผ่น "processing", "users", "log" เพื่อติดตามการเปลี่ยนแปลง
const UPDATE_DB_ID = "1mP3tver14Tp0wYd9xkk4Lh5Mv_g39UPy06juu8t_Dgk";

// ═════════════════════════════════════════════════════════════════════════
// 📄 SHEET NAMES - ชื่อแผ่นงานในแต่ละฐานข้อมูล
// ═════════════════════════════════════════════════════════════════════════

// ✅ SHEET_USERS: เก็บข้อมูลเจ้าหน้าที่ที่มีสิทธิ์เข้าระบบ
const SHEET_USERS = "users";

// ✅ SHEET_LOGS: บันทึกประวัติการใช้งานของทุก action
const SHEET_LOGS = "log";

// ✅ SHEET_PROCESSING: รายการรอดำเนินการ (interim data)
//    เก็บข้อมูลเบื้องต้นก่อนการอัปเดตลงฐานข้อมูลหมายจับหลัก
const SHEET_PROCESSING = "processing";

// ═════════════════════════════════════════════════════════════════════════
// 📅 WARRANT SHEET CONFIGURATION - ช่วงปีของแผ่นหมายจับ
// ═════════════════════════════════════════════════════════════════════════

// ✅ WARRANT_SHEET_START: ปีเริ่มต้นที่ต้องค้นหา
//    ตัวอย่าง: 55 = พ.ศ. 2555 (ค.ศ. 2012)
const WARRANT_SHEET_START = 55;

// ✅ WARRANT_SHEET_END: ปีสิ้นสุดที่ต้องค้นหา
//    ตัวอย่าง: 69 = พ.ศ. 2569 (ค.ศ. 2026)
const WARRANT_SHEET_END = 69;

// ═════════════════════════════════════════════════════════════════════════
// ⏱️ CACHE CONFIGURATION - ระยะเวลาเก็บข้อมูลเร็ว (Cache TTL)
// ═════════════════════════════════════════════════════════════════════════
// 
// Google Apps Script Cache Service:
// - เก็บข้อมูลชั่วคราวในหน่วยความจำของ backend
// - ช่วยลดการอ่านจาก Google Sheets (ประหยัด quota)
// - หากสิ้นสุด TTL จะถูกลบโดยอัตโนมัติ
// - หน่วย: วินาที (seconds)

// ✅ USER_CACHE_TTL_SECONDS: นานเท่าใดที่จะยอมรับข้อมูลผู้ใช้จากแคช
//    ใช้ใน: auth.gs (getAuthorizedUserIds_)
//    ระดับการเปลี่ยน: ต่ำ (เพิ่ม/ลบผู้ใช้ไม่บ่อย)
const USER_CACHE_TTL_SECONDS = 600;           // 10 minutes

// ✅ PENDING_PROCESS_CACHE_TTL_SECONDS: นานเท่าใดที่จะยอมรับรายการรอจากแคช
//    ใช้ใน: cache.gs (getCachedPendingProcess_)
//    ระดับการเปลี่ยน: สูง (อัปเดตเมื่อผู้ใช้เพิ่มรายการ)
const PENDING_PROCESS_CACHE_TTL_SECONDS = 600; // 10 minutes

// ✅ WARRANT_SEARCH_CACHE_TTL_SECONDS: นานเท่าใดที่จะยอมรับผลการค้นหาจากแคช
//    ใช้ใน: cache.gs (getCachedWarrantSearch_)
//    ระดับการเปลี่ยน: ต่ำมาก (ข้อมูลหมายจับหลักแทบจะไม่เปลี่ยน)
const WARRANT_SEARCH_CACHE_TTL_SECONDS = 300;  // 5 minutes

// ═════════════════════════════════════════════════════════════════════════
// 🔑 CACHE KEYS - คีย์สำหรับเก็บข้อมูลใน CacheService
// ═════════════════════════════════════════════════════════════════════════
// 
// ลักษณะการตั้งชื่อ: [dataType]:[version]
// - version ช่วยให้ migrate cache ไม่มี conflict เมื่ออัพเกรด

// ✅ USER_CACHE_KEY: คีย์สำหรับแคชรายชื่อผู้ใช้ที่มีสิทธิ์
//    ใช้ใน: auth.gs, user.gs
const USER_CACHE_KEY = "authorizedUsers:v1";

// ✅ PENDING_PROCESS_CACHE_KEY: คีย์สำหรับแคชรายการรอดำเนินการ
//    ใช้ใน: cache.gs (getCachedPendingProcess_)
const PENDING_PROCESS_CACHE_KEY = "pendingProcess:v1";

// ✅ WARRANT_SEARCH_CACHE_KEY: คีย์ prefix สำหรับแคชผลการค้นหา
//    ใช้ใน: cache.gs (getCachedWarrantSearch_)
//    หมายเหตุ: คีย์จริง = WARRANT_SEARCH_CACHE_KEY + ":" + searchType + ":" + term
const WARRANT_SEARCH_CACHE_KEY = "warrantSearch:v1";

// ═════════════════════════════════════════════════════════════════════════
// 🔐 LOCK CONFIGURATION - ระยะเวลารอ/ล็อกขณะเขียน
// ═════════════════════════════════════════════════════════════════════════
// 
// Google Apps Script Lock Service:
// - ป้องกันการอ่าน-เขียนแบบ concurrent (data race condition)
// - ใช้ในการ sync warrant database หลังจาก update
// - หน่วย: มิลลิวินาที (milliseconds)

// ✅ LOCK_WAIT_MS: นานเท่าใดที่จะรออื่นๆ ปล่อย lock ก่อน timeout
//    ใช้ใน: utils.gs (withScriptLock_)
//    ถ้า timeout: throw error → frontend ได้รู้ว่ามี conflict
const LOCK_WAIT_MS = 30000; // 30 seconds

// ═════════════════════════════════════════════════════════════════════════
// 📱 LIFF CONFIGURATION - ตั้งค่า LINE Integration
// ═════════════════════════════════════════════════════════════════════════
// 
// LIFF = LINE Front-end Framework
// - ช่วยให้ LINE Bot สามารถเปิด web app ในแอป LINE
// - ส่ง User ID โดยอัตโนมัติ
// - ตรวจสอบสิทธิ์ผ่าน LINE

// ✅ LIFF_CHANNEL_ID: Channel ID ของ LINE Bot
//    ใช้ใน: code.gs, auth.gs (ตรวจสอบสิทธิ์จาก LIFF)
//    หารือได้จาก: LINE Developers Console > Channel Settings
const LIFF_CHANNEL_ID = "2010272973-6qo1suX2";

// ═════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS - ฟังก์ชันช่วยเหลือสำหรับ config
// ═════════════════════════════════════════════════════════════════════════


 * 📋 ดึง configuration ทั้งหมด (สำหรับ debugging)
 * @returns {Object} Configuration object
 
function getAllConfig() {
  return {
    databases: {
      warrant: WARRANT_DB_ID,
      update: UPDATE_DB_ID
    },
    sheets: {
      users: SHEET_USERS,
      logs: SHEET_LOGS,
      processing: SHEET_PROCESSING
    },
    warrantYears: {
      start: WARRANT_SHEET_START,
      end: WARRANT_SHEET_END
    },
    cache: {
      userTtl: USER_CACHE_TTL_SECONDS,
      pendingProcessTtl: PENDING_PROCESS_CACHE_TTL_SECONDS,
      warrantSearchTtl: WARRANT_SEARCH_CACHE_TTL_SECONDS
    },
    cacheKeys: {
      user: USER_CACHE_KEY,
      pendingProcess: PENDING_PROCESS_CACHE_KEY,
      warrantSearch: WARRANT_SEARCH_CACHE_KEY
    },
    lock: {
      waitMs: LOCK_WAIT_MS
    },
    liff: {
      channelId: LIFF_CHANNEL_ID
    }
  };
}


 * ✅ ตรวจสอบว่า config ครบถ้วนหรือไม่
 * @returns {Object} {valid: boolean, errors: string[]}
 
function validateConfig() {
  const errors = [];

  // ✅ ตรวจสอบ Database IDs
  if (!WARRANT_DB_ID || typeof WARRANT_DB_ID !== 'string' || WARRANT_DB_ID.length < 10) {
    errors.push("❌ WARRANT_DB_ID ไม่ถูกต้อง");
  }
  if (!UPDATE_DB_ID || typeof UPDATE_DB_ID !== 'string' || UPDATE_DB_ID.length < 10) {
    errors.push("❌ UPDATE_DB_ID ไม่ถูกต้อง");
  }

  // ✅ ตรวจสอบ Sheet Names
  if (!SHEET_USERS || typeof SHEET_USERS !== 'string') {
    errors.push("❌ SHEET_USERS ไม่ถูกต้อง");
  }
  if (!SHEET_LOGS || typeof SHEET_LOGS !== 'string') {
    errors.push("❌ SHEET_LOGS ไม่ถูกต้อง");
  }
  if (!SHEET_PROCESSING || typeof SHEET_PROCESSING !== 'string') {
    errors.push("❌ SHEET_PROCESSING ไม่ถูกต้อง");
  }

  // ✅ ตรวจสอบ Warrant Years
  if (!Number.isInteger(WARRANT_SHEET_START) || WARRANT_SHEET_START < 50) {
    errors.push("❌ WARRANT_SHEET_START ไม่ถูกต้อง");
  }
  if (!Number.isInteger(WARRANT_SHEET_END) || WARRANT_SHEET_END < WARRANT_SHEET_START) {
    errors.push("❌ WARRANT_SHEET_END ไม่ถูกต้อง");
  }

  // ✅ ตรวจสอบ Cache TTLs
  if (!Number.isInteger(USER_CACHE_TTL_SECONDS) || USER_CACHE_TTL_SECONDS <= 0) {
    errors.push("❌ USER_CACHE_TTL_SECONDS ไม่ถูกต้อง");
  }
  if (!Number.isInteger(PENDING_PROCESS_CACHE_TTL_SECONDS) || PENDING_PROCESS_CACHE_TTL_SECONDS <= 0) {
    errors.push("❌ PENDING_PROCESS_CACHE_TTL_SECONDS ไม่ถูกต้อง");
  }
  if (!Number.isInteger(WARRANT_SEARCH_CACHE_TTL_SECONDS) || WARRANT_SEARCH_CACHE_TTL_SECONDS <= 0) {
    errors.push("❌ WARRANT_SEARCH_CACHE_TTL_SECONDS ไม่ถูกต้อง");
  }

  // ✅ ตรวจสอบ Lock Wait Time
  if (!Number.isInteger(LOCK_WAIT_MS) || LOCK_WAIT_MS <= 0) {
    errors.push("❌ LOCK_WAIT_MS ไม่ถูกต้อง");
  }

  // ✅ ตรวจสอบ LIFF Channel ID
  if (!LIFF_CHANNEL_ID || typeof LIFF_CHANNEL_ID !== 'string') {
    errors.push("❌ LIFF_CHANNEL_ID ไม่ถูกต้อง");
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}


 * 🧪 ทดสอบ config ด้วยการเข้าถึง Database
 * @returns {Object} {success: boolean, details: Object}
 
function testConfig() {
  const validation = validateConfig();
  if (!validation.valid) {
    console.error("❌ Config validation failed:", validation.errors);
    return {
      success: false,
      error: "Config ไม่ถูกต้อง",
      details: validation.errors
    };
  }

  try {
    // ✅ ทดสอบเข้าถึง WARRANT_DB_ID
    const warrantDb = SpreadsheetApp.openById(WARRANT_DB_ID);
    const warrantSheets = warrantDb.getSheets().map(s => ({
      name: s.getName(),
      rows: s.getLastRow()
    }));

    // ✅ ทดสอบเข้าถึง UPDATE_DB_ID
    const updateDb = SpreadsheetApp.openById(UPDATE_DB_ID);
    const updateSheets = updateDb.getSheets().map(s => ({
      name: s.getName(),
      rows: s.getLastRow()
    }));

    return {
      success: true,
      details: {
        warrantDb: {
          id: WARRANT_DB_ID,
          sheets: warrantSheets
        },
        updateDb: {
          id: UPDATE_DB_ID,
          sheets: updateSheets
        }
      }
    };
  } catch (err) {
    console.error("❌ Config test failed:", err);
    return {
      success: false,
      error: err.message,
      details: {}
    };
  }
}
*/