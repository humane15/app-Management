import { useState, useMemo } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload,
  Check, 
  X,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

// Institution settings - can be configured per institution
const INSTITUTION_SETTINGS = {
  // How many pembangunan stages this institution uses (1-3)
  pembangunanStages: 2,
  // Whether NIS is required/used by this institution
  useNIS: false,
  // Which other fees are applicable
  enabledFees: {
    catering: true,
    seragam: true,
    buku: false,
    lainnya: true
  }
};

// Sample data structure
interface Student {
  id: string;
  name: string;
  nis: string;
  category: 'Menetap' | 'Sekolah';
  class: string;
  monthlyPayments: MonthlyPayment[];
  pembangunan1: number;
  pembangunan2: number;
  pembangunan3: number;
  catering: number;
  seragam: number;
  buku: number;
  lainnya: number;
  totalPembangunan: number;
  totalSPP: number;
}

interface MonthlyPayment {
  month: number; // 1-12
  status: 'PAID' | 'UNPAID'; // Simplified to only 2 states
  amount?: number;
  paidDate?: string;
  method?: 'Kas' | 'Transfer' | 'QRIS';
  officer?: string;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

const SAMPLE_STUDENTS: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: `Santri ${i + 1}`,
  nis: `NIS${String(i + 1).padStart(4, '0')}`,
  category: (Math.random() > 0.5 ? 'Menetap' : 'Sekolah') as 'Menetap' | 'Sekolah',
  class: ['Tgk Ibnu', 'Tgk Ahmad', 'Tgk Yusuf', 'Tgk Ali'][Math.floor(Math.random() * 4)],
  monthlyPayments: Array.from({ length: 12 }, (_, monthIndex) => ({
    month: monthIndex + 1,
    status: (Math.random() > 0.3 ? 'PAID' : 'UNPAID') as 'PAID' | 'UNPAID',
    amount: Math.random() > 0.3 ? 250000 : undefined,
    paidDate: Math.random() > 0.3 ? `2024-${String(monthIndex + 1).padStart(2, '0')}-15` : undefined,
    method: (['Kas', 'Transfer', 'QRIS'][Math.floor(Math.random() * 3)]) as 'Kas' | 'Transfer' | 'QRIS',
    officer: 'Admin'
  })),
  pembangunan1: Math.random() > 0.5 ? 500000 : 0,
  pembangunan2: Math.random() > 0.7 ? 750000 : 0,
  pembangunan3: Math.random() > 0.8 ? 300000 : 0,
  catering: Math.random() > 0.6 ? 150000 : 0,
  seragam: Math.random() > 0.8 ? 200000 : 0,
  buku: Math.random() > 0.9 ? 100000 : 0,
  lainnya: Math.random() > 0.9 ? 50000 : 0,
  totalPembangunan: 0,
  totalSPP: 0
})).map(student => ({
  ...student,
  totalPembangunan: student.pembangunan1 + student.pembangunan2 + student.pembangunan3 + student.catering + student.seragam + student.buku + student.lainnya,
  totalSPP: student.monthlyPayments.filter(p => p.status === 'PAID').length * 250000
}));

