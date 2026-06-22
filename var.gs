/*// ========== var.gs ==========
// ค่าคงที่และตัวแปรกลาง (โดเมน specific)
// Note: Config ของระบบแยกไปใน config.gs แล้ว

// ========== Cache Keys ==========
// คีย์สำหรับเก็บข้อมูลใน CacheService
const USER_CACHE_KEY = "authorizedUsers:v1";
// สถานะหมายจับ: ต้องการตัว → สิ้นผลรอเพิกถอน → เพิกถอน
const WARRANT_STATUS_WANTED = "ต้องการตัว";
const WARRANT_STATUS_PENDING_REVOCATION = "สิ้นผลรอเพิกถอน";
const WARRANT_STATUS_REVOKED = "เพิกถอน";

// ========== Case Status Constants ==========
// สถานะสำนวน: รอดำเนินการ → เสนอศาล → รอส่งต่อ → ส่งต่อแล้ว
const CASE_STATUS_PENDING = "รอดำเนินการ";
const CASE_STATUS_SUBMITTED_TO_COURT = "เสนอศาล";
const CASE_STATUS_WAITING_FORWARD = "รอส่งต่อ";
const CASE_STATUS_FORWARDED = "ส่งต่อแล้ว";

// ========== Processing Status Constants ==========
// สถานะแสดงผลในพื้นที่การทำงาน (processing sheet)
const PROCESSING_WARRANT_STATUS_PENDING_REVOCATION = "รอเพิกถอน";

// ========== Sync Status Constants ==========
// สถานะภายในของรายการแก้ไข (ผู้ใช้ไม่เห็น)
const SYNC_STATUS_PENDING = "pending";
const SYNC_STATUS_SYNCED = "synced";
const SYNC_STATUS_ERROR = "error";

// ========== Reason Options ==========
// ตัวเลือกเหตุที่จำเลยได้ตัวหรือพบเหตุที่ทำให้หมายจับสิ้นผล
const REASON_OPTIONS = [
  "จำเลยมาศาลตามนัด",
  "จำเลยมาศาลและศาลอนุญาตให้ปล่อยชั่วคราว",
  "จับตัวจำเลยได้",
  "อายัดตัวจำเลยได้",
  "จับผู้ต้องหาได้",
  "ถอนหมายจับ",
  "ถอนฟ้อง/ถอนคำร้องทุกข์",
  "ขาดอายุความ",
  "จำเลยเสียชีวิต",
  "คดีถึงที่สุด",
  "อื่น ๆ"
];

const PROCESSING_HEADERS = [
  "วัน-เวลา",
  "LINEUSERID",
  "เลขที่หมายจับ",
  "ชื่อสกุล",
  "ประกัน",
  "เสนอท่าน",
  "สถานะสำนวน",
  "เหตุ",
  "รายละเอียดเหตุ",
  "สถานะหมายจับ",
  "syncStatus",
  "syncedAt",
  "syncError",
  "ลำดับรายการแก้ไข"
];

const LOG_HEADERS = [
  "วัน-เวลา",
  "LINEUSERID",
  "ชื่อ LINE",
  "หน้าเว็บ",
  "Action",
  "สถานะสิทธิ์",
  "รายละเอียด"
];
*/