import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  DailyChecklistItem, 
  PainRecord, 
  WoundRecord, 
  NavigationTab 
} from './types';
import { 
  INITIAL_CHECKLIST_ITEMS, 
  INITIAL_PAIN_LOGS, 
  INITIAL_WOUND_RECORDS 
} from './data/oremGuideData';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DailyChecklist } from './components/DailyChecklist';
import { PainTracker } from './components/PainTracker';
import { WoundManager } from './components/WoundManager';
import { InteractiveGuide } from './components/InteractiveGuide';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { LoginProfileModal } from './components/LoginProfileModal';
import { DangerSignsView } from './components/DangerSignsView';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Activity, 
  Camera, 
  BookOpen, 
  PhoneCall,
  AlertTriangle
} from 'lucide-react';

const USER_STORAGE_KEY = 'postop_patient_profile_v1';
const CHECKLIST_STORAGE_KEY = 'postop_checklist_items_v1';
const PAIN_STORAGE_KEY = 'postop_pain_records_v1';
const WOUND_STORAGE_KEY = 'postop_wound_records_v1';

const DEFAULT_USER: UserProfile = {
  fullName: 'คุณสมศรี รักษาดี',
  birthDate: '1984-05-18',
  surgeryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
  surgeryType: 'การผ่าตัดช่องท้อง (Abdominal Surgery)',
  hn: 'HN-694201',
  hospitalName: 'โรงพยาบาลกรุงเทพเชียงใหม่',
  emergencyPhone: '1719'
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [guideScrollTarget, setGuideScrollTarget] = useState<string | null>(null);

  const handleGoToVisualWoundGuide = () => {
    setActiveTab('guide');
    setGuideScrollTarget('visual-wound-guide');
  };

  // Modals State
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isInitialLogin, setIsInitialLogin] = useState<boolean>(false);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER;
  });

  // Daily Checklist
  const [checklist, setChecklist] = useState<DailyChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        const parsed: DailyChecklistItem[] = JSON.parse(saved);
        return INITIAL_CHECKLIST_ITEMS.map(defaultItem => {
          const matched = parsed.find(p => p.id === defaultItem.id);
          return matched ? { ...defaultItem, completed: matched.completed } : defaultItem;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  // Pain Records
  const [painRecords, setPainRecords] = useState<PainRecord[]>(() => {
    try {
      const saved = localStorage.getItem(PAIN_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAIN_LOGS;
  });

  // Wound Records
  const [woundRecords, setWoundRecords] = useState<WoundRecord[]>(() => {
    try {
      const saved = localStorage.getItem(WOUND_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WOUND_RECORDS;
  });

  // Persist user changes
  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Persist checklist
  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
    } catch (e) {
      console.error(e);
    }
  }, [checklist]);

  // Persist pain records
  useEffect(() => {
    try {
      localStorage.setItem(PAIN_STORAGE_KEY, JSON.stringify(painRecords));
    } catch (e) {
      console.error(e);
    }
  }, [painRecords]);

  // Persist wound records
  useEffect(() => {
    try {
      localStorage.setItem(WOUND_STORAGE_KEY, JSON.stringify(woundRecords));
    } catch (e) {
      console.error(e);
    }
  }, [woundRecords]);

  // Calculate Days Post-Op
  const calculateDaysPostOp = () => {
    try {
      const surgery = new Date(user.surgeryDate);
      const today = new Date();
      const diffTime = today.getTime() - surgery.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const daysPostOp = calculateDaysPostOp();

  // Handlers for Checklist
  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const handleResetChecklist = () => {
    if (window.confirm('คุณต้องการรีเซ็ตเช็คลิสต์ประจำวันเพื่อเริ่มรอบใหม่ใช่หรือไม่?')) {
      setChecklist(prev => prev.map(item => ({ ...item, completed: false })));
    }
  };

  // Handlers for Pain Tracker
  const handleAddPainRecord = (recordData: Omit<PainRecord, 'id'>) => {
    const newRecord: PainRecord = {
      ...recordData,
      id: `p-${Date.now()}`
    };
    setPainRecords(prev => [...prev, newRecord]);
  };

  const handleDeletePainRecord = (id: string) => {
    if (window.confirm('คุณต้องการลบบันทึกระดับความปวดนี้ใช่หรือไม่?')) {
      setPainRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  // Handlers for Wound Assessment
  const handleAddWoundRecord = (recordData: Omit<WoundRecord, 'id'>) => {
    const newRecord: WoundRecord = {
      ...recordData,
      id: `w-${Date.now()}`
    };
    setWoundRecords(prev => [...prev, newRecord]);
  };

  const handleDeleteWoundRecord = (id: string) => {
    if (window.confirm('คุณต้องการลบรูปภาพและบันทึกประเมินแผลนี้ใช่หรือไม่?')) {
      setWoundRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  // Logout / Switch User
  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบเพื่อความปลอดภัยส่วนบุคคลใช่หรือไม่?')) {
      setIsInitialLogin(true);
      setIsProfileModalOpen(true);
    }
  };

  const handleSaveProfile = (newUser: UserProfile) => {
    setUser(newUser);
    setIsInitialLogin(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900 pb-20 sm:pb-8">
      {/* Top Header & Patient Personalization Banner */}
      <Header
        user={user}
        daysPostOp={daysPostOp}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenProfile={() => {
          setIsInitialLogin(false);
          setIsProfileModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Tab Navigation for Desktop / Tablet */}
      <nav className="hidden sm:block bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            <button
              id="tab-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>ภาพรวมการฟื้นตัว</span>
            </button>

            <button
              id="tab-btn-checklist"
              onClick={() => setActiveTab('checklist')}
              className={`py-2 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'checklist'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Daily Checklist</span>
            </button>

            <button
              id="tab-btn-pain"
              onClick={() => setActiveTab('pain')}
              className={`py-2 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'pain'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>ระดับความปวด</span>
            </button>

            <button
              id="tab-btn-wound"
              onClick={() => setActiveTab('wound')}
              className={`py-2 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'wound'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>แผลผ่าตัด</span>
            </button>

            <button
              id="tab-btn-guide"
              onClick={() => setActiveTab('guide')}
              className={`py-2 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'guide'
                  ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>คู่มือการดูแลตนเอง</span>
            </button>

            <button
              id="tab-btn-danger"
              onClick={() => setActiveTab('danger')}
              className={`py-2 px-3 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'danger'
                  ? 'border-rose-600 text-rose-700 bg-rose-50/80'
                  : 'border-transparent text-rose-600 hover:text-rose-800 hover:border-rose-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>สัญญาณอันตราย (Red Flags)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            user={user}
            daysPostOp={daysPostOp}
            checklist={checklist}
            painRecords={painRecords}
            woundRecords={woundRecords}
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'checklist' && (
          <DailyChecklist
            items={checklist}
            onToggleItem={handleToggleChecklist}
            onResetToday={handleResetChecklist}
          />
        )}

        {activeTab === 'pain' && (
          <PainTracker
            records={painRecords}
            onAddRecord={handleAddPainRecord}
            onDeleteRecord={handleDeletePainRecord}
          />
        )}

        {activeTab === 'wound' && (
          <WoundManager
            records={woundRecords}
            onAddRecord={handleAddWoundRecord}
            onDeleteRecord={handleDeleteWoundRecord}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'guide' && (
          <InteractiveGuide
            initialScrollTarget={guideScrollTarget}
            onClearScrollTarget={() => setGuideScrollTarget(null)}
          />
        )}

        {activeTab === 'danger' && (
          <DangerSignsView
            onGoToVisualWoundGuide={handleGoToVisualWoundGuide}
            hospitalName={user.hospitalName}
            emergencyPhone={user.emergencyPhone}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Fixed) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 shadow-lg">
        <div className="grid grid-cols-6 gap-0.5 text-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-1 px-0.5 rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'dashboard' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 truncate">ภาพรวม</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-1 px-0.5 rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'checklist' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-500'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 truncate">เช็คลิสต์</span>
          </button>

          <button
            onClick={() => setActiveTab('pain')}
            className={`py-1 px-0.5 rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'pain' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-500'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 truncate">ความปวด</span>
          </button>

          <button
            onClick={() => setActiveTab('wound')}
            className={`py-1 px-0.5 rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'wound' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-500'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 truncate">ตรวจแผล</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-1 px-0.5 rounded-lg flex flex-col items-center justify-center transition-colors ${
              activeTab === 'guide' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[9px] mt-0.5 truncate">คู่มือ</span>
          </button>

          <button
            id="mobile-bottom-btn-danger"
            onClick={() => setActiveTab('danger')}
            className={`py-1 px-0.5 rounded-lg flex flex-col items-center justify-center transition-colors relative ${
              activeTab === 'danger' ? 'text-rose-700 font-bold bg-rose-50' : 'text-rose-600 hover:text-rose-700'
            }`}
          >
            <span className="relative">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </span>
            <span className="text-[9px] mt-0.5 truncate font-bold text-rose-600">อันตราย</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 text-xs text-slate-500 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="font-bold text-teal-800">Careplus+</span>
          </p>
          <p className="flex items-center gap-2">
            <span>บริการ 24 ชม. รพ.กรุงเทพเชียงใหม่</span>
            <button
              onClick={() => setIsSOSOpen(true)}
              className="text-rose-600 font-bold hover:underline"
            >
              สายด่วน 1719
            </button>
          </p>
        </div>
      </footer>

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        hospitalName={user.hospitalName}
        emergencyPhone={user.emergencyPhone}
        onNavigateToVisualWoundGuide={handleGoToVisualWoundGuide}
      />

      {/* Personal Login / Profile Modal */}
      <LoginProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
        onSaveUser={handleSaveProfile}
        isInitialSetup={isInitialLogin}
      />
    </div>
  );
}
