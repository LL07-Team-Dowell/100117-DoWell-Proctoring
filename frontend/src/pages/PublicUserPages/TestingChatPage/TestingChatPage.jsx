import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { socketInstance } from "../../../utils/utils";
import { toast } from 'sonner';

export default function TestingChatPage() {
    const [ value, setValue ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const [ searchParams, setSearchParams ] = useSearchParams();

    const testEmail = 'test@gmail.com';
    const testUser = 'John Doe';

    const handleSend = () => {
        if (value.length < 1) return toast.info('Please enter a message');

        const eventId = searchParams.get('event_id');

        socketInstance.emit('incoming-message', (eventId, testEmail, testUser, false, value));

        setValue('');
    }

    useEffect(() => {
        const eventId = searchParams.get('event_id');

        socketInstance.emit('join-event', eventId, crypto.randomUUID(), testEmail, testUser);
        
        socketInstance.on('new-message', (eventId, userEmail, userName, isProctor, message) => {
            setMessages((prevMessages) => {
                return [
                    {
                        eventId,
                        email: userEmail,
                        name: userName,
                        isProctor,
                        message,
                    },
                    ...prevMessages
                ]
            })
        });

    }, [])

    return <div
        style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1rem',
        }}
    >
        <br />
        <h2>Live Chat</h2>
        <input 
            type="text"
            onChange={({ target }) => setValue(target.value)}
            value={value}
        />
        <button onClick={handleSend}>Send</button>
        
        <br />
        <br />
        <br />

        <h3>Messages</h3>
        {
            React.Children.toArray(messages.map(messageItem => {
                return <div
                    style={{
                        backgroundColor: '#efefef',
                        padding: '1rem',
                        borderRadius: '10px'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <p style={{ fontSize: '0.8rem' }}>{messageItem.name}</p>
                        <p style={{ fontSize: '0.8rem' }}>{messageItem.email}</p>
                    </div>
                    <p>{messageItem.message}</p>
                </div>
            }))
        }
    </div>
}