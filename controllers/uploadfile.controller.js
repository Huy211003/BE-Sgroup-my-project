const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        res.status(200).json({ message: 'File upload successfully', file: file });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}

const uploadMultipleFiles = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Please upload files' })
        }
        res.status(200).json({ message: 'Files uploaded successfully ' })
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}
module.exports = {
    uploadFile,
    uploadMultipleFiles,
}