export default function sendResponse(res , status, data ,msg, err = null){
    res.status(status).json({
       status,
        data,
        msg,
        error: err
    })
}