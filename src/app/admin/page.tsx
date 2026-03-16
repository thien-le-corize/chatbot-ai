import { SectionCard } from '@/components/section-card';
import {
  getAppSettings,
  listConversations,
  listKnowledgeItems,
  listLeads,
} from '@/lib/repositories';

export default async function AdminPage() {
  const [knowledgeItems, leads, conversations, settings] = await Promise.all([
    listKnowledgeItems(),
    listLeads(),
    listConversations(),
    getAppSettings(),
  ]);

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm font-medium text-indigo-600">Admin Demo</p>
          <h1 className="mt-1 text-3xl font-bold">AI Customer Care Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Đây là skeleton admin cho MVP: knowledge, leads, conversations và settings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ['Knowledge items', String(knowledgeItems.length)],
            ['Leads', String(leads.length)],
            ['Conversations', String(conversations.length)],
            ['Bot', settings.botName],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Knowledge base" description="FAQ và dữ liệu để bot tham chiếu">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Keywords</th>
                  </tr>
                </thead>
                <tbody>
                  {knowledgeItems.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200 bg-white">
                      <td className="px-4 py-3 font-medium">{item.title}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{Array.isArray(item.keywords) ? item.keywords.join(', ') : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Leads" description="Lead mới từ chatbot">
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-sm text-slate-600">{lead.phone} · {lead.email}</p>
                      <p className="mt-1 text-sm text-slate-700">{lead.interest}</p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <SectionCard title="Conversation logs" description="Các cuộc hội thoại gần đây">
            <div className="space-y-3">
              {conversations.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.customer}</p>
                      <p className="text-sm text-slate-500">{item.source} · {item.updatedAt}</p>
                      <p className="mt-2 text-sm text-slate-700">{item.lastMessage}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Bot settings" description="Cấu hình quan trọng của MVP">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-slate-500">Company</dt>
                <dd className="mt-1 font-semibold">{settings.companyName}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Welcome message</dt>
                <dd className="mt-1 leading-6">{settings.welcomeMessage}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Fallback</dt>
                <dd className="mt-1 leading-6">{settings.fallbackMessage}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Notification email</dt>
                <dd className="mt-1">{settings.notificationEmail}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
