import { ChatWidget } from '@/components/chat-widget';

export default function EmbedPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="h-screen w-full">
        <ChatWidget embedded />
      </div>
    </div>
  );
}
