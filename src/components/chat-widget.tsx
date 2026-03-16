"use client";

import { FormEvent, useMemo, useState } from 'react';
import { settings } from '@/lib/mock-data';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function renderLinkedText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-blue-600 underline"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export function ChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [open, setOpen] = useState(embedded ? true : true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: settings.welcomeMessage },
  ]);
  const [loading, setLoading] = useState(false);
  const sessionId = useMemo(() => `demo-${Date.now()}`, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const nextUserMessage = { role: 'user' as const, content: input.trim() };
    setMessages((prev) => [...prev, nextUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: nextUserMessage.content }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer ?? 'Có lỗi xảy ra.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Không thể kết nối máy chủ.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const shellClass = embedded
    ? 'flex h-full w-full flex-col overflow-hidden rounded-none border-0 bg-white shadow-none'
    : 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl';

  return (
    <div className={embedded ? 'h-full w-full' : 'fixed right-6 bottom-6 z-50 w-[360px] max-w-[calc(100vw-24px)]'}>
      {!embedded && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mb-3 ml-auto flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          {open ? 'Thu gọn chat' : 'Mở chat AI'}
        </button>
      )}

      {open && (
        <div className={shellClass}>
          <div className="bg-slate-900 px-4 py-3 text-white">
            <p className="text-sm font-semibold">{settings.botName} · AI Customer Care</p>
            <p className="text-xs text-slate-300">Trực 24/7 · Tư vấn sản phẩm · Handoff</p>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 whitespace-pre-wrap ${
                  message.role === 'assistant'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'ml-auto bg-indigo-600 text-white'
                }`}
              >
                {renderLinkedText(message.content)}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                Đang trả lời...
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              placeholder="Nhập câu hỏi của khách hàng..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
