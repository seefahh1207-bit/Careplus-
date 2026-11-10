import React, { useState } from 'react';
import { PainRecord } from '../types';
import { PainScaleFace } from './PainScaleFace';
import { 
  Activity, 
  TrendingDown, 
  PlusCircle, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Pill,
  CheckCircle2
} from 'lucide-react';

interface PainTrackerProps {
  records: PainRecord[];
  onAddRecord: (record: Omit<PainRecord, 'id'>) => void;
  onDeleteRecord: (id: string) => void;
}

export const PainTracker: React.FC<PainTrackerProps> = ({
  records,
  onAddRecord,
  onDeleteRecord
}) => {
  const [level, setLevel] = useState<number>(3);
  const [location, setLocation] = useState<string>('บริเวณรอยแผลผ่าตัดหน้าท้อง');
  const [characteristics, setCharacteristics] = useState<string>('ปวดตึง ตื้อๆ');
  const [medicationTaken, setMedicationTaken] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showAddSuccess, setShowAddSuccess] = useState<boolean>(false);

  // Pain scale definitions (Wong-Baker & NRS)
  const painDescriptions: { [key: number]: { label: string; face: string; color: string; bg: string; tip: string } } = {
    0: { label: 'ไม่ปวดเลย (No Pain)', face: '😊', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-300', tip: 'สบายตัว สบายดีมาก สามารถทำกิจกรรมเบาๆ ได้คล่องแคล่ว' },
    1: { label: 'ปวดน้อยมาก', face: '🙂', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', tip: 'รู้สึกตึงแผลเล็กน้อย ไม่รบกวนการใช้ชีวิต' },
    2: { label: 'ปวดเล็กน้อย (Mild)', face: '🙂', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', tip: 'รู้สึกตึงหรือเจ็บแปล๊บเป็นพักๆ เวลาเปลี่ยนท่าทาง' },
    3: { label: 'ปวดทนได้', face: '😐', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200', tip: 'เริ่มรู้สึกรำคาญใจ แต่ยังลุกเดินและทำกิจวัตรได้' },
    4: { label: 'ปวดปานกลาง (Moderate)', face: '🙁', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', tip: 'รบกวนสมาธิและการนอนหลับ แนะนำพักผ่อนและทานยาตามแพทย์สั่ง' },
    5: { label: 'ปวดค่อนข้างมาก', face: '😟', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300', tip: 'ขยับตัวลำบาก ไม่อยากลุกเดิน ควรรับประทานยาแก้ปวด' },
    6: { label: 'ปวดมาก (Mod-Severe)', face: '😣', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-300', tip: 'เคลื่อนไหวร่างกายได้จำกัด ปวดลึกๆ ในช่องท้อง' },
    7: { label: 'ปวดรุนแรง (Severe)', face: '😢', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300', tip: 'ปวดจนนอนไม่หลับ หรือสะดุ้งตื่น ทานยาแล้วยังไม่ค่อยทุเลา' },
    8: { label: 'ปวดรุนแรงมาก', face: '😭', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-400', tip: 'ขยับตัวแทบไม่ได้ ปวดตลอดเวลา หายใจสั้นถี่' },
    9: { label: 'ปวดทรมานสุดๆ', face: '😫', color: 'text-rose-800', bg: 'bg-rose-100 border-rose-500', tip: 'ปวดจนควบคุมตนเองลำบาก ควรโทรปรึกษาแพทย์ทันที' },
    10: { label: 'ปวดที่สุดในชีวิต (Worst Possible)', face: '😱', color: 'text-rose-950', bg: 'bg-rose-100 border-rose-600', tip: 'ปวดเฉียบพลัน รุนแรงผิดปกติ แนะนำกดปุ่ม SOS 1719 ทันที' }
  };

  const currentDesc = painDescriptions[level] || painDescriptions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    onAddRecord({
      date: dateStr,
      time: timeStr,
      level,
      location,
      characteristics,
      medicationTaken: medicationTaken || 'ไม่ได้รับประทานยาแก้ปวด',
      notes
    });

    setNotes('');
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2000);
  };

  // Sort records by date & time ascending for graph
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
  });

  const latestRecord = sortedRecords[sortedRecords.length - 1];
  const firstRecord = sortedRecords[0];
  const painDiff = firstRecord && latestRecord ? firstRecord.level - latestRecord.level : 0;

  // Render SVG Chart for Pain Trend
  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 45;
  const paddingY = 25;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  const points = sortedRecords.map((rec, idx) => {
    const x = sortedRecords.length === 1 
      ? paddingX + graphWidth / 2 
      : paddingX + (idx / (sortedRecords.length - 1)) * graphWidth;
    // level 0 is at bottom (paddingY + graphHeight), level 10 is at top (paddingY)
    const y = paddingY + graphHeight - (rec.level / 10) * graphHeight;
    return { x, y, ...rec };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Careplus+</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                บันทึกระดับความปวดในแต่ละวัน (Pain Tracker) 🩺
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ประเมินและลงบันทึกระดับความปวดเพื่อประกอบการประเมินแผลและการทานยาแก้ปวด
            </p>
          </div>

          {latestRecord && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500">ระดับล่าสุด:</span>
              <span className="text-lg font-black text-teal-700">
                {latestRecord.level} / 10
              </span>
              <PainScaleFace level={latestRecord.level} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Interactive Trend Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              กราฟเปรียบเทียบแนวโน้มความเจ็บปวดในแต่ละวัน
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {records.length} ครั้งที่บันทึก
          </span>
        </div>

        {records.length > 0 ? (
          <div>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[420px]">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 sm:h-52 overflow-visible">
                  {/* Background horizontal guide zones */}
                  {/* Zone 0-3 (Mild/Safe: Green) */}
                  <rect 
                    x={paddingX} 
                    y={paddingY + graphHeight * 0.7} 
                    width={graphWidth} 
                    height={graphHeight * 0.3} 
                    fill="#10b981" 
                    fillOpacity="0.07" 
                  />
                  {/* Zone 4-6 (Moderate: Amber) */}
                  <rect 
                    x={paddingX} 
                    y={paddingY + graphHeight * 0.4} 
                    width={graphWidth} 
                    height={graphHeight * 0.3} 
                    fill="#f59e0b" 
                    fillOpacity="0.07" 
                  />
                  {/* Zone 7-10 (Severe: Rose) */}
                  <rect 
                    x={paddingX} 
                    y={paddingY} 
                    width={graphWidth} 
                    height={graphHeight * 0.4} 
                    fill="#ef4444" 
                    fillOpacity="0.07" 
                  />

                  {/* Horizontal grid lines */}
                  {[0, 2, 4, 6, 8, 10].map(val => {
                    const y = paddingY + graphHeight - (val / 10) * graphHeight;
                    return (
                      <g key={val}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={paddingX + graphWidth}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeDasharray={val === 0 ? 'none' : '3,3'}
                        />
                        <text
                          x={paddingX - 8}
                          y={y + 3.5}
                          textAnchor="end"
                          className="text-[10px] fill-slate-600 font-mono"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Gradient area under line */}
                  <defs>
                    <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {points.length > 1 && (
                    <polygon
                      points={`${points[0].x},${paddingY + graphHeight} ${polylineStr} ${points[points.length - 1].x},${paddingY + graphHeight}`}
                      fill="url(#painGradient)"
                    />
                  )}

                  {/* Connecting Line */}
                  {points.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineStr}
                    />
                  )}

                  {/* Data Points */}
                  {points.map((pt, idx) => (
                    <g key={idx} className="cursor-pointer group">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="6"
                        className={
                          pt.level <= 3 
                            ? 'fill-emerald-500 stroke-white stroke-2' 
                            : pt.level <= 6 
                            ? 'fill-amber-500 stroke-white stroke-2' 
                            : 'fill-rose-500 stroke-white stroke-2'
                        }
                      />
                      {/* Score label above point */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-800"
                      >
                        {pt.level}
                      </text>
                      {/* Date label at bottom */}
                      <text
                        x={pt.x}
                        y={paddingY + graphHeight + 16}
                        textAnchor="middle"
                        className="text-[9px] fill-slate-600 font-medium"
                      >
                        {pt.date.slice(5)} {pt.time}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Trajectory insight analysis */}
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-teal-100 text-teal-800 shrink-0 mt-0.5">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  การวิเคราะห์แนวโน้ม: {painDiff > 0 ? (
                    <span className="text-emerald-700">อาการปวดลดลง {painDiff} ระดับเมื่อเทียบกับบันทึกแรก</span>
                  ) : painDiff === 0 ? (
                    <span className="text-slate-700">ระดับความเจ็บปวดทรงตัว</span>
                  ) : (
                    <span className="text-amber-700">ระดับความเจ็บปวดเพิ่มขึ้นเล็กน้อย ควรพักผ่อนและสังเกตอาการ</span>
                  )}
                </p>
                <p className="text-slate-500 mt-0.5">
                  เกณฑ์ปลอดภัยทางการแพทย์: อาการปวดแผลผ่าตัดช่องท้องมักจะสูงสุดในช่วง 48-72 ชั่วโมงแรก และจะค่อยๆ ทุเลาลงต่ำกว่าระดับ 3 ภายใน 1-2 สัปดาห์
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">
            ยังไม่มีข้อมูลบันทึกความปวด กรุณาบันทึกข้อมูลด้านล่างเพื่อเริ่มแสดงกราฟ
          </p>
        )}
      </div>

      {/* New Pain Log Entry Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-teal-700" />
          <span>บันทึกประเมินอาการปวดรอบใหม่</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Visual Rating Display */}
          <div className={`p-4 rounded-xl border transition-all ${currentDesc.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <PainScaleFace level={level} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      ระดับ {level} / 10
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/90 border ${currentDesc.color}`}>
                      {currentDesc.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentDesc.tip}
                  </p>
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="mt-4">
              <input
                id="slider-pain-level"
                type="range"
                min="0"
                max="10"
                step="1"
                value={level}
                onChange={e => setLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1 px-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setLevel(v)}
                    className={`hover:font-bold ${level === v ? 'font-bold text-teal-800 scale-125' : ''}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Wong-Baker Faces selector row with Pain Scale Images */}
            <div className="grid grid-cols-6 gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
              {[
                { score: 0, label: '0 ไม่ปวด' },
                { score: 2, label: '2 ปวดนิดๆ' },
                { score: 4, label: '4 ปานกลาง' },
                { score: 6, label: '6 ปวดมาก' },
                { score: 8, label: '8 รุนแรง' },
                { score: 10, label: '10 ทรมาน' }
              ].map(item => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => setLevel(item.score)}
                  className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                    level === item.score 
                      ? 'bg-white shadow-xs font-bold border-2 border-teal-500 scale-105 ring-2 ring-teal-500/20' 
                      : 'hover:bg-white/60 text-slate-600 opacity-80 hover:opacity-100'
                  }`}
                >
                  <PainScaleFace level={item.score} size="sm" />
                  <div className="text-[10px] mt-1 font-semibold">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location & Characteristics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ตำแหน่งที่ปวด
              </label>
              <select
                id="select-pain-location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="บริเวณรอยแผลผ่าตัดหน้าท้อง">บริเวณรอยแผลผ่าตัดหน้าท้อง</option>
                <option value="รอบสะดือ (แผลส่องกล้อง)">รอบสะดือ (แผลส่องกล้อง)</option>
                <option value="ท้องด้านขวาล่าง">ท้องด้านขวาล่าง</option>
                <option value="ท้องด้านขวาบน/ใต้ชายโครง">ท้องด้านขวาบน/ใต้ชายโครง</option>
                <option value="แน่นตึงทั่วบริเวณหน้าท้อง">แน่นตึงทั่วบริเวณหน้าท้อง</option>
                <option value="ปวดสะบักไหล่ (จากแก๊สส่องกล้อง)">ปวดสะบักไหล่ (จากแก๊สส่องกล้อง)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ลักษณะอาการปวด
              </label>
              <select
                id="select-pain-characteristics"
                value={characteristics}
                onChange={e => setCharacteristics(e.target.value)}
                className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden"
              >
                <option value="ปวดตึง ตื้อๆ">ปวดตึง ตื้อๆ</option>
                <option value="ปวดแปล๊บๆ เวลาขยับ">ปวดแปล๊บๆ เวลาขยับ</option>
                <option value="ปวดแสบร้อนที่ผิวหนัง">ปวดแสบร้อนที่ผิวหนัง</option>
                <option value="ปวดบีบเกร็งเป็นพักๆ">ปวดบีบเกร็งเป็นพักๆ</option>
                <option value="ปวดจี๊ดๆ เมื่อไอหรือจาม">ปวดจี๊ดๆ เมื่อไอหรือจาม</option>
              </select>
            </div>
          </div>

          {/* Medication Taken */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>ยาแก้ปวดที่รับประทานในมื้อล่าสุด (ถ้ามี)</span>
            </label>
            <input
              id="input-pain-medication"
              type="text"
              value={medicationTaken}
              onChange={e => setMedicationTaken(e.target.value)}
              placeholder="เช่น พาราเซตามอล 500 มก. 1 เม็ด / ยาแก้ปวดตามสั่งแพทย์"
              className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              บันทึกโน้ตเพิ่มเติม
            </label>
            <textarea
              id="input-pain-notes"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="ระบุกิจกรรมที่ทำตอนที่เริ่มปวด เช่น หลังจากลุกเดิน หรือหลังรับประทานอาหาร..."
              className="w-full text-xs sm:text-sm p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-hidden"
            />
          </div>

          {level >= 7 && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">ข้อควรระวังทางการแพทย์ (ระดับความปวด ≥ 7):</p>
                <p>
                  หากปวดรุนแรงต่อเนื่องแม้รับประทานยาแก้ปวดแล้ว หรือมีอาการท้องแข็งเกร็ง หายใจลำบาก กรุณาติดต่อสายด่วน 1719 รพ.กรุงเทพเชียงใหม่ ทันที
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            {showAddSuccess ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                บันทึกระดับความปวดเรียบร้อยแล้ว!
              </span>
            ) : <span />}

            <button
              id="btn-save-pain-record"
              type="submit"
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>บันทึกข้อมูลระดับความปวด</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Log List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>ประวัติการบันทึกระดับความเจ็บปวดย้อนหลัง</span>
        </h3>

        <div className="space-y-2">
          {records.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">ยังไม่มีประวัติการบันทึก</p>
          ) : (
            [...records].reverse().map(rec => {
              const desc = painDescriptions[rec.level] || painDescriptions[0];
              return (
                <div
                  key={rec.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 flex items-start justify-between gap-3 transition-colors text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-xs">
                      {desc.face}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          ระดับ {rec.level}/10
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${desc.bg}`}>
                          {desc.label}
                        </span>
                        <span className="text-slate-400">
                          {rec.date} เวลา {rec.time} น.
                        </span>
                      </div>

                      <p className="text-slate-700 mt-1">
                        <span className="font-semibold text-slate-800">ตำแหน่ง:</span> {rec.location} • <span className="font-semibold text-slate-800">ลักษณะ:</span> {rec.characteristics}
                      </p>

                      {rec.medicationTaken && (
                        <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                          <Pill className="w-3 h-3 text-slate-400" />
                          <span>ยา: {rec.medicationTaken}</span>
                        </p>
                      )}

                      {rec.notes && (
                        <p className="text-slate-500 italic mt-0.5">
                          "{rec.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteRecord(rec.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="ลบบันทึกนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
