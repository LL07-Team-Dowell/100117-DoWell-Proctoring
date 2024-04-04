import { useParams } from "react-router-dom";
import { useUserContext } from "../../contexts";
import useSocketIo from "../../hooks/useSocketIo";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import styles from './styles.module.css';


const ProctorLiveEventPage = () => {
    const {
        currentUser
    } = useUserContext();

    const { eventId } = useParams();
    const [ activeUserStream, setActiveUserStream ] = useState(null);
    const [ cameraPermissionGranted, setCameraPermissionGranted ] = useState(false);
    const [ activeUsers, setActiveUsers ] = useState([]);

    const participantVideosRef = useRef();
    
    const handleRequestCameraPermission = async () => {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            try {
                let userStream = await navigator.mediaDevices.getUserMedia({
                    // video: true,
                    audio: true,
                })

                setCameraPermissionGranted(true);
                setActiveUserStream(userStream);

            } catch (error) {
                console.log(error);
                toast.info('Please approve audio and video permission requests');
            }

            return
        }
        
        toast.info('Your device does not have a camera');
    }

    const handleUpdateUsers = (newUser) => {
        console.log('-----updating----');
        const copyOfActiveUsers = activeUsers.slice();

        const foundId = copyOfActiveUsers.find(item => item?.id === newUser?.id);
        if (foundId) return;

        copyOfActiveUsers.push(newUser);
        setActiveUsers(copyOfActiveUsers);
    }

    useSocketIo(
        cameraPermissionGranted,
        eventId,
        currentUser?.userinfo?.email,
        `${currentUser?.userinfo?.first_name} ${currentUser?.userinfo?.last_name}`,
        activeUserStream,
        (passedUserStream) => handleUpdateUsers(passedUserStream)
    );

    useEffect(() => {
        if (cameraPermissionGranted) return;
        handleRequestCameraPermission();
    }, [])

    useEffect(() => {
        if (!participantVideosRef.current) return;
        
        Array.from(participantVideosRef.current?.children).forEach((child, index) => {
            child.srcObject = activeUsers[index];
            child.muted = true;
        });
        
    }, [activeUsers])


    return <>
        <div className={styles.wrapper}>
            <div ref={participantVideosRef}>
                {
                    React.Children.toArray(activeUsers.map(userStreamItem => {
                        return <video>

                        </video>
                    }))
                }
            </div>
        </div>
    </>
}

export default ProctorLiveEventPage;