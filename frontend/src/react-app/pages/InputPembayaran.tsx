import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Search, 
  Wallet, 
  CreditCard, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  X
} from 'lucide-react';

// Institution settings for Input Pembayaran
const INSTITUTION_SETTINGS = {
  useNIS: false // Can be configured per institution
};

interface Student {
  id: string;
  name: string;
  nis?: string; // Optional depending on institution
  category: 'Menetap' | 'Sekolah';
  class: string;
  monthlyFee: number;
}

interface PaymentData {
  studentId: string;
  amount: number;
  method: 'Kas' | 'Transfer' | 'QRIS';
  type: 'SPP' | 'Pembangunan 1' | 'Pembangunan 2' | 'Pembangunan 3' | 'Catering' | 'Seragam' | 'Buku' | 'Manual';
  customTypeName?: string;
  month?: number;
  date: string;
  notes?: string;
}

const SAMPLE_STUDENTS: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: `Santri ${i + 1}`,
  ...(INSTITUTION_SETTINGS.useNIS && { nis: `NIS${String(i + 1).padStart(4, '0')}` }),
  category: Math.random() > 0.5 ? 'Menetap' : 'Sekolah',
  class: ['Tgk Ibnu', 'Tgk Ahmad', 'Tgk Yusuf', 'Tgk Ali'][Math.floor(Math.random() * 4)],
  monthlyFee: 250000
}));

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const PAYMENT_METHODS = [
  { id: 'Kas', name: 'Kas', icon: Wallet, color: 'emerald' },
  { id: 'Transfer', name: 'Transfer Bank', icon: CreditCard, color: 'blue' },
  { id: 'QRIS', name: 'QRIS', icon: Smartphone, color: 'purple' }
];

const PAYMENT_TYPES = [
  { id: 'SPP', name: 'SPP Bulanan', hasMonth: true },
  { id: 'Pembangunan 1', name: 'Uang Pembangunan 1', hasMonth: false },
  { id: 'Pembangunan 2', name: 'Uang Pembangunan 2', hasMonth: false },
  { id: 'Pembangunan 3', name: 'Uang Pembangunan 3', hasMonth: false },
  { id: 'Catering', name: 'Uang Catering', hasMonth: false },
  { id: 'Seragam', name: 'Uang Seragam', hasMonth: false },
  { id: 'Buku', name: 'Uang Buku', hasMonth: false },
  { id: 'Manual', name: 'Lainnya (Manual)', hasMonth: false, isManual: true }
];

