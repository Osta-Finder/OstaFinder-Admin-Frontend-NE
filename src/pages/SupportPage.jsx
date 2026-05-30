import React, { useState } from 'react';
import { PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const mockTickets = [
  { id: 1, user: 'أحمد محمود', subject: 'مشكلة في تسجيل الدخول', status: 'مفتوح', lastMessage: 'لا أستطيع الدخول لحسابي منذ الأمس' },
  { id: 2, user: 'سارة إبراهيم', subject: 'استفسار عن الفاتورة', status: 'مغلق', lastMessage: 'شكراً لكم على المساعدة' },
  { id: 3, user: 'كريم حسن', subject: 'طلب تغيير موعد', status: 'مفتوح', lastMessage: 'هل يمكنني تغيير موعد الصيانة؟' },
];

const SupportPage = () => {
  const [activeTicket, setActiveTicket] = useState(mockTickets[0]);
  const [reply, setReply] = useState('');

  const handleSend = () => {
    if (!reply) return;
    // In a real app, dispatch to Redux to save the message
    setReply('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* Tickets List */}
      <div className="w-1/3 bg-white rounded-3xl border border-[#F2DECF] shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#F2DECF]">
          <h2 className="font-bold text-gray-900 text-lg">تذاكر الدعم الفني</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => setActiveTicket(ticket)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeTicket.id === ticket.id ? 'bg-[#FAFBFD] border-r-4 border-r-[#A85121]' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 text-sm">{ticket.user}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${ticket.status === 'مفتوح' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="text-sm text-gray-700 font-medium mb-1">{ticket.subject}</div>
              <div className="text-xs text-gray-500 truncate">{ticket.lastMessage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-[#F2DECF] shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#F2DECF] flex justify-between items-center bg-[#FAFBFD]">
          <div>
            <h2 className="font-bold text-gray-900">{activeTicket.user}</h2>
            <p className="text-sm text-gray-500">{activeTicket.subject}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${activeTicket.status === 'مفتوح' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
            {activeTicket.status}
          </span>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {/* Mock messages */}
          <div className="flex gap-3 max-w-[80%]">
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
            <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-gray-700 border border-gray-100">
              {activeTicket.lastMessage}
            </div>
          </div>
          
          {activeTicket.status === 'مغلق' && (
            <div className="text-center text-xs text-gray-400 my-4">تم إغلاق هذه التذكرة</div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#F2DECF] bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="اكتب ردك هنا..."
              disabled={activeTicket.status === 'مغلق'}
              className="flex-1 border border-gray-200 rounded-full py-2 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A85121]/50 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={activeTicket.status === 'مغلق' || !reply}
              className="w-10 h-10 bg-[#A85121] hover:bg-[#8B431B] text-white rounded-full flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5 -ml-1 transform -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