export default function RekapSetoran() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{studentId: string, month: number} | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Get unique classes
  const availableClasses = useMemo(() => {
    return Array.from(new Set(SAMPLE_STUDENTS.map(s => s.class)));
  }, []);

  // Filtered data
  const filteredStudents = useMemo(() => {
    return SAMPLE_STUDENTS.filter(student => {
      const matchesClass = selectedClasses.length === 0 || selectedClasses.includes(student.class);
      const matchesCategory = !selectedCategory || student.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (INSTITUTION_SETTINGS.useNIS && student.nis?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesClass && matchesCategory && matchesSearch;
    });
  }, [selectedClasses, selectedCategory, searchQuery]);

  // Calculate dynamic pembangunan columns
  const pembangunanColumns = useMemo(() => {
    const columns = [];
    for (let i = 1; i <= INSTITUTION_SETTINGS.pembangunanStages; i++) {
      columns.push({
        key: `pembangunan${i}`,
        label: `Pmb ${i}`,
        accessor: (student: Student) => student[`pembangunan${i}` as keyof Student] as number
      });
    }
    return columns;
  }, []);

  // Calculate dynamic other fee columns
  const otherFeeColumns = useMemo(() => {
    const columns = [];
    if (INSTITUTION_SETTINGS.enabledFees.catering) {
      columns.push({
        key: 'catering',
        label: 'Catering',
        accessor: (student: Student) => student.catering
      });
    }
    if (INSTITUTION_SETTINGS.enabledFees.seragam) {
      columns.push({
        key: 'seragam',
        label: 'Seragam',
        accessor: (student: Student) => student.seragam
      });
    }
    if (INSTITUTION_SETTINGS.enabledFees.buku) {
      columns.push({
        key: 'buku',
        label: 'Buku',
        accessor: (student: Student) => student.buku
      });
    }
    if (INSTITUTION_SETTINGS.enabledFees.lainnya) {
      columns.push({
        key: 'lainnya',
        label: 'Lainnya',
        accessor: (student: Student) => student.lainnya
      });
    }
    return columns;
  }, []);

  const allFeeColumns = [...pembangunanColumns, ...otherFeeColumns];

  // Calculate totals
  const totals = useMemo(() => {
    const monthlyTotals = MONTHS.map((_, monthIndex) => {
      const paid = filteredStudents.filter(s => 
        s.monthlyPayments[monthIndex]?.status === 'PAID'
      ).length;
      const unpaid = filteredStudents.filter(s => 
        s.monthlyPayments[monthIndex]?.status === 'UNPAID'
      ).length;
      const amount = filteredStudents.reduce((sum, s) => 
        sum + (s.monthlyPayments[monthIndex]?.amount || 0), 0
      );
      return { paid, unpaid, amount };
    });

    const totalSPP = filteredStudents.reduce((sum, s) => sum + s.totalSPP, 0);
    const totalPembangunan = filteredStudents.reduce((sum, s) => sum + s.totalPembangunan, 0);

    return { monthlyTotals, totalSPP, totalPembangunan };
  }, [filteredStudents]);

  const getStatusIcon = (status: MonthlyPayment['status']) => {
    switch (status) {
      case 'PAID':
        return <Check className="w-4 h-4 text-emerald-600" />;
      case 'UNPAID':
        return <X className="w-4 h-4 text-rose-600" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const clearFilters = () => {
    setSelectedClasses([]);
    setSelectedCategory('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedClasses.length > 0 || selectedCategory || searchQuery;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div>
                <h1 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Rekap Setoran SPP
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {filteredStudents.length} santri • Tahun {selectedYear}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              <button className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Impor CSV</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-brand rounded-lg hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-180 hover:-translate-y-0.5">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Ekspor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors"
              />
            </div>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-colors"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                hasActiveFilters 
                  ? 'text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800'
                  : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-bg border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-brand-600 text-white rounded-full">
                  {(selectedClasses.length > 0 ? 1 : 0) + (selectedCategory ? 1 : 0) + (searchQuery ? 1 : 0)}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-dark-bg rounded-lg border border-slate-200 dark:border-dark-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Kelas
                  </label>
                  <div className="space-y-2">
                    {availableClasses.map(className => (
                      <label key={className} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(className)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedClasses([...selectedClasses, className]);
                            } else {
                              setSelectedClasses(selectedClasses.filter(c => c !== className));
                            }
                          }}
                          className="rounded border-slate-300 text-brand-600 focus:ring-brand-600"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{className}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-600 focus:border-transparent"
                  >
                    <option value="">Semua Kategori</option>
                    <option value="Menetap">Menetap</option>
                    <option value="Sekolah">Sekolah</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedClasses.map(className => (
                <span key={className} className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-full">
                  Kelas: {className}
                  <button
                    onClick={() => setSelectedClasses(selectedClasses.filter(c => c !== className))}
                    className="hover:text-brand-900 dark:hover:text-brand-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-full">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="hover:text-brand-900 dark:hover:text-brand-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-slate-200 dark:border-dark-border">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-6 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Status Pembayaran:</span>
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-600 dark:text-slate-400">Lunas</span>
            </div>
            <div className="flex items-center space-x-1">
              <X className="w-4 h-4 text-rose-600" />
              <span className="text-slate-600 dark:text-slate-400">Belum Lunas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          <table className="w-full">
            {/* Header */}
            <thead className="bg-slate-100 dark:bg-dark-border sticky top-0 z-40">
              {/* Main Header Row */}
              <tr>
                <th rowSpan={2} className="sticky left-0 z-50 bg-slate-100 dark:bg-dark-border px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700 min-w-[200px]">
                  Nama Santri
                </th>
                <th rowSpan={2} className="px-4 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                  Kategori
                </th>
                <th rowSpan={2} className="px-4 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                  Kelas
                </th>
                <th colSpan={12} className="px-4 py-2 text-center text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                  Bulan Setoran SPP
                </th>
                <th colSpan={allFeeColumns.length + 1} className="px-4 py-2 text-center text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                  Uang Pembangunan & Lainnya
                </th>
                <th rowSpan={2} className="px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Total SPP
                </th>
              </tr>
              
              {/* Sub Header Row */}
              <tr>
                {MONTHS.map(month => (
                  <th key={month} className="px-2 py-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 min-w-[50px]">
                    {month}
                  </th>
                ))}
                
                {/* Dynamic Fee Columns */}
                {allFeeColumns.map(column => (
                  <th key={column.key} className="px-3 py-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                    {column.label}
                  </th>
                ))}
                
                <th className="px-3 py-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">
                  Total
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-white dark:bg-dark-surface divide-y divide-slate-200 dark:divide-dark-border">
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-dark-surface' : 'bg-slate-50/50 dark:bg-slate-900/20'
                  } ${selectedStudent === student.id ? 'ring-2 ring-brand-600' : ''}`}
                  onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                >
                  {/* Name (Frozen) */}
                  <td className="sticky left-0 z-40 bg-inherit px-6 py-4 border-r border-slate-200 dark:border-slate-700">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{student.name}</div>
                  </td>
                  
                  {/* Category */}
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-slate-700">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      student.category === 'Menetap' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400'
                    }`}>
                      {student.category}
                    </span>
                  </td>
                  
                  {/* Class */}
                  <td className="px-4 py-4 border-r border-slate-200 dark:border-slate-700">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                      {student.class}
                    </span>
                  </td>
                  
                  {/* Monthly Payments */}
                  {student.monthlyPayments.map((payment, monthIndex) => (
                    <td 
                      key={monthIndex}
                      className="px-2 py-4 text-center border-r border-slate-200 dark:border-slate-700 relative cursor-pointer"
                      onMouseEnter={() => setHoveredCell({studentId: student.id, month: monthIndex + 1})}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {getStatusIcon(payment.status)}
                      
                      {/* Tooltip */}
                      {hoveredCell?.studentId === student.id && hoveredCell?.month === monthIndex + 1 && payment.status === 'PAID' && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
                          <div>Nominal: {formatCurrency(payment.amount || 0)}</div>
                          <div>Tanggal: {payment.paidDate}</div>
                          <div>Metode: {payment.method}</div>
                          <div>Petugas: {payment.officer}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                        </div>
                      )}
                    </td>
                  ))}
                  
                  {/* Dynamic Fee Columns */}
                  {allFeeColumns.map(column => (
                    <td key={column.key} className="px-3 py-4 text-right text-sm text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                      {column.accessor(student) > 0 ? formatCurrency(column.accessor(student)) : '-'}
                    </td>
                  ))}
                  
                  {/* Total Pembangunan */}
                  <td className="px-3 py-4 text-right text-sm font-medium text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                    {student.totalPembangunan > 0 ? formatCurrency(student.totalPembangunan) : '-'}
                  </td>
                  
                  {/* Total SPP */}
                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(student.totalSPP)}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Footer */}
            <tfoot className="bg-slate-100 dark:bg-dark-border sticky bottom-0">
              <tr>
                <td colSpan={3} className="sticky left-0 z-50 bg-slate-100 dark:bg-dark-border px-6 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                  Total ({filteredStudents.length} santri)
                </td>
                {totals.monthlyTotals.map((monthTotal, index) => (
                  <td key={index} className="px-2 py-4 text-center text-xs border-r border-slate-200 dark:border-slate-700">
                    <div className="text-emerald-600 font-medium">{monthTotal.paid}</div>
                    <div className="text-rose-600">{monthTotal.unpaid}</div>
                  </td>
                ))}
                <td colSpan={allFeeColumns.length + 1} className="px-3 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-700">
                  {formatCurrency(totals.totalPembangunan)}
                </td>
                <td className="px-4 py-4 text-right text-sm font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(totals.totalSPP)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
