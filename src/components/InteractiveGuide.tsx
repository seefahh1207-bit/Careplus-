import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Wind, 
  Shield, 
  Utensils, 
  HeartHandshake, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Award,
  Footprints,
  Info,
  ShieldCheck,
  Flame,
  Moon,
  Eye,
  AlertTriangle,
  AlertCircle,
  Pill,
  Clock,
  HeartPulse,
  Droplets,
  Thermometer,
  ZoomIn,
  CheckSquare,
  Square,
  PhoneCall,
  HelpCircle,
  X
} from 'lucide-react';
import woundNormalImg from '../assets/images/wound_normal_1789237128929.jpg';
import woundAbnormalImg from '../assets/images/wound_abnormal_1789237141661.jpg';
import woundDehiscenceImg from '../assets/images/wound_dehiscence_1789238195593.jpg';
import foodRecommendedImg from '../assets/images/food_recommended_1789238723748.jpg';
import foodAvoidImg from '../assets/images/food_avoid_1789238735425.jpg';
import mepilexBorderPostOpImg from '../assets/images/mepilex_border_postop_1789239232148.jpg';
import splintingPillowImg from '../assets/images/splinting_pillow_postop_1789318873844.jpg';
import logrollBedImg from '../assets/images/logroll_bed_getting_up_1789319359677.jpg';
import sleepingPositionsImg from '../assets/images/postop_sleeping_positions_1789319374936.jpg';
import bendingKneesBedImg from '../assets/images/bending_knees_bed_1789319814754.jpg';
import logrollSideLyingImg from '../assets/images/logroll_side_lying_1789320102096.jpg';
import logrollLegsOverImg from '../assets/images/logroll_legs_over_1789320122906.jpg';
import logrollPushUpImg from '../assets/images/logroll_push_up_1789320140757.jpg';

export interface InteractiveGuideProps {
  initialScrollTarget?: string | null;
  onClearScrollTarget?: () => void;
}

