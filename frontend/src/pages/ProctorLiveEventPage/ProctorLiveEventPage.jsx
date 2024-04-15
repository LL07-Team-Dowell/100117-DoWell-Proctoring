import { useParams } from "react-router-dom";
import { useUserContext } from "../../contexts";
import useSocketIo from "../../hooks/useSocketIo";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import styles from './styles.module.css';
import { handleRequestCameraPermission } from "../../utils/helpers";
import dowellLogo from "../../assets/logo.png";
import sampleVideo from "../../assets/test.mp4";
import { getEventById } from "../../services/eventServices";
import LoadingPage from "../LoadingPage/LoadingPage";


let activeUsers = [];
let currentUserPeerId = null;

const ProctorLiveEventPage = () => {
    const {
        currentUser
    } = useUserContext();

    const { eventId } = useParams();
    const [ eventLoading, setEventLoading ] = useState(true);
    const [ existingEventDetails, setExistingEventDetails ] = useState(null);
    const [ activeUserStream, setActiveUserStream ] = useState(null);
    const [ cameraPermissionGranted, setCameraPermissionGranted ] = useState(false);

    const participantVideosRef = useRef();
    
    const handleUpdateUsers = (peerId, userStream, userIsLeaving=false) => {
        console.log('-----adding new user stream----', userStream);
        const copyOfActiveUsers = activeUsers.slice();
        
        const foundId = userIsLeaving ? 
            copyOfActiveUsers.find(item => item?.peerId === peerId)
        :
        copyOfActiveUsers.find(item => item?.id === userStream?.id);
        
        if (userIsLeaving === true) {
            console.log('active users ->', copyOfActiveUsers);
            console.log('---removing user----', peerId);
            console.log(foundId);
            foundId
            return;
        }

        console.log(foundId);
        if (foundId) return;
        if (peerId === currentUserPeerId) return;

        copyOfActiveUsers.push({
            stream: userStream,
            peerId
        });
        
        activeUsers = copyOfActiveUsers;
    }

    useSocketIo(
        // existingEventDetails && new Date(existingEventDetails?.close_date).getTime() < new Date().getTime() && cameraPermissionGranted,
        cameraPermissionGranted,
        eventId,
        currentUser?.userinfo?.email,
        `${currentUser?.userinfo?.first_name} ${currentUser?.userinfo?.last_name}`,
        activeUserStream,
        (passedPeerId, passedUserStream, userLeft) => handleUpdateUsers(passedPeerId, passedUserStream, userLeft),
        (passedPeerId) => currentUserPeerId = passedPeerId,
    );

    useEffect(() => {
        if (existingEventDetails) return setEventLoading(false);

        getEventById(eventId).then(res => {
            setExistingEventDetails(res.data?.data);
            setEventLoading(false);
        }).catch(err => {
            console.log(err?.response?.data);
            setEventLoading(false);
        })
        
    }, [])

    useEffect(() => {
        if (!existingEventDetails || cameraPermissionGranted) return;

        // if (new Date(existingEventDetails?.close_date).getTime() > new Date().getTime()) return;

        handleRequestCameraPermission(false, true).then(res => {
            if (res.error) {
                toast.info(res.error);
                return;
            }

            setCameraPermissionGranted(true);
            setActiveUserStream(res);
        }).catch(err => {
            console.log(err);
        });

    }, [existingEventDetails])

    useEffect(() => {
        if (!participantVideosRef.current) return;
        
        Array.from(participantVideosRef.current?.children).forEach((child, index) => {
            if (typeof activeUsers[index]?.stream === 'object') {
                child.srcObject = activeUsers[index]?.stream;
                child.muted = true;
            }
        });
        
    }, [activeUsers])

    if (eventLoading) return <LoadingPage />

    return <>
        <div className={styles.wrapper}>
            <nav className={styles.nav__Wrapper}>
                <img
                    className={styles.logo}
                    src={dowellLogo}
                    alt="logo"
                />
                <h3>{existingEventDetails?.name}</h3>
            </nav>
            <div ref={participantVideosRef} className={styles.participants__Wrap}>
                {
                    React.Children.toArray(
                        [...Array(20).fill(0).map(() => ({}))].map(() => {
                            return <video
                                autoPlay 
                                playsInline 
                                controls={false} 
                                controlsList="nofullscreen"
                                muted
                            >
                                <source src={sampleVideo} type="video/mp4" />
                            </video>
                        })
                    )
                }

                {/* {
                    React.Children.toArray(activeUsers.map(userStreamItem => {
                        return <video 
                            autoPlay 
                            playsInline 
                            controls={false} 
                            controlsList="nofullscreen"
                        >
                        </video>
                    }))
                } */}
            </div>
        </div>
    </>
}

export default ProctorLiveEventPage;