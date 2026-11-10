import React from 'react';
import { UserProfile } from '../types';
import { PhoneCall, User, ShieldCheck, HeartPulse, LogOut } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  onOpenSOS: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  daysPostOp: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenSOS,
  onOpenProfile,
  onLogout,
  daysPostOp
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Row 1: Brand Logo & Top Actions */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-teal-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <span className="text-base font-black leading-none tracking-tighter">C<span className="text-emerald-400">+</span></span>
          </div>
          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
            Careplus<span className="text-teal-600">+</span>
          </span>
        </div>

        {/* Right Actions: SOS 1719 + Profile + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Emergency 1719 Button */}
          <button
            id="btn-header-emergency-sos"
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold shadow-xs transition-colors shrink-0"
            title="โทรฉุกเฉิน 1719 รพ.กรุงเทพเชียงใหม่ (24 ชม.)"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>1719</span>
            <span className="hidden sm:inline text-[10px] font-medium text-rose-100">ฉุกเฉิน</span>
          </button>

          {/* Profile Button */}
          <button
            id="btn-edit-patient-profile"
            onClick={onOpenProfile}
            className="px-2 py-1 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
            title="ข้อมูลผู้ป่วย"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">ข้อมูลผู้ป่วย</span>
          </button>

          {/* Logout Button */}
          <button
            id="btn-patient-logout"
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Patient Info Bar (นำลงมาอีกบรรทัด) */}
      <div className="border-t border-slate-100 bg-slate-50/80 px-3 sm:px-4 py-1.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div 
            onClick={onOpenProfile}
            className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 min-w-0"
            title="คลิกเพื่อดูและแก้ไขข้อมูลผู้ป่วย"
          >
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate">
                {user.fullName || 'ผู้ป่วยพักฟื้น'}
              </span>
              {user.hn && (
                <span className="text-[11px] font-mono text-slate-500 hidden xs:inline">
                  (HN: {user.hn})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
              <HeartPulse className="w-3 h-3 text-teal-600" />
              พักฟื้นวันที่ {daysPostOp > 0 ? daysPostOp : 1}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
