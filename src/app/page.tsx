import { ChatWidget } from '@/components/chat-widget';
import { SectionCard } from '@/components/section-card';

const features = [
  'Trả lời FAQ 24/7 dựa trên knowledge base',
  'Thu lead khi phát hiện ý định mua hàng',
  'Chuyển nhân viên khi khách muốn handoff',
  'Lưu lịch sử chat, lead và cấu hình admin',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10">
        <section className="grid gap-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 px-8 py-10 text-white lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-medium tracking-wide text-slate-200">
              MVP AI Customer Care Agent
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">
              Chatbot AI cho website doanh nghiệp, sẵn để demo và thương mại hóa.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Bản nền này gồm landing page, chat widget, admin mock, API khung, schema dữ liệu,
              Google Sheets flow và tài liệu triển khai MVP.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/admin" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                Mở admin demo
              </a>
              <a href="/api/admin/knowledge" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white">
                Xem API mẫu
              </a>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Giá trị MVP</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-100">
              {features.map((feature) => (
                <li key={feature} className="rounded-xl bg-white/10 px-4 py-3">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Khách truy cập" description="Luồng ngoài website">
            <ul className="space-y-2 text-sm text-slate-700">
              <li>- Mở chat widget</li>
              <li>- Hỏi FAQ, giá, chính sách</li>
              <li>- Bot thu lead khi có nhu cầu</li>
              <li>- Handoff sang nhân viên khi cần</li>
            </ul>
          </SectionCard>
          <SectionCard title="Admin" description="Quản trị nội dung và dữ liệu">
            <ul className="space-y-2 text-sm text-slate-700">
              <li>- Quản lý knowledge base</li>
              <li>- Xem lead mới</li>
              <li>- Xem lịch sử hội thoại</li>
              <li>- Cấu hình welcome/fallback</li>
            </ul>
          </SectionCard>
          <SectionCard title="Tech stack" description="Khuyến nghị để đi production">
            <ul className="space-y-2 text-sm text-slate-700">
              <li>- Next.js App Router</li>
              <li>- Supabase Postgres</li>
              <li>- OpenAI / Gemini / Claude</li>
              <li>- Google Sheets / CRM sync</li>
            </ul>
          </SectionCard>
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}
