import React from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert, X, MapPin, Clock, Hospital, Eye, ArrowRight } from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalName?: string;
  emergencyPhone?: string;
  onNavigateToVisualWoundGuide?: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  hospitalName = 'โรงพยาบาลกรุงเทพเชียงใหม่ (Bangkok Hospital Chiang Mai)',
  emergencyPhone = '1719',
  onNavigateToVisualWoundGuide
}) => {
  if (!isOpen) return null;

  const redFlagSymptoms = [
    {
      title: 'แผลผ่าตัด: ปริ/แยก มีหนอง หรือเลือดซึมมากไม่หยุด',
      detail: 'ไหมเย็บหลุด ขอบแผลแยกมองเห็นชั้นใน หรือมีหนองสีเหลือง/เขียว หรือเลือดสดไหลซึมต่อเนื่อง',
      badge: 'แผลปริ/หนอง/เลือด',
      hasWoundLink: true
    },
    {
      title: 'ระบบทางเดินอาหาร: ท้องอืดตึงมาก ไม่ผายลม/ไม่อุจจาระ, อาเจียนรุนแรง, อาเจียนเป็นเลือด หรือถ่ายอุจจาระสีดำ',
      detail: 'อาจเกิดจากภาวะลำไส้อุดตัน ลำไส้อัมพาต หรือมีเลือดออกในกระเพาะอาหาร/ลำไส้',
      badge: 'ทางเดินอาหาร/อาเจียน'
    },
    {
      title: 'มีไข้สูง 38°C ร่วมกับหนาวสั่น, ปวดท้องรุนแรงขึ้น หรือหน้าท้องแข็งเกร็ง',
      detail: 'สัญญาณของการติดเชื้อในช่องท้อง การอักเสบรุนแรง หรือหน้าท้องแข็งเกร็งเหมือนแผ่นกระดาน',
      badge: 'ไข้สูง/ปวดรุนแรง'
    },
    {
      title: 'มีอาการหน้ามืด วิงเวียนคล้ายจะเป็นลม (ช็อก), ซึมลง/สับสน, หรือปัสสาวะไม่ออกเลย',
      detail: 'บ่งชี้ถึงภาวะความดันโลหิตตก ภาวะช็อกจากการสูญเสียเลือดหรือสารน้ำ หรือปัสสาวะไม่ออกนานเกิน 6-8 ชม.',
      badge: 'ภาวะช็อก/ปัสสาวะไม่ออก'
    },
    {
      title: 'หายใจหอบเหนื่อย เจ็บหน้าอกกะทันหัน หรือขาบวมตึงข้างเดียว',
      detail: 'ต้องระวังภาวะลิ่มเลือดอุดตันในหลอดเลือดดำ (DVT) หรือลิ่มเลือดหลุดไปปอด (Pulmonary Embolism)',
      badge: 'ลิ่มเลือดอุดตัน'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="modal-emergency-sos"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border-2 border-rose-500 overflow-hidden my-6"
      >
        {/* Red emergency banner header */}
        <div className="bg-rose-600 text-white p-4 sm:p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-rose-700/60 hover:bg-rose-700 rounded-full p-1.5 transition-colors"
            title="ปิดหน้าต่างฉุกเฉิน"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block bg-rose-700 text-rose-100 text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase mb-1">
                Careplus+ Emergency Alert • สัญญาณอันตรายหลังผ่าตัดช่องท้อง
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ศูนย์อุบัติเหตุและฉุกเฉิน 24 ชั่วโมง
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 mt-2 font-medium">
            หากมีอาการผิดปกติทางช่องท้องหรืออาการรุนแรงต่อไปนี้ อย่ารอช้า! ให้กดโทร 1719 ติดต่อโรงพยาบาลกรุงเทพเชียงใหม่ทันที
          </p>
        </div>

        {/* Big Call Button Section */}
        <div className="p-4 sm:p-5 bg-rose-50/60 border-b border-rose-200">
          <div className="text-center mb-3">
            <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              {hospitalName}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              บริการรถพยาบาลฉุกเฉินและทีมแพทย์เฉพาะทางอุบัติเหตุตลอด 24 ชั่วโมง
            </p>
          </div>

          <a
            id="btn-call-1719-main"
            href={`tel:${emergencyPhone}`}
            className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-xl font-bold text-lg sm:text-xl shadow-lg shadow-rose-600/30 transition-all text-center"
          >
            <PhoneCall className="w-6 h-6 animate-bounce" />
            <span>กดโทรออก 1719 ทันที</span>
          </a>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            *สายด่วนฉุกเฉิน 4 หลัก โทรฟรีหรือคิดค่าบริการตามแพ็กเกจผู้ให้บริการเครือข่าย
          </p>
        </div>

        {/* Red Flag Symptoms Checklist */}
        <div className="p-4 sm:p-5 max-h-[46vh] overflow-y-auto space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>สัญญาณเตือนอันตรายสีแดงที่ต้องกลับมารพ.ทันที (Red Flags)</span>
          </div>

          <div className="space-y-2">
            {redFlagSymptoms.map((symptom, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs flex items-start gap-3 hover:border-rose-300 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {symptom.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 shrink-0">
                      {symptom.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {symptom.detail}
                  </p>
                  {symptom.hasWoundLink && onNavigateToVisualWoundGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToVisualWoundGuide();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold border border-teal-200 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>เปิดคู่มือประเมินแผลด้วยสายตา (Visual Wound Guide)</span>
                      <ArrowRight className="w-3 h-3 text-teal-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Hospital Info card */}
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Hospital className="w-4 h-4 text-teal-700" />
              <span>ข้อมูลติดต่อโรงพยาบาลกรุงเทพเชียงใหม่</span>
            </div>
            <p className="flex items-start gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>88/8-9 หมู่ 6 ต.หนองป่าครั่ง อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50000</span>
            </p>
            <p className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>แผนกฉุกเฉินเปิดบริการตลอด 24 ชั่วโมง ทุกวัน</span>
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500">
            คำแนะนำ: หากผู้ป่วยหมดสติหรือหายใจลำบาก ห้ามให้น้ำหรืออาหารทางปาก
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
