import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { socketInstance } from "../../../utils/utils";
import { toast } from 'sonner';

export default function TestingChatPage() {
    const [ value, setValue ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const [ searchParams, setSearchParams ] = useSearchParams();
    
    const eventId = '660b25bcd17611da52105b91';//searchParams.get('event_id');
    const testEmail = 'test@gmail.com';
    const testUser = 'John Doe';

    let activityTimer
    const emmitter =(event,data) =>{
        socketInstance.emit(event,data);
    }

    const handleSend = () => {
        if (value.length < 1) return toast.info('Please enter a message');
        const data={
            'eventId':eventId,
            'email':testEmail,
            'username':testUser,
            'isProctor':false,
            'message':value
        }
        emmitter('incoming-message', data);

        setValue('');
    }
    
    useEffect(() => {
        
        
        socketInstance.emit('join-event', eventId, crypto.randomUUID(), testEmail, testUser);
        
        socketInstance.on('new-message', (eventId, userName,userEmail, isProctor,messageid, message, messagecreateddate) => {
            setMessages(prevMessages => {
                // Check if there is already a message with the same messageid
                const existingMessage = prevMessages.find(msg => msg.messageid === messageid);
                // If no existing message with the same messageid is found and there is a username, add the new message
                if (!existingMessage && !(userName==undefined)) {
                    return [...prevMessages, {
                        eventId: eventId,
                        name: userName,
                        email:userEmail,
                        isProctor: isProctor,
                        messageid: messageid,
                        message: message,
                        createddate: messagecreateddate
                    }];
                }
                return prevMessages;
            });
        });

        socketInstance.on("activity", (data) => {
            document.getElementById('activity').innerHTML = `${data.username} is typing...`

            // Clear after 1.5 seconds 
            clearTimeout(activityTimer)
            activityTimer = setTimeout(() => {
                document.getElementById('activity').textContent = ""
            }, 1500)
        })

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
            onKeyDown={( target ) => emmitter('on-typing', {'email':testEmail,'username':testUser,'eventId':eventId})}
            value={value}
        />
        <button onClick={handleSend}>Send</button>
        
        <h3>Messages</h3>
        <div className="message">
            {messages.map((messageItem, index) => (
                <div key={index} style={{ backgroundColor: '#efefef', padding: '1rem', borderRadius: '10px', margin: '12px' }}>
                    <small>Date: <span style={{ fontSize: '0.8rem' }}>{messageItem.createddate}</span></small>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '0.8rem' }}>{messageItem.name}</p>
                        <p style={{ fontSize: '0.8rem' }}>{messageItem.email}</p>
                    </div>
                    <p>{messageItem.message}</p>
                </div>
            ))}
        </div>
        <p id="activity"></p>
 
    </div>
}