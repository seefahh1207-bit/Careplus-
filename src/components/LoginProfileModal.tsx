import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Calendar, Stethoscope, ShieldCheck, X, FileText, CheckCircle2 } from 'lucide-react';

interface LoginProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (user: UserProfile) => void;
  isInitialSetup?: boolean;
}

export const LoginProfileModal: React.FC<LoginProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  isInitialSetup = false
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...currentUser });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const sampleProfiles: Partial<UserProfile>[] = [
    {
      fullName: 'คุณสมศรี รักษาดี',
      birthDate: '1984-05-18',
      surgeryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      surgeryType: 'การผ่าตัดช่องท้อง (Abdominal Surgery)',
      hn: 'HN-694201',
      hospitalName: 'โรงพยาบาลกรุงเทพเชียงใหม่',
      emergencyPhone: '1719'
    },
    {
      fullName: 'คุณเกรียงไกร มั่นคง',
      birthDate: '1976-11-04',
      surgeryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      surgeryType: 'ผ่าตัดเปิดช่องท้อง (Exploratory Laparotomy)',
      hn: 'HN-810423',
      hospitalName: 'โรงพยาบาลกรุงเทพเชียงใหม่',
      emergencyPhone: '1719'
    },
    {
      fullName: 'คุณวิภาวรรณ สุขภาพเลิศ',
      birthDate: '1990-08-22',
      surgeryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      surgeryType: 'ผ่าตัดผ่านกล้องช่องท้อง (Laparoscopic Abdominal Surgery)',
      hn: 'HN-932145',
      hospitalName: 'โรงพยาบาลกรุงเทพเชียงใหม่',
      emergencyPhone: '1719'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="modal-patient-profile"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white p-4 sm:p-5">
          {!isInitialSetup && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Careplus+ Application</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isInitialSetup ? 'เข้าสู่ระบบผู้ป่วยผ่าตัดช่องท้อง' : 'ข้อมูลส่วนบุคคลและการผ่าตัดช่องท้อง'}
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                ระบบจัดการข้อมูลผู้ป่วยเพื่อการติดตามการฟื้นตัวเฉพาะบุคคลหลังผ่าตัดช่องท้อง
              </p>
            </div>
          </div>
        </div>

        {/* Quick select presets */}
        <div className="px-5 pt-4 pb-2 bg-teal-50/50 border-b border-teal-100">
          <p className="text-xs font-semibold text-teal-900 mb-2">
            ตัวเลือกข้อมูลตัวอย่างผู้ป่วยผ่าตัดช่องท้อง (คลิกเพื่อทดสอบใช้งานทันที):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sampleProfiles.map((prof, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, ...prof }))}
                className="text-left p-2 rounded-lg border border-teal-200 bg-white hover:bg-teal-50 text-xs transition-colors shadow-xs"
              >
                <p className="font-bold text-slate-800 truncate">{prof.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate">{prof.surgeryType}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อ - นามสกุล ผู้ป่วย *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-patient-name"
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="เช่น นายสมชาย ใจดี"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white outline-hidden transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันเดือนปีเกิด *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-patient-birthdate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่ทำการผ่าตัด *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-patient-surgery-date"
                  type="date"
                  required
                  value={formData.surgeryDate}
                  onChange={e => setFormData({ ...formData, surgeryDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขประจำตัวผู้ป่วย (HN)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-patient-hn"
                  type="text"
                  value={formData.hn}
                  onChange={e => setFormData({ ...formData, hn: e.target.value })}
                  placeholder="เช่น HN-123456"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทการผ่าตัดช่องท้อง *
              </label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-patient-surgery-type"
                  type="text"
                  required
                  value={formData.surgeryType}
                  onChange={e => setFormData({ ...formData, surgeryType: e.target.value })}
                  placeholder="เช่น การผ่าตัดช่องท้อง (Abdominal Surgery)"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:bg-white outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              โรงพยาบาลที่เข้ารับการผ่าตัด
            </label>
            <input
              type="text"
              readOnly
              value="โรงพยาบาลกรุงเทพเชียงใหม่ (สายด่วน 1719)"
              className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 text-slate-600 rounded-lg cursor-not-allowed"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            {!isInitialSetup && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
            )}

            <button
              id="btn-save-patient-profile"
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-teal-200" />
                  <span>บันทึกสำเร็จ!</span>
                </>
              ) : (
                <span>บันทึกและเข้าใช้งาน</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
