import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, Icon } from '@/components/ui';
import { appRoutes } from '@/utils/navigation';

/**
 * UpdateScore Screen
 *
 * Match score update with photo upload option.
 */
const UpdateScore: React.FC = () => {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const [homeScore, setHomeScore] = useState(3);
  const [awayScore, setAwayScore] = useState(1);

  // Mock images for the preview UI
  const [images, setImages] = useState([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9Ns4MA64Fnc8Vke3awKivvU4LqvEgVWMBQCuI0C8gVvDROVIMsYR9JP17oh9jGvYoUXqRJTmmm8F1pRY_pbFhBJ3RVUdz7cyvkSefPGh7gY--1T7TGY64u7yqPjTH92IvklbdiudT8pL6OzfzOWFXjPmMH0zqGj9V7BTRjpQk9OGQdvWCVbg3rzSgl77SvzFxl6fBEoLqpKbYD8COWiRUCd8vK07Q9WeWVFCTH2E4IRqmuNKBgZn1TVXJ369CZnwYDXFapEHoKos',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQl5XVDrioHKHxyH9m3AJNhIpcTo1lH1i6tzv83AcOAOPiQWhrYtiIhdvswszL6YUQDRtbDsUHjrlwA472jAvUV_imlLd0GFbRltCudayRqRCAqhs_NPz8FMr3wRMhqBlCzJOdHcyRMa9hvUIOTAPHDWitxwwyX0HskkwI0z8eigZKcJAusH0WpJzjWoDeO-O8Z2Zqq9Ql4T3qfw-EDiqyGnb1kPFWFutE7HCcgLVoSKsYl-Q6sWkDwuajBqR8NBAm98ox1Kmmtnmk'
  ]);

  const handleScoreChange = (team: 'home' | 'away', delta: number) => {
    if (team === 'home') {
      setHomeScore(Math.max(0, homeScore + delta));
    } else {
      setAwayScore(Math.max(0, awayScore + delta));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-white pb-32">
      <Header title="Cập nhật kết quả" onBack={() => navigate(-1)} />

      <main className="flex-1 w-full max-w-md mx-auto p-4 space-y-6">
        {/* Match Versus Card */}
        <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/10 p-6">
          {/* Decorative gradient behind */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>

          <div className="relative flex items-center justify-between gap-2">
            {/* Team A */}
            <div className="flex flex-col items-center justify-start w-1/3 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-white/10 p-1 mb-3 ring-2 ring-primary/20 overflow-hidden relative">
                <img alt="FC Chim Ưng Logo" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3tnQmrRGUX0ePUvqff6cq3_qZlRcT9SgkJSctA9HjBiZFoz2VWi7EnZvIcpA6rk2HMQtxKD0X9ZDdGvoImdgG57MuaLBndlzUg80UgeT1fGkKD9yD5RgOpEP5AXROB_TGgEI58htik1xtTneBs8BC3WEDKJmTe2AvfxoYSi2W5mWiROYvMJECYNexJsVhAnCVA_ZsqK-PSKyPf8ZmPu4IR9Pyqs2hFb6XsX6R1e8sTXQ6_tMyW-i2LZ0LVac2ARcAokFkp4qSwbT5"/>
              </div>
              <h2 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">FC Chim Ưng</h2>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center justify-center w-1/6">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">VS</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Hôm nay</span>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center justify-start w-1/3 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-white/10 p-1 mb-3 ring-2 ring-white/10 overflow-hidden relative">
                <img alt="FC Báo Đen Logo" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAInradef2yFx63hNPX8ntut-VJf0uPlGE1jGX44ISB2hv-WZqUhd8DIKSTvCiz13km70T4SfnsBVh6e5VYkataCPt1arbsCZ8TlorYx1nkXzkmEe0uC7GYK0VyG-55HRlP7QUOpXn0R8fiYibmgYUAJ2IOEOrDxkOlCX2n5Tsv9aLBfb9MgaEf6d5b3DleQTdymi6C9HFbJQgrsscWXAWf86yWg8DNeIc3z1SpaZslcaFFiKg8KMITBVb1mPr1qrabijyJH92D8BoB"/>
              </div>
              <h2 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2">FC Báo Đen</h2>
            </div>
          </div>
        </section>

        {/* Score Inputs (Hero Section) */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Tỷ số</h3>
          <div className="flex items-center justify-between gap-4">
            {/* Score A */}
            <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 flex flex-col items-center gap-3 ring-1 ring-black/5 dark:ring-white/5 shadow-sm">
              <div className="flex items-center gap-3 w-full justify-between">
                <button
                  onClick={() => handleScoreChange('home', -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary/20 hover:text-primary transition-colors active:scale-95"
                >
                  <Icon name="remove" className="text-lg" />
                </button>
                <button
                  onClick={() => handleScoreChange('home', 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary/20 hover:text-primary transition-colors active:scale-95"
                >
                  <Icon name="add" className="text-lg" />
                </button>
              </div>
              <input
                className="w-full bg-transparent text-center text-6xl font-bold text-slate-800 dark:text-white border-none focus:ring-0 p-0 leading-none placeholder-gray-700 dark:placeholder-gray-600"
                placeholder="0"
                type="number"
                value={homeScore}
                readOnly
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Chim Ưng</span>
            </div>

            <div className="text-2xl font-bold text-gray-300 dark:text-gray-600 pb-6">:</div>

            {/* Score B */}
            <div className="flex-1 bg-white dark:bg-surface-dark rounded-2xl p-4 flex flex-col items-center gap-3 ring-1 ring-black/5 dark:ring-white/5 shadow-sm">
              <div className="flex items-center gap-3 w-full justify-between">
                <button
                  onClick={() => handleScoreChange('away', -1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary/20 hover:text-primary transition-colors active:scale-95"
                >
                  <Icon name="remove" className="text-lg" />
                </button>
                <button
                  onClick={() => handleScoreChange('away', 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-primary/20 hover:text-primary transition-colors active:scale-95"
                >
                  <Icon name="add" className="text-lg" />
                </button>
              </div>
              <input
                className="w-full bg-transparent text-center text-6xl font-bold text-slate-800 dark:text-white border-none focus:ring-0 p-0 leading-none placeholder-gray-700 dark:placeholder-gray-600"
                placeholder="0"
                type="number"
                value={awayScore}
                readOnly
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Báo Đen</span>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="grid gap-6">
          {/* Notes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-gray-300" htmlFor="notes">
              <Icon name="edit_note" className="text-primary text-lg" />
              Ghi chú trận đấu
            </label>
            <textarea
              className="w-full rounded-xl bg-white dark:bg-surface-dark border-0 ring-1 ring-gray-200 dark:ring-white/10 focus:ring-2 focus:ring-primary text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none p-4 text-base shadow-sm"
              id="notes"
              placeholder="Nhập tên cầu thủ ghi bàn, thẻ phạt..."
              rows={3}
            ></textarea>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Icon name="image" className="text-primary text-lg" />
                Hình ảnh trận đấu
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">Tối đa 5 ảnh</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {/* Upload Button */}
              <button className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group">
                <Icon name="add_a_photo" className="text-2xl mb-1 group-hover:scale-110 transition-transform" />
              </button>

              {/* Preview Images */}
              {images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl bg-white dark:bg-surface-dark relative group overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }}></div>
                  <button className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="close" className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Footer CTA */}
      <div className="fixed bottom-0 left-0 w-full z-40">
        {/* Gradient fade to content */}
        <div className="h-8 bg-gradient-to-b from-transparent to-background-light dark:to-background-dark pointer-events-none"></div>
        <div className="bg-background-light dark:bg-background-dark p-4 pb-8 pt-2">
          <button
            onClick={() => navigate(appRoutes.matchSchedule)}
            className="w-full bg-primary hover:bg-primary-dark text-white dark:text-[#102219] font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Icon name="save" />
            Lưu kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateScore;
