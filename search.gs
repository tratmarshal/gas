/*function searchWarrant(query) {
  const term = normalizeText_(query);
  if (!term) return { success: true, data: [] };

  // ตรวจสอบอัตโนมัติ: ถ้าพิมพ์เป็นตัวเลขทั้งหมดและยาว 13 หลัก ให้เป็น id13 นอกนั้นถือว่าเป็นชื่อ (name)
  const searchType = (/^\d{13}$/.test(term)) ? "id13" : "name";

  return { success: true, data: getCachedWarrantSearch_(searchType, term) };
}*/