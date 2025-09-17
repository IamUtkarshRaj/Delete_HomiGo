import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import './Messages.css';

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const contacts = [
    {
      id: 1,
      name: 'Sarah Wilson',
      lastMessage: 'Are you still looking for a roommate?',
      time: '2 min ago',
      avatar: '👩',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'The property viewing is at 3 PM',
      time: '1 hour ago',
      avatar: '👨',
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: 'Emma Davis',
      lastMessage: 'Thanks for the room details!',
      time: '3 hours ago',
      avatar: '👩‍🦰',
      unread: 0,
      online: false
    },
    {
      id: 4,
      name: 'John Smith',
      lastMessage: 'When can we schedule a call?',
      time: 'Yesterday',
      avatar: '👱‍♂️',
      unread: 1,
      online: false
    }
  ];

  const [conversations, setConversations] = useState({
    1: [
      { id: 1, text: 'Hi! I saw your roommate listing', sender: 'other', time: '10:30 AM' },
      { id: 2, text: 'Yes, still available! Are you interested?', sender: 'me', time: '10:32 AM' },
      { id: 3, text: 'Definitely! Can we set up a time to chat?', sender: 'other', time: '10:35 AM' },
      { id: 4, text: 'Are you still looking for a roommate?', sender: 'other', time: '2 min ago' },
    ],
    2: [
      { id: 1, text: 'Hello! About the property on Oak Street', sender: 'other', time: '9:00 AM' },
      { id: 2, text: 'Hi Mike! Yes, it\'s still available', sender: 'me', time: '9:15 AM' },
      { id: 3, text: 'Great! When can I schedule a viewing?', sender: 'other', time: '9:20 AM' },
      { id: 4, text: 'How about today at 3 PM?', sender: 'me', time: '9:25 AM' },
      { id: 5, text: 'Perfect! See you then', sender: 'other', time: '9:30 AM' },
      { id: 6, text: 'The property viewing is at 3 PM', sender: 'other', time: '1 hour ago' },
    ],
    3: [
      { id: 1, text: 'Hi Emma! Here are the room details you requested', sender: 'me', time: 'Yesterday' },
      { id: 2, text: 'Thanks for the room details!', sender: 'other', time: '3 hours ago' },
    ],
    4: [
      { id: 1, text: 'Hi! I\'m interested in your listing', sender: 'other', time: 'Yesterday' },
      { id: 2, text: 'When can we schedule a call?', sender: 'other', time: 'Yesterday' },
    ]
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedContact, conversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedContact) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));

    setMessage('');
  };

  const currentMessages = selectedContact ? conversations[selectedContact.id] || [] : [];

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="messages-page">
        <div className="messages-container">
        {/* Contacts Sidebar */}
        <div className="contacts-sidebar">
          <div className="contacts-header">
            <h2>Messages</h2>
            <button className="new-message-btn">✏️</button>
          </div>
          
          <div className="search-boxx">
            <input type="text" placeholder="Search conversations..." />
          </div>

          <div className="contacts-list">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="contact-avatar">
                  <span>{contact.avatar}</span>
                  {contact.online && <div className="online-indicator"></div>}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-last-message">{contact.lastMessage}</div>
                </div>
                <div className="contact-meta">
                  <div className="contact-time">{contact.time}</div>
                  {contact.unread > 0 && (
                    <div className="unread-badge">{contact.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedContact ? (
            <>
              <div className="chat-header">
                <div className="chat-contact-info">
                  <div className="chat-avatar">
                    <span>{selectedContact.avatar}</span>
                    {selectedContact.online && <div className="online-indicator"></div>}
                  </div>
                  <div>
                    <div className="chat-contact-name">{selectedContact.name}</div>
                    <div className="chat-contact-status">
                      {selectedContact.online ? 'Online' : 'Last seen recently'}
                    </div>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-btn">📞</button>
                  <button className="chat-action-btn">📹</button>
                  <button className="chat-action-btn">ℹ️</button>
                </div>
              </div>

              <div className="messages-container-inner">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.sender === 'me' ? 'message-sent' : 'message-received'}`}>
                    <div className="message-bubble">
                      <div className="message-text">{msg.text}</div>
                      <div className="message-time">{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-container" onSubmit={handleSendMessage}>
                <div className="input-wrapper">
                  <button type="button" className="attachment-btn">📎</button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                  />
                  <button type="button" className="emoji-btn">😊</button>
                  <button type="submit" className="send-btn" disabled={!message.trim()}>
                    ➤
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <div className="no-chat-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};export default Messages;