export default function InputPembayaran() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    studentId: '',
    amount: 0,
    method: 'Kas',
    type: 'SPP',
    customTypeName: '',
    month: new Date().getMonth() + 1,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Filter students based on search
  const filteredStudents = SAMPLE_STUDENTS.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (INSTITUTION_SETTINGS.useNIS && student.nis?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Update amount based on payment type and student
  useEffect(() => {
    if (selectedStudent && paymentData.type === 'SPP') {
      setPaymentData(prev => ({ ...prev, amount: selectedStudent.monthlyFee }));
    }
  }, [selectedStudent, paymentData.type]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setPaymentData(prev => ({ 
      ...prev, 
      studentId: student.id,
      amount: prev.type === 'SPP' ? student.monthlyFee : prev.amount
    }));
    setShowStudentPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setPaymentData({
      studentId: '',
      amount: 0,
      method: 'Kas',
      type: 'SPP',
      month: new Date().getMonth() + 1,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div>
                <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Input Pembayaran
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Catat pembayaran SPP dan uang tahap santri
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Selection */}
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Pilih Santri
              </h3>
              
              {selectedStudent ? (
                <div className="flex items-center justify-between p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{selectedStudent.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {INSTITUTION_SETTINGS.useNIS && selectedStudent.nis && `${selectedStudent.nis} • `}
                      {selectedStudent.class} • {selectedStudent.category}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStudentPicker(true)}
                    className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                  >
                    Ganti
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowStudentPicker(true)}
                  className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
                >
                  <div className="text-center">
                    <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Pilih Santri</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">Klik untuk mencari dan memilih santri</p>
                  </div>
                </button>
              )}
            </div>

            {/* Payment Details Form */}
            {selectedStudent && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Type & Month */}
                <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Detail Pembayaran
                  </h3>
                  
                  {/* Payment Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Jenis Pembayaran
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {PAYMENT_TYPES.map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setPaymentData(prev => ({ ...prev, type: type.id as any, customTypeName: type.isManual ? '' : prev.customTypeName }))}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            paymentData.type === type.id
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                              : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                          }`}
                        >
                          <div className="text-sm font-medium">{type.name}</div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Type Name for Manual */}
                    {paymentData.type === 'Manual' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Nama Pembayaran
                        </label>
                        <input
                          type="text"
                          value={paymentData.customTypeName}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, customTypeName: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                          placeholder="Contoh: Uang Kegiatan, Uang Asrama, dll"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Month Selection (for SPP only) */}
                  {paymentData.type === 'SPP' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Bulan
                      </label>
                      <select
                        value={paymentData.month}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, month: Number(e.target.value) }))}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                        required
                      >
                        {MONTHS.map((month, index) => (
                          <option key={index} value={index + 1}>{month}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nominal
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">Rp</span>
                      <input
                        type="number"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tanggal Bayar
                    </label>
                    <input
                      type="date"
                      value={paymentData.date}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {PAYMENT_METHODS.map(method => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentData(prev => ({ ...prev, method: method.id as any }))}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              paymentData.method === method.id
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                            }`}
                          >
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${
                              paymentData.method === method.id 
                                ? 'text-brand-600 dark:text-brand-400' 
                                : 'text-slate-400'
                            }`} />
                            <div className={`text-sm font-medium ${
                              paymentData.method === method.id 
                                ? 'text-brand-700 dark:text-brand-400' 
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {method.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent resize-none"
                      placeholder="Tambahkan catatan jika diperlukan..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedStudent}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-brand text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-180 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Simpan Pembayaran</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Summary & Recent Payments */}
          <div className="space-y-6">
            {/* Payment Summary */}
            {selectedStudent && (
              <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Ringkasan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Santri:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{selectedStudent.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Jenis:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {paymentData.type === 'Manual' ? paymentData.customTypeName || 'Manual' : paymentData.type}
                    </span>
                  </div>
                  {paymentData.type === 'SPP' && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Bulan:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{MONTHS[paymentData.month! - 1]}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Metode:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{paymentData.method}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-dark-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Total:</span>
                      <span className="font-bold text-lg text-brand-600 dark:text-brand-400">
                        {formatCurrency(paymentData.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Payments */}
            <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Pembayaran Terbaru
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Ahmad Fauzi</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">SPP Oktober - Rp 250,000</div>
                  </div>
                  <span className="text-xs text-slate-500">5 min lalu</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Siti Aisyah</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Uang Pembangunan 1 - Rp 500,000</div>
                  </div>
                  <span className="text-xs text-slate-500">1 jam lalu</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Fatimah Zahra</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Uang Catering - Rp 150,000</div>
                  </div>
                  <span className="text-xs text-slate-500">1 jam lalu</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Muhammad Ali</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">SPP Oktober - Rp 250,000</div>
                  </div>
                  <span className="text-xs text-slate-500">2 jam lalu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Picker Modal */}
      {showStudentPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Pilih Santri
                </h3>
                <button
                  onClick={() => setShowStudentPicker(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={INSTITUTION_SETTINGS.useNIS ? "Cari nama atau NIS..." : "Cari nama santri..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Student List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <div className="p-4 space-y-2">
                  {filteredStudents.slice(0, 20).map(student => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className="w-full text-left p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{student.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {INSTITUTION_SETTINGS.useNIS && student.nis && `${student.nis} • `}
                            {student.class} • {student.category}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-brand-600 dark:text-brand-400">
                          {formatCurrency(student.monthlyFee)}/bulan
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredStudents.length > 20 && (
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-2">
                      dan {filteredStudents.length - 20} santri lainnya...
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Tidak ada santri ditemukan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Pembayaran Berhasil Disimpan!
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Pembayaran {selectedStudent?.name} telah tercatat dalam sistem.
            </p>
            <div className="text-2xl font-bold text-emerald-600 mb-4">
              {formatCurrency(paymentData.amount)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
