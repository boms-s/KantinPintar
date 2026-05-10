/**
 * Utility untuk parsing dan pengecekan jam operasional warung
 * Mendukung dua format:
 * 1. JSON per-hari: {"mon":"08:00-17:00","tue":"08:00-17:00",...}
 *    Key: mon, tue, wed, thu, fri, sat, sun
 *    Value kosong ("") berarti libur hari itu
 * 2. String legacy (backward compat): "08:00-17:00" atau teks bebas
 */

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface OperatingHoursSchedule {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Senin",
  tue: "Selasa",
  wed: "Rabu",
  thu: "Kamis",
  fri: "Jumat",
  sat: "Sabtu",
  sun: "Minggu",
};

export const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const EMPTY_SCHEDULE: OperatingHoursSchedule = {
  mon: "",
  tue: "",
  wed: "",
  thu: "",
  fri: "",
  sat: "",
  sun: "",
};

/**
 * Parse string operatingHours ke OperatingHoursSchedule.
 * Jika JSON per-hari → parse langsung.
 * Jika string lama / tidak valid → kembalikan semua hari dengan nilai teks asli
 *   (agar backward compat tidak merusak tampilan).
 */
export function parseOperatingHours(raw: string | null | undefined): OperatingHoursSchedule | null {
  if (!raw || raw.trim() === "") return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      // Validasi format JSON per-hari
      const schedule: OperatingHoursSchedule = { ...EMPTY_SCHEDULE };
      for (const day of DAY_KEYS) {
        if (typeof parsed[day] === "string") {
          schedule[day] = parsed[day];
        }
      }
      return schedule;
    }
  } catch {
    // Bukan JSON — format lama, tidak bisa di-parse per-hari
  }

  return null; // Kembalikan null jika format lama
}

/**
 * Ubah OperatingHoursSchedule ke JSON string untuk disimpan ke DB.
 */
export function serializeOperatingHours(schedule: OperatingHoursSchedule): string {
  return JSON.stringify(schedule);
}

/**
 * Parse waktu "HH:MM" ke menit sejak tengah malam.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Mendapatkan DayKey untuk hari saat ini di timezone WIB (Asia/Jakarta, UTC+7).
 */
export function getTodayDayKey(): DayKey {
  // Gunakan Intl untuk mendapatkan hari dalam WIB
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
  });
  const dayShort = formatter.format(new Date()).toLowerCase(); // "mon", "tue", dst.
  const map: Record<string, DayKey> = {
    mon: "mon",
    tue: "tue",
    wed: "wed",
    thu: "thu",
    fri: "fri",
    sat: "sat",
    sun: "sun",
  };
  return map[dayShort] ?? "mon";
}

/**
 * Mendapatkan menit saat ini sejak tengah malam di timezone WIB.
 */
function getCurrentMinutesWIB(): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const timeStr = formatter.format(new Date()); // e.g. "08:30"
  return timeToMinutes(timeStr);
}

/**
 * Cek apakah range waktu "HH:MM-HH:MM" mencakup waktu saat ini (WIB).
 * Return false jika format tidak valid atau string kosong.
 */
export function isTimeRangeActive(range: string): boolean {
  if (!range || range.trim() === "") return false;

  const parts = range.split("-");
  if (parts.length !== 2) return false;

  const [startStr, endStr] = parts.map((s) => s.trim());
  const start = timeToMinutes(startStr);
  const end = timeToMinutes(endStr);
  const now = getCurrentMinutesWIB();

  // Handle midnight crossing (e.g. "22:00-02:00")
  if (end < start) {
    return now >= start || now < end;
  }

  return now >= start && now < end;
}

/**
 * Cek apakah warung sedang buka berdasarkan operatingHours + isOpen flag.
 *
 * Logika:
 * 1. Jika penjual.isOpen === false → tutup (override manual)
 * 2. Jika tidak ada operatingHours → ikuti isOpen saja
 * 3. Jika ada operatingHours JSON per-hari → cek schedule hari ini
 * 4. Format lama (non-JSON) → ikuti isOpen saja
 */
export function isWarungCurrentlyOpen(penjual: {
  isOpen: boolean;
  operatingHours?: string | null;
}): boolean {
  // Penjual menutup secara manual
  if (!penjual.isOpen) return false;

  // Tidak ada jam operasional — ikuti flag isOpen
  if (!penjual.operatingHours) return penjual.isOpen;

  const schedule = parseOperatingHours(penjual.operatingHours);

  // Format lama tidak bisa di-parse → ikuti flag isOpen
  if (!schedule) return penjual.isOpen;

  const today = getTodayDayKey();
  const todayRange = schedule[today];

  // Hari ini tidak ada jadwal (libur)
  if (!todayRange || todayRange.trim() === "") return false;

  return isTimeRangeActive(todayRange);
}

/**
 * Mendapatkan teks jam buka hari ini untuk ditampilkan.
 * Return null jika tidak ada jadwal atau format tidak dikenali.
 */
export function getTodayScheduleText(operatingHours: string | null | undefined): string | null {
  if (!operatingHours) return null;

  const schedule = parseOperatingHours(operatingHours);
  if (!schedule) return operatingHours; // Tampilkan apa adanya jika format lama

  const today = getTodayDayKey();
  const range = schedule[today];

  if (!range) return null;
  return `${DAY_LABELS[today]}: ${range || "Libur"}`;
}

/**
 * Format schedule untuk tampilan ringkas (baris-baris per hari).
 */
export function formatScheduleDisplay(operatingHours: string | null | undefined): string | null {
  if (!operatingHours) return null;

  const schedule = parseOperatingHours(operatingHours);
  if (!schedule) return operatingHours; // Format lama, tampilkan apa adanya

  const lines = DAY_KEYS.map((day) => {
    const range = schedule[day];
    return `${DAY_LABELS[day]}: ${range || "Libur"}`;
  });

  return lines.join("\n");
}
