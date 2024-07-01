import { useEffect } from "react";
import { socketInstance } from "../utils/utils";

export default function useReceiveMessage({
    userType='user',
    updateChatMessages = () => {},
    chatContainerRef,
}) {
    useEffect(() => {
        if (!socketInstance) return;

        const handleNewMessage = (eventId, userName, userEmail, isProctor, message, messageCreatedDate) => {

            const receivedMessage = {
                eventId: eventId,
                username: userName,
                email: userEmail,
                isProctor: isProctor,
                message: message,
                createdAt: messageCreatedDate,
            }

            console.log(`received message on ${userType} end, receivedMessage`);

            updateChatMessages(prevMessages => [...prevMessages, receivedMessage]);

            if (chatContainerRef?.current && chatContainerRef?.current?.scrollTop) {
                chatContainerRef.current.scrollTop = chatContainerRef?.current?.scrollHeight;
            }
        };

        socketInstance.on('new-message', handleNewMessage);

        return () => {
            socketInstance.off('new-message', handleNewMessage);
        };

    }, [socketInstance]);
}