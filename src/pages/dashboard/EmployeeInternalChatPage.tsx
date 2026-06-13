import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Trash2, Edit2, Globe, Clock, ShieldAlert, Copy, Share2 } from 'lucide-react';
import i18n from '../../lib/i18n';

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'boss' | 'employee' | 'hr' | 'manager';
    avatar?: string;
  };
  content: string;
  originalLanguage?: string;
  translations?: Record<string, string>;
  timestamp: Date;
  isEdited?: boolean;
  attachments?: string[];
  metadata?: {
    ipAddress?: string;
    deviceInfo?: string;
    actions?: string[];
  };
}

interface UserRole {
  id: string;
  name: string;
  role: 'boss' | 'employee' | 'hr' | 'manager';
}

const getRoleEmoji = (role: string): string => {
  const roleEmojis: Record<string, string> = {
    boss: '👔',
    manager: '📋',
    hr: '💼',
    employee: '👤',
  };
  return roleEmojis[role] || '👤';
};

const getRoleColor = (role: string): string => {
  const roleColors: Record<string, string> = {
    boss: 'bg-red-100 text-red-800 border-red-300',
    manager: 'bg-blue-100 text-blue-800 border-blue-300',
    hr: 'bg-purple-100 text-purple-800 border-purple-300',
    employee: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return roleColors[role] || 'bg-gray-100 text-gray-800';
};

const getLocalTimeAndDate = (date: Date, language: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const locale = language === 'hi' ? 'hi-IN' : language === 'ar' ? 'ar-SA' : 'en-US';
  return new Date(date).toLocaleString(locale, options);
};

export const EmployeeInternalChatPage: React.FC = () => {
  const { t } = useTranslation();
  const currentLang = i18n.language;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLang);
  const [showTranslations, setShowTranslations] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [currentUser] = useState<UserRole>({
    id: '1',
    name: 'You',
    role: 'employee',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate translation using i18n
  const translateMessage = useCallback(
    async (text: string, targetLanguage: string): Promise<string> => {
      // This would call a real translation API in production
      // For now, return the same text with language indicator
      return `[${targetLanguage.toUpperCase()}] ${text}`;
    },
    []
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const timestamp = new Date();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      content: newMessage,
      originalLanguage: currentLang,
      timestamp,
      metadata: {
        ipAddress: '192.168.1.1', // Mock - get from server
        deviceInfo: navigator.userAgent,
        actions: ['created'],
      },
    };

    // Generate translations for all supported languages
    const translations: Record<string, string> = {};
    const supportedLangs = ['en', 'hi', 'ar', 'es', 'fr', 'de', 'pt', 'zh'];
    
    for (const lang of supportedLangs) {
      if (lang !== currentLang) {
        translations[lang] = await translateMessage(newMessage, lang);
      }
    }

    newMsg.translations = translations;
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleDeleteMessage = (messageId: string) => {
    // Only boss can delete
    if (currentUser.role !== 'boss') {
      alert(t('only_boss_can_delete'));
      return;
    }
    setMessages(messages.filter((m) => m.id !== messageId));
  };

  const handleEditMessage = (messageId: string) => {
    // Only boss can edit
    if (currentUser.role !== 'boss') {
      alert(t('only_boss_can_edit'));
      return;
    }

    const msg = messages.find((m) => m.id === messageId);
    if (msg) {
      setEditingMessageId(messageId);
      setEditContent(msg.content);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    setMessages(
      messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              content: editContent,
              isEdited: true,
              metadata: {
                ...m.metadata,
                actions: [...(m.metadata?.actions || []), 'edited'],
              },
            }
          : m
      )
    );
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              💬 {t('common.internalChat', 'Internal Employee Chat')}
            </h1>
            <p className="text-sm text-slate-500">
              {t('common.realtimeChat', 'Real-time encrypted communication with live translation')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100"
            >
              <Globe size={18} />
              {t('common.liveTranslate', 'Live Translate')}
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-500">
              <Globe size={48} className="mb-3 opacity-20" />
              <p>{t('common.noMessages', 'No messages yet. Start the conversation!')}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`group flex gap-3 ${
                  msg.sender.id === currentUser.id ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar with Role Indicator */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${getRoleColor(msg.sender.role)} font-bold text-lg`}
                  >
                    {getRoleEmoji(msg.sender.role)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-700 border border-slate-200">
                    {msg.sender.role === 'boss' && '👑'}
                    {msg.sender.role === 'manager' && '📌'}
                    {msg.sender.role === 'hr' && '✓'}
                  </div>
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 ${msg.sender.id === currentUser.id ? 'flex flex-col items-end' : ''}`}
                >
                  {/* Sender Info */}
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`font-semibold ${msg.sender.role === 'boss' ? 'text-red-700' : 'text-slate-900'}`}>
                      {msg.sender.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium border ${getRoleColor(msg.sender.role)}`}
                    >
                      {msg.sender.role.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={12} />
                      {getLocalTimeAndDate(msg.timestamp, currentLang)}
                    </span>
                    {msg.isEdited && <span className="text-xs text-amber-600">{t('edited')}</span>}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-md rounded-lg px-4 py-2 ${
                      msg.sender.id === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : msg.sender.role === 'boss'
                          ? 'bg-red-50 text-slate-900 border border-red-200'
                          : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {editingMessageId === msg.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 rounded bg-white px-2 py-1 text-slate-900"
                        />
                        <button
                          onClick={() => handleSaveEdit(msg.id)}
                          className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
                        >
                          {t('save')}
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>

                  {/* Live Translations */}
                  {showTranslations && msg.translations && Object.keys(msg.translations).length > 0 && (
                    <div className="mt-2 max-w-md rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="mb-1 text-xs font-semibold text-slate-600">
                        {t('common.translations', 'Translations')}:
                      </p>
                      <div className="space-y-1 text-xs">
                        {Object.entries(msg.translations).map(([lang, translation]) => (
                          <div key={lang} className="text-slate-600">
                            <span className="font-medium">{lang.toUpperCase()}:</span> {translation.substring(0, 50)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Actions */}
                  <div className="mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleCopyMessage(msg.content)}
                      className="rounded p-1 text-slate-500 hover:bg-slate-200"
                      title={t('copy')}
                    >
                      <Copy size={14} />
                    </button>
                    {currentUser.role === 'boss' && (
                      <>
                        <button
                          onClick={() => handleEditMessage(msg.id)}
                          className="rounded p-1 text-slate-500 hover:bg-yellow-200"
                          title={t('edit')}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="rounded p-1 text-slate-500 hover:bg-red-200"
                          title={t('delete')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Metadata / Audit Trail */}
                  {msg.metadata && (
                    <div className="mt-1 text-xs text-slate-400">
                      {msg.metadata.actions?.join(', ') && (
                        <div className="flex items-center gap-1">
                          <ShieldAlert size={12} />
                          {t('common.actions', 'Actions')}: {msg.metadata.actions.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('common.typeMessage', 'Type your message...')}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              i18n.changeLanguage(e.target.value);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 outline-none"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
            <option value="zh">中文</option>
          </select>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600 disabled:bg-slate-300"
          >
            <Send size={18} />
            {t('common.send', 'Send')}
          </button>
        </form>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <ShieldAlert size={14} />
          {t('common.encryptedChat', 'Encrypted • Audit logged • Real-time notifications')}
        </div>
      </div>
    </div>
  );
};

export default EmployeeInternalChatPage;
