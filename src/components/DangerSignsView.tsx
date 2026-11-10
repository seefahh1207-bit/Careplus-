import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  Thermometer,
  Activity,
  HeartPulse,
  Hospital,
  MapPin,
  Clock,
  ArrowRight,
  Eye,
  Info,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface DangerSignsViewProps {
  onGoToVisualWoundGuide: () => void;
  hospitalName?: string;
  emergencyPhone?: string;
}

export const DangerSignsView: React.FC<DangerSignsViewProps> = ({
  onGoToVisualWoundGuide,
  hospitalName = 'โรงพยาบาลกรุงเทพเชียงใหม่ (Bangkok Hospital Chiang Mai)',
  emergencyPhone = '1719'
}) => {
  // Dropdown state for the 4 core danger signs
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    setOpenItems({ 1: true, 2: true, 3: true, 4: true });
  };

  const handleCollapseAll = () => {
    setOpenItems({ 1: false, 2: false, 3: false, 4: false });
  };

  const allExpanded = Object.values(openItems).every(Boolean);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Red Alert Header Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>Red Flags • สัญญาณอันตรายหลังผ่าตัดช่องท้อง</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              อาการเร่งด่วนที่ต้องกลับมาโรงพยาบาลทันที
            </h1>
            <p className="text-sm sm:text-base text-rose-100 leading-relaxed font-medium">
              หากผู้ป่วยมีอาการเตือนข้อใดข้อหนึ่งต่อไปนี้ ถือเป็นภาวะฉุกเฉินทางการแพทย์
              กรุณาติดต่อสายด่วนฉุกเฉินหรือเดินทางมายังห้องฉุกเฉินทันที ตลอด 24 ชั่วโมง
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <a
              id="btn-danger-call-1719"
              href={`tel:${emergencyPhone}`}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 py-3.5 px-6 rounded-2xl font-black text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-95"
            >
              <PhoneCall className="w-5 h-5 fill-rose-600 text-rose-600" />
              <span>กดโทรฉุกเฉิน 1719</span>
            </a>
            <p className="text-center text-[11px] text-rose-200 mt-1.5 font-medium">
              {hospitalName}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Urgent Danger Signs Categories (Dropdown Accordion) */}
      <div className="space-y-3">
        {/* Controls: Expand/Collapse All */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              กดแตะที่หัวข้อเพื่อเปิด/ปิดดูรายละเอียด
            </span>
          </div>
          <button
            type="button"
            onClick={allExpanded ? handleCollapseAll : handleExpandAll}
            className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
          >
            {allExpanded ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด'}
          </button>
        </div>

        <div className="space-y-3">
          {/* Card 1: แผลผ่าตัด */}
          <div className="bg-white rounded-2xl border-2 border-rose-200 hover:border-rose-300 shadow-xs overflow-hidden transition-all">
            <button
              type="button"
              id="btn-dropdown-danger-1"
              onClick={() => toggleItem(1)}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-rose-50/40 cursor-pointer"
              aria-expanded={openItems[1]}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  แผลผ่าตัด: ปริ/แยก มีหนอง หรือเลือดซึมมากไม่หยุด
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-rose-600 hidden sm:inline">
                  {openItems[1] ? 'ย่อ' : 'ดูรายละเอียด'}
                </span>
                <div className={`w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center transition-transform duration-200 ${openItems[1] ? 'rotate-180 bg-rose-100' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {openItems[1] && (
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-rose-100 space-y-3.5 animate-in fade-in duration-200">
                <div className="bg-rose-50/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 space-y-1.5 border border-rose-100 mt-2">
                  <p className="font-semibold text-rose-900">
                    ลักษณะอาการที่ต้องสังเกต:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>ขอบแผลผ่าตัดแยกออกจากกัน ไหมเย็บหลุด หรือมองเห็นเนื้อเยื่อชั้นใน</li>
                    <li>มีน้ำเหลืองปนหนองสีขุ่น ขาว เหลือง หรือเขียวไหลออกมา มีกลิ่นเหม็น</li>
                    <li>มีเลือดสดสีแดงสดไหลซึมชุ่มผ้าก๊อซต่อเนื่องไม่หยุด แม้จะกดซับแล้ว</li>
                    <li>ผิวหนังรอบแผลบวมแดงกว้างขึ้น ร้อนจัด และปวดแสบรุนแรงขึ้นเรื่อยๆ</li>
                  </ul>
                </div>

                {/* Direct Link to Visual Wound Guide as requested */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    id="btn-link-to-visual-wound-guide"
                    onClick={onGoToVisualWoundGuide}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-teal-50 hover:bg-teal-100/90 text-teal-800 rounded-xl font-bold text-xs sm:text-sm transition-colors border border-teal-200 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
                      <span>ดูคู่มือประเมินแผลด้วยสายตา (Visual Wound Guide)</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-teal-700">
                      <span>เปรียบเทียบแผล</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: ระบบทางเดินอาหาร */}
          <div className="bg-white rounded-2xl border-2 border-rose-200 hover:border-rose-300 shadow-xs overflow-hidden transition-all">
            <button
              type="button"
              id="btn-dropdown-danger-2"
              onClick={() => toggleItem(2)}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-rose-50/40 cursor-pointer"
              aria-expanded={openItems[2]}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  ระบบทางเดินอาหาร: ท้องอืดตึงมาก ไม่ผายลม/ไม่อุจจาระ อาเจียนรุนแรง
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-rose-600 hidden sm:inline">
                  {openItems[2] ? 'ย่อ' : 'ดูรายละเอียด'}
                </span>
                <div className={`w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center transition-transform duration-200 ${openItems[2] ? 'rotate-180 bg-rose-100' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {openItems[2] && (
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-rose-100 space-y-3 animate-in fade-in duration-200">
                <div className="bg-rose-50/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 space-y-1.5 border border-rose-100 mt-2">
                  <p className="font-semibold text-rose-900">
                    ลักษณะอาการที่ต้องสังเกต:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>ท้องอืดแน่น ท้องตึงแข็งมาก ไม่ผายลมและไม่ถ่ายอุจจาระติดต่อกัน</li>
                    <li>คลื่นไส้ อาเจียนซ้ำๆ รับประทานอาหารหรือดื่มน้ำไม่ได้เลย</li>
                    <li><strong className="text-rose-700">อาเจียนเป็นเลือดสด</strong> หรือของเหลวสีกาแฟเข้ม</li>
                    <li><strong className="text-rose-700">ถ่ายอุจจาระเป็นมูกเลือด หรือถ่ายดำเหนียวคล้ายยางมะตอย</strong></li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>ห้ามรับประทานยาระบายเองโดยไม่ได้รับคำสั่งจากแพทย์เด็ดขาด</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: ไข้สูงและปวดท้อง */}
          <div className="bg-white rounded-2xl border-2 border-rose-200 hover:border-rose-300 shadow-xs overflow-hidden transition-all">
            <button
              type="button"
              id="btn-dropdown-danger-3"
              onClick={() => toggleItem(3)}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-rose-50/40 cursor-pointer"
              aria-expanded={openItems[3]}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  มีไข้สูง 38°C ร่วมกับหนาวสั่น ปวดท้องรุนแรงขึ้น หรือหน้าท้องแข็งเกร็ง
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-rose-600 hidden sm:inline">
                  {openItems[3] ? 'ย่อ' : 'ดูรายละเอียด'}
                </span>
                <div className={`w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center transition-transform duration-200 ${openItems[3] ? 'rotate-180 bg-rose-100' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {openItems[3] && (
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-rose-100 space-y-3 animate-in fade-in duration-200">
                <div className="bg-rose-50/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 space-y-1.5 border border-rose-100 mt-2">
                  <p className="font-semibold text-rose-900">
                    ลักษณะอาการที่ต้องสังเกต:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>วัดอุณหภูมิร่างกายได้สูงตั้งแต่ 38.0 องศาเซลเซียสขึ้นไป ร่วมกับตัวสั่น หนาวสั่นสะท้าน</li>
                    <li>ปวดท้องรุนแรงทวีคูณ รับประทานยาแก้ปวดที่แพทย์จัดให้แล้วไม่ทุเลา</li>
                    <li>หน้าท้องแข็งเกร็งเหมือนแผ่นกระดาน (Board-like rigidity)</li>
                    <li>เจ็บแปล๊บมากเมื่อไอ จาม หรือเมื่อมีการขยับสะเทือนหน้าท้อง</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>ไข้สูงร่วมกับหนาวสั่นเป็นสัญญาณของการติดเชื้อในช่องท้องที่ต้องตรวจอัลตราซาวด์/CT ด่วน</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 4: ภาวะช็อก ซึมลง หรือปัสสาวะไม่ออก */}
          <div className="bg-white rounded-2xl border-2 border-rose-200 hover:border-rose-300 shadow-xs overflow-hidden transition-all">
            <button
              type="button"
              id="btn-dropdown-danger-4"
              onClick={() => toggleItem(4)}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-rose-50/40 cursor-pointer"
              aria-expanded={openItems[4]}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center shrink-0">
                  4
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  มีอาการหน้ามืด วิงเวียนคล้ายจะเป็นลม (ช็อก) ซึมลง/สับสน หรือปัสสาวะไม่ออกเลย
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-rose-600 hidden sm:inline">
                  {openItems[4] ? 'ย่อ' : 'ดูรายละเอียด'}
                </span>
                <div className={`w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center transition-transform duration-200 ${openItems[4] ? 'rotate-180 bg-rose-100' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {openItems[4] && (
              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-rose-100 space-y-3 animate-in fade-in duration-200">
                <div className="bg-rose-50/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 space-y-1.5 border border-rose-100 mt-2">
                  <p className="font-semibold text-rose-900">
                    ลักษณะอาการที่ต้องสังเกต:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>หน้ามืด วิงเวียนศีรษะ เหงื่อกาฬแตก ตัวเย็น ตัวซีด ชีพจรเต้นเร็วคล้ายจะเป็นลม (ภาวะช็อก)</li>
                    <li>ผู้ป่วยซึมลง ปลุกตื่นยาก ตอบสนองช้า หรือมีอาการสับสนเพ้อ ไม่รู้เวลาสถานที่</li>
                    <li>ปวดตึงหัวหน่าวแต่ปัสสาวะไม่ออกเลยนานเกิน 6-8 ชั่วโมง</li>
                    <li>ปัสสาวะออกน้อยมาก (น้อยกว่า 1 แก้วตลอดวัน) หรือปัสสาวะมีเลือดสดปนเข้มข้น</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>หากมีอาการหน้ามืด ให้นอนราบและยกปลายเท้าสูงเล็กน้อยระหว่างรอรถพยาบาล</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Immediate Instructions & Hospital Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Actions while traveling to hospital */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ข้อควรปฏิบัติทันที เมื่อสงสัยสัญญาณอันตรายและกำลังเดินทางมารพ.</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <p className="font-bold text-amber-900 mb-1">1. งดน้ำและอาหารทางปากทันที</p>
              <p className="text-slate-600">
                เผื่อในกรณีที่แพทย์จำเป็นต้องตรวจเอกซเรย์คอมพิวเตอร์ หรือต้องเข้ารับการผ่าตัดแก้ไขฉุกเฉิน
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200/80">
              <p className="font-bold text-rose-900 mb-1">2. ห้ามกดหรือบีบเค้นแผล</p>
              <p className="text-slate-600">
                หากมีเลือดหรือหนองไหล ให้ใช้ผ้าก๊อซหรือผ้าสะอาดปิดทับไว้เบาๆ ห้ามแกะแผ่นปิดแผลออกทั้งหมด
              </p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200/80">
              <p className="font-bold text-sky-900 mb-1">3. พกถุงยาและประวัติการผ่าตัด</p>
              <p className="text-slate-600">
                นำยาปฏิชีวนะ ยาแก้ปวด และซองยาทั้งหมดที่แพทย์สั่งจ่ายติดตัวมาด้วย เพื่อให้แพทย์ประเมินการรักษา
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
              <p className="font-bold text-indigo-900 mb-1">4. มีญาติหรือผู้ดูแลร่วมเดินทาง</p>
              <p className="text-slate-600">
                เพื่อคอยดูแลความปลอดภัย ป้องกันการหกล้ม และช่วยแจ้งข้อมูลประวัติการรักษาแก่เจ้าหน้าที่
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Room Contact Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Hospital className="w-4 h-4" />
              <span>จุดรับผู้ป่วยฉุกเฉิน (Emergency Room)</span>
            </div>
            <h4 className="text-base font-bold text-white leading-snug">
              {hospitalName}
            </h4>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>88/8-9 หมู่ 6 ต.หนองป่าครั่ง อ.เมืองเชียงใหม่ จ.เชียงใหม่ 50000</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>เปิดบริการ 24 ชั่วโมง ทุกวัน ไม่มีวันหยุด</span>
              </p>
            </div>
          </div>

          <a
            href={`tel:${emergencyPhone}`}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-colors text-center"
          >
            <PhoneCall className="w-4 h-4" />
            <span>โทรด่วน {emergencyPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
