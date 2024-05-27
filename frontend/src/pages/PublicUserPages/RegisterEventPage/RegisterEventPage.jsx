import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { registerForEvent } from "../../../services/participantServices";
import { getEventById } from "../../../services/eventServices";
import { toast } from "sonner";
import DotLoader from "../../../components/DotLoader/DotLoader";
import logo from "../../../assets/logo.png";
import expiredIllus from "../../../assets/expired-illustration.svg";
import html2canvas from "html2canvas";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { sendEmailToSingleRecipient } from "../../../services/emailServices";


const emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link to join event</title>
</head>
<body>
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:100px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="#" style="font-size:1.2em;color: #00466a;text-decoration:none;font-weight:600">Dowell UX Living Lab</a>
          </div>
          <p style="font-size:1.1em">You have been successfully registered for: {eventTitle}</p>
          <br />
          <p style="font-size:1.1em">{message}</p>
        </div>
      </div>
</body>
</html>
`;


const RegisterEvent = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCaptureButtonVisible, setIsCaptureButtonVisible] = useState(true);
    const [isCameraAllowed, setIsCameraAllowed] = useState(true);
    const [eventDetails, setEventDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegisteringEvent, setIsRegisteringEvent] = useState(false);
    const [showEventOverModal, setShowEventOverModal] = useState(false);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleCaptureImage = () => {
        html2canvas(videoRef.current)
            .then(canvas => {
                const dataURL = canvas.toDataURL('image/png');
                setCapturedImage(dataURL);
                setIsCaptureButtonVisible(false);
            })
            .catch(error => {
                console.error('Error capturing image:', error);
            });
    };

    const handleRetakeImage = () => {
        setCapturedImage(null);
        setIsCaptureButtonVisible(true);
        setIsCameraAllowed(true);
        const requestCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                toast.error('Error accessing camera:', error);
                setIsCameraAllowed(false);
            }
        };
        requestCameraPermission();
    };



    useEffect(() => {
        // if(new Date(eventDetails?.registration_end_date).getTime() > new Date().getTime()) return
        const requestCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsLoading(false);
            } catch (error) {
                toast.error('Error accessing camera:', error);
                setIsCameraAllowed(false);
                setIsLoading(false);
            }
        };

        requestCameraPermission();

        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('event_id');
        getEventById(eventId).then(res => {
            console.log('event details retrieved', res?.data?.data);
            setEventDetails(res?.data?.data);

            new Date(res?.data?.data?.registration_end_date) < new Date() ? setShowEventOverModal(true) : setShowEventOverModal(false);
        }).catch(error => {
            // console.log('error getting events details', error);
            toast.error('Error getting events details, Please try again');
        })
    }, [])

    const handleRegisterEvent = async () => {
        if (!isCameraAllowed) {
            toast.warning('Camera access is required to register. Please allow camera access and try again.');
            return;
        }

        if (!name || !email || !capturedImage) {
            toast.warning('Please enter your name, email, and capture an image before registering.');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('event_id');

        const dataToPost = {
            name: name,
            email: email,
            event_id: eventId,
            user_image: capturedImage,
        }
        console.log('data to post', dataToPost);

        setIsRegisteringEvent(true);
        await registerForEvent(dataToPost).then(async () => {
            try {
                const message = `Please use this link: ${window.location.origin}/?view=public&event_id=${eventDetails?._id} to begin.`;
                let formattedEmailContent = emailContent.replace("{message}", message).replace("{eventTitle}", eventDetails?.name);

                await sendEmailToSingleRecipient(dataToPost.email, dataToPost.name, `Link to join event: ${eventDetails?.name}`, formattedEmailContent);
                toast.success('Successfully registered for event! An email has been sent to you containing details on how to join in for this event');
            } catch (error) {
                toast.success('Successfully registered for event!');
            }
        }).catch((err) => {
            const errorMessage = err?.response ? err?.response?.data?.message : 'Unable to register for event, Please try again later';
            toast.error(errorMessage);
        }).finally(() => {
            setIsRegisteringEvent(false);
        })
    }

    return (
        <>
            <div className={styles.main_wrap}>
                {isLoading ? (
                    <DotLoader />
                ) : (
                    showEventOverModal ?
                        <div className={styles.event_over_modal}>
                            <h3>Registration for this event is over</h3>
                            <img
                                src={expiredIllus}
                                alt="illustration"
                                className={styles.event__Ended__Illus}
                            />
                        </div> :
                        <div className={styles.modal_wrap}>
                            <img src={logo} alt="logo" className={styles.logo_} />
                            <div className={styles.event_details}>
                                <div className={styles.event_info}><b className={styles.title__}>Title:</b> <p className={styles.title_info}>{eventDetails ? eventDetails?.name : null}</p></div>
                                <div className={styles.event_info}><b className={styles.title__}>Registration Closes:</b> <p className={styles.title_info}>{eventDetails ? new Date(eventDetails.registration_end_date).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }) : null}</p></div>
                                <div className={styles.event_info}><b className={styles.title__}>Event starts:</b> <p className={styles.title_info}>{eventDetails ? new Date(eventDetails.start_time).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true
                                }) : null}</p></div>
                            </div>
                            <div className={styles.input__data}>
                                <div>
                                    <p>Full Name:</p>
                                    <input type="text" value={name} onChange={handleNameChange} className={styles.input__} />
                                </div>
                                <div>
                                    <p>Email:</p>
                                    <input type="text" value={email} onChange={handleEmailChange} className={styles.input__} />
                                </div>
                            </div>
                            <div className={styles.capture_photo}>
                                {!capturedImage ? (
                                    <>
                                        {isCameraAllowed ? (
                                            <>
                                                <video ref={videoRef} className={styles.video_ref} autoPlay playsInline></video>
                                                <div className={styles.instructions}>
                                                    <p className={styles.instructions_}>Please ensure that</p>
                                                    <ul>
                                                        <li>Your Face is visible.</li>
                                                        <li>You are not wearing any glasses.</li>
                                                        <li>You are not behind any bright light that might cause reflection.</li>
                                                    </ul>
                                                    {isCaptureButtonVisible && <button onClick={handleCaptureImage} className={styles.register__}>Capture</button>}
                                                </div>
                                            </>
                                        ) : (
                                            <p>Camera access is required to proceed. Please allow access and refresh the page.</p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <img src={capturedImage} alt="Captured" className={styles.captured_image} />
                                        <div className={styles.retake_button}>
                                            <button onClick={handleRetakeImage} className={styles.register__}>Retake</button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={styles.register_event}>
                                <button className={styles.register__} onClick={handleRegisterEvent} disabled={!isCameraAllowed}>
                                    {isRegisteringEvent ? <LoadingSpinner width={'1.5rem'} height={'1.5rem'} /> : 'Register'}
                                </button>
                            </div>
                        </div>

                )}
            </div>
        </>
    );
}

export default RegisterEvent;


{/* <div className={styles.event_over_modal}>
                    <h3>This event is over</h3>
                    <img
                        src={expiredIllus}
                        alt="illustration"
                        className={styles.event__Ended__Illus}
                    />
                </div> */}
