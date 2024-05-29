import { useEffect } from "react";
import { socketInstance } from "../utils/utils";
import { Peer } from "peerjs";
import { peerServerHost, peerServerPath, peerServerPort } from "../services/config";

export default function useSocketIo(
    canStartUsing=false,
    eventId,
    userEmail,
    userName,
    currentUserStream=null,
    updateParticipants = () => {},
    updateCurrentUserPeerId = () => {},
) {
    useEffect(() => {
        if (!canStartUsing) return;

        const peer = new Peer(undefined);

        peer.on('open', (id) => {
            console.log('current user peer id::' + id + ', and email::' + userEmail);
            updateCurrentUserPeerId(id);
            socketInstance.emit('join-event', eventId, id, userEmail, userName);
        });
        
        peer.on('call', (call) => {
            call.answer(currentUserStream);

            call.on('stream', (passedStream) => {
                console.log('new stream 1 ->', passedStream);
                updateParticipants(peer.id, passedStream);
            })
        })

        const handleNewUserConnect = (userPeerId, emailConnected='', nameOfUserConnected='', userSocketId='') => {
            console.log('new user connecting->>>>>', userPeerId, emailConnected, nameOfUserConnected, userSocketId);
            
            const peerCall = peer.call(userPeerId, currentUserStream);
            
            peerCall.on('stream', (passedStream) => {
                console.log('new stream 2 ->', passedStream);
                updateParticipants(userPeerId, passedStream, false, nameOfUserConnected, userSocketId);
            })

            peerCall.on('close', () => {
                console.log('enddnd');
            })
        };

        socketInstance.on('user-connected', handleNewUserConnect);

        const handleAddExistingUserStreamsForProctor = (userPeerIds) => {
            if (Array.isArray(userPeerIds)) {
                userPeerIds.forEach(item => {
                    if (item?.peerId !== peer.id) {
                        handleNewUserConnect(item?.peerId);
                    }
                })
            }
        }

        socketInstance.on('current-connected-users', handleAddExistingUserStreamsForProctor);

        const handleUserDisconnect = (userPeerId, emailConnected, nameOfUserDisconnected, userSocketId='') => {
            console.log('user disconnecting->>>>>', userPeerId, emailConnected, nameOfUserDisconnected, userSocketId);
            updateParticipants(userPeerId, null, true, nameOfUserDisconnected, userSocketId);
        };

        socketInstance.on('user-disconnected', handleUserDisconnect);

        return (() => {
            socketInstance.off('user-connected', handleNewUserConnect);
            socketInstance.off('user-disconnected', handleUserDisconnect);
            socketInstance.off('current-connected-users', handleAddExistingUserStreamsForProctor);
        })

    }, [canStartUsing])
}