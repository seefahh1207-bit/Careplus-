import React, { useState } from 'react';
import { DailyChecklistItem } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  RotateCcw, 
  Award,
  Utensils,
  Footprints,
  Shield,
  Search,
  Droplet,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyChecklistProps {
  items: DailyChecklistItem[];
  onToggleItem: (id: string) => void;
  onResetToday: () => void;
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({
  items,
  onToggleItem,
  onResetToday
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleToggle = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item && !item.completed && completedCount + 1 === totalCount) {
      // Trigger celebratory confetti on 100% completion
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
    onToggleItem(id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Utensils className="w-4 h-4 text-emerald-600" />;
      case 'mobility':
        return <Footprints className="w-4 h-4 text-sky-600" />;
      case 'respiratory':
        return <Shield className="w-4 h-4 text-indigo-600" />;
      case 'wound':
        return <Search className="w-4 h-4 text-rose-600" />;
      case 'elimination':
        return <Droplet className="w-4 h-4 text-amber-600" />;
      case 'rest':
        return <Moon className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'nutrition':
        return { label: 'โภชนาการ', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'mobility':
        return { label: 'การเคลื่อนไหว', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'respiratory':
        return { label: 'บริหารปอด & แผล', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'wound':
        return { label: 'ความสะอาดแผล', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'elimination':
        return { label: 'การขับถ่าย', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'rest':
        return { label: 'การพักผ่อน', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'ทั่วไป', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Careplus+</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                เช็คลิสต์ตรวจสอบตัวเอง (Daily Checklist) 📝
              </h2>
              {progressPercent === 100 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                  <Award className="w-3.5 h-3.5" />
                  สำเร็จครบ 100%!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              บันทึกความก้าวหน้าในการฟื้นตัวหลังผ่าตัด
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-teal-700">
              {progressPercent}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({completedCount}/{totalCount} ข้อ)
            </span>
            <button
              onClick={onResetToday}
              className="ml-2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="เริ่มเช็คลิสต์รอบใหม่"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPercent === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : progressPercent >= 60
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                : 'bg-gradient-to-r from-amber-400 to-teal-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Guidance status text */}
        <div className="mt-3 text-xs flex items-center justify-between text-slate-600">
          <span className="font-medium">
            {progressPercent === 100 ? (
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                ยอดเยี่ยมมาก! วันนี้คุณดูแลตัวเองได้อย่างปลอดภัยและครบถ้วนตามหลักการแพทย์
              </span>
            ) : progressPercent >= 50 ? (
              <span className="text-teal-800">
                ทำภารกิจสำเร็จไปแล้วกว่าครึ่งทาง ร่างกายกำลังฟื้นตัวอย่างต่อเนื่อง
              </span>
            ) : (
              <span className="text-slate-500">
                คลิกที่รายการเพื่อบันทึกการปฏิบัติในแต่ละวัน
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            รีเซ็ตข้อมูลได้ทุกวัน
          </span>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const badge = getCategoryBadge(item.category);
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-200 ${
                item.completed
                  ? 'bg-teal-50/40 border-teal-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              } shadow-xs overflow-hidden`}
            >
              <div className="p-3.5 sm:p-4 flex items-start gap-3">
                {/* Checkbox button */}
                <button
                  id={`btn-checklist-item-${index + 1}`}
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className="mt-0.5 shrink-0 text-teal-700 hover:scale-105 active:scale-95 transition-transform"
                  aria-label={item.completed ? 'ทำเครื่องหมายว่ายังไม่ทำ' : 'ทำเครื่องหมายว่าทำแล้ว'}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-teal-600 fill-teal-100" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleToggle(item.id)}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-slate-400">
                      ข้อที่ {index + 1}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      • {item.frequency}
                    </span>
                  </div>

                  <h3 className={`text-sm sm:text-base font-bold ${
                    item.completed ? 'text-teal-900 line-through decoration-teal-400/70' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Expand / Details Toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  title="ดูคำอธิบายทางการแพทย์"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expandable Medical rationale */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 text-xs bg-slate-50/70 border-t border-slate-100 text-slate-600 flex items-start gap-2 animate-in fade-in duration-150">
                  <div className="mt-0.5 p-1 rounded-full bg-teal-100 text-teal-700 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">เหตุผลทางการพยาบาล: </span>
                    <span>{item.detail}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
