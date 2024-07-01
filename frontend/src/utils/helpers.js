export const handleRequestCameraPermission = async (
    requestVideo=true, 
    requestAudio=true,
) => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
            let userStream = await navigator.mediaDevices.getUserMedia({
                video: requestVideo,
                audio: requestAudio,
            });

            return userStream;
        } catch (error) {
            return {
                error: 'Please check your camera is enabled and reload to approve media permission request'
            }
        }
    }
    
    return {
        error: 'Your device does not have a camera'
    };
}

export const addStreamToVideoElement = (video, stream) => {
    if (!video) return;
    
    video.srcObject = stream;
    video.muted = true;

    video.onloadedmetadata = () => {
        console.log('Metadata loaded, playing stream in video element');
        
        video.play().catch(error => {
            console.error('Error playing strwam in video element:', error);
        });
    };

    // Adding an error event listener
    video.onerror = (error) => {
        console.error('Error with video element:', error);
    };

}