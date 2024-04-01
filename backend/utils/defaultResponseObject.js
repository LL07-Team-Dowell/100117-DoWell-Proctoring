exports.generateDefaultResponseObject = ({ 
    success=false,
    message='',
    response=null
}) => {
    return {
        success: success,
        message: message,
        response: response,
    }
}
exports.ResponseObject = ({ 
    success=false,
    message='',
    response=null
}, status) => {
    return status.json({
        success: success,
        message: message,
        response: response,
    })
}