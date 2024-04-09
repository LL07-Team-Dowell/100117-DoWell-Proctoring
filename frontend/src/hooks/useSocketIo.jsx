import { useEffect } from "react";
import { socketInstance } from "../utils/utils";
import { Peer } from "peerjs";

export default function useSocketIo(
    canStartUsing=false,
    eventId,
    userEmail,
    userName,
    currentUserStream=null,
    updateParticipants = () => {},
) {
    useEffect(() => {
        if (!canStartUsing) return;

        const peer = new Peer(undefined, {
            host: "localhost",
            port: 9000,
            path: "/myapp",
        });

        peer.on('open', (id) => {
            console.log('current user peer id::' + id + ', and email::' + userEmail);
            socketInstance.emit('join-event', eventId, id, userEmail, userName);
        });
        
        peer.on('call', (call) => {
            call.answer(currentUserStream);

            call.on('stream', (passedStream) => {
                console.log('ew stream 1 ->', passedStream);
                updateParticipants(passedStream);
            })
        })

        socketInstance.on('user-connected', (userPeerId, emailConnected, nameOfUserConnected) => {
            console.log('new user connecting->>>>>', userPeerId, emailConnected, nameOfUserConnected);
            
            const peerCall = peer.call(userPeerId, currentUserStream);
            
            peerCall.on('stream', (passedStream) => {
                console.log('ew stream 2 ->', passedStream);
                updateParticipants(passedStream)
            })

            peerCall.on('close', () => {
                console.log('enddnd');
            })
        });

        socketInstance.on('user-disconnected', (userPeerId, emailConnected, nameOfUserDisconnected) => {
            console.log('user disconnecting->>>>>', userPeerId, emailConnected, nameOfUserDisconnected);
        })

    }, [socketInstance, canStartUsing])
}