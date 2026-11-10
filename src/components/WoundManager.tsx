import React, { useState, useRef } from 'react';
import { WoundRecord, WoundStatus } from '../types';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  Trash2, 
  Eye, 
  X, 
  Clock, 
  Calendar, 
  Sparkles,
  Info
} from 'lucide-react';

interface WoundManagerProps {
  records: WoundRecord[];
  onAddRecord: (record: Omit<WoundRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
  onOpenSOS: () => void;
}

export const WoundManager: React.FC<WoundManagerProps> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onOpenSOS
}) => {
  const [selectedStatus, setSelectedStatus] = useState<WoundStatus>('healthy');
  const [notes, setNotes] = useState<string>('');
  const [locationTag, setLocationTag] = useState<string>('แผลรอยเย็บหน้าท้องหลัก');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewModalRecord, setPreviewModalRecord] = useState<WoundRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | WoundStatus>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status definitions matching prompt requirements
  const statusOptions: {
    key: WoundStatus;
    label: string;
    sublabel: string;
    description: string;
    badgeClass: string;
    buttonActiveClass: string;
    borderClass: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'healthy',
      label: 'ปกติ (Healthy)',
      sublabel: 'แผลสมานตัวแห้งดี',
      description: 'แผลสมานตัวแห้งดี ไม่มีรอยอักเสบแดง ไม่มีหนองหรือเลือดซึม ผ้าก๊อซสะอาด',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      buttonActiveClass: 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500',
      borderClass: 'border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    },
    {
      key: 'monitor',
      label: 'รอดูอาการ (Monitor)',
      sublabel: 'บวมชมพูเล็กน้อย',
      description: 'ขอบแผลมีอาการบวมชมพูเล็กน้อย หรือรู้สึกตึงตื้อๆ แต่ไม่มีหนองหรือไข้สูง',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      buttonActiveClass: 'border-amber-500 bg-amber-50/80 text-amber-900 ring-2 ring-amber-500',
      borderClass: 'border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
    },
    {
      key: 'risk',
      label: 'ผิดปกติ (เสี่ยง)',
      sublabel: 'แผลบวมแดงมาก / เสี่ยงติดเชื้อ',
      description: 'แผลบวมแดงจัด ร้อน ปริแยก มีหนองกลิ่นเหม็น เลือดสดซึม หรือมีไข้ร่วมด้วย',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      buttonActiveClass: 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500',
      borderClass: 'border-rose-200',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />
    }
  ];

  // Sample presets for quick testing
  const sampleWoundImages = [
    {
      name: 'ภาพแผลแห้งปกติ (ตัวอย่าง)',
      url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      status: 'healthy' as WoundStatus
    },
    {
      name: 'ภาพแผลรอดูอาการ (ตัวอย่าง)',
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      status: 'monitor' as WoundStatus
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    // Fallback image if user didn't select one
    const finalImg = previewImage || sampleWoundImages[0].url;

    onAddRecord({
      date: dateStr,
      time: timeStr,
      status: selectedStatus,
      notes: notes || (selectedStatus === 'healthy' ? 'แผลแห้งดี ไม่พบรอยแดง' : selectedStatus === 'monitor' ? 'มีรอยชมพูตึงเล็กน้อย เฝ้าสังเกต' : 'แผลบวมแดงผิดปกติ'),
      imageUrl: finalImg,
      locationTag
    });

    // Reset
    setNotes('');
    setPreviewImage('');
    setIsSubmitting(false);
  };

  const filteredRecords = records.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Careplus+</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                แผลผ่าตัด (Wound Care) 🩹
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ถ่ายภาพแผลผ่าตัดเก็บไว้ในเครื่อง เพื่อดูการเปลี่ยนแปลงของแผลทีละนิด หรือใช้ประกอบเวลามาพบแพทย์ตามนัด
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">บันทึกสะสม:</span>
            <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              {records.length} ภาพถ่าย
            </span>
          </div>
        </div>
      </div>

      {/* Immediate Urgent Medical Alert if 'risk' is active */}
      {selectedStatus === 'risk' && (
        <div 
          id="urgent-medical-advisory"
          className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-500 rounded-2xl shadow-md animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                  คำแนะนำทางการแพทย์เร่งด่วน (Urgent Medical Warning)
                </span>
                <span className="text-xs font-bold text-rose-900">
                  ประเมินสถานะ: ผิดปกติ (เสี่ยงติดเชื้อ)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-900 font-medium mt-1 leading-relaxed">
                แผลที่บวมแดงมาก มีหนองซึม เลือดสดไหล หรือมีอาการปวดแสบร้อนรุนแรง อาจเป็นสัญญาณของการติดเชื้อที่แผลผ่าตัด (Surgical Site Infection) หรือไหมเย็บชั้นพังผืดแยกตัว กรุณาติดต่อแพทย์ผู้ทำการผ่าตัด หรือโทรติดต่อโรงพยาบาลกรุงเทพเชียงใหม่ทันที
              </p>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={onOpenSOS}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>กดโทร 1719 หรือเปิดหน้าต่างฉุกเฉิน</span>
                </button>
                <span className="text-xs text-rose-700">
                  *ห้ามบีบ เค้น หรือใส่ยาผง/ยาหม่องลงบนแผลเองเด็ดขาด
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Wound Check Assessment Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-teal-700" />
          <span>บันทึกรูปภาพและประเมินสถานะแผลรอบใหม่</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status 3-level buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              เลือกระดับสถานะแผล (คลิกเพื่อประเมิน 3 ระดับ) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {statusOptions.map(opt => {
                const isSelected = selectedStatus === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedStatus(opt.key)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected ? opt.buttonActiveClass : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-600">
                      {opt.sublabel}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo upload area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ถ่ายภาพหรืออัปโหลดรูปถ่ายแผล
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              {/* Drop area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-teal-50/30 flex flex-col items-center justify-center min-h-[140px]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Camera className="w-8 h-8 text-teal-600 mb-1.5" />
                <p className="text-xs font-bold text-slate-800">
                  คลิกเพื่อถ่ายภาพด้วยกล้อง หรือเลือกไฟล์รูป
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  รองรับ JPG, PNG (แนะนำถ่ายในที่แสงสว่างเพียงพอ)
                </p>
              </div>

              {/* Preview or Preset */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 min-h-[140px] flex flex-col justify-between">
                {previewImage ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-teal-800">
                        ตัวอย่างภาพที่พร้อมบันทึก:
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewImage('')}
                        className="text-[11px] text-rose-600 hover:underline flex items-center gap-0.5"
                      >
                        <X className="w-3 h-3" /> ยกเลิกรูป
                      </button>
                    </div>
                    <div className="relative h-24 w-full rounded-lg overflow-hidden border border-slate-300">
                      <img
                        src={previewImage}
                        alt="Wound preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 mb-1.5 block">
                      หรือเลือกใช้ภาพตัวอย่างเพื่อทดสอบ:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {sampleWoundImages.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPreviewImage(s.url);
                            setSelectedStatus(s.status);
                          }}
                          className="text-left p-1.5 rounded-lg border border-slate-200 bg-white hover:border-teal-400 transition-colors"
                        >
                          <img
                            src={s.url}
                            alt={s.name}
                            className="w-full h-14 object-cover rounded-md mb-1"
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-[10px] font-medium text-slate-700 truncate">
                            {s.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ตำแหน่งของแผล
              </label>
              <select
                id="select-wound-location"
                value={locationTag}
                onChange={e => setLocationTag(e.target.value)}
                className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="แผลรอยเย็บหน้าท้องหลัก">แผลรอยเย็บหน้าท้องหลัก</option>
                <option value="แผลรูกล้องส่องตรวจ (บริเวณสะดือ)">แผลรูกล้องส่องตรวจ (บริเวณสะดือ)</option>
                <option value="แผลเจาะท้องด้านข้าง (Trocar Site)">แผลเจาะท้องด้านข้าง (Trocar Site)</option>
                <option value="บริเวณสายระบายเลือด/น้ำเหลือง (Drain Tube)">บริเวณสายระบายเลือด/น้ำเหลือง (Drain Tube)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                บันทึกโน้ต & รายละเอียดอาการแผล
              </label>
              <input
                id="input-wound-notes"
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="เช่น รู้สึกตึงแผลเล็กน้อย, แผลแห้งดี, ขอบบวมชมพู..."
                className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              *บันทึกจะประทับเวลาอัตโนมัติเพื่อเปรียบเทียบลำดับการฟื้นตัว
            </span>
            <button
              id="btn-save-wound-record"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกผลการประเมินแผล</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Section with High-Resolution Zoom Preview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-slate-600" />
              <span>คลังแกลเลอรีประวัติแผลผ่าตัด (Wound Gallery)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คลิกที่รูปภาพเพื่อเปิดดูพรีวิวขนาดใหญ่ หรือลบรูปภาพที่ไม่ต้องการ
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ทั้งหมด ({records.length})
            </button>
            <button
              onClick={() => setFilterStatus('healthy')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterStatus === 'healthy'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              ปกติ ({records.filter(r => r.status === 'healthy').length})
            </button>
            <button
              onClick={() => setFilterStatus('monitor')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterStatus === 'monitor'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              รอดูอาการ ({records.filter(r => r.status === 'monitor').length})
            </button>
            <button
              onClick={() => setFilterStatus('risk')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterStatus === 'risk'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              ผิดปกติ ({records.filter(r => r.status === 'risk').length})
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              ไม่พบรูปภาพในหมวดหมู่นี้
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              ถ่ายรูปบันทึกแผลใหม่อย่างน้อยวันละ 1 ครั้งเพื่อติดตามการสมานตัว
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {[...filteredRecords].reverse().map(item => {
              const statusDef = statusOptions.find(s => s.key === item.status) || statusOptions[0];
              return (
                <div
                  key={item.id}
                  className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Image container */}
                  <div 
                    onClick={() => setPreviewModalRecord(item)}
                    className="relative h-44 w-full bg-slate-900 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.imageUrl}
                      alt="Wound record"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        คลิกดูรูปขยายใหญ่
                      </span>
                    </div>

                    {/* Status badge on top right */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-xs ${statusDef.badgeClass}`}>
                        {statusDef.label}
                      </span>
                    </div>
                  </div>

                  {/* Card metadata content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.time} น.
                        </span>
                      </div>

                      {item.locationTag && (
                        <p className="text-xs font-bold text-slate-800 mb-1">
                          {item.locationTag}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.notes || 'ไม่มีโน้ตเพิ่มเติม'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <button
                        onClick={() => setPreviewModalRecord(item)}
                        className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>พรีวิวขยาย</span>
                      </button>

                      <button
                        onClick={() => onDeleteRecord(item.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="ลบภาพนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Large Image Preview Modal */}
      {previewModalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>พรีวิวรูปถ่ายแผลผ่าตัด</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    previewModalRecord.status === 'healthy' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : previewModalRecord.status === 'monitor'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {statusOptions.find(s => s.key === previewModalRecord.status)?.label}
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  บันทึกเมื่อ {previewModalRecord.date} เวลา {previewModalRecord.time} น. • {previewModalRecord.locationTag}
                </p>
              </div>

              <button
                onClick={() => setPreviewModalRecord(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image Display */}
            <div className="relative bg-black flex-1 overflow-auto flex items-center justify-center min-h-[300px] max-h-[55vh]">
              <img
                src={previewModalRecord.imageUrl}
                alt="Large wound preview"
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Details & Notes */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="mb-3">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  รายละเอียดและโน้ตที่บันทึกไว้:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {previewModalRecord.notes || 'ไม่ได้ระบุโน้ตเพิ่มเติม'}
                </p>
              </div>

              {previewModalRecord.status === 'risk' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 mb-3 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">สถานะแผลอยู่ในเกณฑ์เสี่ยง:</p>
                    <p>หากมีอาการแดงลาม บวมตึง มีหนอง หรือมีไข้ กรุณาติดต่อสายด่วน 1719 เพื่อรับคำปรึกษาจากทีมแพทย์โดยตรง</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    onDeleteRecord(previewModalRecord.id);
                    setPreviewModalRecord(null);
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1 font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบภาพนี้</span>
                </button>

                <button
                  onClick={() => setPreviewModalRecord(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  ปิดหน้าต่างพรีวิว
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
