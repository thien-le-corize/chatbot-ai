"use client";

import { FormEvent, useMemo, useState } from 'react';
import { settings } from '@/lib/mock-data';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatWidget() {
  const [open, setOpen] = useState(true);
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

  return (
    <div className="fixed right-6 bottom-6 z-50 w-[360px] max-w-[calc(100vw-24px)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-3 ml-auto flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"
      >
        {open ? 'Thu gọn chat' : 'Mở chat AI'}
      </button>

      {open && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-slate-900 px-4 py-3 text-white">
            <p className="text-sm font-semibold">{settings.botName} · AI Customer Care</p>
            <p className="text-xs text-slate-300">Trực 24/7 · Thu lead · Handoff</p>
          </div>

          <div className="flex h-[400px] flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'assistant'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'ml-auto bg-indigo-600 text-white'
                }`}
              >
                {message.content}
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
