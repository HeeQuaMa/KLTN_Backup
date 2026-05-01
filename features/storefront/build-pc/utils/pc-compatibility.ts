import {
  BuildState,
  BuildSlotKey,
  SelectedPart,
} from "@/features/storefront/build-pc/types";

export const checkCompatibilityRules = (
  currentBuild: BuildState,
  newSlotKey: BuildSlotKey,
  newPart: SelectedPart,
): string[] => {
  const warnings: string[] = [];

  // 1. Tạo bản sao cấu hình mô phỏng việc đã thêm linh kiện mới
  const tempBuild: BuildState = { ...currentBuild, [newSlotKey]: newPart };

  const { cpu, mainboard, ram, vga, psu, case: pcCase } = tempBuild;

  // Trích xuất specifications an toàn
  const cpuSpecs = cpu?.specifications || {};
  const mbSpecs = mainboard?.specifications || {};
  const ramSpecs = ram?.specifications || {};
  const vgaSpecs = vga?.specifications || {};
  const psuSpecs = psu?.specifications || {};
  const caseSpecs = pcCase?.specifications || {};

  // ---------------------------------------------------------
  // RULE 1: CPU + Mainboard (Định danh Socket)
  // ---------------------------------------------------------
  if (cpu && mainboard) {
    if (
      cpuSpecs.socket &&
      mbSpecs.socket &&
      cpuSpecs.socket !== mbSpecs.socket
    ) {
      warnings.push(
        `Socket không khớp: CPU (${cpuSpecs.socket}) và Mainboard (${mbSpecs.socket}).`,
      );
    }
  }

  // ---------------------------------------------------------
  // RULE 2: Mainboard + RAM (Chuẩn kết nối - DDR)
  // ---------------------------------------------------------
  if (mainboard && ram) {
    if (
      mbSpecs.ramType &&
      ramSpecs.ramType &&
      mbSpecs.ramType !== ramSpecs.ramType
    ) {
      warnings.push(
        `Chuẩn RAM không khớp: Mainboard hỗ trợ ${mbSpecs.ramType}, nhưng RAM là ${ramSpecs.ramType}.`,
      );
    }
  }

  // ---------------------------------------------------------
  // RULE 3: GPU + Case (Vật lý - Kích thước VGA)
  // ---------------------------------------------------------
  if (vga && pcCase) {
    const vgaLength = Number(vgaSpecs.length || vgaSpecs.vgaLength);
    const caseMaxGpu = Number(caseSpecs.maxGpuLength || caseSpecs.vgaClearance);

    if (vgaLength && caseMaxGpu && vgaLength >= caseMaxGpu) {
      warnings.push(
        `VGA quá dài (${vgaLength}mm) so với sức chứa của Case (${caseMaxGpu}mm).`,
      );
    }
  }

  // ---------------------------------------------------------
  // RULE 4: Mainboard + Case (Chuẩn kích thước Form Factor)
  // ---------------------------------------------------------
  if (mainboard && pcCase) {
    const mbForm = String(mbSpecs.formFactor);
    // Giả sử supportedForms trả về dạng mảng ['ATX', 'Micro-ATX'] hoặc chuỗi 'ATX, Micro-ATX'
    const supportedForms = caseSpecs.supportedForms || caseSpecs.mbSupport;

    if (mbForm && supportedForms) {
      const isSupported = Array.isArray(supportedForms)
        ? supportedForms.includes(mbForm)
        : String(supportedForms).includes(mbForm);

      if (!isSupported) {
        warnings.push(`Case không hỗ trợ kích thước Mainboard (${mbForm}).`);
      }
    }
  }

  // ---------------------------------------------------------
  // RULE 5: Hệ thống + PSU (Điện năng - Tính tổng TDP)
  // ---------------------------------------------------------
  if (psu) {
    // Lấy tất cả linh kiện hiện có trong bảng mô phỏng
    const allParts = Object.values(tempBuild).filter(Boolean) as SelectedPart[];

    // Tính tổng TDP (Công suất tỏa nhiệt / tiêu thụ)
    const totalTDP = allParts.reduce((sum, part) => {
      const tdp = Number(
        part.specifications?.tdp || part.specifications?.powerDraw || 0,
      );
      return sum + tdp;
    }, 0);

    const requiredWattage = totalTDP * 1.5;
    const psuWattage = Number(psuSpecs.wattage || psuSpecs.capacity);

    if (totalTDP > 0 && psuWattage && psuWattage < requiredWattage) {
      warnings.push(
        `Nguồn điện có thể thiếu. Hệ thống cần tối thiểu ~${Math.ceil(requiredWattage)}W (Nguồn đang chọn: ${psuWattage}W).`,
      );
    }
  }

  return warnings;
};