export const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  initialScrollTarget,
  onClearScrollTarget
}) => {
  // Accordion state for the 4 main topics (topic 1 open by default)
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({
    hygieneWound: true,
    painManagement: false,
    nutrition: false,
    eliminationRest: false,
  });

  // Effect to scroll to target (e.g. Visual Wound Guide from Danger Signs view)
  useEffect(() => {
    if (initialScrollTarget === 'visual-wound-guide') {
      setOpenTopics(prev => ({ ...prev, hygieneWound: true }));
      const timer = setTimeout(() => {
        const el = document.getElementById('visual-wound-guide');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        onClearScrollTarget?.();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialScrollTarget, onClearScrollTarget]);

  // Active interactive simulator
  const [activeTool, setActiveTool] = useState<'none' | 'breathing' | 'splinting' | 'logroll'>('breathing');
  
  // Guided Breathing Timer State
  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathingTimer, setBreathingTimer] = useState<number>(0);
  const [breathingCount, setBreathingCount] = useState<number>(0);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // Splinting Simulator State
  const [splintStep, setSplintStep] = useState<number>(1);

  // Log-Roll Step
  const [logRollStep, setLogRollStep] = useState<number>(1);

  // Wound Care Visual Explorer State
  const [woundViewMode, setWoundViewMode] = useState<'all' | 'normal' | 'infection' | 'dehiscence' | 'checker'>('all');
  const [enlargedWoundModal, setEnlargedWoundModal] = useState<null | 'normal' | 'infection' | 'dehiscence'>(null);
  const [selfCheckSymptoms, setSelfCheckSymptoms] = useState<string[]>([]);

  // Food & Nutrition Visual Explorer State
  const [foodFilterTab, setFoodFilterTab] = useState<'all' | 'recommended' | 'avoid'>('all');
  const [enlargedFoodModal, setEnlargedFoodModal] = useState<null | 'recommended' | 'avoid'>(null);
  const [isMepilexModalOpen, setIsMepilexModalOpen] = useState<boolean>(false);
  const [isSplintingModalOpen, setIsSplintingModalOpen] = useState<boolean>(false);
  const [isLogrollModalOpen, setIsLogrollModalOpen] = useState<boolean>(false);
  const [isSleepingModalOpen, setIsSleepingModalOpen] = useState<boolean>(false);
  const [isKneesBentModalOpen, setIsKneesBentModalOpen] = useState<boolean>(false);
  const [enlargedLogrollStepModal, setEnlargedLogrollStepModal] = useState<number | null>(null);

  const toggleSymptom = (id: string) => {
    setSelfCheckSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleTopic = (topicKey: string) => {
    setOpenTopics(prev => ({
      ...prev,
      [topicKey]: !prev[topicKey]
    }));
  };

  // Guided Breathing Animation Loop
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          if (breathingPhase === 'inhale') {
            if (prev >= 4) {
              setBreathingPhase('hold');
              return 0;
            }
            return prev + 1;
          } else if (breathingPhase === 'hold') {
            if (prev >= 2) {
              setBreathingPhase('exhale');
              return 0;
            }
            return prev + 1;
          } else if (breathingPhase === 'exhale') {
            if (prev >= 4) {
              setBreathingCount(c => c + 1);
              setBreathingPhase('inhale');
              return 0;
            }
            return prev + 1;
          }
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  const startBreathing = () => {
    setBreathingPhase('inhale');
    setBreathingTimer(0);
    setIsBreathingActive(true);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('idle');
    setBreathingTimer(0);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('idle');
    setBreathingTimer(0);
    setBreathingCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner for Self-Care Guide */}
      <div id="guide-overview-banner" className="bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 rounded-2xl p-5 sm:p-6 border border-teal-100/90 shadow-xs scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                Careplus+
              </span>
              <span className="text-xs text-slate-500">
                คู่มือการดูแลตนเอง
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 flex-wrap">
              <span>📖 คู่มือการดูแลตนเองหลังการผ่าตัดช่องท้อง</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              คู่มือฉบับนี้รวบรวมแนวทางปฏิบัติด้านโภชนาการ ข้อควรระวัง และการเคลื่อนไหวร่างกาย เพื่อช่วยให้ผู้ป่วยฟื้นตัวได้อย่างปลอดภัยและป้องกันภาวะแทรกซ้อนเมื่อกลับไปอยู่บ้าน
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              id="banner-btn-breathing"
              onClick={() => {
                setActiveTool('breathing');
                const target = document.getElementById('interactive-simulators-section');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              <span>ฝึกหายใจลึก (Interactive)</span>
            </button>
            <button
              id="banner-btn-splinting"
              onClick={() => {
                setActiveTool('splinting');
                const target = document.getElementById('interactive-simulators-section');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-teal-600" />
              <span>จำลองกอดหมอน Splinting</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Topics - Dropdown / Accordion Section */}
      <div className="space-y-3.5">
        {/* =========================================================================
            TOPIC 1: การดูแลความสะอาดของร่างกายและแผลผ่าตัด (Wound Care)
        ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleTopic('hygieneWound')}
            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  1. การดูแลรักษาความสะอาดแผลผ่าตัด (Wound Care)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  การทำความสะอาดและดูแลแผล ข้อควรปฏิบัติเมื่อสัมผัสแผล สัญญาณผิดปกติ และรูปเปรียบเทียบแผล
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg text-slate-400 shrink-0">
              {openTopics.hygieneWound ? (
                <ChevronUp className="w-5 h-5 text-teal-700" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {openTopics.hygieneWound && (
            <div className="p-4 sm:p-6 border-t border-slate-100 space-y-6 animate-in fade-in duration-200">

              {/* 1. การทำความสะอาดและดูแลแผล */}
              <div className="bg-sky-50/50 rounded-2xl p-4 sm:p-5 border border-sky-100 shadow-2xs">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>🧼 การทำความสะอาดและดูแลแผล</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      แนวทางการอาบน้ำ การรักษาความแห้ง และการสังเกตพลาสติกกันน้ำใส
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-700">
                  <div className="bg-white p-3.5 rounded-xl border border-sky-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-1.5">
                        <Droplets className="w-4 h-4 text-sky-600" />
                        <span>การอาบน้ำฟอกสบู่:</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        หากแพทย์อนุญาตให้แผลโดนน้ำได้ <strong>สามารถอาบน้ำฟอกสบู่ได้ตามปกติ</strong> แต่<strong>ห้ามแช่ตัวในอ่างน้ำ</strong>จนกว่าแผลจะหายสนิทและตัดไหมเรียบร้อย
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-sky-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-1.5">
                        <Wind className="w-4 h-4 text-sky-600" />
                        <span>การซับแผลให้แห้ง:</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        <strong>ซับแผลให้แห้งสนิทด้วยผ้าสะอาดทุกครั้งหลังอาบน้ำ</strong> โดยซับเบาๆ ไม่ถูหรือขัด เพื่อป้องกันความอับชื้นและการระคายเคือง
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-sky-200 shadow-2xs flex flex-col justify-between overflow-hidden">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-sky-900">
                          <ShieldCheck className="w-4 h-4 text-sky-600" />
                          <span>พลาสเตอร์กันน้ำ:</span>
                        </div>
                        <span className="text-[10px] font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                          กันน้ำได้
                        </span>
                      </div>

                      {/* Image Thumbnail with Zoom Button */}
                      <div 
                        className="relative aspect-16/10 rounded-lg overflow-hidden border border-sky-200 cursor-pointer group bg-slate-100"
                        onClick={() => setIsMepilexModalOpen(true)}
                        title="คลิกเพื่อดูรูปขยายพลาสเตอร์กันน้ำ"
                      >
                        <img 
                          src={mepilexBorderPostOpImg} 
                          alt="การปิดแผลด้วยพลาสเตอร์กันน้ำ"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <span className="text-[11px] font-medium bg-black/60 px-2 py-1 rounded flex items-center gap-1">
                            <ZoomIn className="w-3.5 h-3.5" /> ดูภาพขยาย
                          </span>
                        </div>
                        <div className="absolute bottom-1.5 left-1.5 bg-sky-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium">
                          พลาสเตอร์กันน้ำทางการแพทย์
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        หากแผลปิดด้วย <strong>พลาสเตอร์กันน้ำ</strong> สามารถอาบน้ำได้ตามปกติโดยไม่ต้องแกะออก ให้ปล่อยไว้ตามกำหนดของแพทย์ แต่ถ้ามีน้ำหรือเลือดซึม ขอบพลาสติกเผยอหลุด หรือคันแสบ ให้รีบมาพบแพทย์หรือพยาบาลเพื่อเปลี่ยนแผ่นใหม่
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMepilexModalOpen(true)}
                      className="mt-2.5 w-full py-1.5 px-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-lg font-medium text-[11px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-sky-600" />
                      <span>ดูภาพขยายและการสังเกตพลาสเตอร์</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. ข้อควรปฏิบัติเมื่อสัมผัสแผล */}
              <div className="bg-teal-50/50 rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-2xs">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>🧼 ข้อควรปฏิบัติเมื่อสัมผัสแผล</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      สุขอนามัยของมือและการปกป้องเนื้อเยื่อที่กำลังสร้างตัว
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-700">
                  <div className="bg-white p-3.5 rounded-xl border border-teal-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold text-teal-900 mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>การล้างมือก่อน-หลังสัมผัส:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>ล้างมือให้สะอาดด้วยสบู่และน้ำทุกครั้งก่อนและหลังสัมผัสบริเวณแผลผ่าตัด</strong> เพื่อตัดวงจรการนำเชื้อโรคเข้าสู่แผล
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-teal-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold text-teal-900 mb-1.5">
                      <Shield className="w-4 h-4 text-teal-600" />
                      <span>สะเก็ดแผล:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>ห้ามแกะสะเก็ดแผล ปล่อยให้สะเก็ดหลุดออกเองตามธรรมชาติ</strong> การแกะสะเก็ดจะทำให้แผลเปิดซ้ำและเพิ่มโอกาสเกิดแผลเป็นนูน
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-teal-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold text-teal-900 mb-1.5">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span>สารและยาที่ไม่ได้รับคำสั่งแพทย์:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>หลีกเลี่ยงการทาโลชั่น แป้ง ยาหม่อง หรือน้ำยาใดๆ ลงบนแผลโดยตรง</strong> เพราะอาจก่อให้เกิดการระคายเคืองและนำพาเชื้อแบคทีเรีย
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. สังเกตอาการผิดปกติ (ที่ต้องรีบไปพบแพทย์) */}
              <div className="bg-rose-50/70 rounded-2xl p-4 sm:p-5 border-2 border-rose-200 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-rose-950 flex items-center gap-1.5 flex-wrap">
                      <span>🧼 สังเกตอาการผิดปกติ (ที่ต้องรีบไปพบแพทย์)</span>
                    </h4>
                    <p className="text-xs text-rose-700">
                      สัญญาณอันตรายภาวะแทรกซ้อน หากพบข้อใดข้อหนึ่งให้รีบมาพบแพทย์ทันที
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs flex items-center gap-2.5">
                    <Flame className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-bold text-rose-950">บวม แดง ร้อน หรือปวด</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs flex items-center gap-2.5">
                    <Droplets className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-bold text-rose-950">สิ่งคัดหลั่งผิดปกติ</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs flex items-center gap-2.5">
                    <Thermometer className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-bold text-rose-950">มีไข้สูงและหนาวสั่น</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="font-bold text-rose-950">ไหมหลุดหรือแผลปริ</span>
                  </div>
                </div>
              </div>

              {/* 4. คู่มือประเมินแผลด้วยสายตา (รูปเปรียบเทียบแผล ปกติ vs แผลที่ผิดปกติ) */}
              <div 
                id="visual-wound-guide"
                className="bg-gradient-to-b from-slate-50/90 to-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm scroll-mt-24"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>คู่มือประเมินแผลด้วยสายตา (Visual Wound Guide)</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 hidden sm:inline-block">
                          ภาพถ่ายเพื่อการศึกษา
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        เปรียบเทียบลักษณะแผลปกติกับสัญญาณเตือนผิดปกติ พร้อมเครื่องมือประเมินแผลด้วยตนเอง
                      </p>
                    </div>
                  </div>

                  {/* Filter / View Switcher Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setWoundViewMode('all')}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                        woundViewMode === 'all'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ดูทั้งหมด (3 ภาพ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWoundViewMode('normal')}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        woundViewMode === 'normal'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      แผลปกติ
                    </button>
                    <button
                      type="button"
                      onClick={() => setWoundViewMode('infection')}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        woundViewMode === 'infection'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      ติดเชื้อ (หนอง)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWoundViewMode('dehiscence')}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        woundViewMode === 'dehiscence'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      แผลปริแยก
                    </button>
                    <button
                      type="button"
                      onClick={() => setWoundViewMode('checker')}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        woundViewMode === 'checker'
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-teal-800 bg-teal-50 hover:bg-teal-100 font-bold'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      เช็กอาการด้วยตนเอง
                    </button>
                  </div>
                </div>

                {/* VIEW MODE: CARDS GRID (When NOT in pure checker mode) */}
                {woundViewMode !== 'checker' && (
                  <div className={`grid gap-4.5 ${
                    woundViewMode === 'all' 
                      ? 'grid-cols-1 md:grid-cols-3' 
                      : 'grid-cols-1 max-w-2xl mx-auto'
                  }`}>

                    {/* CARD 1: แผลปกติ (Normal Healing) */}
                    {(woundViewMode === 'all' || woundViewMode === 'normal') && (
                      <div className="bg-white rounded-2xl border-2 border-emerald-300/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
                        {/* Header Badge */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-white flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-xs tracking-wide">
                            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                            <span>1. แผลปกติ (Normal Healing)</span>
                          </div>
                          <span className="text-[10px] font-semibold bg-emerald-700/80 px-2 py-0.5 rounded-full text-emerald-100 border border-emerald-400/40">
                            ปลอดภัย
                          </span>
                        </div>

                        {/* Image Frame with Interactive Zoom Hover */}
                        <div 
                          className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
                          onClick={() => setEnlargedWoundModal('normal')}
                          title="คลิกเพื่อขยายดูภาพและจุดสังเกต"
                        >
                          <img 
                            src={woundNormalImg} 
                            alt="แผลผ่าตัดสมานตัวปกติ" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                            <span className="text-xs font-semibold flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5" /> คลิกเพื่อดูภาพขยาย
                            </span>
                            <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                              จุดตรวจ 4 จุด
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                            <ZoomIn className="w-3 h-3 text-emerald-600" /> ดูภาพขยาย
                          </div>
                        </div>

                        {/* Card Content with Visual Characteristic Chips */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                              เกณฑ์การตรวจลักษณะแผล
                            </div>

                            {/* Structured Chips */}
                            <div className="space-y-2 text-xs">
                              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                                <span className="font-bold text-emerald-900 shrink-0">ขอบแผล:</span>
                                <span className="text-slate-700">แนบสนิท เรียบ ไม่มีรอยอ้าแยก</span>
                              </div>
                              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                                <span className="font-bold text-emerald-900 shrink-0">สีผิวรอบแผล:</span>
                                <span className="text-slate-700">สีปกติ หรือชมพูระเรื่อจางๆ ไม่แผ่กว้าง</span>
                              </div>
                              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                                <span className="font-bold text-emerald-900 shrink-0">สารคัดหลั่ง:</span>
                                <span className="text-slate-700">แห้งสะอาด ไม่มีหนองหรือเลือดซึม</span>
                              </div>
                              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
                                <span className="font-bold text-emerald-900 shrink-0">ความปวด:</span>
                                <span className="text-slate-700">ตึงเล็กน้อย และทุเลาลงตามลำดับวัน</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 p-2.5 rounded-xl flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span><strong>คำแนะนำ:</strong> ดูแลให้แห้ง ซับเบาๆ ทุกครั้งหลังเช็ดตัว/อาบน้ำ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CARD 2: แผลผิดปกติ 1: ติดเชื้อ (Infected) */}
                    {(woundViewMode === 'all' || woundViewMode === 'infection') && (
                      <div className="bg-white rounded-2xl border-2 border-rose-300 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
                        {/* Header Badge */}
                        <div className="bg-gradient-to-r from-rose-600 to-amber-600 px-3.5 py-2 text-white flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-xs tracking-wide">
                            <ShieldAlert className="w-4 h-4 text-rose-200" />
                            <span>2. แผลติดเชื้อ (Infection)</span>
                          </div>
                          <span className="text-[10px] font-semibold bg-rose-700/90 px-2 py-0.5 rounded-full text-rose-100 border border-rose-400/40">
                            เสี่ยงสูง
                          </span>
                        </div>

                        {/* Image Frame with Interactive Zoom Hover */}
                        <div 
                          className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
                          onClick={() => setEnlargedWoundModal('infection')}
                          title="คลิกเพื่อขยายดูภาพและจุดสังเกต"
                        >
                          <img 
                            src={woundAbnormalImg} 
                            alt="แผลผ่าตัดผิดปกติ มีการติดเชื้อ อักเสบ บวมแดง" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                            <span className="text-xs font-semibold flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5" /> คลิกเพื่อดูภาพขยาย
                            </span>
                            <span className="text-[10px] bg-rose-500/80 px-2 py-0.5 rounded">
                              สัญญาณติดเชื้อ
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                            <ZoomIn className="w-3 h-3 text-rose-600" /> ดูภาพขยาย
                          </div>
                        </div>

                        {/* Card Content with Visual Characteristic Chips */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-2">
                              สัญญาณเตือนที่ต้องระวัง
                            </div>

                            {/* Structured Chips */}
                            <div className="space-y-2 text-xs">
                              <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-100 flex items-start gap-2">
                                <span className="font-bold text-rose-950 shrink-0">ขอบแผล:</span>
                                <span className="text-slate-700"><strong>บวม แดง ร้อน</strong> ลุกลามกว้าง &gt; 2 ซม.</span>
                              </div>
                              <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-100 flex items-start gap-2">
                                <span className="font-bold text-rose-950 shrink-0">สารคัดหลั่ง:</span>
                                <span className="text-slate-700"><strong>มีหนองข้น</strong> น้ำเหลืองซึม หรือมีกลิ่นเหม็น</span>
                              </div>
                              <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-100 flex items-start gap-2">
                                <span className="font-bold text-rose-950 shrink-0">ความปวด:</span>
                                <span className="text-slate-700"><strong>ปวดแสบปวดร้อน</strong> หรือปวดตุบๆ รุนแรงขึ้น</span>
                              </div>
                              <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-100 flex items-start gap-2">
                                <span className="font-bold text-rose-950 shrink-0">อาการร่วม:</span>
                                <span className="text-slate-700">อาจมี<strong>ไข้สูงหนาวสั่น</strong> (อุณหภูมิ &gt; 38°C)</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <div className="text-[11px] font-semibold text-rose-900 bg-rose-100/70 p-2.5 rounded-xl flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span><strong>การปฏิบัติ:</strong> รีบพบแพทย์ทันที ห้ามบีบหนองหรือโรยยาเอง</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CARD 3: แผลผิดปกติ 2: แผลปริแยก (Dehiscence) */}
                    {(woundViewMode === 'all' || woundViewMode === 'dehiscence') && (
                      <div className="bg-white rounded-2xl border-2 border-purple-300 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
                        {/* Header Badge */}
                        <div className="bg-gradient-to-r from-purple-700 to-rose-700 px-3.5 py-2 text-white flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-xs tracking-wide">
                            <AlertCircle className="w-4 h-4 text-purple-200" />
                            <span>3. แผลปริแยก (Dehiscence)</span>
                          </div>
                          <span className="text-[10px] font-semibold bg-purple-900/90 px-2 py-0.5 rounded-full text-purple-100 border border-purple-400/40">
                            ภาวะฉุกเฉิน
                          </span>
                        </div>

                        {/* Image Frame with Interactive Zoom Hover */}
                        <div 
                          className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer"
                          onClick={() => setEnlargedWoundModal('dehiscence')}
                          title="คลิกเพื่อขยายดูภาพและจุดสังเกต"
                        >
                          <img 
                            src={woundDehiscenceImg} 
                            alt="แผลผ่าตัดผิดปกติ แผลปริแยก ไหมหลุดก่อนกำหนด" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                            <span className="text-xs font-semibold flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5" /> คลิกเพื่อดูภาพขยาย
                            </span>
                            <span className="text-[10px] bg-purple-500/80 px-2 py-0.5 rounded">
                              แผลแยกตัว
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                            <ZoomIn className="w-3 h-3 text-purple-700" /> ดูภาพขยาย
                          </div>
                        </div>

                        {/* Card Content with Visual Characteristic Chips */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2">
                              สัญญาณเตือนที่ต้องระวัง
                            </div>

                            {/* Structured Chips */}
                            <div className="space-y-2 text-xs">
                              <div className="p-2 rounded-lg bg-purple-50/80 border border-purple-100 flex items-start gap-2">
                                <span className="font-bold text-purple-950 shrink-0">ขอบแผล:</span>
                                <span className="text-slate-700"><strong>ขอบแผลอ้าแยกออกจากกัน</strong> ไม่สมานตัว</span>
                              </div>
                              <div className="p-2 rounded-lg bg-purple-50/80 border border-purple-100 flex items-start gap-2">
                                <span className="font-bold text-purple-950 shrink-0">ไหมเย็บแผล:</span>
                                <span className="text-slate-700"><strong>ไหมเย็บหลุดหรือขาด</strong> ก่อนกำหนดนัดแพทย์</span>
                              </div>
                              <div className="p-2 rounded-lg bg-purple-50/80 border border-purple-100 flex items-start gap-2">
                                <span className="font-bold text-purple-950 shrink-0">สารคัดหลั่ง:</span>
                                <span className="text-slate-700">มี<strong>เลือดสดหรือน้ำเหลือง</strong>ไหลซึมต่อเนื่อง</span>
                              </div>
                              <div className="p-2 rounded-lg bg-purple-50/80 border border-purple-100 flex items-start gap-2">
                                <span className="font-bold text-purple-950 shrink-0">ความเสี่ยง:</span>
                                <span className="text-slate-700">เสี่ยงต่อ<strong>ไส้เลื่อนแผลผ่าตัด</strong>และการติดเชื้อลึก</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100">
                            <div className="text-[11px] font-semibold text-purple-950 bg-purple-100/70 p-2.5 rounded-xl flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-purple-700 shrink-0" />
                              <span><strong>การปฏิบัติ:</strong> ใช้ผ้าสะอาดปิดแผลไว้แล้วรีบไปโรงพยาบาลทันที</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW MODE: INTERACTIVE SELF-CHECKER */}
                {woundViewMode === 'checker' && (
                  <div className="bg-white rounded-2xl border-2 border-teal-300 p-5 shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">
                          แบบประเมินลักษณะแผลผ่าตัดด้วยตนเอง (30 วินาที)
                        </h5>
                        <p className="text-xs text-slate-500">
                          ติ๊กเลือกอาการที่คุณกำลังตรวจพบในปัจจุบันเพื่อดูคำแนะนำทางการพยาบาล
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
                      {[
                        { id: 'redness', label: 'แผลมีอาการบวม แดง ร้อน หรือปวดแผ่กว้างขึ้น', severity: 'warning' },
                        { id: 'pus', label: 'มีหนอง น้ำเหลือง หรือเลือดสดซึมออกจากแผล', severity: 'danger' },
                        { id: 'odor', label: 'มีกลิ่นเหม็นผิดปกติโชยออกจากบริเวณแผล', severity: 'danger' },
                        { id: 'dehiscence', label: 'ไหมเย็บแผลหลุด หรือขอบแผลปริแยกอ้าออกจากกัน', severity: 'emergency' },
                        { id: 'fever', label: 'มีไข้สูง หนาวสั่น อุณหภูมิร่างกายเกิน 38°C', severity: 'emergency' },
                        { id: 'severe_pain', label: 'ปวดแผลรุนแรงขึ้นเรื่อยๆ กินยาแก้ปวดแล้วไม่ทุเลา', severity: 'warning' },
                      ].map((item) => {
                        const isChecked = selfCheckSymptoms.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleSymptom(item.id)}
                            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all text-xs ${
                              isChecked
                                ? 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-2xs font-semibold'
                                : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0 text-teal-700">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-rose-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <span className="leading-snug">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Live Assessment Result Card */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      {selfCheckSymptoms.length === 0 ? (
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-emerald-900 text-sm block mb-1">
                              🟢 ไม่พบอาการผิดปกติ: แผลอยู่ในเกณฑ์สมานตัวปลอดภัย
                            </span>
                            <p className="text-xs text-emerald-800 leading-relaxed">
                              รักษาความสะอาดอย่างต่อเนื่อง ซับแผลให้แห้งสนิทหลังอาบน้ำ ห้ามแกะสะเก็ดแผล และมารับการตรวจตามที่แพทย์นัดหมาย
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50 rounded-xl p-4 border-2 border-rose-300 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-rose-950 text-sm">
                                🚨 พบสัญญาณเตือนผิดปกติ ({selfCheckSymptoms.length} รายการ):
                              </span>
                              <span className="text-[11px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md">
                                ต้องรีบพบแพทย์
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              อาการที่ท่านติ๊กเลือกบ่งชี้ถึงภาวะเสี่ยงต่อการติดเชื้อ หรือการแยกตัวของแผลผ่าตัด <strong>ไม่ควรนิ่งนอนใจหรือซื้อยาทาเอง</strong> กรุณาใช้ผ้าก๊อซหรือผ้าสะอาดปิดคลุมแผลไว้ และเดินทางมาพบแพทย์หรือติดต่อห้องฉุกเฉินโรงพยาบาลทันที
                            </p>
                            <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-rose-900">
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>เบอร์ติดต่อฉุกเฉิน 1719 หรือเบอร์โทรศัพท์ประจำตึกผู้ป่วยในใบนัด</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelfCheckSymptoms([])}
                          className="text-xs text-slate-500 hover:text-slate-800 underline"
                        >
                          ล้างการเลือกทั้งหมด
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* ENLARGED WOUND IMAGE MODAL */}
              {enlargedWoundModal && (
                <div 
                  className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
                  onClick={() => setEnlargedWoundModal(null)}
                >
                  <div 
                    className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className={`px-4 py-3 text-white flex items-center justify-between ${
                      enlargedWoundModal === 'normal' 
                        ? 'bg-emerald-700' 
                        : enlargedWoundModal === 'infection'
                          ? 'bg-rose-700'
                          : 'bg-purple-800'
                    }`}>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {enlargedWoundModal === 'normal' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                        {enlargedWoundModal === 'infection' && <ShieldAlert className="w-5 h-5 text-rose-300" />}
                        {enlargedWoundModal === 'dehiscence' && <AlertTriangle className="w-5 h-5 text-purple-300" />}
                        <span>
                          {enlargedWoundModal === 'normal' && 'รูปขยาย: แผลผ่าตัดที่สมานตัวปกติ'}
                          {enlargedWoundModal === 'infection' && 'รูปขยาย: แผลผ่าตัดที่ติดเชื้อ (Infection)'}
                          {enlargedWoundModal === 'dehiscence' && 'รูปขยาย: แผลผ่าตัดปริแยก (Dehiscence)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnlargedWoundModal(null)}
                        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Modal Image */}
                    <div className="relative aspect-4/3 w-full bg-slate-950">
                      <img
                        src={
                          enlargedWoundModal === 'normal' 
                            ? woundNormalImg 
                            : enlargedWoundModal === 'infection'
                              ? woundAbnormalImg
                              : woundDehiscenceImg
                        }
                        alt="รูปขยายแผลผ่าตัด"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Modal Clinical Guidance */}
                    <div className="p-4 sm:p-5 space-y-3 text-xs">
                      {enlargedWoundModal === 'normal' && (
                        <div className="space-y-2 text-slate-700">
                          <p className="font-bold text-emerald-900 text-sm">
                            🟢 ลักษณะสำคัญของแผลที่กำลังสมานตัวดี:
                          </p>
                          <ul className="space-y-1 text-slate-600 leading-relaxed list-disc list-inside">
                            <li>ขอบแผลชิดแนบสนิท ไม่มีสิ่งคัดหลั่งหรือน้ำเหลืองไหลซึม</li>
                            <li>ผิวหนังรอบแผลอาจมีสีชมพูจางๆ แต่ไม่บวมร้อน</li>
                            <li>สะเก็ดแผลจะแห้งและค่อยๆ หลุดไปเอง ห้ามแกะเกา</li>
                          </ul>
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-medium">
                            💡 การดูแล: ซับแผลให้แห้งสนิทหลังอาบน้ำ และระวังไม่ให้เสื้อผ้าเสียดสี
                          </div>
                        </div>
                      )}

                      {enlargedWoundModal === 'infection' && (
                        <div className="space-y-2 text-slate-700">
                          <p className="font-bold text-rose-950 text-sm">
                            🔴 สัญญาณอันตรายจากการติดเชื้อ (Infection):
                          </p>
                          <ul className="space-y-1 text-slate-600 leading-relaxed list-disc list-inside">
                            <li>ผิวหนังรอบแผลบวม แดงก่ำ และร้อนจัดเมื่อสัมผัสใกล้ๆ</li>
                            <li>มีหนองสีเหลือง/เขียว หรือน้ำเหลืองไหลซึมออกมา พร้อมกลิ่นเหม็น</li>
                            <li>มีไข้ หนาวสั่น และปวดแผลตุบๆ ทวีความรุนแรงขึ้นเรื่อยๆ</li>
                          </ul>
                          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-900 font-bold border border-rose-200">
                            🚨 ข้อควรปฏิบัติ: ห้ามบีบหนองหรือทายาสมุนไพรเอง รีบมาพบแพทย์ทันที
                          </div>
                        </div>
                      )}

                      {enlargedWoundModal === 'dehiscence' && (
                        <div className="space-y-2 text-slate-700">
                          <p className="font-bold text-purple-950 text-sm">
                            🚨 สัญญาณฉุกเฉินแผลปริแยก (Wound Dehiscence):
                          </p>
                          <ul className="space-y-1 text-slate-600 leading-relaxed list-disc list-inside">
                            <li>ขอบแผลแยกออกจากกัน อ้าเปิดจนมองเห็นชั้นใต้ผิวหนัง</li>
                            <li>ไหมเย็บแผลขาดหรือหลุดก่อนกำหนดนัดตัดไหม</li>
                            <li>อาจมีเลือดสด หรือน้ำเหลืองพุ่งซึมออกมาปริมาณมาก</li>
                          </ul>
                          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-950 font-bold border border-purple-200">
                            🚨 ข้อควรปฏิบัติ: ใช้ผ้าก๊อซหรือผ้าสะอาดปิดแผลไว้ ห้ามกดแรง และรีบไป รพ. ทันที
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setEnlargedWoundModal(null)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                        >
                          ปิดหน้าต่าง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ENLARGED MEPILEX BORDER POST-OP MODAL */}
              {isMepilexModalOpen && (
                <div 
                  className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
                  onClick={() => setIsMepilexModalOpen(false)}
                >
                  <div 
                    className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="px-4 py-3 bg-sky-700 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <ShieldCheck className="w-5 h-5 text-sky-200" />
                        <span>การปิดแผลด้วย พลาสเตอร์กันน้ำ</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMepilexModalOpen(false)}
                        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Modal Image */}
                    <div className="relative aspect-4/3 w-full bg-slate-950">
                      <img
                        src={mepilexBorderPostOpImg}
                        alt="รูปขยายการปิดแผลด้วยพลาสเตอร์กันน้ำ"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg">
                        พลาสเตอร์กันน้ำทางการแพทย์
                      </div>
                    </div>

                    {/* Clinical Instructions */}
                    <div className="p-4 sm:p-5 space-y-3 text-xs">
                      <div className="space-y-2 text-slate-700">
                        <p className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
                          <span>🔍 คุณสมบัติและวิธีดูแลพลาสเตอร์กันน้ำ:</span>
                        </p>
                        <ul className="space-y-1.5 text-slate-600 leading-relaxed list-disc list-inside">
                          <li>สามารถอาบน้ำได้ตามปกติโดยไม่ต้องลอกแผ่นพลาสเตอร์ออก</li>
                          <li><strong>แผ่นโฟมดูดซับสารคัดหลั่ง:</strong> ดูดซับเลือดและน้ำเหลืองได้ดี ไม่ติดเนื้อแผล ลดการเจ็บปวดขณะลอกออก</li>
                          <li><strong>คงสภาพตามกำหนดแพทย์:</strong> โดยทั่วไปสามารถปิดไว้ได้ 5-7 วัน หรือตามที่แพทย์/พยาบาลนัดเปิดแผล</li>
                        </ul>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>ข้อสังเกตที่ควรมาพบแพทย์เพื่อเปลี่ยนแผ่น:</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            1) มีน้ำหรือเลือดซึมออกมาจนชุ่มเกิน 75% ของแผ่นโฟม<br />
                            2) ขอบฟิล์มกาวเปิดอ้าจนน้ำอาจซึมเข้าด้านในได้<br />
                            3) มีอาการคัน แดง หรือแสบรอบขอบผิวหนังอย่างรุนแรง
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsMepilexModalOpen(false)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                        >
                          ปิดหน้าต่าง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* =========================================================================
            TOPIC 2: การจัดการความเจ็บปวด (Pain Management)
        ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleTopic('painManagement')}
            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  2. การจัดการความเจ็บปวด (Pain Management)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  วิธีกินยาแก้ปวดที่ถูกต้อง และเทคนิคการประคองแผลเวลาไอหรือจาม
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg text-slate-400 shrink-0">
              {openTopics.painManagement ? (
                <ChevronUp className="w-5 h-5 text-teal-700" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {openTopics.painManagement && (
            <div className="p-4 sm:p-6 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
              {/* Key Pain Management Points */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-700">
                <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200">
                  <div className="flex items-center gap-2 mb-2 font-bold text-rose-900 text-sm">
                    <Pill className="w-4 h-4 text-rose-600" />
                    <span>วิธีกินยาแก้ปวดที่ถูกต้อง</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>ไม่ต้องรอให้ปวดทนไม่ไหว (ระดับ 8-10)</strong> ค่อยกินยา เพราะจะควบคุมอาการได้ยาก ให้รับประทานยาตามที่แพทย์สั่งสม่ำเสมอ หรือเมื่อเริ่มมีอาการปวดระดับปานกลาง (ระดับ 4 ขึ้นไป)
                  </p>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <span>เทคนิคกอดหมอนพยุงแผล (Splinting)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSplintingModalOpen(true)}
                      className="text-[10px] text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-0.5 bg-indigo-100/70 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition-colors"
                    >
                      <ZoomIn className="w-3 h-3" />
                      <span>ดูรูปภาพประกอบ</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-start mt-2">
                    <div 
                      onClick={() => setIsSplintingModalOpen(true)}
                      className="relative w-full sm:w-28 h-20 rounded-lg overflow-hidden border border-indigo-200 shrink-0 cursor-pointer group shadow-2xs bg-slate-900"
                    >
                      <img 
                        src={splintingPillowImg} 
                        alt="ภาพการใช้หมอนกอดพยุงแผลผ่าตัดหน้าท้อง" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-600 leading-relaxed text-xs">
                        ทุกครั้งที่ไอ จาม หัวเราะ หรือจะลุกเปลี่ยนท่าทาง ให้นำหมอนใบเล็กมากอดแนบแน่นบริเวณหน้าท้องตรงรอยแผลผ่าตัด จะช่วยซับแรงกระแทกได้มากกว่า 40% และป้องกันไหมเย็บฉีกขาด
                      </p>
                      <button
                        onClick={() => {
                          setActiveTool('splinting');
                          const simEl = document.getElementById('interactive-simulators-section');
                          if (simEl) simEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow-xs"
                      >
                        <span>เปิดตัวจำลอง Splinting</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2 font-bold text-amber-900 text-sm">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>รับประทานยาก่อนทำกิจกรรม</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    หากต้องฝึกเดิน ลุกจากเตียง หรือทำกายภาพบำบัด สามารถรับประทานยาแก้ปวดล่วงหน้า 30-45 นาที ตามคำสั่งแพทย์ เพื่อให้ร่างกายขยับตัวได้โดยไม่เจ็บทรมาน
                  </p>
                </div>
              </div>

              {/* Pain Scale Guide Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5 text-sm">
                  <HeartPulse className="w-4 h-4 text-teal-600" />
                  <span>เกณฑ์การประเมินระดับความปวด (Pain Scale 0 - 10):</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                  <div className="p-3 bg-white rounded-lg border border-emerald-200">
                    <span className="font-bold text-emerald-800 block text-xs">0 - 3 : ปวดเล็กน้อย (Mild)</span>
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      รู้สึกตึงๆ ทำกิจวัตรทั่วไปได้ ไม่รบกวนการนอน สามารถพักผ่อนหรือฝึกหายใจช้าๆ ช่วยลดปวดได้
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-800 block text-xs">4 - 6 : ปวดปานกลาง (Moderate)</span>
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      เริ่มรบกวนสมาธิ การเดิน หรือการนอนหลับ ควรรับประทานยาแก้ปวดตามคำสั่งแพทย์
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-rose-200">
                    <span className="font-bold text-rose-800 block text-xs">7 - 10 : ปวดรุนแรง (Severe)</span>
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      ปวดทรมาน หน้าท้องแข็งเกร็ง หากกินยาแล้ว 1 ชม. ไม่ดีขึ้น หรือปวดเพิ่มขึ้นเฉียบพลัน ควรรีบพบแพทย์
                    </span>
                  </div>
                </div>
              </div>

              {/* Do & Don't for Pain Management */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200">
                  <h5 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>สิ่งที่ควรปฏิบัติ (Recommended):</span>
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>ทานยาพาราเซตามอลห่างกันอย่างน้อย 4-6 ชั่วโมง (ไม่เกิน 8 เม็ด/วัน)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>บันทึกระดับความปวดในแอป Careplus+ เป็นประจำเพื่อดูแนวโน้มการฟื้นตัว</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-200">
                  <h5 className="text-xs font-bold text-rose-900 mb-2 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>ข้อห้ามเด็ดขาด (Prohibited):</span>
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>ห้ามปรับเพิ่มขนาดยาแก้ปวดเอง</strong> โดยเฉพาะยาแก้ปวดกลุ่มที่มีฤทธิ์กดประสาท</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>ห้ามซื้อยาชุด ยาลูกกลอน หรือยาสมุนไพรมาทานเอง เพราะอาจมีสารสเตียรอยด์</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>ห้ามดื่มเครื่องดื่มแอลกอฮอล์ขณะรับประทานยาแก้ปวดทุกชนิด</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            TOPIC 3: ด้านอาหารและโภชนาการ (Nutrition & Diet)
        ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleTopic('nutrition')}
            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  3. ด้านอาหารและโภชนาการ (Nutrition & Diet)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  ลำดับการรับประทานอาหาร อาหารเร่งสมานเนื้อเยื่อ และอาหารที่ควรเลี่ยง
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg text-slate-400 shrink-0">
              {openTopics.nutrition ? (
                <ChevronUp className="w-5 h-5 text-teal-700" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {openTopics.nutrition && (
            <div className="p-4 sm:p-6 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">

              {/* View Mode Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span>ภาพตัวอย่างอาหารสำหรับผู้ป่วยหลังผ่าตัดช่องท้อง</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    เปรียบเทียบภาพอาหารแนะนำเร่งสมานแผล และอาหารอันตรายที่ควรหลีกเลี่ยง
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setFoodFilterTab('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      foodFilterTab === 'all'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ดูทั้งหมด
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoodFilterTab('recommended')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                      foodFilterTab === 'recommended'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    อาหารแนะนำ
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoodFilterTab('avoid')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                      foodFilterTab === 'avoid'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    อาหารที่ควรเลี่ยง
                  </button>
                </div>
              </div>

              {/* Visual Food Showcase Cards */}
              <div className={`grid gap-5 ${
                foodFilterTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'
              }`}>

                {/* CARD 1: อาหารที่แนะนำ (Recommended Foods) */}
                {(foodFilterTab === 'all' || foodFilterTab === 'recommended') && (
                  <div className="bg-white rounded-2xl border-2 border-emerald-300 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
                    {/* Header Badge */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>อาหารแนะนำที่ควรรับประทาน (เร่งสมานแผล)</span>
                      </div>
                      <span className="text-[11px] font-semibold bg-emerald-700/80 px-2.5 py-0.5 rounded-full text-emerald-100 border border-emerald-400/40">
                        เร่งสมานแผล 🟢
                      </span>
                    </div>

                    {/* Image Frame with Zoom Overlay */}
                    <div 
                      className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden cursor-pointer"
                      onClick={() => setEnlargedFoodModal('recommended')}
                      title="คลิกเพื่อดูภาพขยายและตัวอย่างเมนูแนะนำ"
                    >
                      <img 
                        src={foodRecommendedImg} 
                        alt="ภาพตัวอย่างอาหารแนะนำหลังผ่าตัด เช่น ไข่ขาวต้ม เนื้อปลา ผักต้ม ผลไม้เนื้อนิ่ม" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 text-white">
                        <span className="text-xs font-semibold flex items-center gap-1.5">
                          <ZoomIn className="w-4 h-4" /> คลิกเพื่อดูภาพขยายและคำแนะนำเจาะลึก
                        </span>
                        <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                          4 อาหารหลัก
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                        <ZoomIn className="w-3 h-3 text-emerald-600" /> ดูรูปขยาย
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-lg">
                        โปรตีนสูง • ย่อยง่าย • กากใยนุ่ม • ช่วยขับถ่าย
                      </div>
                    </div>

                    {/* Content & Food Item Badges */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          รายการอาหารสำคัญและประโยชน์ทางการฟื้นตัว
                        </div>

                        <div className="space-y-2 text-xs">
                          {/* Item 1 */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">🥚</span>
                            <div>
                              <div className="font-bold text-emerald-950 flex items-center gap-1">
                                <span>ไข่ขาวต้มสุก</span>
                                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                  2-4 ฟอง/วัน
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                แหล่งโปรตีนอัลบูมินบริสุทธิ์ ช่วยเร่งสมานเนื้อเยื่อ เสริมสร้างคอลลาเจนปิดปากแผลผ่าตัดให้ติดแน่น
                              </p>
                            </div>
                          </div>

                          {/* Item 2 */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">🐟</span>
                            <div>
                              <div className="font-bold text-emerald-950 flex items-center gap-1">
                                <span>เนื้อปลาลวก / เนื้ออกไก่นุ่ม</span>
                                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                  โปรตีนย่อยง่าย
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                ร่างกายดูดซึมไปใช้ได้ทันที ไม่ทำให้ลำไส้ทำงานหนัก ไม่อืดท้อง สบายระบบทางเดินอาหาร
                              </p>
                            </div>
                          </div>

                          {/* Item 3 */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">🥕</span>
                            <div>
                              <div className="font-bold text-emerald-950 flex items-center gap-1">
                                <span>ผักต้มสุก & ผลไม้เนื้อนิ่ม</span>
                                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                  ฟักทอง, แครอท, มะละกอ, กล้วย
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                อุดมด้วยวิตามินเอ วิตามินซี ช่วยเสริมภูมิต้านทาน และมีใยอาหารนุ่มช่วยให้อุจจาระนิ่ม ไม่ต้องออกแรงเบ่ง
                              </p>
                            </div>
                          </div>

                          {/* Item 4 */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">💧</span>
                            <div>
                              <div className="font-bold text-emerald-950 flex items-center gap-1">
                                <span>น้ำสะอาด</span>
                                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                  8 - 10 แก้ว/วัน
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                เพิ่มการไหลเวียนโลหิตนำสารอาหารไปเลี้ยงแผล ป้องกันภาวะขาดน้ำ และช่วยให้ขับถ่ายสะดวก
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/70 p-2.5 rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>ข้อแนะนำ:</strong> รับประทานมื้อละน้อยๆ แต่บ่อยครั้ง (4-5 มื้อ/วัน) เคี้ยวให้ละเอียดก่อนกลืน</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CARD 2: อาหารที่ควรหลีกเลี่ยง (Foods to Avoid) */}
                {(foodFilterTab === 'all' || foodFilterTab === 'avoid') && (
                  <div className="bg-white rounded-2xl border-2 border-rose-300 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
                    {/* Header Badge */}
                    <div className="bg-gradient-to-r from-rose-600 to-amber-600 px-4 py-2.5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        <XCircle className="w-4 h-4 text-rose-200" />
                        <span>อาหารและเครื่องดื่มที่ต้องหลีกเลี่ยงเด็ดขาด</span>
                      </div>
                      <span className="text-[11px] font-semibold bg-rose-700/90 px-2.5 py-0.5 rounded-full text-rose-100 border border-rose-400/40">
                        เสี่ยงแทรกซ้อน 🔴
                      </span>
                    </div>

                    {/* Image Frame with Zoom Overlay */}
                    <div 
                      className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden cursor-pointer"
                      onClick={() => setEnlargedFoodModal('avoid')}
                      title="คลิกเพื่อดูภาพขยายและอาหารอันตรายที่ต้องระวัง"
                    >
                      <img 
                        src={foodAvoidImg} 
                        alt="ภาพตัวอย่างอาหารที่ต้องหลีกเลี่ยง เช่น อาหารรสจัด ของหมักดอง น้ำอัดลม แอลกอฮอล์ ของทอดมันเยิ้ม" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 text-white">
                        <span className="text-xs font-semibold flex items-center gap-1.5">
                          <ZoomIn className="w-4 h-4" /> คลิกเพื่อดูภาพขยายและเหตุผลทางการแพทย์
                        </span>
                        <span className="text-[10px] bg-rose-500/80 px-2 py-0.5 rounded">
                          4 กลุ่มเสี่ยงสูง
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                        <ZoomIn className="w-3 h-3 text-rose-600" /> ดูรูปขยาย
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-lg">
                        รสจัด • ของหมักดอง • น้ำอัดลม • แอลกอฮอล์ • ของทอด
                      </div>
                    </div>

                    {/* Content & Avoid Item Badges */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                          กลุ่มอาหารอันตรายและผลกระทบต่อร่างกาย
                        </div>

                        <div className="space-y-2 text-xs">
                          {/* Item 1 */}
                          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">🌶️</span>
                            <div>
                              <div className="font-bold text-rose-950 flex items-center gap-1">
                                <span>อาหารรสจัด & ของหมักดอง</span>
                                <span className="text-[10px] font-normal text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded">
                                  ส้มตำ, ยำเผ็ด, ปลาร้า, ของดอง
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                รสเผ็ด เปรี้ยว เค็มจัด ระคายเคืองกระเพาะอาหารและลำไส้ เสี่ยงต่ออาการท้องเสีย ถ่ายบ่อย และการติดเชื้อ
                              </p>
                            </div>
                          </div>

                          {/* Item 2 */}
                          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">🥤</span>
                            <div>
                              <div className="font-bold text-rose-950 flex items-center gap-1">
                                <span>น้ำอัดลม, แอลกอฮอล์ & ชากาแฟเข้ม</span>
                                <span className="text-[10px] font-normal text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded">
                                  เพิ่มแก๊ส • ชะลอแผลหาย
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                ทำให้เกิดแก๊สสะสม ท้องอืดดันแผลผ่าตัด แอลกอฮอล์ยับยั้งการสร้างคอลลาเจนสมานแผล และตีกับยาแก้ปวด
                              </p>
                            </div>
                          </div>

                          {/* Item 3 */}
                          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">🥦</span>
                            <div>
                              <div className="font-bold text-rose-950 flex items-center gap-1">
                                <span>ผักดิบที่สร้างแก๊สสูง & ถั่วดิบ</span>
                                <span className="text-[10px] font-normal text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded">
                                  กะหล่ำดิบ, บรอกโคลีดิบ, ถั่วฝักยาว
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                มีน้ำตาลและกากใยดิบที่ย่อยยาก แบคทีเรียในลำไส้หมักจนเกิดลมดันหน้าท้อง เสี่ยงแผลตึงหรือไหมเย็บฉีก
                              </p>
                            </div>
                          </div>

                          {/* Item 4 */}
                          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 flex items-start gap-2.5">
                            <span className="text-base shrink-0">🍗</span>
                            <div>
                              <div className="font-bold text-rose-950 flex items-center gap-1">
                                <span>ของทอดน้ำมันเยิ้ม & ไขมันสูง</span>
                                <span className="text-[10px] font-normal text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded">
                                  ย่อยยากมาก
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed mt-0.5">
                                ทำให้อาหารค้างในกระเพาะนาน เกิดอาการคลื่นไส้ แน่นหน้าอก จุกเสียด และเสี่ยงต่อลำไส้อืดตัว
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-semibold text-rose-900 bg-rose-100/70 p-2.5 rounded-xl flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span><strong>คำเตือน:</strong> ควรงดเว้นอาหารกลุ่มนี้อย่างน้อย 2-4 สัปดาห์แรก หรือจนกว่าแผลจะหายสนิท</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Nutrition Comparison Bar */}
              <div className="p-3.5 bg-gradient-to-r from-teal-50 via-white to-amber-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 font-medium">
                  <span className="p-1 rounded-md bg-teal-100 text-teal-800 font-bold text-[10px]">หลักจำง่ายๆ</span>
                  <span><strong>"เน้นสุก สะอาด รสจืด โปรตีนนิ่ม กากใยเปื่อย เคี้ยวช้าๆ ดื่มน้ำพอเหมาะ"</strong></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  หลีกเลี่ยง 4 อย่าง: เผ็ดจัด • หมักดอง • น้ำอัดลม • ของทอด
                </div>
              </div>

              {/* ENLARGED FOOD MODAL */}
              {enlargedFoodModal && (
                <div 
                  className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
                  onClick={() => setEnlargedFoodModal(null)}
                >
                  <div 
                    className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Image */}
                    <div className="relative aspect-16/10 w-full bg-slate-900 overflow-hidden">
                      <img 
                        src={enlargedFoodModal === 'recommended' ? foodRecommendedImg : foodAvoidImg}
                        alt="ภาพขยายตัวอย่างอาหาร" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEnlargedFoodModal(null)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors shadow-md"
                        aria-label="ปิดภาพขยาย"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-md bg-slate-900/80">
                        {enlargedFoodModal === 'recommended' 
                          ? '🟢 ภาพตัวอย่างอาหารแนะนำเพื่อการสมานแผล' 
                          : '🔴 ภาพตัวอย่างอาหารที่ต้องหลีกเลี่ยง'}
                      </div>
                    </div>

                    {/* Modal Details */}
                    <div className="p-5 sm:p-6 space-y-4 text-xs">
                      {enlargedFoodModal === 'recommended' ? (
                        <div className="space-y-3">
                          <h4 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>แนวทางการจัดสำรับอาหารเร่งการฟื้นตัว</span>
                          </h4>
                          <p className="text-slate-600 leading-relaxed">
                            ภาพด้านบนแสดงตัวอย่างอาหารที่เหมาะสมที่สุดสำหรับผู้ป่วยผ่าตัดช่องท้อง ประกอบด้วย <strong>ไข่ขาวต้มสุก</strong> ที่ให้โปรตีนบริสุทธิ์เพื่อเสริมเนื้อเยื่อ, <strong>เนื้อปลาลวกและอกไก่นึ่ง</strong> ซึ่งย่อยง่ายไม่ทำให้ท้องอืด, <strong>ฟักทองและแครอทต้มสุก</strong> ที่มีวิตามินบำรุงเซลล์ พร้อม <strong>ผลไม้เนื้อนิ่ม</strong> (กล้วยน้ำว้า/มะละกอสุก) และ <strong>น้ำดื่มสะอาด</strong> เพื่อป้องกันอาการท้องผูก
                          </p>
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed font-medium">
                            💡 <strong>เคล็ดลับสำหรับญาติผู้ดูแล:</strong> ปรุงรสอ่อนๆ หลีกเลี่ยงผงชูรสและพริก แบ่งเสิร์ฟมื้อละปริมาณพอเหมาะวันละ 4-5 มื้อ เพื่อไม่ให้กระเพาะอาหารและแผลผ่าตัดหน้าท้องตึงแน่นจนเกินไป
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <h4 className="text-base font-bold text-rose-950 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-rose-600" />
                            <span>เหตุผลทางการแพทย์ที่ต้องหลีกเลี่ยงอาหารกลุ่มนี้</span>
                          </h4>
                          <p className="text-slate-600 leading-relaxed">
                            ภาพด้านบนสะท้อนถึงอาหารที่มีความเสี่ยงสูงต่อการผ่าตัดช่องท้อง:
                          </p>
                          <ul className="space-y-1.5 text-slate-700 list-disc list-inside leading-relaxed">
                            <li><strong>อาหารรสจัด & ของหมักดอง:</strong> ความเป็นกรดและพริกจะกระตุ้นการบีบตัวของลำไส้อย่างรุนแรง เกิดอาการปวดเกร็ง และเสี่ยงต่อการติดเชื้อ</li>
                            <li><strong>น้ำอัดลม & เบียร์/เหล้า:</strong> ก๊าซคาร์บอนไดออกไซด์จะขยายตัวดันผนังหน้าท้อง ทำให้ไหมเย็บแผลตึงจนอาจปริแยก แอลกอฮอล์ยังทำลายเซลล์ที่กำลังสร้างใหม่</li>
                            <li><strong>ของทอดน้ำมันเยิ้ม:</strong> น้ำมันทำให้กระเพาะอาหารย่อยช้า เกิดอาการจุกเสียด คลื่นไส้ และแน่นแผล</li>
                          </ul>
                          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 leading-relaxed font-medium">
                            ⚠️ <strong>ข้อควรระวังสำคัญ:</strong> หากเผลอรับประทานแล้วมีอาการท้องอืด ปวดแผลรุนแรง หรืออาเจียน ให้หยุดรับประทานทันที ดื่มน้ำอุ่น และติดต่อโรงพยาบาล
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setEnlargedFoodModal(null)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                        >
                          ปิดหน้าต่าง
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* =========================================================================
            TOPIC 4: การขับถ่ายและการพักผ่อนนอนหลับ (Elimination & Rest)
        ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleTopic('eliminationRest')}
            className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  4. การขับถ่ายและการพักผ่อนนอนหลับ (Elimination & Rest)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  การดูแลการขับถ่าย ป้องกันท้องผูก และท่านอนที่ช่วยลดแรงดึงรั้งแผล
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg text-slate-400 shrink-0">
              {openTopics.eliminationRest ? (
                <ChevronUp className="w-5 h-5 text-teal-700" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {openTopics.eliminationRest && (
            <div className="p-4 sm:p-6 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
              {/* Elimination Principles */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-center gap-2 mb-2 font-bold text-amber-950 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>กฎเหล็กสำคัญ: ห้ามเบ่งถ่ายอุจจาระเด็ดขาด!</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  การเบ่งถ่ายอุจจาระจะเพิ่มความดันในช่องท้อง (Intra-abdominal Pressure) สูงขึ้นทันที 2-3 เท่า ซึ่งเป็นสาเหตุสำคัญที่ทำให้<strong>ไหมเย็บชั้นพังผืดหน้าท้องฉีกขาด แผลปริแยก หรือเกิดไส้เลื่อนแผลผ่าตัด (Incisional Hernia)</strong> ได้ หากท้องผูกเกิน 2 วัน ให้แจ้งแพทย์หรือพยาบาลเพื่อรับยาระบายชนิดอ่อน ห้ามฝืนเบ่งเด็ดขาด
                </p>
              </div>

              {/* Sleeping & Rest Guidance */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span>2. ท่านอนที่เหมาะสมหลังผ่าตัดช่องท้อง</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsSleepingModalOpen(true)}
                    className="text-[11px] text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg hover:bg-teal-100 transition-colors border border-teal-200"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>ดูรูปภาพประกอบท่านอน</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                  <div 
                    onClick={() => setIsSleepingModalOpen(true)}
                    className="md:col-span-4 relative aspect-4/3 rounded-xl overflow-hidden border border-teal-200 cursor-pointer group shadow-2xs bg-slate-900"
                  >
                    <img 
                      src={sleepingPositionsImg} 
                      alt="ภาพประกอบท่านอนที่เหมาะสมหลังผ่าตัดช่องท้อง" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">ท่านอน Semi-Fowler & ตะแคง</span>
                        <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <ZoomIn className="w-2.5 h-2.5" /> ขยาย
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-2.5 text-xs text-slate-700">
                    <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200">
                      <div className="font-bold text-teal-950 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>ท่านอนหงาย (Semi-Fowler's position):</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        นอนหงายโดยหนุนศีรษะสูงเล็กน้อย (Semi-Fowler's position) และอาจหาหมอนมารองใต้เข่า เพื่อช่วยลดการตึงรั้งของกล้ามเนื้อหน้าท้อง
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                      <div className="font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span>ท่านอนตะแคง:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        นอนตะแคงซ้ายหรือขวา สลับได้ เพื่อป้องกันแผลกดทับและช่วยให้ลำไส้เคลื่อนไหวได้ดีขึ้น (ควรปรึกษาพยาบาลหรือแพทย์ประจำเคสก่อนว่าแผลผ่าตัดจำกัดท่านอนตะแคงหรือไม่)
                      </p>
                    </div>

                    <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-[11px] flex items-center gap-1.5 font-medium">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span><strong>ข้อห้ามสำคัญ:</strong> ห้ามนอนคว่ำเด็ดขาดในช่วง 4-6 สัปดาห์แรก เพื่อป้องกันน้ำหนักตัวกดทับแผล</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Do & Don't for Rest & Elimination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200">
                  <h5 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>สิ่งที่ควรปฏิบัติ (Recommended):</span>
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>ลุกเดินเบาๆ บ่อยครั้งในบ้าน เพื่อกระตุ้นการเคลื่อนไหวของลำไส้และช่วยให้ผายลม</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>จัดห้องนอนให้เงียบสงบ มืด อุณหภูมิพอเหมาะ 24-26°C อากาศถ่ายเทดี</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>หากปวดแผลจนนอนไม่หลับ ให้ทานยาแก้ปวดก่อนเวลานอนประมาณ 30 นาที</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-200">
                  <h5 className="text-xs font-bold text-rose-900 mb-2 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>ข้อห้ามเด็ดขาด (Prohibited):</span>
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>ห้ามนั่งเบ่งในห้องน้ำนานเกิน 5-10 นาที</strong> หากไม่ออกให้ลุกขึ้นเดินแล้วดื่มน้ำอุ่น</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>ห้ามกลั้นปัสสาวะหรืออุจจาระเมื่อรู้สึกปวด</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>ห้ามดื่มชา กาแฟ หรือน้ำอัดลมช่วงบ่ายและเย็น เพราะจะรบกวนการนอนหลับ</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          เครื่องมือจำลองขั้นตอนแบบโต้ตอบ (Interactive Simulators)
          คลิกเพื่อเปิด/สลับเครื่องมือ (เก็บไว้ตามคำสั่งของผู้ใช้)
      ========================================================================= */}
      <div id="interactive-simulators-section" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                เครื่องมือจำลองขั้นตอนแบบโต้ตอบ (Interactive Simulators)
              </h3>
              <p className="text-xs text-slate-500">
                คลิกเพื่อเปิด/สลับเครื่องมือฝึกปฏิบัติการดูแลตนเอง
              </p>
            </div>
          </div>
          <span className="text-[11px] text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 font-semibold self-start sm:self-auto">
            ฝึกทักษะด้วยตนเอง (Self-Care Skills)
          </span>
        </div>

        {/* Simulator Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            id="tab-btn-breathing"
            onClick={() => {
              setActiveTool('breathing');
              const target = document.getElementById('interactive-simulators-section');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
              activeTool === 'breathing'
                ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold ring-2 ring-teal-500/20 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-white'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="font-bold">ฝึกบริหารปอด</p>
              <p className="text-[10px] text-slate-500 font-normal">Deep Breathing</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('splinting')}
            className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center gap-2.5 ${
              activeTool === 'splinting'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-white'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="font-bold">กอดหมอนพยุงแผล</p>
              <p className="text-[10px] text-slate-500 font-normal">Splinting Guide</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('logroll')}
            className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center gap-2.5 ${
              activeTool === 'logroll'
                ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold ring-2 ring-sky-500/20 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-white'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Footprints className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="font-bold">ท่าลุกจากเตียง</p>
              <p className="text-[10px] text-slate-500 font-normal">Log-Roll Method</p>
            </div>
          </button>
        </div>

        {/* Dynamic Simulator View Container */}
        {activeTool === 'breathing' && (
          <div className="mt-4 p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-slate-800 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-md">
                <span className="px-2 py-0.5 bg-teal-200/70 text-teal-800 text-[10px] font-bold rounded uppercase">
                  การบริหารปอดและการหายใจลึก (Deep Breathing Exercise)
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  ฝึกหายใจเพื่อป้องกันปอดแฟบและขับเสมหะตกค้าง
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  หลังดมยาสลบผ่าตัดช่องท้อง ถุงลมปอดส่วนล่างอาจยุบตัว การฝึกหายใจเข้าลึกช้าๆ จะช่วยขยายปอด ลดเสมหะคั่งค้าง และเพิ่มออกซิเจนไปเลี้ยงแผลผ่าตัด
                </p>

                <div className="flex items-center gap-2 mt-4">
                  {!isBreathingActive ? (
                    <button
                      onClick={startBreathing}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>เริ่มฝึกหายใจตามจังหวะ</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopBreathing}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Pause className="w-4 h-4 fill-white" />
                      <span>หยุดพักชั่วคราว</span>
                    </button>
                  )}

                  <button
                    onClick={resetBreathing}
                    className="p-2 bg-white text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-300 text-xs transition-colors"
                    title="เริ่มนับรอบใหม่"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold text-teal-900 ml-2">
                    ทำสำเร็จแล้ว: <span className="font-bold text-teal-700">{breathingCount}</span> รอบ (แนะนำ 5-10 รอบ/ครั้ง)
                  </span>
                </div>
              </div>

              {/* Animated Breathing Circle */}
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                      breathingPhase === 'inhale'
                        ? 'bg-teal-400/30 scale-105 animate-pulse'
                        : breathingPhase === 'hold'
                        ? 'bg-indigo-400/30 scale-105'
                        : breathingPhase === 'exhale'
                        ? 'bg-sky-400/20 scale-90'
                        : 'bg-slate-200/40'
                    }`}
                  />
                  <div
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-1000 ${
                      breathingPhase === 'inhale'
                        ? 'bg-gradient-to-tr from-teal-600 to-teal-400 scale-110'
                        : breathingPhase === 'hold'
                        ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 scale-110'
                        : breathingPhase === 'exhale'
                        ? 'bg-gradient-to-tr from-sky-600 to-teal-500 scale-90'
                        : 'bg-slate-400 scale-95'
                    }`}
                  >
                    <span className="text-sm font-bold tracking-tight">
                      {breathingPhase === 'idle' && 'พร้อมฝึก'}
                      {breathingPhase === 'inhale' && 'หายใจเข้าช้าๆ'}
                      {breathingPhase === 'hold' && 'กลั้นหายใจนิ่ง'}
                      {breathingPhase === 'exhale' && 'ผ่อนลมหายใจออก'}
                    </span>
                    <span className="text-3xl font-black mt-0.5">
                      {breathingPhase === 'idle' ? 'เริ่ม' : breathingTimer}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {breathingPhase === 'inhale' && '4 วินาที'}
                      {breathingPhase === 'hold' && '2 วินาที'}
                      {breathingPhase === 'exhale' && '4 วินาที'}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  *ขณะหายใจออก ให้ผ่อนคลายไหล่และหน้าท้องช้าๆ
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'splinting' && (
          <div className="mt-4 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-slate-800 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-md">
                <span className="px-2 py-0.5 bg-indigo-200/80 text-indigo-900 text-[10px] font-bold rounded uppercase">
                  เทคนิคการพยุงแผลผ่าตัด (Splinting Technique)
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  วิธีใช้หมอนกอดพยุงหน้าท้องเพื่อลดความเจ็บปวดและป้องกันแผลปริ
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  ทุกครั้งที่มีอาการไอ จาม หัวเราะ หรือลุกเปลี่ยนท่าทาง ความดันในช่องท้องจะพุ่งขึ้นทันที การนำหมอนใบเล็กมากอดแนบแน่นบริเวณแผลผ่าตัด จะช่วยซับแรงกระแทกได้มากกว่า 40% และป้องกันไม่ให้ไหมเย็บดึงรั้งเนื้อเยื่อ
                </p>
              </div>

              {/* Splinting Graphic & Image Visual */}
              <div className="w-full md:w-80 bg-white rounded-2xl p-4 border border-indigo-200 shadow-xs flex flex-col justify-between">
                <div>
                  {/* Photo Container */}
                  <div 
                    onClick={() => setIsSplintingModalOpen(true)}
                    className="relative aspect-4/3 rounded-xl overflow-hidden border border-indigo-100 cursor-pointer group shadow-2xs bg-slate-900"
                  >
                    <img 
                      src={splintingPillowImg} 
                      alt="ภาพสาธิตการใช้หมอนกอดพยุงแผลผ่าตัดหน้าท้องเพื่อลดความปวด" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold drop-shadow">
                          หมอนหนุนนุ่มกอดแนบหน้าท้อง
                        </span>
                        <span className="text-[10px] bg-white/25 backdrop-blur-xs px-2 py-0.5 rounded text-white font-medium flex items-center gap-1">
                          <ZoomIn className="w-2.5 h-2.5" /> คลิกขยาย
                        </span>
                      </div>
                      <p className="text-[10px] text-indigo-100 leading-tight mt-0.5 drop-shadow-sm">
                        โอบแขนทั้งสองข้างกอดหมอนแนบรอยแผลขณะไอ จาม หรือลุกขึ้น
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mt-3 text-[10px] font-semibold text-slate-700 text-center">
                  <div className="p-1.5 bg-indigo-50/70 rounded-lg border border-indigo-100">
                    1. ทาบหมอน
                  </div>
                  <div className="p-1.5 bg-indigo-50/70 rounded-lg border border-indigo-100">
                    2. กอดกระชับ
                  </div>
                  <div className="p-1.5 bg-indigo-50/70 rounded-lg border border-indigo-100">
                    3. ไอ/จาม ปลอดภัย
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'logroll' && (
          <div className="mt-4 p-5 rounded-2xl bg-sky-50/70 border border-sky-200 text-slate-800 animate-in fade-in duration-200">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              {/* Left Column: Instructions and details */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="px-2 py-0.5 bg-sky-200 text-sky-900 text-[10px] font-bold rounded uppercase">
                    วิธีการลุกและนอนหลังผ่าตัดช่องท้องอย่างปลอดภัย
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    1. การพลิกตัวและลุกจากเตียง (Log-rolling technique)
                  </h4>
                </div>

                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-rose-950 font-medium flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>ข้อควรระวังสำคัญ:</strong> อย่ายกศีรษะขึ้นตรง ๆ จากท่านอนหงายทันที เพราะจะทำให้เกร็งกล้ามเนื้อหน้าท้องและดึงรั้งแผลผ่าตัด
                    </span>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-sky-200 shadow-2xs space-y-2">
                    <p className="font-bold text-sky-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      <span>ขั้นตอนการปฏิบัติตามหลัก Log-rolling:</span>
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                      <li>
                        ให้ใช้วิธี <strong>นอนตะแคงตัว</strong> ไปด้านใดด้านหนึ่งก่อน งอเข่าทั้งสองข้างขึ้นเล็กน้อย
                      </li>
                      <li>
                        ใช้มือข้างที่อยู่ด้านบนยันกับที่นอน พร้อมกับค่อย ๆ หย่อนขาลงข้างเตียง และใช้ลำตัวท่อนบนค่อย ๆ พยุงลุกขึ้นนั่ง
                      </li>
                    </ol>
                  </div>
                </div>

                {/* 4 Interactive Step Selector */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      คลิกดูรายละเอียดแต่ละจังหวะ:
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map(s => (
                        <button
                          key={s}
                          onClick={() => setLogRollStep(s)}
                          className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${
                            logRollStep === s
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        step: 1,
                        title: '1. นอนหงายงอเข่า',
                        desc: 'ชันเข่าทั้งสองข้างขึ้น เท้าวางราบกับฟูก',
                        icon: '🛏️',
                        image: bendingKneesBedImg,
                        imageAlt: 'ภาพการนอนหงายงอเข่า เท้าวางราบกับฟูกก่อนพลิกตัว'
                      },
                      {
                        step: 2,
                        title: '2. นอนตะแคงตัว',
                        desc: 'พลิกไหล่และสะโพกพร้อมกัน งอเข่าเล็กน้อย',
                        icon: '🔄',
                        image: logrollSideLyingImg,
                        imageAlt: 'ภาพการนอนตะแคงตัว พลิกไหล่และสะโพกพร้อมกันเป็นท่อนเดียว'
                      },
                      {
                        step: 3,
                        title: '3. หย่อนขาลงเตียง',
                        desc: 'ค่อยๆ หย่อนขาทั้งสองข้างลงข้างเตียง',
                        icon: '🦵',
                        image: logrollLegsOverImg,
                        imageAlt: 'ภาพการค่อยๆ หย่อนขาทั้งสองข้างลงข้างเตียงพร้อมกัน'
                      },
                      {
                        step: 4,
                        title: '4. มือบนยันที่นอน',
                        desc: 'มือบนยันฟูก ลำตัวท่อนบนพยุงลุกขึ้นนั่ง',
                        icon: '💪',
                        image: logrollPushUpImg,
                        imageAlt: 'ภาพการใช้มือบนและศอกดันฟูกเตียงพยุงลำตัวขึ้นนั่ง'
                      }
                    ].map(item => (
                      <div
                        key={item.step}
                        onClick={() => setLogRollStep(item.step)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          logRollStep === item.step
                            ? 'bg-white border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div>
                          {item.image ? (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setLogRollStep(item.step);
                                setEnlargedLogrollStepModal(item.step);
                              }}
                              className="relative w-full aspect-16/10 rounded-lg overflow-hidden border border-sky-200 mb-1.5 bg-slate-900 group/img shadow-2xs"
                            >
                              <img 
                                src={item.image} 
                                alt={item.imageAlt}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" 
                              />
                              <div className="absolute inset-0 bg-slate-900/20 group-hover/img:bg-transparent transition-colors flex items-end justify-end p-1">
                                <span className="bg-slate-950/70 text-white rounded p-0.5 backdrop-blur-2xs">
                                  <ZoomIn className="w-2.5 h-2.5" />
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xl mb-1">{item.icon}</div>
                          )}
                          <h5 className="text-[11px] font-bold text-slate-900">{item.title}</h5>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Photo Display */}
              <div className="w-full lg:w-80 bg-white rounded-2xl p-4 border border-sky-200 shadow-xs flex flex-col justify-between shrink-0">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-sky-950 flex items-center gap-1.5">
                      <Footprints className="w-3.5 h-3.5 text-sky-600" />
                      <span>ภาพสาธิตท่าลุกจากเตียงจริง</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLogrollModalOpen(true)}
                      className="text-[10px] text-sky-700 hover:text-sky-900 font-bold flex items-center gap-0.5 bg-sky-50 px-2 py-0.5 rounded-md hover:bg-sky-100 transition-colors"
                    >
                      <ZoomIn className="w-3 h-3" />
                      <span>ขยายดูชัดๆ</span>
                    </button>
                  </div>

                  <div 
                    onClick={() => setIsLogrollModalOpen(true)}
                    className="relative aspect-4/3 rounded-xl overflow-hidden border border-sky-100 cursor-pointer group shadow-2xs bg-slate-900"
                  >
                    <img 
                      src={logrollBedImg} 
                      alt="ภาพสาธิตการลุกจากเตียงด้วยเทคนิค Log-roll หลังผ่าตัดช่องท้อง" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold drop-shadow">
                          ตะแคงตัว ยันแขน หย่อนขาลงเตียง
                        </span>
                        <span className="text-[10px] bg-white/25 backdrop-blur-xs px-2 py-0.5 rounded text-white font-medium flex items-center gap-1">
                          <ZoomIn className="w-2.5 h-2.5" /> คลิกขยาย
                        </span>
                      </div>
                      <p className="text-[10px] text-sky-100 leading-tight mt-0.5 drop-shadow-sm">
                        ป้องกันการเกร็งกล้ามเนื้อหน้าท้องและลดแรงดึงรั้งแผล
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-sky-50/70 rounded-xl border border-sky-100 text-[11px] text-slate-700 leading-snug">
                  💡 <strong>เคล็ดลับ:</strong> ขณะลุกขึ้น ให้นำหมอนใบเล็กมากอดแนบหน้าท้อง (Splinting) ร่วมด้วย จะช่วยซับแรงกระเทือนได้ดียิ่งขึ้น
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENLARGED SPLINTING MODAL */}
        {isSplintingModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setIsSplintingModalOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image */}
              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                <img 
                  src={splintingPillowImg} 
                  alt="ภาพสาธิตการใช้หมอนกอดพยุงแผลผ่าตัดหน้าท้องเพื่อลดความปวด" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsSplintingModalOpen(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 transition-colors shadow-md"
                  aria-label="ปิดภาพขยาย"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-md bg-indigo-950/80 border border-indigo-500/30">
                  🛡️ ภาพสาธิตเทคนิคกอดหมอนพยุงหน้าท้อง (Abdominal Splinting Technique)
                </div>
              </div>

              {/* Modal Details */}
              <div className="p-5 sm:p-6 space-y-4 text-xs">
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-indigo-950 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <span>คำแนะนำการใช้หมอนพยุงแผลผ่าตัดเพื่อบรรเทาอาการปวด</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    ภาพด้านบนสาธิตท่าทางที่ถูกต้องตามหลักการพยาบาลศัลยกรรม: ผู้ป่วยใช้หมอนขนาดพอเหมาะทาบแนบลงบนบริเวณแผลผ่าตัดหน้าท้อง จากนั้นใช้แขนทั้งสองข้างโอบกอดหมอนกระชับเข้าหาลำตัวเบาๆ เพื่อให้หมอนทำหน้าที่เป็น <strong>"ตัวดูดซับแรงดัน (Shock Absorber)"</strong> 
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200">
                      <span className="font-bold text-indigo-950 block mb-1">🛋️ 1. เลือกหมอนนุ่มกระชับ</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        ควรเป็นหมอนใบเล็กที่มีความแน่นพอดี ไม่นิ่มยวบหรือแข็งกระด้างจนกดทับแผล
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200">
                      <span className="font-bold text-indigo-950 block mb-1">🤗 2. กอดก่อนไอหรือจาม</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        เมื่อรู้สึกระคายคอจะไอ จาม หรือหัวเราะ ให้รีบนำหมอนมากอดแนบแน่นทันที
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200">
                      <span className="font-bold text-indigo-950 block mb-1">🚶 3. พยุงขณะเปลี่ยนท่า</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        ขณะลุกนั่ง ขยับตัว หรือเริ่มเดินก้าวแรก กอดหมอนไว้จะช่วยลดการสะเทือนของกล้ามเนื้อ
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed font-medium">
                    💡 <strong>ประโยชน์สำคัญ:</strong> ช่วยลดแรงกระชากที่ไหมเย็บแผลได้มากกว่า 40% ลดอาการเจ็บแปลบ และป้องกันไม่ให้เกิดภาวะขอบแผลแยก (Wound Dehiscence)
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSplintingModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENLARGED LOG-ROLL BED MOBILITY MODAL */}
        {isLogrollModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setIsLogrollModalOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                <img 
                  src={logrollBedImg} 
                  alt="ภาพสาธิตการพลิกตัวและลุกจากเตียงด้วยเทคนิค Log-rolling" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsLogrollModalOpen(false)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 text-xs">
                {/* Header Information below image without blocking photo */}
                <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200">
                  <p className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>ภาพสาธิต: เทคนิคการพลิกตัวและลุกจากเตียง (Log-rolling technique)</span>
                  </p>
                  <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                    นอนตะแคงก่อน งอเข่าเล็กน้อย หย่อนขาลงเตียง แล้วใช้มือบนยันฟูกพยุงลำตัวขึ้นนั่ง
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-bold text-sky-950 flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-sky-600" />
                    <span>วิธีการลุกและนอนหลังผ่าตัดช่องท้องอย่างปลอดภัย</span>
                  </h4>
                  
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 font-medium">
                    ⚠️ <strong>ข้อควรระวังสำคัญ:</strong> อย่ายกศีรษะขึ้นตรง ๆ จากท่านอนหงายทันที เพราะจะทำให้เกร็งกล้ามเนื้อหน้าท้องและดึงรั้งแผลผ่าตัด
                  </div>

                  <div className="p-4 bg-sky-50/80 rounded-xl border border-sky-200 space-y-2">
                    <h5 className="font-bold text-sky-950 text-sm">1. การพลิกตัวและลุกจากเตียง (Log-rolling technique):</h5>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                      <li>
                        ให้ใช้วิธี <strong>นอนตะแคงตัว</strong> ไปด้านใดด้านหนึ่งก่อน งอเข่าทั้งสองข้างขึ้นเล็กน้อย
                      </li>
                      <li>
                        ใช้มือข้างที่อยู่ด้านบนยันกับที่นอน พร้อมกับค่อย ๆ หย่อนขาลงข้างเตียง และใช้ลำตัวท่อนบนค่อย ๆ พยุงลุกขึ้นนั่ง
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1">🛑 สิ่งที่ไม่ควรทำ</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        ห้ามทำท่าซิทอัพขึ้นมาตรงๆ และห้ามบิดเอวหรือดึงรั้งตัวกะทันหัน
                      </p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                      <span className="font-bold text-teal-950 block mb-1">💡 เทคนิคเสริม</span>
                      <p className="text-[11px] text-teal-900 leading-snug">
                        กอดหมอนใบเล็กแนบหน้าท้องขณะลุกขึ้น จะช่วยลดแรงกระแทกและความเจ็บปวดได้ดียิ่งขึ้น
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsLogrollModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENLARGED SLEEPING POSITIONS MODAL */}
        {isSleepingModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setIsSleepingModalOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                <img 
                  src={sleepingPositionsImg} 
                  alt="ภาพสาธิตท่านอนที่เหมาะสมหลังผ่าตัดช่องท้อง" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsSleepingModalOpen(false)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 text-xs">
                {/* Header Information below image without blocking photo */}
                <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200">
                  <p className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>ภาพสาธิต: ท่านอนที่เหมาะสมหลังผ่าตัดช่องท้อง</span>
                  </p>
                  <p className="text-xs text-indigo-900 mt-1 leading-relaxed">
                    ท่านอนหงายศีรษะสูงหนุนหมอนใต้เข่า (Semi-Fowler) และท่านอนตะแคงสลับข้าง
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-bold text-indigo-950 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <span>2. ท่านอนที่เหมาะสมหลังผ่าตัดช่องท้องอย่างปลอดภัย</span>
                  </h4>

                  <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 space-y-1.5">
                    <h5 className="font-bold text-teal-950 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>ท่านอนหงาย (Semi-Fowler's position):</span>
                    </h5>
                    <p className="text-slate-700 leading-relaxed">
                      นอนหงายโดยหนุนศีรษะสูงเล็กน้อย (Semi-Fowler's position) และอาจหาหมอนมารองใต้เข่า เพื่อช่วยลดการตึงรั้งของกล้ามเนื้อหน้าท้อง
                    </p>
                  </div>

                  <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1.5">
                    <h5 className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      <span>ท่านอนตะแคง:</span>
                    </h5>
                    <p className="text-slate-700 leading-relaxed">
                      นอนตะแคงซ้ายหรือขวา สลับได้ เพื่อป้องกันแผลกดทับและช่วยให้ลำไส้เคลื่อนไหวได้ดีขึ้น (ควรปรึกษาพยาบาลหรือแพทย์ประจำเคสก่อนว่าแผลผ่าตัดจำกัดท่านอนตะแคงหรือไม่)
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      <strong>ข้อห้ามสำคัญ:</strong> ห้ามนอนคว่ำเด็ดขาดในช่วง 4-6 สัปดาห์แรก เพื่อป้องกันน้ำหนักตัวกดทับแผลผ่าตัดหน้าท้องโดยตรง
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSleepingModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ENLARGED LOG-ROLL STEP MODAL FOR ALL 4 STEPS */}
        {enlargedLogrollStepModal !== null && (() => {
          const stepData: Record<number, {
            title: string;
            subtitle: string;
            img: string;
            alt: string;
            tip: string;
            details: string;
          }> = {
            1: {
              title: 'ขั้นตอนที่ 1: นอนหงายงอเข่า (Hook-lying Position)',
              subtitle: 'ชันเข่าขึ้นทั้งสองข้าง เท้าวางราบกับฟูก ช่วยผ่อนคลายกล้ามเนื้อหน้าท้องก่อนเริ่มพลิกตัว',
              img: bendingKneesBedImg,
              alt: 'ภาพสาธิตท่านอนหงายงอเข่า ชันเข่าขึ้น เท้าวางราบกับฟูกเตียง',
              tip: 'การชันเข่าขึ้นจะช่วยลดความตึงของกล้ามเนื้อหน้าท้อง (Rectus abdominis) และข้อสะโพกทันที ทำให้แผลผ่าตัดไม่ถูกดึงรั้ง',
              details: 'นอนหงายในท่าที่สบาย ค่อยๆ ชันเข่าทั้งสองข้างขึ้นโดยให้ฝ่าเท้าวางราบบนฟูกเตียง พร้อมหายใจเข้าออกช้าๆ ผ่อนคลายกล้ามเนื้อลำตัว'
            },
            2: {
              title: 'ขั้นตอนที่ 2: นอนตะแคงตัว (Side-Lying Log-Roll)',
              subtitle: 'พลิกไหล่ ลำตัว และสะโพกไปพร้อมๆ กันเป็นท่อนเดียว โดยไม่งอหรือบิดเอว',
              img: logrollSideLyingImg,
              alt: 'ภาพสาธิตการนอนตะแคงตัว พลิกไหล่และสะโพกพร้อมกันเป็นท่อนเดียว',
              tip: 'ห้ามบิดเอวหรือหมุนลำตัวส่วนบนก่อนสะโพกเด็ดขาด เพราะจะเกิดแรงเฉือนที่แผลผ่าตัด',
              details: 'จากท่านอนหงายงอเข่า ให้พลิกทั้งตัวไปทางด้านข้างที่ต้องการลงเตียงพร้อมกัน ทั้งไหล่ ลำตัว และสะโพกเสมือนท่อนซุง (Log-roll) งอเข่าเล็กน้อยเพื่อความมั่นคง'
            },
            3: {
              title: 'ขั้นตอนที่ 3: หย่อนขาลงเตียง (Lowering Legs)',
              subtitle: 'ค่อยๆ เลื่อนและหย่อนขาทั้งสองข้างลงข้างเตียงอย่างช้าๆ',
              img: logrollLegsOverImg,
              alt: 'ภาพสาธิตการค่อยๆ หย่อนขาทั้งสองข้างลงข้างเตียงพร้อมกัน',
              tip: 'น้ำหนักของขาที่หย่อนลงข้างเตียง จะทำหน้าที่เป็นคานถ่วงช่วยดึงลำตัวส่วนบนให้ลุกขึ้นได้ง่ายขึ้น',
              details: 'ขณะนอนตะแคงใกล้ขอบเตียง ให้ค่อยๆ ขยับขาทั้งสองข้างให้หย่อนลงสู่ข้างเตียงพร้อมกันอย่างนุ่มนวล โดยยังคงผ่อนคลายกล้ามเนื้อหน้าท้อง'
            },
            4: {
              title: 'ขั้นตอนที่ 4: มือบนยันที่นอนพยุงลุกขึ้นนั่ง (Arm Push-Up)',
              subtitle: 'ใช้มือข้างบนยันกับฟูกเตียง และใช้ลำตัวท่อนบนค่อยๆ พยุงลุกขึ้นนั่ง',
              img: logrollPushUpImg,
              alt: 'ภาพสาธิตการใช้มือบนและศอกดันฟูกเตียงพยุงลำตัวขึ้นนั่ง',
              tip: 'ออกแรงดันจากกล้ามเนื้อแขนและข้อศอกเป็นหลัก ไม่เกร็งหรือออกแรงจากหน้าท้อง',
              details: 'วางฝ่ามือข้างที่อยู่ด้านบนลงบนฟูกระดับหน้าอก แล้วออกแรงดันมือและข้อศอกล่างพร้อมกัน เพื่อพยุงลำตัวท่อนบนขึ้นมาอยู่ในท่านั่งที่ขอบเตียงอย่างมั่นคง'
            }
          };

          const current = stepData[enlargedLogrollStepModal] || stepData[1];

          return (
            <div 
              className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
              onClick={() => setEnlargedLogrollStepModal(null)}
            >
              <div 
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                  <img 
                    src={current.img} 
                    alt={current.alt} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEnlargedLogrollStepModal(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 sm:p-6 space-y-4 text-xs">
                  {/* Step information placed cleanly below image */}
                  <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200">
                    <p className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>{current.title}</span>
                    </p>
                    <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                      {current.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed space-y-1.5">
                      <span className="font-bold text-slate-900 block">วิธีการปฏิบัติ:</span>
                      <p>{current.details}</p>
                    </div>

                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-950 font-medium leading-relaxed">
                      💡 <strong>เทคนิคและเหตุผลทางการแพทย์:</strong> {current.tip}
                    </div>
                  </div>

                  {/* Step Switcher Buttons within modal */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500 mr-1">ขั้นตอน:</span>
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setEnlargedLogrollStepModal(num)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            enlargedLogrollStepModal === num
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setEnlargedLogrollStepModal(null)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
