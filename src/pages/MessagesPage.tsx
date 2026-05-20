/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, MessageSquare, Loader2, User, ArrowLeft } from 'lucide-react';
import { dbService, Conversation, Message } from '../lib/dbService';
import { cn } from '../lib/utils';

export const MessagesPage = () => {
  const [currentUser, setCurrentUser] = useState(dbService.getCurrentUser());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Garantir usuário logado
  useEffect(() => {
    let user = dbService.getCurrentUser();
    if (!user) {
      user = {
        uid: "nelson",
        name: "Nelson Camisassa",
        email: "nelson@nexa.ao",
        role: "ENTREPRENEUR",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nelson",
        bio: "Empreendedor em Luanda focado em soluções de pagamento inovadoras.",
        createdAt: new Date().toISOString()
      };
      dbService.setCurrentUser(user);
      setCurrentUser(user);
    }
  }, []);

  // Carregar conversas
  const loadConversations = async (silent = false) => {
    if (!currentUser) return;
    try {
      const list = await dbService.getConversations(currentUser.uid);
      setConversations(list);
      
      // Auto-selecionar a primeira conversa se nenhuma estiver ativa
      if (list.length > 0 && !activeConv && !silent) {
        setActiveConv(list[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      
      // Polling de conversas e mensagens a cada 3 segundos
      const interval = setInterval(() => {
        loadConversations(true);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Carregar mensagens da conversa ativa
  const loadMessages = async (silent = false) => {
    if (!activeConv) return;
    try {
      const msgList = await dbService.getMessages(activeConv.id);
      
      // Só atualiza o estado se a quantidade ou o conteúdo mudar, evitando re-renders desnecessários
      if (msgList.length !== messages.length || (msgList.length > 0 && msgList[msgList.length - 1].id !== messages[messages.length - 1]?.id)) {
        setMessages(msgList);
        setTimeout(() => scrollToBottom(), 50);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  };

  useEffect(() => {
    if (activeConv) {
      loadMessages();
      
      // Polling de mensagens a cada 2 segundos para o chat ativo
      const interval = setInterval(() => {
        loadMessages(true);
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [activeConv]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || !currentUser || sending) return;

    const textToSend = inputText;
    setInputText('');
    setSending(true);

    try {
      const newMsg = await dbService.sendMessage(activeConv.id, currentUser.uid, textToSend);
      setMessages(prev => [...prev, newMsg]);
      setTimeout(() => scrollToBottom(), 50);
      
      // Atualizar lista de conversas silenciosamente para refletir a última mensagem
      loadConversations(true);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-nexa-teal" size={40} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Sidebar - Conversas */}
      <div className={cn(
        "w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50",
        activeConv ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-gray-100 bg-white">
          <h3 className="font-bold text-lg text-nexa-dark flex items-center gap-2">
            <MessageSquare className="text-nexa-teal" size={20} /> Central de Chats
          </h3>
          <p className="text-xs text-gray-400 mt-1">Conexões entre empreendedores e investidores.</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              const formattedTime = conv.lastMessage
                ? new Date(conv.lastMessage.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={cn(
                    "w-full p-4 flex gap-3 text-left transition-all hover:bg-white",
                    isSelected ? "bg-white border-l-4 border-l-nexa-teal shadow-sm" : ""
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-nexa-amber flex-shrink-0 overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center font-bold text-nexa-dark text-xs">
                    {conv.otherUser?.avatar ? (
                      <img src={conv.otherUser.avatar} alt="Avatar" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm text-nexa-dark truncate">{conv.otherUser?.name || 'Utilizador'}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">{formattedTime}</span>
                    </div>
                    <div className="text-xs font-bold text-nexa-teal truncate mb-1">{conv.projectTitle}</div>
                    <p className="text-xs text-gray-400 truncate">
                      {conv.lastMessage ? conv.lastMessage.text : 'Nenhuma mensagem.'}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 italic text-sm">
              Nenhuma conversa ativa. Explore as startups e demonstre interesse para iniciar um chat!
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-white",
        !activeConv ? "hidden md:flex items-center justify-center p-8 bg-gray-50/20" : "flex"
      )}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white shadow-sm z-10">
              <button 
                onClick={() => setActiveConv(null)}
                className="md:hidden p-1 text-gray-400 hover:text-nexa-dark hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-nexa-amber overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm flex items-center justify-center font-bold text-xs">
                {activeConv.otherUser?.avatar ? (
                  <img src={activeConv.otherUser.avatar} alt="Avatar" />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-nexa-dark">{activeConv.otherUser?.name}</h4>
                <div className="text-xs font-medium text-gray-400">
                  <span className="text-nexa-teal font-bold mr-1">{activeConv.projectTitle}</span> 
                  • {activeConv.otherUser?.role === 'INVESTOR' ? 'Investidor Anjo' : 'Empreendedor'}
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-nexa-ghost/30">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.uid;
                  const time = new Date(msg.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div className={cn(
                        "max-w-[70%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
                        isMe 
                          ? "bg-nexa-dark text-white rounded-tr-none" 
                          : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                      )}>
                        <div>{msg.text}</div>
                        <div className={cn(
                          "text-[9px] mt-1.5 text-right font-medium",
                          isMe ? "text-gray-400" : "text-gray-400"
                        )}>
                          {time}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-gray-400 italic text-sm">
                  Início da conversa. Envie uma mensagem para dar o primeiro passo!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-nexa-teal text-sm transition-all"
              />
              <Button type="submit" disabled={!inputText.trim() || sending} className="h-11 px-5 rounded-xl gap-2">
                {sending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Send size={16} /> <span className="hidden sm:inline">Enviar</span>
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-teal-50 text-nexa-teal rounded-full flex items-center justify-center mx-auto shadow-sm">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-bold text-lg text-nexa-dark">Nenhum Chat Selecionado</h3>
            <p className="text-gray-400 max-w-xs text-sm">Escolha uma conversa na barra lateral para começar a trocar mensagens em tempo real.</p>
          </div>
        )}
      </div>
    </div>
  );
};
