exports.generateDefaultResponseObject = ({ 
    success=false,
    message='',
    data=null
}) => {
    return {
        success: success,
        message: message,
        data: data,
    }
}