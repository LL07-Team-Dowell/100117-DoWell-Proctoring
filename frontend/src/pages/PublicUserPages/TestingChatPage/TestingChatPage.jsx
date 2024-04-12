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

    let activityTimer
    const emmitter =(event,data) =>{
        socketInstance.emit(event,data);
    }

    const handleSend = () => {
        if (value.length < 1) return toast.info('Please enter a message');
        const eventId = searchParams.get('event_id');
        const data={
            'eventId':eventId,
            'email':testEmail,
            'username':testUser,
            'isProctor':false,
            'messageid':crypto.randomUUID(),
            'message':value
        }
        emmitter('incoming-message', data);

        setValue('');
    }
    
    useEffect(() => {
        const eventId = searchParams.get('event_id');
        
        socketInstance.emit('join-event', eventId, crypto.randomUUID(), testEmail, testUser);
        
        socketInstance.on('new-message', (eventId, userEmail, userName, isProctor,messageid, message) => {
            setMessages(prevMessages => {
                // Check if there is already a message with the same messageid
                const existingMessage = prevMessages.find(msg => msg.messageid === messageid);
                // If no existing message with the same messageid is found and there is a username, add the new message
                console.log(userEmail+"||||||"+undefined);
                if (!existingMessage && !(userEmail==undefined)) {
                    return [...prevMessages, {
                        eventId: eventId,
                        email: userEmail,
                        name: userName,
                        isProctor: isProctor,
                        messageid: messageid,
                        message: message,
                    }];
                }
                    // If an existing message with the same messageid is found, return the previous state
                return prevMessages;
            });
        });

        socketInstance.on("activity", (name) => {
            document.getElementById('activity').innerHTML = `${name.username} is typing...`

            // Clear after 2 seconds 
            clearTimeout(activityTimer)
            activityTimer = setTimeout(() => {
                document.getElementById('activity').textContent = ""
            }, 2000)
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
            onKeyDown={( target ) => emmitter('on-typing', {'email':testEmail,'username':testUser})}
            value={value}
        />
        <button onClick={handleSend}>Send</button>
        
        <h3>Messages</h3>
        <div className="message">
            {messages.map((messageItem, index) => (
                <div key={index} style={{ backgroundColor: '#efefef', padding: '1rem', borderRadius: '10px', margin: '12px' }}>
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