// Thêm hàm này vào cuối file pc-compatibility.ts

export const evaluateBuildWarnings = (
  build: BuildState,
): Record<string, string[]> => {
  const warnings: Record<string, string[]> = {};

  // Hàm tiện ích để nhét lỗi vào các slot liên quan
  const addWarning = (slots: BuildSlotKey[], message: string) => {
    slots.forEach((slot) => {
      if (!warnings[slot]) warnings[slot] = [];
      warnings[slot].push(message);
    });
  };

  const { cpu, mainboard, ram, vga, psu, case: pcCase } = build;

  const cpuSpecs = cpu?.specifications || {};
  const mbSpecs = mainboard?.specifications || {};
  const ramSpecs = ram?.specifications || {};
  const vgaSpecs = vga?.specifications || {};
  const psuSpecs = psu?.specifications || {};
  const caseSpecs = pcCase?.specifications || {};

  // RULE 1: CPU + Mainboard (Socket)
  if (cpu && mainboard && cpuSpecs.socket && mbSpecs.socket) {
    if (cpuSpecs.socket !== mbSpecs.socket) {
      // Báo lỗi cho cả CPU và Mainboard
      addWarning(
        ["cpu", "mainboard"],
        `Không tương thích với Mainboard (Khác Socket: ${cpuSpecs.socket} vs ${mbSpecs.socket})`,
      );
    }
  }

  // RULE 2: Mainboard + RAM (DDR)
  if (mainboard && ram && mbSpecs.ramType && ramSpecs.ramType) {
    if (mbSpecs.ramType !== ramSpecs.ramType) {
      addWarning(
        ["mainboard", "ram"],
        `Chuẩn RAM không khớp (Hỗ trợ: ${mbSpecs.ramType}, Đang chọn: ${ramSpecs.ramType})`,
      );
    }
  }

  // RULE 3: VGA + Case (Chiều dài)
  if (vga && pcCase) {
    const vgaLen = Number(vgaSpecs.length || vgaSpecs.vgaLength);
    const caseVgaClearance = Number(
      caseSpecs.maxGpuLength || caseSpecs.vgaClearance,
    );
    if (vgaLen && caseVgaClearance && vgaLen >= caseVgaClearance) {
      addWarning(
        ["vga", "case"],
        `VGA quá dài (${vgaLen}mm) so với Case (${caseVgaClearance}mm)`,
      );
    }
  }

  // RULE 4: Nguồn (PSU)
  if (psu) {
    const allParts = Object.values(build).filter(Boolean) as SelectedPart[];
    const totalTDP = allParts.reduce(
      (sum, part) => sum + Number(part.specifications?.tdp || 0),
      0,
    );
    const requiredWattage = totalTDP * 1.5;
    const psuWattage = Number(psuSpecs.wattage || psuSpecs.capacity);

    if (totalTDP > 0 && psuWattage && psuWattage < requiredWattage) {
      addWarning(
        ["psu"],
        `Nguồn điện có thể không đủ tải (Cần >= ${Math.ceil(requiredWattage)}W)`,
      );
    }
  }

  // Bạn có thể copy thêm các Rule khác từ hàm check cũ xuống đây...

  return warnings;
};
