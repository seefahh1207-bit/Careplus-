import React from 'react';
import { UserProfile, DailyChecklistItem, PainRecord, WoundRecord, NavigationTab } from '../types';
import { PainScaleFace, getNormalizedPainLevel } from './PainScaleFace';
import { 
  Activity, 
  CheckCircle2, 
  Camera, 
  BookOpen, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles, 
  HeartPulse, 
  ChevronRight, 
  Award,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  TrendingDown,
  Clock
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  daysPostOp: number;
  checklist: DailyChecklistItem[];
  painRecords: PainRecord[];
  woundRecords: WoundRecord[];
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenSOS: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  daysPostOp,
  checklist,
  painRecords,
  woundRecords,
  onNavigateTab,
  onOpenSOS
}) => {
  // Calculate completion percentage
  const completedChecklist = checklist.filter(i => i.completed).length;
  const totalChecklist = checklist.length;
  const checklistPercent = Math.round((completedChecklist / totalChecklist) * 100);

  // Latest Pain Record
  const latestPain = painRecords.length > 0 
    ? painRecords[painRecords.length - 1] 
    : null;

  // Latest Wound Record
  const latestWound = woundRecords.length > 0 
    ? woundRecords[woundRecords.length - 1] 
    : null;

  // Calculate Daily Readiness Score (คะแนนความพร้อมประจำวัน 0 - 100)
  // Checklist: up to 50 pts
  const checklistScore = (completedChecklist / totalChecklist) * 50;

  // Pain factor: up to 25 pts (10 is 0 pts, 0 is 25 pts)
  let painScore = 25;
  if (latestPain) {
    if (latestPain.level <= 2) painScore = 25;
    else if (latestPain.level <= 4) painScore = 20;
    else if (latestPain.level <= 6) painScore = 12;
    else painScore = 5;
  }

  // Wound factor: up to 25 pts
  let woundScore = 25;
  if (latestWound) {
    if (latestWound.status === 'healthy') woundScore = 25;
    else if (latestWound.status === 'monitor') woundScore = 15;
    else woundScore = 0;
  }

  const dailyReadinessScore = Math.min(100, Math.round(checklistScore + painScore + woundScore));

  const getReadinessStatus = (score: number) => {
    if (score >= 85) {
      return {
        label: 'การฟื้นตัวยอดเยี่ยม (Excellent Recovery)',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-300',
        barColor: 'from-emerald-500 to-teal-500',
        desc: 'ร่างกายตอบสนองต่อการฟื้นฟูได้ดีมาก แผลอยู่ในเกณฑ์แห้งสะอาด และปฏิบัติภารกิจดูแลตนเองได้สม่ำเสมอ'
      };
    } else if (score >= 60) {
      return {
        label: 'การฟื้นตัวอยู่ในเกณฑ์ดี (Good Progress)',
        color: 'text-teal-700',
        bg: 'bg-teal-50 border-teal-300',
        barColor: 'from-teal-500 to-cyan-500',
        desc: 'ฟื้นตัวได้ตามลำดับความคาดหมาย แนะนำทำภารกิจเช็คลิสต์ที่เหลือให้ครบเพื่อเร่งการสมานตัว'
      };
    } else {
      return {
        label: 'ต้องการการดูแลเพิ่มเติม (Needs Attention)',
        color: 'text-amber-700',
        bg: 'bg-amber-50 border-amber-300',
        barColor: 'from-amber-400 to-rose-400',
        desc: 'มีอาการปวดหรือยังปฏิบัติภารกิจดูแลตัวเองไม่ครบ กรุณาพักผ่อนและสังเกตอาการอย่างใกล้ชิด'
      };
    }
  };

  const readiness = getReadinessStatus(dailyReadinessScore);

  return (
    <div className="space-y-4">
      {/* Risk Alert Banner if latest wound is 'risk' or pain is severe */}
      {latestWound?.status === 'risk' && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 shadow-md flex items-start gap-3.5 animate-in slide-in-from-top-2">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                สัญญาณเตือนแผลอยู่ในเกณฑ์เสี่ยง
              </span>
              <span className="text-xs font-bold text-rose-900">
                ประเมินเมื่อ {latestWound.date} {latestWound.time} น.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-rose-900 mt-1 font-medium">
              ภาพแผลล่าสุดถูกประเมินว่ามีอาการบวมแดงมากหรือเสี่ยงติดเชื้อ หากมีไข้ร่วมด้วย หรือมีหนองไหลซึม กรุณากดติดต่อแพทย์โรงพยาบาลกรุงเทพเชียงใหม่ทันที
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={onOpenSOS}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>โทร 1719 ฉุกเฉิน</span>
              </button>
              <button
                onClick={() => onNavigateTab('wound')}
                className="px-3 py-1.5 bg-white text-rose-700 hover:bg-rose-100 border border-rose-300 text-xs font-semibold rounded-lg transition-colors"
              >
                ดูประวัติแผล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Overview: Daily Readiness Score & Self-Care Mission Completion */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Readiness Score dial/card */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-teal-600" />
                <span>บันทึกและสรุปภาพรวมการดูแลตัวเองในแต่ละวัน</span>
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {dailyReadinessScore}
                <span className="text-xl sm:text-2xl font-bold text-slate-400 ml-1">/100</span>
              </h2>
              <div className="flex flex-col">
                <span className={`text-sm sm:text-base font-bold ${readiness.color}`}>
                  {readiness.label}
                </span>
                <span className="text-xs text-slate-500">
                  คะแนนความพร้อมประจำวัน (Daily Readiness Score)
                </span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${readiness.barColor} transition-all duration-700`}
                style={{ width: `${dailyReadinessScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              สรุปผลการดูแลตัวเองในแต่ละวันของคุณ เพื่อดูความก้าวหน้าทั้งเรื่องการลุกเดิน การพักผ่อน และระดับความปวด ช่วยให้คุณและครอบครัวมั่นใจได้ในทุกๆ ก้าวของการฟื้นตัวกลับสู่ชีวิตปกติ
            </p>
          </div>

          {/* Mission completion percentage box */}
          <div className="w-full md:w-64 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>ภารกิจดูแลตัวเองวันนี้</span>
              </span>
              <span className="text-lg font-black text-teal-700">
                {checklistPercent}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${checklistPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              สำเร็จแล้ว {completedChecklist} จากทั้งหมด {totalChecklist} ภารกิจหลัก
            </p>

            <button
              id="btn-goto-checklist"
              onClick={() => onNavigateTab('checklist')}
              className="w-full py-2 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>ทำเช็คลิสต์ประจำวัน</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Days Post-Op */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">วันพักฟื้น</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              วันที่ {daysPostOp > 0 ? daysPostOp : 1}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              ผ่าตัดเมื่อ {user.surgeryDate}
            </p>
          </div>
        </div>

        {/* Latest Pain Score */}
        <div 
          onClick={() => onNavigateTab('pain')}
          className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-teal-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">ระดับความปวดล่าสุด</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-2xl font-black text-slate-900">
                  {latestPain ? `${latestPain.level}/10` : '-'}
                </p>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {latestPain ? (latestPain.level <= 3 ? 'เล็กน้อย' : latestPain.level <= 6 ? 'ปานกลาง' : 'รุนแรง') : 'ยังไม่บันทึก'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {latestPain ? `บันทึก ${latestPain.time} น.` : 'คลิกเพื่อประเมิน'}
              </p>
            </div>
            <div className="shrink-0">
              <PainScaleFace level={latestPain ? latestPain.level : 0} size="md" />
            </div>
          </div>
        </div>

        {/* Latest Wound Status */}
        <div 
          onClick={() => onNavigateTab('wound')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-teal-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold">สถานะแผลล่าสุด</span>
            <Camera className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 truncate">
              {latestWound ? (
                latestWound.status === 'healthy' ? 'ปกติ (สมานดี)' :
                latestWound.status === 'monitor' ? 'รอดูอาการ' : 'ผิดปกติ (เสี่ยง)'
              ) : 'ยังไม่บันทึก'}
            </p>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
              latestWound?.status === 'healthy' ? 'bg-emerald-100 text-emerald-800' :
              latestWound?.status === 'monitor' ? 'bg-amber-100 text-amber-800' :
              latestWound?.status === 'risk' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {latestWound ? `${woundRecords.length} ภาพถ่ายในแกลเลอรี` : 'เริ่มถ่ายรูปแผล'}
            </span>
          </div>
        </div>

        {/* Emergency SOS Call Box */}
        <div 
          onClick={() => onNavigateTab('danger')}
          className="bg-rose-50/70 border border-rose-200 hover:border-rose-400 rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-rose-700 text-xs mb-1">
            <span className="font-bold group-hover:underline flex items-center gap-1">
              <span>สัญญาณอันตราย & สายด่วน</span>
            </span>
            <PhoneCall className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div>
            <p className="text-2xl font-black text-rose-700">
              1719
            </p>
            <p className="text-[11px] text-rose-800 font-medium mt-0.5 truncate">
              สัญญาณอันตราย / รพ.กรุงเทพเชียงใหม่
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Menu Cards to the 4 Main Features */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-teal-700" />
          <span>ฟีเจอร์เด่นเพื่อการฟื้นตัวอย่างเป็นระบบ:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Checklist */}
          <div
            onClick={() => onNavigateTab('checklist')}
            className="p-4 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200 hover:border-teal-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              เช็คลิสต์ตรวจสอบตัวเอง 📝
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              บันทึกความก้าวหน้าในการฟื้นตัวหลังผ่าตัด โภชนาการ การเคลื่อนไหว และแผล
            </p>
            <span className="text-xs font-bold text-teal-700 mt-3 inline-flex items-center gap-1">
              เปิดเช็คลิสต์ <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2: Pain Tracker - Displayed as Visual Wong-Baker Faces Image Scale */}
          <div
            onClick={() => onNavigateTab('pain')}
            className="p-4 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200 hover:border-teal-400 cursor-pointer transition-all shadow-xs group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  รูปภาพ Pain Scale
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Pain Scale (รูปภาพประเมินความปวด)
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                ภาพแสดงระดับความปวด Wong-Baker Faces (0-10) พร้อมบันทึกอาการและดูกราฟ
              </p>

              {/* Visual Pain Scale Faces Illustration Strip */}
              <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between gap-1">
                  {[0, 2, 4, 6, 8, 10].map((score) => {
                    const isCurrent = latestPain ? getNormalizedPainLevel(latestPain.level) === score : score === 0;
                    return (
                      <div 
                        key={score} 
                        className={`flex flex-col items-center transition-all ${
                          latestPain && getNormalizedPainLevel(latestPain.level) === score 
                            ? 'scale-110 -translate-y-0.5' 
                            : 'opacity-85 hover:opacity-100'
                        }`}
                        title={`ระดับ ${score}`}
                      >
                        <PainScaleFace level={score} size="sm" />
                        <span className={`text-[9px] mt-1 font-bold ${isCurrent && latestPain ? 'text-teal-700' : 'text-slate-500'}`}>
                          {score}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-700 mt-3 inline-flex items-center gap-1">
              บันทึก & ประเมินความปวด <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3: Wound Assessment */}
          <div
            onClick={() => onNavigateTab('wound')}
            className="p-4 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200 hover:border-teal-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              แผลผ่าตัด 🩹
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ถ่ายภาพแผลผ่าตัดเพื่อดูการเปลี่ยนแปลง บันทึกรูปภาพ และพรีวิวขยายขนาดใหญ่
            </p>
            <span className="text-xs font-bold text-teal-700 mt-3 inline-flex items-center gap-1">
              แผลผ่าตัด <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 4: Self-Care Guide (คู่มือการดูแลตนเอง) */}
          <div
            onClick={() => onNavigateTab('guide')}
            className="p-4 bg-white hover:bg-slate-50/80 rounded-xl border border-slate-200 hover:border-teal-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              คู่มือการดูแลตนเอง
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              คำแนะนำทางการพยาบาล โภชนาการ ข้อห้ามสำคัญ พร้อมเครื่องมือฝึกหายใจลึกและกอดหมอน
            </p>
            <span className="text-xs font-bold text-teal-700 mt-3 inline-flex items-center gap-1">
              เปิดคู่มือการดูแลตนเอง <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
