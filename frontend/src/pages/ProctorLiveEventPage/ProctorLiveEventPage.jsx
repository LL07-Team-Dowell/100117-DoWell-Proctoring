import { useNavigate, useParams } from "react-router-dom";
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
import { BsFillChatTextFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { socketInstance } from "../../utils/utils";
import { getMessages } from "../../services/eventServices";
import DotLoader from "../../components/DotLoader/DotLoader";
import { MdClose } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";

// let activeUsers = [];
let currentUserPeerId = null;

const ProctorLiveEventPage = () => {
    const {
        currentUser
    } = useUserContext();

    const { eventId } = useParams();
    const [eventLoading, setEventLoading] = useState(true);
    const [existingEventDetails, setExistingEventDetails] = useState(null);
    const [activeUserStream, setActiveUserStream] = useState(null);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const chatContainerRef = useRef(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatLoadedOnce, setChatLoadedOnce] = useState(false);
    const [allCurrentUsers, setAllCurrentUsers] = useState([]);
    const [currentUserEmailBeingMonitored, setCurrentUserEmailBeingMonitored] = useState(null);

    const participantVideosRef = useRef();
    const singleUserVideRef = useRef();

    const navigate = useNavigate();

    const handleUpdateUsers = (peerId, userStream, userIsLeaving = false, socketId) => {
        console.log('-----adding new user stream----', userStream);
        
        // // FOR DEBUGGING
        // if (userStream){
        //     const videoTracks = userStream?.getVideoTracks();
        //     console.log('vid tracks -> ', videoTracks);
        // }

        const copyOfActiveUsers = activeUsers.slice();

        const foundId = userIsLeaving ?
            copyOfActiveUsers.find(item => item?.peerId === peerId)
            :
            copyOfActiveUsers.find(item => item?.id === userStream?.id);
        
        const foundExistingSocketId = copyOfActiveUsers.find(item => item.socketId === socketId);

        if (userIsLeaving === true) {
            console.log('active users ->', copyOfActiveUsers);
            console.log('---removing user----', peerId);
            console.log(foundId);
            
            if (foundId) {
                const updatedUsers = copyOfActiveUsers.filter(item => item.peerId !== peerId);
                setActiveUsers(updatedUsers);
            }

            return;
        }

        console.log(foundId);
        if (foundId || foundExistingSocketId) return;
        if (peerId === currentUserPeerId) return;

        copyOfActiveUsers.push({
            stream: userStream,
            peerId,
            socketId,
        });
        setActiveUsers(copyOfActiveUsers);
    }

    const addStreamToVideoElement = (video, stream) => {
        if (!video) return;
        
        video.srcObject = stream;
        video.muted = true;

        video.onloadedmetadata = () => {
            console.log('Metadata loaded, playing new user video');
            video.play().catch(error => {
                console.error('Error playing new user video:', error);
            });
        };

        // Adding an error event listener
        video.onerror = (error) => {
            console.error('Error with video element:', error);
        };

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

        handleRequestCameraPermission().then(res => {
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
                const videoElement = Array.from(child?.children)[0];
                if (videoElement && videoElement?.nodeName === 'VIDEO') {
                    addStreamToVideoElement(videoElement, activeUsers[index]?.stream);
                }
            }
        });

        socketInstance.emit('get-users-in-event', eventId);

        const handleGetUsers = (users) => setAllCurrentUsers(users);

        socketInstance.on('current-users', handleGetUsers);

        return (() => {
            socketInstance.off('current-users', handleGetUsers);
        })

    }, [activeUsers, currentUserEmailBeingMonitored])

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

            console.log('recieved message on proctor end', receivedMessage);

            setChatMessages(prevMessages => [...prevMessages, receivedMessage]);

            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        socketInstance.on('new-message', handleNewMessage);

        return () => {
            socketInstance.off('new-message', handleNewMessage);
        };
    }, [socketInstance]);

    useEffect(() => {
        if (!currentUserEmailBeingMonitored) return;

        if (singleUserVideRef.current) {
            const userPeerId = allCurrentUsers?.find(user => user?.email === currentUserEmailBeingMonitored)?.peerId;
            const foundUserStream = activeUsers.find(user => user.peerId === userPeerId);
            if (!foundUserStream) return;

            singleUserVideRef.current.srcObject = foundUserStream.stream;
            singleUserVideRef.current.muted = true;

            singleUserVideRef.current.onloadedmetadata = () => {
                console.log('Metadata loaded, playing video of user being monitored');
                singleUserVideRef.current.play().catch(error => {
                    console.error('Error playing video of user being monitored:', error);
                });
            };

            // Adding an error event listener
            singleUserVideRef.current.onerror = (error) => {
                console.error('Error with video element:', error);
            };
        }

    }, [currentUserEmailBeingMonitored])

    const handleSendMessage = () => {
        console.log('connesction', socketInstance);
        if (newMessage.trim() === '') return;

        const data = {
            eventId: eventId,
            email: currentUser?.userinfo?.email,
            username: `${currentUser?.userinfo?.first_name} ${currentUser?.userinfo?.last_name}`,
            isProctor: true,
            message: newMessage.trim(),
            createdAt: new Date(),
        };

        console.log('send message from proctor end', data);

        setChatMessages(prevMessages => [...prevMessages, data]);
        setNewMessage('');

        socketInstance.emit('incoming-message', data);

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    const fetchChatMessages = async () => {
        if (chatLoadedOnce) return
        setIsChatLoading(true);
        try {
            const response = await getMessages({ "eventId": eventId });
            console.log('chat responseeeeee', response?.data?.data);
            setChatMessages(response?.data?.data);
            setChatLoadedOnce(true);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        } finally {
            setIsChatLoading(false);
        }

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (eventLoading) return <LoadingPage />

    return <>
        <div className={styles.wrapper}>
            <nav className={styles.nav__Wrapper}>
                <button 
                    className={styles.back_}
                    onClick={() => navigate(-1)}
                >
                    <AiOutlineArrowLeft />
                    <span>Back</span>
                </button>
                <div className={styles.logo__Wrap}>
                    <img
                        className={styles.logo}
                        src={'https://ll07-team-dowell.github.io/100098-DowellJobPortal/static/media/landing-logo.13cfa69b57d9bdf1e3da.png'}
                        alt="logo"
                    />
                    <h3>{existingEventDetails?.name}</h3>
                </div>
                <BsFillChatTextFill
                    className={styles.chat__icon}
                    color="#005734"
                    onClick={() => {
                        setIsChatOpen(!isChatOpen);
                        fetchChatMessages();
                    }}
                />
            </nav>
            <div className={styles.live_event_wrap}>
                {
                    currentUserEmailBeingMonitored ?
                        <>
                            <div className={styles.monitor__Wrap}>
                                <section className={styles.video__Section}>
                                    <MdClose 
                                        size={'1.2rem'}
                                        onClick={() => setCurrentUserEmailBeingMonitored(null)}
                                        style={{
                                            display: 'block',
                                            marginLeft: 'auto',
                                            cursor: 'pointer',
                                        }}
                                    />

                                    <video className={styles.single__User__Vid} ref={singleUserVideRef}></video>
                                </section>
                                <section className={styles.info__Section}>
                                    <h3>User Info</h3>

                                    <section className={styles.info}>
                                        <p>Name: {allCurrentUsers?.find(user => user?.email === currentUserEmailBeingMonitored)?.nameOfUser}</p>
                                        <p>Number of times user navigated away: 0</p>
                                        <p>Time spent: 1min</p>
                                        <p>Location: Lagos, Nigeria</p>
                                    </section>
                                </section>
                            </div>
                        </>
                    :
                    <>
                        <div ref={participantVideosRef} className={styles.participants__Wrap}>
                            {/* {
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
                            } */}

                            {
                                React.Children.toArray(activeUsers.map(userItem => {
                                    return <div className={styles.user__Video__Item}>
                                        <video
                                            playsInline
                                            controls={false}
                                            controlsList="nofullscreen"
                                            muted
                                        >
                                        </video>
                                        {
                                            allCurrentUsers?.find(user => user?.peerId === userItem?.peerId) &&
                                            <>
                                                <span>{allCurrentUsers?.find(user => user?.peerId === userItem?.peerId)?.nameOfUser}</span>
                                                <br />
                                                <button 
                                                    className={styles.view__Participant__Details}
                                                    onClick={() => setCurrentUserEmailBeingMonitored(allCurrentUsers?.find(user => user?.peerId === userItem?.peerId)?.email)}
                                                >
                                                    <span>Monitor User</span>
                                                </button>                             
                                            </>
                                        }
                                    </div>
                                }))
                            }
                        </div>
                    </>
                }

                <div className={styles.proctor__chat} style={{ display: isChatOpen ? 'block' : 'none' }}>
                    <div className={styles.chat__bar}>
                        <h1 className={styles.chat__heading}>Chats</h1>
                        <IoMdClose
                            fontSize={'28px'}
                            color=""
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            cursor={'pointer'}
                        />
                    </div>
                    {
                        isChatLoading ? <div className={styles.chat__main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DotLoader /></div> :
                            <div ref={chatContainerRef} className={styles.chat__main}>
                                {React.Children.toArray(chatMessages.map(message => {
                                    const isCurrentUser = currentUser?.userinfo?.email === message.email && message.username === `${currentUser?.userinfo?.first_name} ${currentUser?.userinfo?.last_name}`;
                                    return (
                                        <div className={`${styles.chat_message} ${isCurrentUser ? styles.chat_messageRight : styles.chat_messageLeft}`}>
                                            <div className={styles.avatarContainer} style={{ display: isCurrentUser ? 'none' : 'block' }}>
                                                <div className={styles.avatar}>
                                                    {message.username[0].toUpperCase()}
                                                </div>
                                            </div>
                                            <div className={styles.main_msg_content}>
                                                <div className={`${styles.username_date} ${styles.username__}`} style={{ justifyContent: isCurrentUser ? 'end' : 'space-between' }}>
                                                    <strong className={styles.username_} style={{ display: isCurrentUser ? 'none' : 'block' }}>
                                                        {message.username}
                                                    </strong>
                                                    <p>{new Date(message.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className={styles.message_}>
                                                    <div key={message.eventId} className={styles.chat__message} style={{ width: '100%' }}>
                                                        <div className={styles.messageContent}>
                                                            {message.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.avatarContainer} style={{ display: isCurrentUser ? 'block' : 'none', marginLeft: '0.3rem' }}>
                                                <div className={styles.avatar}>
                                                    {message.username[0]}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }))}
                            </div>

                    }
                    <div className={styles.chat__input}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isChatLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ProctorLiveEventPage;